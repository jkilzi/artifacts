'use strict';

var backstagePluginOrchestratorCommon = require('@red-hat-developer-hub/backstage-plugin-orchestrator-common');
var Helper = require('../Helper.cjs.js');
var V2Mappings = require('./mapping/V2Mappings.cjs.js');

const FETCH_INSTANCE_MAX_ATTEMPTS = 10;
const FETCH_INSTANCE_RETRY_DELAY_MS = 1e3;
class V2 {
  constructor(orchestratorService) {
    this.orchestratorService = orchestratorService;
  }
  async getWorkflowsOverview(pagination, filter) {
    const overviews = await this.orchestratorService.fetchWorkflowOverviews({
      pagination,
      filter
    });
    if (!overviews) {
      throw new Error("Couldn't fetch workflow overviews");
    }
    const result = {
      overviews: overviews.map((item) => V2Mappings.mapToWorkflowOverviewDTO(item)),
      paginationInfo: {
        pageSize: pagination.limit,
        offset: pagination.offset,
        totalCount: overviews.length
      }
    };
    return result;
  }
  async getWorkflowOverviewById(workflowId) {
    const overview = await this.orchestratorService.fetchWorkflowOverview({
      definitionId: workflowId,
      cacheHandler: "throw"
    });
    if (!overview) {
      throw new Error(`Couldn't fetch workflow overview for ${workflowId}`);
    }
    return V2Mappings.mapToWorkflowOverviewDTO(overview);
  }
  async getWorkflowById(workflowId) {
    const resultV1 = await this.getWorkflowSourceById(workflowId);
    return V2Mappings.mapToWorkflowDTO(resultV1);
  }
  async getWorkflowSourceById(workflowId) {
    const source = await this.orchestratorService.fetchWorkflowSource({
      definitionId: workflowId,
      cacheHandler: "throw"
    });
    if (!source) {
      throw new Error(`Couldn't fetch workflow source for ${workflowId}`);
    }
    return source;
  }
  async getInstances(pagination, filter, workflowId) {
    const instances = await this.orchestratorService.fetchInstances({
      pagination,
      filter,
      workflowId
    });
    const totalCount = await this.orchestratorService.fetchInstancesTotalCount(
      workflowId,
      filter
    );
    const result = {
      items: instances?.map(V2Mappings.mapToProcessInstanceDTO),
      paginationInfo: {
        pageSize: pagination?.limit,
        offset: pagination?.offset,
        totalCount
      }
    };
    return result;
  }
  async getInstanceById(instanceId, includeAssessment = false) {
    const instance = await this.orchestratorService.fetchInstance({
      instanceId,
      cacheHandler: "throw"
    });
    if (!instance) {
      throw new Error(`Couldn't fetch process instance ${instanceId}`);
    }
    let assessedByInstance;
    if (includeAssessment && instance.businessKey) {
      assessedByInstance = await this.orchestratorService.fetchInstance({
        instanceId: instance.businessKey,
        cacheHandler: "throw"
      });
    }
    return {
      instance: V2Mappings.mapToProcessInstanceDTO(instance),
      assessedBy: assessedByInstance ? V2Mappings.mapToProcessInstanceDTO(assessedByInstance) : void 0
    };
  }
  async executeWorkflow(executeWorkflowRequestDTO, workflowId, businessKey) {
    const definition = await this.orchestratorService.fetchWorkflowInfo({
      definitionId: workflowId,
      cacheHandler: "throw"
    });
    if (!definition) {
      throw new Error(`Couldn't fetch workflow definition for ${workflowId}`);
    }
    if (!definition.serviceUrl) {
      throw new Error(`ServiceURL is not defined for workflow ${workflowId}`);
    }
    const executionResponse = await this.orchestratorService.executeWorkflow({
      definitionId: workflowId,
      inputData: executeWorkflowRequestDTO.inputData,
      serviceUrl: definition.serviceUrl,
      businessKey,
      cacheHandler: "throw"
    });
    if (!executionResponse) {
      throw new Error(`Couldn't execute workflow ${workflowId}`);
    }
    await Helper.retryAsyncFunction({
      asyncFn: () => this.orchestratorService.fetchInstance({
        instanceId: executionResponse.id,
        cacheHandler: "throw"
      }),
      maxAttempts: FETCH_INSTANCE_MAX_ATTEMPTS,
      delayMs: FETCH_INSTANCE_RETRY_DELAY_MS
    });
    if (!executionResponse) {
      throw new Error("Error executing workflow with id ${workflowId}");
    }
    return V2Mappings.mapToExecuteWorkflowResponseDTO(workflowId, executionResponse);
  }
  async retriggerInstance(workflowId, instanceId) {
    const definition = await this.orchestratorService.fetchWorkflowInfo({
      definitionId: workflowId,
      cacheHandler: "throw"
    });
    if (!definition) {
      throw new Error(`Couldn't fetch workflow definition for ${workflowId}`);
    }
    if (!definition.serviceUrl) {
      throw new Error(`ServiceURL is not defined for workflow ${workflowId}`);
    }
    const response = await this.orchestratorService.retriggerWorkflow({
      definitionId: workflowId,
      instanceId,
      serviceUrl: definition.serviceUrl,
      cacheHandler: "throw"
    });
    if (!response) {
      throw new Error(
        `Couldn't retrigger instance ${instanceId} of workflow ${workflowId}`
      );
    }
  }
  async abortWorkflow(instanceId) {
    await this.orchestratorService.abortWorkflowInstance({
      instanceId,
      cacheHandler: "throw"
    });
    return `Workflow instance ${instanceId} successfully aborted`;
  }
  async getWorkflowStatuses() {
    return [
      backstagePluginOrchestratorCommon.ProcessInstanceState.Active,
      backstagePluginOrchestratorCommon.ProcessInstanceState.Error,
      backstagePluginOrchestratorCommon.ProcessInstanceState.Completed,
      backstagePluginOrchestratorCommon.ProcessInstanceState.Aborted,
      backstagePluginOrchestratorCommon.ProcessInstanceState.Suspended,
      backstagePluginOrchestratorCommon.ProcessInstanceState.Pending
    ].map((status) => V2Mappings.mapToWorkflowRunStatusDTO(status));
  }
  async getWorkflowInputSchemaById(workflowId, serviceUrl) {
    return this.orchestratorService.fetchWorkflowInfoOnService({
      definitionId: workflowId,
      serviceUrl,
      cacheHandler: "throw"
    });
  }
  extractQueryParam(req, key) {
    return req.query[key];
  }
}

exports.V2 = V2;
//# sourceMappingURL=v2.cjs.js.map
