import React from 'react';
import { InfoCard, Link } from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { AboutField } from '@backstage/plugin-catalog';
import { makeStyles, Grid, Typography, List, ListItem, CircularProgress } from '@material-ui/core';
import DotIcon from '@material-ui/icons/FiberManualRecord';
import { ProcessInstanceStatusDTO, WorkflowResultDTOCompletedWithEnum, QUERY_PARAM_ASSESSMENT_INSTANCE_ID } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import 'axios';
import { orchestratorApiRef } from '../api/api.esm.js';
import { VALUE_UNAVAILABLE } from '../constants.esm.js';
import { executeWorkflowRouteRef } from '../routes.esm.js';
import { buildUrl } from '../utils/UrlUtils.esm.js';
import { WorkflowDescriptionModal } from './WorkflowDescriptionModal.esm.js';

const useStyles = makeStyles((theme) => ({
  outputGrid: {
    "& h2": {
      textTransform: "none",
      fontSize: "small"
    }
  },
  links: {
    padding: "0px"
  },
  errorIcon: {
    color: theme.palette.error.main
  }
}));
const finalStates = [
  ProcessInstanceStatusDTO.Error,
  ProcessInstanceStatusDTO.Completed,
  ProcessInstanceStatusDTO.Aborted,
  ProcessInstanceStatusDTO.Suspended
];
const ResultMessage = ({
  status,
  error,
  resultMessage,
  completedWith
}) => {
  const styles = useStyles();
  const errorMessage = error?.message || error?.toString();
  let noResult = /* @__PURE__ */ React.createElement(React.Fragment, null);
  if (!resultMessage && !errorMessage) {
    if (status && finalStates.includes(status)) {
      noResult = /* @__PURE__ */ React.createElement("i", null, "The workflow provided no additional info about the status.");
    } else {
      noResult = /* @__PURE__ */ React.createElement(Typography, null, /* @__PURE__ */ React.createElement(CircularProgress, { size: "0.75rem" }), "\xA0The workflow has not yet provided additional info about the status.");
    }
  }
  return /* @__PURE__ */ React.createElement(React.Fragment, null, resultMessage && /* @__PURE__ */ React.createElement(Typography, null, completedWith === WorkflowResultDTOCompletedWithEnum.Error && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    DotIcon,
    {
      style: { fontSize: "0.75rem" },
      className: styles.errorIcon
    }
  ), "\xA0"), resultMessage), errorMessage && /* @__PURE__ */ React.createElement("b", null, errorMessage), noResult);
};
const NextWorkflows = ({
  instanceId,
  nextWorkflows
}) => {
  const styles = useStyles();
  const orchestratorApi = useApi(orchestratorApiRef);
  const executeWorkflowLink = useRouteRef(
    executeWorkflowRouteRef
  );
  const [
    currentOpenedWorkflowDescriptionModalID,
    setCurrentOpenedWorkflowDescriptionModalID
  ] = React.useState("");
  const [currentWorkflow, setCurrentWorkflow] = React.useState(
    {}
  );
  const [workflowError, setWorkflowError] = React.useState();
  const runWorkflowLink = React.useMemo(
    () => buildUrl(
      executeWorkflowLink({
        workflowId: currentOpenedWorkflowDescriptionModalID
      }),
      {
        [QUERY_PARAM_ASSESSMENT_INSTANCE_ID]: instanceId
      }
    ),
    [currentOpenedWorkflowDescriptionModalID, executeWorkflowLink, instanceId]
  );
  const openWorkflowDescriptionModal = React.useCallback(
    (itemId) => {
      if (itemId) {
        orchestratorApi.getWorkflowOverview(itemId).then((workflow) => {
          setCurrentWorkflow(workflow.data);
        }).catch((error) => {
          setWorkflowError({ itemId, error });
        });
        setCurrentOpenedWorkflowDescriptionModalID(itemId);
      }
    },
    [orchestratorApi]
  );
  const closeWorkflowDescriptionModal = React.useCallback(() => {
    setCurrentOpenedWorkflowDescriptionModalID("");
    setCurrentWorkflow({});
  }, []);
  if (!nextWorkflows?.length) {
    return null;
  }
  const sectionLabel = nextWorkflows.length === 1 ? "Suggested next workflow" : "Suggested next workflows";
  return /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12, className: styles.outputGrid }, /* @__PURE__ */ React.createElement(AboutField, { label: sectionLabel }, /* @__PURE__ */ React.createElement(List, { dense: true, disablePadding: true }, nextWorkflows.map((item) => /* @__PURE__ */ React.createElement(ListItem, { key: item.id, disableGutters: true }, /* @__PURE__ */ React.createElement(
    Link,
    {
      color: "primary",
      to: "#",
      onClick: () => {
        openWorkflowDescriptionModal(item.id);
      }
    },
    item.name
  ))))), /* @__PURE__ */ React.createElement(
    WorkflowDescriptionModal,
    {
      workflow: currentWorkflow,
      workflowError,
      runWorkflowLink,
      open: !!currentOpenedWorkflowDescriptionModalID,
      onClose: closeWorkflowDescriptionModal
    }
  ));
};
const WorkflowOutputs = ({
  outputs
}) => {
  const styles = useStyles();
  if (!outputs?.length) {
    return null;
  }
  const links = outputs?.filter((item) => item.format === "link");
  const nonLinks = outputs?.filter((item) => item.format !== "link");
  return /* @__PURE__ */ React.createElement(React.Fragment, null, nonLinks.map((item) => {
    let value = item.value || VALUE_UNAVAILABLE;
    if (typeof value !== "string") {
      if (typeof value === "object") {
        value = `Object: ${JSON.stringify(value)}`;
      } else {
        value = "Unexpected type";
      }
    }
    return /* @__PURE__ */ React.createElement(Grid, { item: true, md: 6, key: item.key, className: styles.outputGrid }, /* @__PURE__ */ React.createElement(AboutField, { label: item.key, value }));
  }), links?.length > 0 && /* @__PURE__ */ React.createElement(Grid, { item: true, md: 12, key: "__links", className: styles.links }, /* @__PURE__ */ React.createElement(AboutField, { label: "Links" }, /* @__PURE__ */ React.createElement(List, { dense: true, disablePadding: true }, links.filter(
    (item) => item.value && item.key && typeof item.value === "string"
  ).map((item) => {
    return /* @__PURE__ */ React.createElement(ListItem, { disableGutters: true, key: item.key }, /* @__PURE__ */ React.createElement(Link, { to: item.value }, item.key));
  })))));
};
const WorkflowResult = ({ assessedInstance, className }) => {
  const instance = assessedInstance.instance;
  const result = instance.workflowdata?.result;
  return /* @__PURE__ */ React.createElement(
    InfoCard,
    {
      title: "Results",
      subheader: /* @__PURE__ */ React.createElement(
        ResultMessage,
        {
          status: instance.status,
          error: instance.error,
          resultMessage: result?.message,
          completedWith: result?.completedWith
        }
      ),
      divider: false,
      className
    },
    /* @__PURE__ */ React.createElement(Grid, { container: true, alignContent: "flex-start" }, /* @__PURE__ */ React.createElement(
      NextWorkflows,
      {
        instanceId: instance.id,
        nextWorkflows: result?.nextWorkflows
      }
    ), /* @__PURE__ */ React.createElement(WorkflowOutputs, { outputs: result?.outputs }))
  );
};
WorkflowResult.displayName = "WorkflowResult";

export { WorkflowResult };
//# sourceMappingURL=WorkflowResult.esm.js.map
