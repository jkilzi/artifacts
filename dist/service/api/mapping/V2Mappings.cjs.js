'use strict';

var moment = require('moment');
var backstagePluginOrchestratorCommon = require('@red-hat-developer-hub/backstage-plugin-orchestrator-common');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e : { default: e }; }

var moment__default = /*#__PURE__*/_interopDefaultCompat(moment);

function mapToWorkflowOverviewDTO(overview) {
  return {
    name: overview.name,
    format: overview.format,
    workflowId: overview.workflowId,
    description: overview.description,
    lastRunId: overview.lastRunId,
    lastRunStatus: overview.lastRunStatus ? getProcessInstancesStatusDTOFromString(overview.lastRunStatus) : void 0,
    lastTriggeredMs: overview.lastTriggeredMs,
    category: mapWorkflowCategoryDTOFromString(overview.category)
  };
}
function mapWorkflowCategoryDTOFromString(category) {
  return category?.toLocaleLowerCase() === "assessment" ? "assessment" : "infrastructure";
}
function getWorkflowCategoryDTO(definition) {
  return backstagePluginOrchestratorCommon.getWorkflowCategory(definition);
}
function getWorkflowFormatDTO(source) {
  return backstagePluginOrchestratorCommon.extractWorkflowFormat(source);
}
function mapToWorkflowDTO(source) {
  const definition = backstagePluginOrchestratorCommon.fromWorkflowSource(source);
  return {
    annotations: definition.annotations,
    category: getWorkflowCategoryDTO(definition),
    description: definition.description,
    name: definition.name,
    format: getWorkflowFormatDTO(source),
    id: definition.id
  };
}
function mapWorkflowCategoryDTO(category) {
  if (category === backstagePluginOrchestratorCommon.WorkflowCategory.ASSESSMENT) {
    return "assessment";
  }
  return "infrastructure";
}
function getProcessInstancesStatusDTOFromString(state) {
  switch (state) {
    case backstagePluginOrchestratorCommon.ProcessInstanceState.Active.valueOf():
      return "Active";
    case backstagePluginOrchestratorCommon.ProcessInstanceState.Error.valueOf():
      return "Error";
    case backstagePluginOrchestratorCommon.ProcessInstanceState.Completed.valueOf():
      return "Completed";
    case backstagePluginOrchestratorCommon.ProcessInstanceState.Aborted.valueOf():
      return "Aborted";
    case backstagePluginOrchestratorCommon.ProcessInstanceState.Suspended.valueOf():
      return "Suspended";
    case backstagePluginOrchestratorCommon.ProcessInstanceState.Pending.valueOf():
      return "Pending";
    default:
      throw new Error(
        `state ${state} is not one of the values of type ProcessInstanceStatusDTO`
      );
  }
}
function getProcessInstanceStateFromStatusDTOString(status) {
  switch (status) {
    case "Active":
      return backstagePluginOrchestratorCommon.ProcessInstanceState.Active.valueOf();
    case "Error":
      return backstagePluginOrchestratorCommon.ProcessInstanceState.Error.valueOf();
    case "Completed":
      return backstagePluginOrchestratorCommon.ProcessInstanceState.Completed.valueOf();
    case "Aborted":
      return backstagePluginOrchestratorCommon.ProcessInstanceState.Aborted.valueOf();
    case "Suspended":
      return backstagePluginOrchestratorCommon.ProcessInstanceState.Suspended.valueOf();
    case "Pending":
      return backstagePluginOrchestratorCommon.ProcessInstanceState.Pending.valueOf();
    default:
      throw new Error(
        `status ${status} is not one of the values of type ProcessInstanceState`
      );
  }
}
function mapToProcessInstanceDTO(processInstance) {
  const start = moment__default.default(processInstance.start);
  const end = moment__default.default(processInstance.end);
  const duration = processInstance.end ? moment__default.default.duration(start.diff(end)).humanize() : void 0;
  let variables;
  if (typeof processInstance?.variables === "string") {
    variables = JSON.parse(processInstance?.variables);
  } else {
    variables = processInstance?.variables;
  }
  return {
    id: processInstance.id,
    processId: processInstance.processId,
    processName: processInstance.processName,
    description: processInstance.description,
    serviceUrl: processInstance.serviceUrl,
    businessKey: processInstance.businessKey,
    endpoint: processInstance.endpoint,
    error: processInstance.error,
    category: mapWorkflowCategoryDTO(processInstance.category),
    start: processInstance.start,
    end: processInstance.end,
    duration,
    // @ts-ignore
    workflowdata: variables?.workflowdata,
    status: getProcessInstancesStatusDTOFromString(processInstance.state),
    nodes: processInstance.nodes.map(mapToNodeInstanceDTO)
  };
}
function mapToNodeInstanceDTO(nodeInstance) {
  return { ...nodeInstance, __typename: "NodeInstance" };
}
function mapToExecuteWorkflowResponseDTO(workflowId, workflowExecutionResponse) {
  if (!workflowExecutionResponse?.id) {
    throw new Error(
      `Error while mapping ExecuteWorkflowResponse to ExecuteWorkflowResponseDTO for workflow with id ${workflowId}`
    );
  }
  return {
    id: workflowExecutionResponse.id
  };
}
function mapToWorkflowRunStatusDTO(status) {
  return {
    key: backstagePluginOrchestratorCommon.capitalize(status),
    value: status
  };
}

exports.getProcessInstanceStateFromStatusDTOString = getProcessInstanceStateFromStatusDTOString;
exports.getProcessInstancesStatusDTOFromString = getProcessInstancesStatusDTOFromString;
exports.getWorkflowCategoryDTO = getWorkflowCategoryDTO;
exports.getWorkflowFormatDTO = getWorkflowFormatDTO;
exports.mapToExecuteWorkflowResponseDTO = mapToExecuteWorkflowResponseDTO;
exports.mapToNodeInstanceDTO = mapToNodeInstanceDTO;
exports.mapToProcessInstanceDTO = mapToProcessInstanceDTO;
exports.mapToWorkflowDTO = mapToWorkflowDTO;
exports.mapToWorkflowOverviewDTO = mapToWorkflowOverviewDTO;
exports.mapToWorkflowRunStatusDTO = mapToWorkflowRunStatusDTO;
exports.mapWorkflowCategoryDTO = mapWorkflowCategoryDTO;
exports.mapWorkflowCategoryDTOFromString = mapWorkflowCategoryDTOFromString;
//# sourceMappingURL=V2Mappings.cjs.js.map
