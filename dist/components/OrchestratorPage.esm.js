import React from 'react';
import { TabbedLayout } from '@backstage/core-components';
import { workflowInstancesRouteRef } from '../routes.esm.js';
import { BaseOrchestratorPage } from './BaseOrchestratorPage.esm.js';
import { WorkflowRunsTabContent } from './WorkflowRunsTabContent.esm.js';
import { WorkflowsTabContent } from './WorkflowsTabContent.esm.js';

const OrchestratorPage = () => {
  return /* @__PURE__ */ React.createElement(BaseOrchestratorPage, { title: "Workflow Orchestrator", noPadding: true }, /* @__PURE__ */ React.createElement(TabbedLayout, null, /* @__PURE__ */ React.createElement(TabbedLayout.Route, { path: "/", title: "Workflows" }, /* @__PURE__ */ React.createElement(WorkflowsTabContent, null)), /* @__PURE__ */ React.createElement(
    TabbedLayout.Route,
    {
      path: workflowInstancesRouteRef.path,
      title: "Workflow runs"
    },
    /* @__PURE__ */ React.createElement(WorkflowRunsTabContent, null)
  )));
};

export { OrchestratorPage };
//# sourceMappingURL=OrchestratorPage.esm.js.map
