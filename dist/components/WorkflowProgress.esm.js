import React from 'react';
import { compareNodes } from '../utils/NodeInstanceUtils.esm.js';
import { Paragraph } from './Paragraph.esm.js';
import { WorkflowProgressNode } from './WorkflowProgressNode.esm.js';
import { fromNodeInstanceToWorkflowProgressNodeModel } from './WorkflowProgressNodeModel.esm.js';

const WorkflowProgress = ({
  workflowStatus,
  workflowError,
  workflowNodes,
  emptyState = /* @__PURE__ */ React.createElement(Paragraph, null, "No data available")
}) => /* @__PURE__ */ React.createElement(React.Fragment, null, workflowNodes.length === 0 ? emptyState : structuredClone(workflowNodes).sort(compareNodes).map(
  fromNodeInstanceToWorkflowProgressNodeModel(
    workflowStatus,
    workflowError
  )
).map((model) => /* @__PURE__ */ React.createElement(WorkflowProgressNode, { model, key: model.id })));
WorkflowProgress.displayName = "WorkflowProgress";

export { WorkflowProgress };
//# sourceMappingURL=WorkflowProgress.esm.js.map
