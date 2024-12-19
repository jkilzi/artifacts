import { createRouteRef, createSubRouteRef } from '@backstage/core-plugin-api';

const orchestratorRootRouteRef = createRouteRef({
  id: "orchestrator"
});
const workflowDefinitionsRouteRef = createSubRouteRef({
  id: "orchestrator/workflows",
  parent: orchestratorRootRouteRef,
  path: "/workflows/:format/:workflowId"
});
const workflowInstancesRouteRef = createSubRouteRef({
  id: "orchestrator/instances",
  parent: orchestratorRootRouteRef,
  path: "/instances"
});
const workflowInstanceRouteRef = createSubRouteRef({
  id: "orchestrator/instances",
  parent: orchestratorRootRouteRef,
  path: "/instances/:instanceId"
});
const executeWorkflowRouteRef = createSubRouteRef({
  id: "orchestrator/workflows/execute",
  parent: orchestratorRootRouteRef,
  path: "/workflows/:workflowId/execute"
});

export { executeWorkflowRouteRef, orchestratorRootRouteRef, workflowDefinitionsRouteRef, workflowInstanceRouteRef, workflowInstancesRouteRef };
//# sourceMappingURL=routes.esm.js.map
