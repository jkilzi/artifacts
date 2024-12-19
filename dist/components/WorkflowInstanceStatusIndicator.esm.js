import React from 'react';
import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import { capitalize } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import { VALUE_UNAVAILABLE } from '../constants.esm.js';
import { useWorkflowInstanceStateColors } from '../hooks/useWorkflowInstanceStatusColors.esm.js';
import { workflowInstanceRouteRef } from '../routes.esm.js';

const WorkflowInstanceStatusIndicator = ({
  status,
  lastRunId
}) => {
  const iconColor = useWorkflowInstanceStateColors(status);
  const workflowInstanceLink = useRouteRef(workflowInstanceRouteRef);
  if (!status) {
    return VALUE_UNAVAILABLE;
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(DotIcon, { style: { fontSize: "0.75rem" }, className: iconColor }), " ", lastRunId ? /* @__PURE__ */ React.createElement(Link, { to: workflowInstanceLink({ instanceId: lastRunId }) }, capitalize(status)) : /* @__PURE__ */ React.createElement(React.Fragment, null, capitalize(status)));
};

export { WorkflowInstanceStatusIndicator };
//# sourceMappingURL=WorkflowInstanceStatusIndicator.esm.js.map
