'use strict';

var backstagePluginOrchestratorCommon = require('@red-hat-developer-hub/backstage-plugin-orchestrator-common');

class SonataFlowService {
  constructor(dataIndexService, logger) {
    this.dataIndexService = dataIndexService;
    this.logger = logger;
  }
  async fetchWorkflowInfoOnService(args) {
    const urlToFetch = `${args.serviceUrl}/management/processes/${args.definitionId}`;
    const response = await fetch(urlToFetch);
    if (response.ok) {
      const json = await response.json();
      this.logger.debug(`Fetch workflow info result: ${JSON.stringify(json)}`);
      return json;
    }
    throw new Error(
      await this.createPrefixFetchErrorMessage(urlToFetch, response)
    );
  }
  async fetchWorkflowDefinition(definitionId) {
    const source = await this.dataIndexService.fetchWorkflowSource(definitionId);
    if (source) {
      return backstagePluginOrchestratorCommon.fromWorkflowSource(source);
    }
    return void 0;
  }
  async fetchWorkflowOverviews(args) {
    const { definitionIds, pagination, filter } = args;
    const workflowInfos = await this.dataIndexService.fetchWorkflowInfos({
      definitionIds,
      pagination,
      filter
    });
    if (!workflowInfos?.length) {
      return [];
    }
    const items = await Promise.all(
      workflowInfos.filter((info) => info.source).map((info) => this.fetchWorkflowOverviewBySource(info.source))
    );
    return items.filter((item) => !!item);
  }
  async executeWorkflow(args) {
    const urlToFetch = args.businessKey ? `${args.serviceUrl}/${args.definitionId}?businessKey=${args.businessKey}` : `${args.serviceUrl}/${args.definitionId}`;
    const response = await fetch(urlToFetch, {
      method: "POST",
      body: JSON.stringify(args.inputData || {}),
      headers: { "content-type": "application/json" }
    });
    const json = await response.json();
    if (json.id) {
      this.logger.debug(
        `Execute workflow successful. Response: ${JSON.stringify(json)}`
      );
      return json;
    } else if (!response.ok) {
      const errorMessage = await this.createPrefixFetchErrorMessage(
        urlToFetch,
        response,
        "POST"
      );
      this.logger.error(
        `Execute workflow failed. Response: ${JSON.stringify(json)}`
      );
      throw new Error(errorMessage);
    } else {
      this.logger.error(
        `Execute workflow did not return a workflow instance ID. Response: ${JSON.stringify(
          json
        )}`
      );
      throw new Error("Execute workflow did not return a workflow instance ID");
    }
  }
  async retriggerInstance(args) {
    const urlToFetch = `${args.serviceUrl}/management/processes/${args.definitionId}/instances/${args.instanceId}/retrigger`;
    const response = await fetch(urlToFetch, {
      method: "POST"
    });
    if (!response.ok) {
      throw new Error(
        `${await this.createPrefixFetchErrorMessage(
          urlToFetch,
          response,
          "POST"
        )}`
      );
    }
    return true;
  }
  async fetchWorkflowOverview(definitionId) {
    const source = await this.dataIndexService.fetchWorkflowSource(definitionId);
    if (!source) {
      this.logger.debug(`Workflow source not found: ${definitionId}`);
      return void 0;
    }
    return await this.fetchWorkflowOverviewBySource(source);
  }
  async fetchWorkflowOverviewBySource(source) {
    let lastTriggered = /* @__PURE__ */ new Date(0);
    let lastRunStatus;
    let lastRunId;
    const definition = backstagePluginOrchestratorCommon.fromWorkflowSource(source);
    const processInstances = await this.dataIndexService.fetchInstancesByDefinitionId({
      definitionId: definition.id,
      limit: 1,
      offset: 0
    });
    const pInstance = processInstances[0];
    if (pInstance?.start) {
      lastRunId = pInstance.id;
      lastTriggered = new Date(pInstance.start);
      lastRunStatus = pInstance.state;
    }
    return {
      workflowId: definition.id,
      name: definition.name,
      format: backstagePluginOrchestratorCommon.extractWorkflowFormat(source),
      lastRunId,
      lastTriggeredMs: lastTriggered.getTime(),
      lastRunStatus,
      category: backstagePluginOrchestratorCommon.getWorkflowCategory(definition),
      description: definition.description
    };
  }
  async pingWorkflowService(args) {
    const urlToFetch = `${args.serviceUrl}/management/processes/${args.definitionId}`;
    const response = await fetch(urlToFetch);
    return response.ok;
  }
  async updateInstanceInputData(args) {
    const { definitionId, serviceUrl, instanceId, inputData } = args;
    const urlToFetch = `${serviceUrl}/${definitionId}/${instanceId}`;
    const response = await fetch(urlToFetch, {
      method: "PATCH",
      body: JSON.stringify(inputData),
      headers: { "content-type": "application/json" }
    });
    return response.ok;
  }
  async createPrefixFetchErrorMessage(urlToFetch, response, httpMethod = "GET") {
    const res = await response.json();
    const errorInfo = [];
    let errorMsg = `Request ${httpMethod} ${urlToFetch} failed with: StatusCode: ${response.status}`;
    if (response.statusText) {
      errorInfo.push(`StatusText: ${response.statusText}`);
    }
    if (res?.details) {
      errorInfo.push(`Details: ${res?.details}`);
    }
    if (res?.stack) {
      errorInfo.push(`Stack: ${res?.stack}`);
    }
    if (errorInfo.length > 0) {
      errorMsg += ` ${errorInfo.join(", ")}`;
    } else {
      errorMsg += " Unexpected error";
    }
    return errorMsg;
  }
}

exports.SonataFlowService = SonataFlowService;
//# sourceMappingURL=SonataFlowService.cjs.js.map
