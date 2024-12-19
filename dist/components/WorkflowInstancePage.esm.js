import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Progress, ResponseErrorPanel, ContentHeader } from '@backstage/core-components';
import { useApi, useRouteRef, useRouteRefParams } from '@backstage/core-plugin-api';
import { usePermission } from '@backstage/plugin-permission-react';
import { Grid, Tooltip, Button } from '@material-ui/core';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { orchestratorWorkflowExecutePermission, orchestratorWorkflowInstanceAbortPermission, ProcessInstanceStatusDTO, QUERY_PARAM_INSTANCE_ID, QUERY_PARAM_ASSESSMENT_INSTANCE_ID } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import 'axios';
import { orchestratorApiRef } from '../api/api.esm.js';
import { SHORT_REFRESH_INTERVAL } from '../constants.esm.js';
import usePolling from '../hooks/usePolling.esm.js';
import { executeWorkflowRouteRef, workflowInstanceRouteRef } from '../routes.esm.js';
import { isNonNullable } from '../utils/TypeGuards.esm.js';
import { buildUrl } from '../utils/UrlUtils.esm.js';
import { BaseOrchestratorPage } from './BaseOrchestratorPage.esm.js';
import { InfoDialog } from './InfoDialog.esm.js';
import { WorkflowInstancePageContent } from './WorkflowInstancePageContent.esm.js';

