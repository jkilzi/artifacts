import React from 'react';
import { Content, InfoCard } from '@backstage/core-components';
import { makeStyles, Grid } from '@material-ui/core';
import moment from 'moment';
import { VALUE_UNAVAILABLE } from '../constants.esm.js';
import { WorkflowEditor, EditorViewKind } from './WorkflowEditor/WorkflowEditor.esm.js';
import { WorkflowProgress } from './WorkflowProgress.esm.js';
import { WorkflowResult } from './WorkflowResult.esm.js';
import { WorkflowRunDetails } from './WorkflowRunDetails.esm.js';
import { WorkflowVariablesViewer } from './WorkflowVariablesViewer.esm.js';

const mapProcessInstanceToDetails = (instance) => {
  const name = instance.processName || instance.processId;
  const start = instance.start ? moment(instance.start) : void 0;
  let duration = VALUE_UNAVAILABLE;
  if (start && instance.end) {
    const end = moment(instance.end);
    duration = moment.duration(start.diff(end)).humanize();
  }
  const started = start?.toDate().toLocaleString() ?? VALUE_UNAVAILABLE;
  return {
    id: instance.id,
    name,
    workflowId: instance.processId,
    started,
    duration,
    category: instance.category,
    status: instance.status,
    description: instance.description,
    businessKey: instance.businessKey
  };
};
const useStyles = makeStyles((_) => ({
  topRowCard: {
    height: "20rem"
  },
  middleRowCard: {
    height: "20rem",
    overflow: "auto",
    wordBreak: "break-word"
  },
  bottomRowCard: {
    minHeight: "40rem",
    height: "100%"
  },
  autoOverflow: { overflow: "auto" },
  recommendedLabelContainer: {
    display: "flex",
    alignItems: "center",
    whiteSpace: "nowrap"
  },
  recommendedLabel: { margin: "0 0.25rem" }
}));
const WorkflowInstancePageContent = ({ assessedInstance }) => {
  const styles = useStyles();
  const details = React.useMemo(
    () => mapProcessInstanceToDetails(assessedInstance.instance),
    [assessedInstance.instance]
  );
  const workflowdata = assessedInstance.instance?.workflowdata;
  let instanceVariables;
  if (workflowdata) {
    instanceVariables = {
      /* Since we are about to remove just the top-level property, shallow copy of the object is sufficient */
      ...workflowdata
    };
    if (instanceVariables.hasOwnProperty("result")) {
      delete instanceVariables.result;
    }
  }
  return /* @__PURE__ */ React.createElement(Content, { noPadding: true }, /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 2 }, /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12 }, /* @__PURE__ */ React.createElement(
    InfoCard,
    {
      title: "Details",
      divider: false,
      className: styles.topRowCard
    },
    /* @__PURE__ */ React.createElement(
      WorkflowRunDetails,
      {
        details,
        assessedBy: assessedInstance.assessedBy
      }
    )
  )), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 6 }, /* @__PURE__ */ React.createElement(
    InfoCard,
    {
      title: "Variables",
      divider: false,
      className: styles.middleRowCard,
      cardClassName: styles.autoOverflow
    },
    instanceVariables && /* @__PURE__ */ React.createElement(WorkflowVariablesViewer, { variables: instanceVariables }),
    !instanceVariables && /* @__PURE__ */ React.createElement("div", null, "The workflow instance has no variables")
  )), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 6 }, /* @__PURE__ */ React.createElement(
    WorkflowResult,
    {
      assessedInstance,
      className: styles.middleRowCard
    }
  )), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 6 }, /* @__PURE__ */ React.createElement(
    InfoCard,
    {
      title: "Workflow definition",
      divider: false,
      className: styles.bottomRowCard
    },
    /* @__PURE__ */ React.createElement(
      WorkflowEditor,
      {
        workflowId: assessedInstance.instance.processId,
        kind: EditorViewKind.DIAGRAM_VIEWER,
        editorMode: "text"
      }
    )
  )), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 6 }, /* @__PURE__ */ React.createElement(
    InfoCard,
    {
      title: "Workflow progress",
      divider: false,
      className: styles.bottomRowCard,
      cardClassName: styles.autoOverflow
    },
    /* @__PURE__ */ React.createElement(
      WorkflowProgress,
      {
        workflowError: assessedInstance.instance.error,
        workflowNodes: assessedInstance.instance.nodes,
        workflowStatus: assessedInstance.instance.status
      }
    )
  ))));
};
WorkflowInstancePageContent.displayName = "WorkflowInstancePageContent";

export { WorkflowInstancePageContent, mapProcessInstanceToDetails };
//# sourceMappingURL=WorkflowInstancePageContent.esm.js.map
