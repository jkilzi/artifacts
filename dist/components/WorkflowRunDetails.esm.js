import React from 'react';
import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { AboutField } from '@backstage/plugin-catalog';
import { makeStyles, Grid, Typography } from '@material-ui/core';
import { capitalize } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import { VALUE_UNAVAILABLE } from '../constants.esm.js';
import { workflowInstanceRouteRef } from '../routes.esm.js';
import { WorkflowInstanceStatusIndicator } from './WorkflowInstanceStatusIndicator.esm.js';

const useStyles = makeStyles({
  root: {
    overflowY: "auto",
    height: "15rem"
  }
});
const WorkflowRunDetails = ({
  assessedBy,
  details
}) => {
  const styles = useStyles();
  const workflowInstanceLink = useRouteRef(workflowInstanceRouteRef);
  return /* @__PURE__ */ React.createElement(Grid, { container: true, className: styles.root, alignContent: "flex-start" }, /* @__PURE__ */ React.createElement(Grid, { item: true, md: 4, key: "Category" }, /* @__PURE__ */ React.createElement(AboutField, { label: "Category" }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", component: "div" }, /* @__PURE__ */ React.createElement("b", null, capitalize(details.category ?? VALUE_UNAVAILABLE))))), /* @__PURE__ */ React.createElement(Grid, { item: true, md: 4, key: "Status" }, /* @__PURE__ */ React.createElement(AboutField, { label: "Status" }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", component: "div" }, /* @__PURE__ */ React.createElement("b", null, /* @__PURE__ */ React.createElement(
    WorkflowInstanceStatusIndicator,
    {
      status: details.status
    }
  ))))), /* @__PURE__ */ React.createElement(Grid, { item: true, md: 4, key: "Duration" }, /* @__PURE__ */ React.createElement(AboutField, { label: "Duration" }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", component: "div" }, /* @__PURE__ */ React.createElement("b", null, details.duration)))), /* @__PURE__ */ React.createElement(Grid, { item: true, md: 8, key: "ID" }, /* @__PURE__ */ React.createElement(AboutField, { label: "ID" }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", component: "div" }, /* @__PURE__ */ React.createElement("b", null, details.id)))), /* @__PURE__ */ React.createElement(Grid, { item: true, md: 4, key: "Started" }, /* @__PURE__ */ React.createElement(AboutField, { label: "Started" }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", component: "div" }, /* @__PURE__ */ React.createElement("b", null, details.started)))), assessedBy ? /* @__PURE__ */ React.createElement(Grid, { item: true, md: 12, key: "Assessed by" }, /* @__PURE__ */ React.createElement(AboutField, { label: "Assessed by" }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", component: "div" }, /* @__PURE__ */ React.createElement("b", null, /* @__PURE__ */ React.createElement(
    Link,
    {
      to: workflowInstanceLink({
        instanceId: assessedBy.id
      })
    },
    assessedBy.processName
  ))))) : null, /* @__PURE__ */ React.createElement(Grid, { item: true, md: 12, key: "Description" }, /* @__PURE__ */ React.createElement(AboutField, { label: "Description" }, /* @__PURE__ */ React.createElement(Typography, { variant: "subtitle2", component: "div" }, /* @__PURE__ */ React.createElement("b", null, details.description ?? VALUE_UNAVAILABLE)))));
};
WorkflowRunDetails.displayName = "WorkflowDetails";

export { WorkflowRunDetails };
//# sourceMappingURL=WorkflowRunDetails.esm.js.map
