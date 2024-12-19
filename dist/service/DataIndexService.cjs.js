'use strict';

var core = require('@urql/core');
var backstagePluginOrchestratorCommon = require('@red-hat-developer-hub/backstage-plugin-orchestrator-common');
var errorBuilder = require('../helpers/errorBuilder.cjs.js');
var filterBuilder = require('../helpers/filterBuilder.cjs.js');
var queryBuilder = require('../helpers/queryBuilder.cjs.js');
var constants = require('./constants.cjs.js');

class DataIndexService {
  constructor(dataIndexUrl, logger) {
    this.dataIndexUrl = dataIndexUrl;
    this.logger = logger;
    if (!dataIndexUrl.length) {
      throw errorBuilder.ErrorBuilder.GET_NO_DATA_INDEX_URL_ERR();
    }
    this.client = this.getNewGraphQLClient();
  }
  client;
  processDefinitionArguments = [];
  processInstanceArguments = [];
  getNewGraphQLClient() {
    const diURL = `${this.dataIndexUrl}/graphql`;
    return new core.Client({
      url: diURL,
      exchanges: [core.fetchExchange]
    });
  }
  async initInputProcessDefinitionArgs() {
    if (this.processDefinitionArguments.length === 0) {
      this.processDefinitionArguments = await this.inspectInputArgument("ProcessDefinition");
    }
    return this.processDefinitionArguments;
  }
  graphQLArgumentQuery(type) {
    return `query ${type}Argument {
        __type(name: "${type}Argument") {
          kind
          name
          inputFields {
            name
            type {
              kind
              name
              ofType {
                kind
                name
                ofType {
                  kind
                  name
                  ofType {
                    kind
                    name
                  }
                }
              }
            }
          }
        }
      }`;
  }
  async inspectInputArgument(type) {
    const result = await this.client.query(this.graphQLArgumentQuery(type), {});
    this.logger.debug(`Introspection query result: ${JSON.stringify(result)}`);
    if (result?.error) {
      this.logger.error(`Error executing introspection query ${result.error}`);
      throw result.error;
    }
    const pairs = [];
    if (result?.data?.__type?.inputFields) {
      for (const field of result.data.__type.inputFields) {
        if (field.name !== "and" && field.name !== "or" && field.name !== "not") {
          pairs.push({
            name: field.name,
            type: {
              name: field.type.name,
              kind: field.type.kind,
              ofType: field.type.ofType
            }
          });
        }
      }
    }
    return pairs;
  }
  async abortWorkflowInstance(instanceId) {
    this.logger.info(`Aborting workflow instance ${instanceId}`);
    const ProcessInstanceAbortMutationDocument = core.gql`
      mutation ProcessInstanceAbortMutation($id: String) {
        ProcessInstanceAbort(id: $id)
      }
    `;
    const result = await this.client.mutation(
      ProcessInstanceAbortMutationDocument,
      { id: instanceId }
    );
    this.logger.debug(
      `Abort workflow instance result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      throw new Error(
        `Error aborting workflow instance ${instanceId}: ${result.error}`
      );
    }
    this.logger.debug(`Successfully aborted workflow instance ${instanceId}`);
  }
  async fetchWorkflowInfo(definitionId) {
    const graphQlQuery = `{ ProcessDefinitions ( where: {id: {equal: "${definitionId}" } } ) { id, name, version, type, endpoint, serviceUrl, source } }`;
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Get workflow definition result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(`Error fetching workflow definition ${result.error}`);
      throw result.error;
    }
    const processDefinitions = result.data.ProcessDefinitions;
    if (processDefinitions.length === 0) {
      this.logger.info(`No workflow definition found for ${definitionId}`);
      return void 0;
    }
    return processDefinitions[0];
  }
  async fetchWorkflowServiceUrls() {
    const graphQlQuery = `{ ProcessDefinitions { id, serviceUrl } }`;
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Get workflow service urls result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(`Error fetching workflow service urls ${result.error}`);
      throw result.error;
    }
    const processDefinitions = result.data.ProcessDefinitions;
    return processDefinitions.filter((definition) => definition.serviceUrl).map((definition) => ({ [definition.id]: definition.serviceUrl })).reduce((acc, curr) => ({ ...acc, ...curr }), {});
  }
  async fetchWorkflowInfos(args) {
    this.logger.info(`fetchWorkflowInfos() called: ${this.dataIndexUrl}`);
    const { definitionIds, pagination, filter } = args;
    const definitionIdsCondition = definitionIds !== void 0 && definitionIds.length > 0 ? `id: {in: ${JSON.stringify(definitionIds)}}` : void 0;
    const filterCondition = filter ? filterBuilder.buildFilterCondition(
      await this.initInputProcessDefinitionArgs(),
      "ProcessDefinition",
      filter
    ) : void 0;
    let whereClause;
    if (definitionIds && filter) {
      whereClause = `and: [{${definitionIdsCondition}}, {${filterCondition}}]`;
    } else if (definitionIdsCondition || filterCondition) {
      whereClause = definitionIdsCondition ?? filterCondition;
    } else {
      whereClause = void 0;
    }
    const graphQlQuery = queryBuilder.buildGraphQlQuery({
      type: "ProcessDefinitions",
      queryBody: "id, name, version, type, endpoint, serviceUrl, source",
      whereClause,
      pagination
    });
    this.logger.debug(`GraphQL query: ${graphQlQuery}`);
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Get workflow definitions result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(
        `Error fetching data index swf results ${result.error}`
      );
      throw result.error;
    }
    return result.data.ProcessDefinitions;
  }
  async fetchInstances(args) {
    const { pagination, definitionIds, filter } = args;
    if (pagination) pagination.sortField ??= constants.FETCH_PROCESS_INSTANCES_SORT_FIELD;
    const processIdNotNullCondition = "processId: {isNull: false}";
    const definitionIdsCondition = definitionIds ? `processId: {in: ${JSON.stringify(definitionIds)}}` : void 0;
    const type = "ProcessInstance";
    const filterCondition = filter ? filterBuilder.buildFilterCondition(
      await this.inspectInputArgument(type),
      type,
      filter
    ) : "";
    let whereClause = "";
    const conditions = [];
    {
      conditions.push(`{${processIdNotNullCondition}}`);
    }
    if (definitionIdsCondition) {
      conditions.push(`{${definitionIdsCondition}}`);
    }
    if (filter) {
      conditions.push(`{${filterCondition}}`);
    }
    if (conditions.length === 0) {
      whereClause = processIdNotNullCondition;
    } else if (conditions.length === 1) {
      whereClause = conditions[0].slice(1, -1);
    } else if (conditions.length > 1) {
      whereClause = `and: [${conditions.join(", ")}]`;
    }
    const graphQlQuery = queryBuilder.buildGraphQlQuery({
      type: "ProcessInstances",
      queryBody: "id, processName, processId, businessKey, state, start, end, nodes { id }, variables, parentProcessInstance {id, processName, businessKey}",
      whereClause,
      pagination
    });
    this.logger.debug(`GraphQL query: ${graphQlQuery}`);
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Fetch process instances result: ${JSON.stringify(result)}`
    );
    const processInstancesSrc = result.data.ProcessInstances;
    const processInstances = await Promise.all(
      processInstancesSrc.map(async (instance) => {
        return await this.getWorkflowDefinitionFromInstance(instance);
      })
    );
    return processInstances;
  }
  async fetchInstancesTotalCount(definitionIds, filter) {
    const definitionIdsCondition = definitionIds ? `processId: {in: ${JSON.stringify(definitionIds)}}` : void 0;
    this.initInputProcessDefinitionArgs();
    const filterCondition = filter ? filterBuilder.buildFilterCondition(
      await this.inspectInputArgument("ProcessInstance"),
      "ProcessInstance",
      filter
    ) : "";
    let whereClause;
    if (definitionIds && filter) {
      whereClause = `and: [{${definitionIdsCondition}}, {${filterCondition}}]`;
    } else if (definitionIdsCondition || filterCondition) {
      whereClause = definitionIdsCondition ?? filterCondition;
    }
    const graphQlQuery = queryBuilder.buildGraphQlQuery({
      type: "ProcessInstances",
      queryBody: "id",
      whereClause
    });
    this.logger.debug(`GraphQL query: ${graphQlQuery}`);
    const result = await this.client.query(graphQlQuery, {});
    if (result.error) {
      this.logger.error(
        `Error when fetching instances total count: ${result.error}`
      );
      throw result.error;
    }
    const idArr = result.data.ProcessInstances;
    return idArr.length;
  }
  async getWorkflowDefinitionFromInstance(instance) {
    const workflowInfo = await this.fetchWorkflowInfo(instance.processId);
    if (!workflowInfo?.source) {
      throw new Error(
        `Workflow defintion is required to fetch instance ${instance.id}`
      );
    }
    const workflowDefinitionSrc = backstagePluginOrchestratorCommon.fromWorkflowSource(
      workflowInfo.source
    );
    if (workflowInfo) {
      instance.category = backstagePluginOrchestratorCommon.getWorkflowCategory(workflowDefinitionSrc);
      instance.description = workflowInfo.description;
    }
    return instance;
  }
  async fetchWorkflowSource(definitionId) {
    const graphQlQuery = `{ ProcessDefinitions ( where: {id: {equal: "${definitionId}" } } ) { id, source } }`;
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Fetch workflow source result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(`Error when fetching workflow source: ${result.error}`);
      return void 0;
    }
    const processDefinitions = result.data.ProcessDefinitions;
    if (processDefinitions.length === 0) {
      this.logger.info(`No workflow source found for ${definitionId}`);
      return void 0;
    }
    return processDefinitions[0].source;
  }
  async fetchInstancesByDefinitionId(args) {
    const graphQlQuery = `{ ProcessInstances(where: {processId: {equal: "${args.definitionId}" } }, orderBy: {start:DESC}, pagination: {limit: ${args.limit}, offset: ${args.offset}}) { id, processName, state, start, end } }`;
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Fetch workflow instances result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(
        `Error when fetching workflow instances: ${result.error}`
      );
      throw result.error;
    }
    return result.data.ProcessInstances;
  }
  async fetchInstanceVariables(instanceId) {
    const graphQlQuery = `{ ProcessInstances (where: { id: {equal: "${instanceId}" } } ) { variables } }`;
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Fetch process instance variables result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(
        `Error when fetching process instance variables: ${result.error}`
      );
      throw result.error;
    }
    const processInstances = result.data.ProcessInstances;
    if (processInstances.length === 0) {
      return void 0;
    }
    return backstagePluginOrchestratorCommon.parseWorkflowVariables(processInstances[0].variables);
  }
  async fetchDefinitionIdByInstanceId(instanceId) {
    const graphQlQuery = `{ ProcessInstances (where: { id: {equal: "${instanceId}" } } ) { processId } }`;
    const result = await this.client.query(graphQlQuery, {});
    this.logger.debug(
      `Fetch process id from instance result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(
        `Error when fetching process id from instance: ${result.error}`
      );
      throw result.error;
    }
    const processInstances = result.data.ProcessInstances;
    if (processInstances.length === 0) {
      return void 0;
    }
    return processInstances[0].processId;
  }
  async fetchInstance(instanceId) {
    const FindProcessInstanceQuery = core.gql`
      query FindProcessInstanceQuery($instanceId: String!) {
        ProcessInstances(where: { id: { equal: $instanceId } }) {
          id
          processName
          processId
          serviceUrl
          businessKey
          state
          start
          end
          nodes {
            id
            nodeId
            definitionId
            type
            name
            enter
            exit
          }
          variables
          parentProcessInstance {
            id
            processName
            businessKey
          }
          error {
            nodeDefinitionId
            message
          }
        }
      }
    `;
    const result = await this.client.query(FindProcessInstanceQuery, {
      instanceId
    });
    this.logger.debug(
      `Fetch process instance result: ${JSON.stringify(result)}`
    );
    if (result.error) {
      this.logger.error(
        `Error when fetching process instances: ${result.error}`
      );
      throw result.error;
    }
    const processInstances = result.data.ProcessInstances;
    if (processInstances.length === 0) {
      return void 0;
    }
    const instance = processInstances[0];
    const workflowInfo = await this.fetchWorkflowInfo(instance.processId);
    if (!workflowInfo?.source) {
      throw new Error(
        `Workflow defintion is required to fetch instance ${instance.id}`
      );
    }
    const workflowDefinitionSrc = backstagePluginOrchestratorCommon.fromWorkflowSource(
      workflowInfo.source
    );
    if (workflowInfo) {
      instance.category = backstagePluginOrchestratorCommon.getWorkflowCategory(workflowDefinitionSrc);
      instance.description = workflowDefinitionSrc.description;
    }
    return instance;
  }
}

exports.DataIndexService = DataIndexService;
//# sourceMappingURL=DataIndexService.cjs.js.map
