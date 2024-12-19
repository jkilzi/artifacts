import React from 'react';
import { InfoCard } from '@backstage/core-components';
import { AboutField } from '@backstage/plugin-catalog';
import { makeStyles, Grid } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { VALUE_UNAVAILABLE } from '../../constants.esm.js';
import WorkflowOverviewFormatter from '../../dataFormatters/WorkflowOverviewFormatter.esm.js';
import { WorkflowInstanceStatusIndicator } from '../WorkflowInstanceStatusIndicator.esm.js';

const useStyles = makeStyles({
  details: {
    overflowY: "auto",
    height: "15rem"
  }
});
const WorkflowDefinitionDetailsCard = ({
  loading,
  workflowOverview
}) => {
  const classes = useStyles();
  const formattedWorkflowOverview = React.useMemo(
    () => workflowOverview ? WorkflowOverviewFormatter.format(workflowOverview) : void 0,
    [workflowOverview]
  );
  const details = React.useMemo(
    () => [
      {
        label: "type",
        value: formattedWorkflowOverview?.category
      },
      {
        label: "last run",
        value: formattedWorkflowOverview?.lastTriggered
      },
      {
        label: "last run status",
        value: formattedWorkflowOverview?.lastRunStatus,
        children: formattedWorkflowOverview?.lastRunStatus !== VALUE_UNAVAILABLE ? /* @__PURE__ */ React.createElement(
          WorkflowInstanceStatusIndicator,
          {
            status: formattedWorkflowOverview?.lastRunStatus,
            lastRunId: formattedWorkflowOverview?.lastRunId
          }
        ) : VALUE_UNAVAILABLE
      }
    ],
    [formattedWorkflowOverview]
  );
  return /* @__PURE__ */ React.createElement(InfoCard, { title: "Details", className: classes.details }, /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 3, alignContent: "flex-start" }, /* @__PURE__ */ React.createElement(Grid, { container: true, item: true, md: 4, spacing: 3, alignContent: "flex-start" }, details?.map(({ label, value, children }) => /* @__PURE__ */ React.createElement(Grid, { item: true, md: 6, key: label }, /* @__PURE__ */ React.createElement(AboutField, { label, value }, loading ? /* @__PURE__ */ React.createElement(Skeleton, { variant: "text" }) : children || value)))), /* @__PURE__ */ React.createElement(Grid, { item: true, md: 8 }, /* @__PURE__ */ React.createElement(
    AboutField,
    {
      label: "description",
      value: formattedWorkflowOverview?.description
    },
    loading ? /* @__PURE__ */ React.createElement(Skeleton, { variant: "text" }) : formattedWorkflowOverview?.description
  ))));
};

export { WorkflowDefinitionDetailsCard as default };
//# sourceMappingURL=WorkflowDefinitionDetailsCard.esm.js.map
