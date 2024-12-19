'use strict';

var pluginPermissionCommon = require('@backstage/plugin-permission-common');

const orchestratorWorkflowInstancesReadPermission = pluginPermissionCommon.createPermission({
  name: "orchestrator.workflowInstances.read",
  attributes: {
    action: "read"
  }
});
const orchestratorWorkflowInstanceReadPermission = pluginPermissionCommon.createPermission({
  name: "orchestrator.workflowInstance.read",
  attributes: {
    action: "read"
  }
});
const orchestratorWorkflowReadPermission = pluginPermissionCommon.createPermission({
  name: "orchestrator.workflow.read",
  attributes: {
    action: "read"
  }
});
const orchestratorWorkflowExecutePermission = pluginPermissionCommon.createPermission({
  name: "orchestrator.workflow.execute",
  attributes: {}
});
const orchestratorWorkflowInstanceAbortPermission = pluginPermissionCommon.createPermission({
  name: "orchestrator.workflowInstance.abort",
  attributes: {}
});
const orchestratorPermissions = [
  orchestratorWorkflowReadPermission,
  orchestratorWorkflowExecutePermission,
  orchestratorWorkflowInstancesReadPermission,
  orchestratorWorkflowInstanceReadPermission,
  orchestratorWorkflowInstanceAbortPermission
];

exports.orchestratorPermissions = orchestratorPermissions;
exports.orchestratorWorkflowExecutePermission = orchestratorWorkflowExecutePermission;
exports.orchestratorWorkflowInstanceAbortPermission = orchestratorWorkflowInstanceAbortPermission;
exports.orchestratorWorkflowInstanceReadPermission = orchestratorWorkflowInstanceReadPermission;
exports.orchestratorWorkflowInstancesReadPermission = orchestratorWorkflowInstancesReadPermission;
exports.orchestratorWorkflowReadPermission = orchestratorWorkflowReadPermission;
//# sourceMappingURL=permissions.cjs.js.map
