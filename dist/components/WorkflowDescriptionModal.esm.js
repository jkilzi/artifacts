import React, { forwardRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { makeStyles, Box, Typography, Dialog, DialogTitle, IconButton, DialogContent, DialogActions, Button } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((_theme) => ({
  closeBtn: {
    position: "absolute",
    right: 8,
    top: 8
  }
}));
const RefForwardingWorkflowDescriptionModal = (props, forwardedRef) => {
  const {
    workflow,
    open = false,
    onClose,
    runWorkflowLink,
    workflowError
  } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const handleRunWorkflow = () => {
    if (runWorkflowLink) {
      navigate(runWorkflowLink);
    }
  };
  let content;
  if (workflowError) {
    content = /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { paragraph: true }, "Failed to load details for the workflow ID:", workflowError.itemId), workflowError.error.message && /* @__PURE__ */ React.createElement(Typography, { paragraph: true }, workflowError.error.message));
  } else if (workflow.description) {
    content = /* @__PURE__ */ React.createElement(Box, null, workflow.description);
  } else {
    content = /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { paragraph: true }, "Are you sure you want to run this workflow?"));
  }
  return /* @__PURE__ */ React.createElement(
    Dialog,
    {
      onClose: (_) => onClose,
      open,
      ref: forwardedRef,
      maxWidth: "sm",
      fullWidth: true
    },
    /* @__PURE__ */ React.createElement(DialogTitle, null, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h5" }, workflow.name), /* @__PURE__ */ React.createElement(
      IconButton,
      {
        className: classes.closeBtn,
        "aria-label": "close",
        onClick: onClose
      },
      /* @__PURE__ */ React.createElement(CloseIcon, null)
    ))),
    /* @__PURE__ */ React.createElement(DialogContent, null, content),
    /* @__PURE__ */ React.createElement(DialogActions, null, /* @__PURE__ */ React.createElement(
      Button,
      {
        onClick: handleRunWorkflow,
        color: "primary",
        variant: "contained",
        disabled: !!workflowError
      },
      "Run workflow"
    ), /* @__PURE__ */ React.createElement(Button, { onClick: onClose, color: "primary", variant: "outlined" }, "Close"))
  );
};
const WorkflowDescriptionModal = forwardRef(
  RefForwardingWorkflowDescriptionModal
);

export { RefForwardingWorkflowDescriptionModal, WorkflowDescriptionModal };
//# sourceMappingURL=WorkflowDescriptionModal.esm.js.map
