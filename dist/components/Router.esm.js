import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { workflowInstanceRouteRef, workflowDefinitionsRouteRef, executeWorkflowRouteRef } from '../routes.esm.js';
import { ExecuteWorkflowPage } from './ExecuteWorkflowPage/ExecuteWorkflowPage.esm.js';
import { OrchestratorPage } from './OrchestratorPage.esm.js';
import { WorkflowDefinitionViewerPage } from './WorkflowDefinitionViewerPage/WorkflowDefinitionViewerPage.esm.js';
import { WorkflowInstancePage } from './WorkflowInstancePage.esm.js';

const Router = () => {
  return /* @__PURE__ */ React.createElement(Routes, null, /* @__PURE__ */ React.createElement(Route, { path: "/*", element: /* @__PURE__ */ React.createElement(OrchestratorPage, null) }), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: workflowInstanceRouteRef.path,
      element: /* @__PURE__ */ React.createElement(WorkflowInstancePage, null)
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: workflowDefinitionsRouteRef.path,
      element: /* @__PURE__ */ React.createElement(WorkflowDefinitionViewerPage, null)
    }
  ), /* @__PURE__ */ React.createElement(
    Route,
    {
      path: executeWorkflowRouteRef.path,
      element: /* @__PURE__ */ React.createElement(ExecuteWorkflowPage, null)
    }
  ));
};

export { Router };
//# sourceMappingURL=Router.esm.js.map
