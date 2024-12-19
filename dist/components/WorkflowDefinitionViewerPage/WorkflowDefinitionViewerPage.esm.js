import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import { ResponseErrorPanel, InfoCard } from '@backstage/core-components';
import { useRouteRefParams, useApi, useRouteRef } from '@backstage/core-plugin-api';
import { usePermission } from '@backstage/plugin-permission-react';
import { Grid, Tooltip, Button } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { orchestratorWorkflowExecutePermission } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import 'axios';
import { orchestratorApiRef } from '../../api/api.esm.js';
import { workflowDefinitionsRouteRef, executeWorkflowRouteRef } from '../../routes.esm.js';
import { BaseOrchestratorPage } from '../BaseOrchestratorPage.esm.js';
import { WorkflowEditor, EditorViewKind } from '../WorkflowEditor/WorkflowEditor.esm.js';
import WorkflowDefinitionDetailsCard from './WorkflowDefinitionDetailsCard.esm.js';

const WorkflowDefinitionViewerPage = () => {
  const { workflowId, format } = useRouteRefParams(workflowDefinitionsRouteRef);
  const orchestratorApi = useApi(orchestratorApiRef);
  const { loading: loadingPermission, allowed: canRun } = usePermission({
    permission: orchestratorWorkflowExecutePermission
  });
  const {
    value: workflowOverviewDTO,
    loading,
    error
  } = useAsync(() => {
    return orchestratorApi.getWorkflowOverview(workflowId);
  }, []);
  const navigate = useNavigate();
  const executeWorkflowLink = useRouteRef(executeWorkflowRouteRef);
  const workflowFormat = useMemo(
    () => format === "json" ? "json" : "yaml",
    [format]
  );
  const handleExecute = () => {
    navigate(executeWorkflowLink({ workflowId }));
  };
  return /* @__PURE__ */ React.createElement(
    BaseOrchestratorPage,
    {
      title: workflowOverviewDTO?.data.name || workflowId,
      type: "Workflows",
      typeLink: "/orchestrator"
    },
    /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 2, direction: "column", wrap: "nowrap" }, error && /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(ResponseErrorPanel, { error })), /* @__PURE__ */ React.createElement(Grid, { container: true, item: true, justifyContent: "flex-end", spacing: 1 }, /* @__PURE__ */ React.createElement(Grid, { item: true }, loading || loadingPermission ? /* @__PURE__ */ React.createElement(Skeleton, { variant: "text", width: "5rem" }) : /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: "user not authorized to execute workflow",
        disableHoverListener: canRun
      },
      /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "contained",
          color: "primary",
          onClick: handleExecute,
          disabled: !canRun
        },
        "Run"
      )
    ))), /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(
      WorkflowDefinitionDetailsCard,
      {
        workflowOverview: workflowOverviewDTO?.data,
        loading
      }
    )), /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(InfoCard, { title: "Workflow definition" }, /* @__PURE__ */ React.createElement("div", { style: { height: "600px" } }, /* @__PURE__ */ React.createElement(
      WorkflowEditor,
      {
        kind: EditorViewKind.EXTENDED_DIAGRAM_VIEWER,
        workflowId,
        format: workflowFormat
      }
    )))))
  );
};

export { WorkflowDefinitionViewerPage };
//# sourceMappingURL=WorkflowDefinitionViewerPage.esm.js.map
