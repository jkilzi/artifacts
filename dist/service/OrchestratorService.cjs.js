'use strict';

class OrchestratorService {
  constructor(sonataFlowService, dataIndexService, workflowCacheService) {
    this.sonataFlowService = sonataFlowService;
    this.dataIndexService = dataIndexService;
    this.workflowCacheService = workflowCacheService;
  }
  // Data Index Service Wrapper
  async abortWorkflowInstance(args) {
    const { instanceId, cacheHandler } = args;
    const definitionId = await this.dataIndexService.fetchDefinitionIdByInstanceId(instanceId);
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.dataIndexService.abortWorkflowInstance(instanceId) : void 0;
  }
  async fetchWorkflowInfo(args) {
    const { definitionId, cacheHandler } = args;
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.dataIndexService.fetchWorkflowInfo(definitionId) : void 0;
  }
  async fetchInstances(args) {
    const definitionIds = args.workflowId ? [args.workflowId] : this.workflowCacheService.definitionIds;
    return await this.dataIndexService.fetchInstances({
      definitionIds,
      pagination: args.pagination,
      filter: args.filter
    });
  }
  async fetchInstancesTotalCount(workflowId, filter) {
    const definitionIds = workflowId ? [workflowId] : this.workflowCacheService.definitionIds;
    return await this.dataIndexService.fetchInstancesTotalCount(
      definitionIds,
      filter
    );
  }
  async fetchWorkflowSource(args) {
    const { definitionId, cacheHandler } = args;
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.dataIndexService.fetchWorkflowSource(definitionId) : void 0;
  }
  async fetchInstanceVariables(args) {
    const { instanceId, cacheHandler } = args;
    const definitionId = await this.dataIndexService.fetchDefinitionIdByInstanceId(instanceId);
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.dataIndexService.fetchInstanceVariables(instanceId) : void 0;
  }
  async fetchInstance(args) {
    const { instanceId, cacheHandler } = args;
    const instance = await this.dataIndexService.fetchInstance(instanceId);
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      instance?.processId,
      cacheHandler
    );
    return isWorkflowAvailable ? instance : void 0;
  }
  // SonataFlow Service Wrapper
  async fetchWorkflowInfoOnService(args) {
    const { definitionId, cacheHandler } = args;
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.sonataFlowService.fetchWorkflowInfoOnService(args) : void 0;
  }
  async fetchWorkflowDefinition(args) {
    const { definitionId, cacheHandler } = args;
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.sonataFlowService.fetchWorkflowDefinition(definitionId) : void 0;
  }
  async fetchWorkflowOverviews(args) {
    return await this.sonataFlowService.fetchWorkflowOverviews({
      definitionIds: this.workflowCacheService.definitionIds,
      pagination: args.pagination,
      filter: args.filter
    });
  }
  async executeWorkflow(args) {
    const { definitionId, cacheHandler } = args;
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.sonataFlowService.executeWorkflow(args) : void 0;
  }
  async retriggerWorkflow(args) {
    const { definitionId, cacheHandler } = args;
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.sonataFlowService.retriggerInstance(args) : void 0;
  }
  async fetchWorkflowOverview(args) {
    const { definitionId, cacheHandler } = args;
    const isWorkflowAvailable = this.workflowCacheService.isAvailable(
      definitionId,
      cacheHandler
    );
    return isWorkflowAvailable ? await this.sonataFlowService.fetchWorkflowOverview(definitionId) : void 0;
  }
}

exports.OrchestratorService = OrchestratorService;
//# sourceMappingURL=OrchestratorService.cjs.js.map
