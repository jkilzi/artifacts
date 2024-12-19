import { createPermission } from '@backstage/plugin-permission-common';

const orchestratorWorkflowInstancesReadPermission = createPermission({
  name: "orchestrator.workflowInstances.read",
  attributes: {
    action: "read"
  }
});
const orchestratorWorkflowInstanceReadPermission = createPermission({
  name: "orchestrator.workflowInstance.read",
  attributes: {
    action: "read"
  }
});
const orchestratorWorkflowReadPermission = createPermission({
  name: "orchestrator.workflow.read",
  attributes: {
    action: "read"
  }
});
const orchestratorWorkflowExecutePermission = createPermission({
  name: "orchestrator.workflow.execute",
  attributes: {}
});
const orchestratorWorkflowInstanceAbortPermission = createPermission({
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

export { orchestratorPermissions, orchestratorWorkflowExecutePermission, orchestratorWorkflowInstanceAbortPermission, orchestratorWorkflowInstanceReadPermission, orchestratorWorkflowInstancesReadPermission, orchestratorWorkflowReadPermission };
//# sourceMappingURL=permissions.esm.js.map
