import React from 'react';
import Moment from 'react-moment';
import { Typography, Tooltip } from '@material-ui/core';
import CancelIcon from '@material-ui/icons/Cancel';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import HourglassTopIcon from '@mui/icons-material/HourglassTop';
import PauseCircleIcon from '@mui/icons-material/PauseCircle';
import { VALUE_UNAVAILABLE } from '../constants.esm.js';
import { useWorkflowInstanceStateColors } from '../hooks/useWorkflowInstanceStatusColors.esm.js';
import { Paragraph } from './Paragraph.esm.js';

const WorkflowProgressNodeIcon = ({ status, error }) => {
  const color = useWorkflowInstanceStateColors(status);
  switch (status) {
    case "Error": {
      return /* @__PURE__ */ React.createElement(
        Tooltip,
        {
          title: error?.message ?? "Additional details about this error are not available"
        },
        /* @__PURE__ */ React.createElement(ErrorIcon, { className: color })
      );
    }
    case "Completed": {
      return /* @__PURE__ */ React.createElement(Tooltip, { title: "Completed" }, /* @__PURE__ */ React.createElement(CheckCircleIcon, { className: color }));
    }
    case "Active": {
      return /* @__PURE__ */ React.createElement(Tooltip, { title: "Active" }, /* @__PURE__ */ React.createElement(HourglassTopIcon, { className: color }));
    }
    case "Aborted": {
      return /* @__PURE__ */ React.createElement(Tooltip, { title: "Aborted" }, /* @__PURE__ */ React.createElement(CancelIcon, { className: color }));
    }
    case "Suspended": {
      return /* @__PURE__ */ React.createElement(Tooltip, { title: "Suspended" }, /* @__PURE__ */ React.createElement(PauseCircleIcon, { className: color }));
    }
    case "Pending": {
      return /* @__PURE__ */ React.createElement(Tooltip, { title: "Pending" }, /* @__PURE__ */ React.createElement(HourglassTopIcon, { className: color }));
    }
    default:
      return null;
  }
};
WorkflowProgressNodeIcon.displayName = "WorkflowProgressNodeIcon";
const WorkflowProgressNode = ({ model }) => /* @__PURE__ */ React.createElement(Paragraph, null, /* @__PURE__ */ React.createElement(
  Typography,
  {
    style: {
      display: "flex",
      alignItems: "center"
    }
  },
  /* @__PURE__ */ React.createElement(WorkflowProgressNodeIcon, { status: model.status, error: model.error }),
  /* @__PURE__ */ React.createElement(Typography, { style: { paddingLeft: "8px" } }, model.name)
), /* @__PURE__ */ React.createElement("small", { style: { paddingLeft: "32px", color: "grey" } }, !model.exit ? VALUE_UNAVAILABLE : /* @__PURE__ */ React.createElement(Moment, { fromNow: true }, /* @__PURE__ */ new Date(`${model.exit}`))));
WorkflowProgressNode.displayName = "WorkflowProgressNode";

export { WorkflowProgressNode };
//# sourceMappingURL=WorkflowProgressNode.esm.js.map
