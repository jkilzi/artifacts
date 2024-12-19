import { isNonNullable } from '../utils/TypeGuards.esm.js';

const fromNodeInstanceToWorkflowProgressNodeModel = (workflowStatus, workflowError) => (node, nodeIndex, nodes) => {
  const isLastNode = nodeIndex === nodes.length - 1;
  const model = {
    ...node,
    status: workflowStatus,
    enter: node.enter
  };
  if (isNonNullable(node.exit)) {
    model.exit = node.exit;
  }
  if (node.definitionId === workflowError?.nodeDefinitionId) {
    model.status = "Error";
    model.error = workflowError;
  } else if (node.enter && node.exit) {
    model.status = "Completed";
  } else if (!node.exit) {
    model.status = "Active";
  }
  if (workflowStatus && isLastNode && ["ABORTED", "SUSPENDED"].includes(workflowStatus)) {
    model.status = workflowStatus;
  }
  return model;
};

export { fromNodeInstanceToWorkflowProgressNodeModel };
//# sourceMappingURL=WorkflowProgressNodeModel.esm.js.map