const useStyles = makeStyles(
  (theme) => createStyles({
    abortButton: {
      backgroundColor: theme.palette.error.main,
      color: theme.palette.getContrastText(theme.palette.error.main),
      "&:hover": {
        backgroundColor: theme.palette.error.dark
      }
    }
  })
);
const AbortConfirmationDialogContent = () => /* @__PURE__ */ React.createElement("div", null, "Are you sure you want to abort this workflow instance?");
const AbortAlertDialogContent = (props) => /* @__PURE__ */ React.createElement("div", null, "The abort operation failed with the following error: ", props.message);
const AbortConfirmationDialogActions = (props) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Button, { onClick: props.handleCancel }, "Cancel"), /* @__PURE__ */ React.createElement(Button, { onClick: props.handleSubmit, color: "primary" }, "Ok"));
const AbortAlertDialogActions = (props) => /* @__PURE__ */ React.createElement(Button, { onClick: props.handleClose, color: "primary" }, "OK");
const WorkflowInstancePage = ({
  instanceId
}) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const orchestratorApi = useApi(orchestratorApiRef);
  const executeWorkflowLink = useRouteRef(executeWorkflowRouteRef);
  const { instanceId: queryInstanceId } = useRouteRefParams(
    workflowInstanceRouteRef
  );
  const [isAbortConfirmationDialogOpen, setIsAbortConfirmationDialogOpen] = useState(false);
  const [isAbortAlertDialogOpen, setIsAbortAlertDialogOpen] = useState(false);
  const [abortWorkflowInstanceErrorMsg, setAbortWorkflowInstanceErrorMsg] = useState("");
  const permittedToExecute = usePermission({
    permission: orchestratorWorkflowExecutePermission
  });
  const permittedToAbort = usePermission({
    permission: orchestratorWorkflowInstanceAbortPermission
  });
  const fetchInstance = React.useCallback(async () => {
    if (!instanceId && !queryInstanceId) {
      return void 0;
    }
    const res = await orchestratorApi.getInstance(
      instanceId ?? queryInstanceId,
      true
    );
    return res.data;
  }, [instanceId, orchestratorApi, queryInstanceId]);
  const { loading, error, value, restart } = usePolling(
    fetchInstance,
    SHORT_REFRESH_INTERVAL,
    (curValue) => !!curValue && (curValue.instance.status === "Active" || curValue.instance.status === "Pending" || !curValue.instance.status)
  );
  const canAbort = value?.instance.status === ProcessInstanceStatusDTO.Active || value?.instance.status === ProcessInstanceStatusDTO.Error;
  const canRerun = value?.instance.status === ProcessInstanceStatusDTO.Completed || value?.instance.status === ProcessInstanceStatusDTO.Aborted || value?.instance.status === ProcessInstanceStatusDTO.Error;
  const toggleAbortConfirmationDialog = () => {
    setIsAbortConfirmationDialogOpen(!isAbortConfirmationDialogOpen);
  };
  const toggleAbortAlertDialog = () => {
    setIsAbortAlertDialogOpen(!isAbortAlertDialogOpen);
  };
  const handleAbort = React.useCallback(async () => {
    if (value) {
      try {
        await orchestratorApi.abortWorkflowInstance(value.instance.id);
        restart();
      } catch (e) {
        setAbortWorkflowInstanceErrorMsg(`${e.message}`);
        setIsAbortAlertDialogOpen(true);
      }
      setIsAbortConfirmationDialogOpen(false);
    }
  }, [orchestratorApi, restart, value]);
  const handleRerun = React.useCallback(() => {
    if (!value) {
      return;
    }
    const routeUrl = executeWorkflowLink({
      workflowId: value.instance.processId
    });
    const urlToNavigate = buildUrl(routeUrl, {
      [QUERY_PARAM_INSTANCE_ID]: value.instance.id,
      [QUERY_PARAM_ASSESSMENT_INSTANCE_ID]: value.assessedBy?.id
    });
    navigate(urlToNavigate);
  }, [value, navigate, executeWorkflowLink]);
  return /* @__PURE__ */ React.createElement(
    BaseOrchestratorPage,
    {
      title: value?.instance.processId ?? value?.instance.id ?? instanceId,
      type: "Workflow runs",
      typeLink: "/orchestrator/instances"
    },
    loading ? /* @__PURE__ */ React.createElement(Progress, null) : null,
    error ? /* @__PURE__ */ React.createElement(ResponseErrorPanel, { error }) : null,
    !loading && isNonNullable(value) ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(ContentHeader, { title: "" }, /* @__PURE__ */ React.createElement(
      InfoDialog,
      {
        title: "Abort workflow",
        onClose: toggleAbortConfirmationDialog,
        open: isAbortConfirmationDialogOpen,
        dialogActions: /* @__PURE__ */ React.createElement(
          AbortConfirmationDialogActions,
          {
            handleCancel: toggleAbortConfirmationDialog,
            handleSubmit: handleAbort
          }
        ),
        children: /* @__PURE__ */ React.createElement(AbortConfirmationDialogContent, null)
      }
    ), /* @__PURE__ */ React.createElement(
      InfoDialog,
      {
        title: "Abort workflow failed",
        onClose: toggleAbortAlertDialog,
        open: isAbortAlertDialogOpen,
        dialogActions: /* @__PURE__ */ React.createElement(AbortAlertDialogActions, { handleClose: toggleAbortAlertDialog }),
        children: /* @__PURE__ */ React.createElement(
          AbortAlertDialogContent,
          {
            message: abortWorkflowInstanceErrorMsg
          }
        )
      }
    ), /* @__PURE__ */ React.createElement(Grid, { container: true, item: true, justifyContent: "flex-end", spacing: 1 }, /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: "user not authorized to abort workflow",
        disableHoverListener: permittedToAbort.allowed
      },
      /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "contained",
          disabled: !permittedToAbort.allowed || !canAbort,
          onClick: toggleAbortConfirmationDialog,
          className: classes.abortButton
        },
        "Abort"
      )
    )), /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(
      Tooltip,
      {
        title: "user not authorized to execute workflow",
        disableHoverListener: permittedToExecute.allowed
      },
      /* @__PURE__ */ React.createElement(
        Button,
        {
          variant: "contained",
          color: "primary",
          disabled: !permittedToExecute.allowed || !canRerun,
          onClick: handleRerun
        },
        "Rerun"
      )
    )))), /* @__PURE__ */ React.createElement(WorkflowInstancePageContent, { assessedInstance: value })) : null
  );
};
WorkflowInstancePage.displayName = "WorkflowInstancePage";

export { WorkflowInstancePage };
//# sourceMappingURL=WorkflowInstancePage.esm.js.map
