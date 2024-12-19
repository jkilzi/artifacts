import React, { forwardRef } from 'react';
import { makeStyles, Dialog, DialogTitle, Box, Typography, IconButton, DialogContent, DialogActions } from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';

const useStyles = makeStyles((_theme) => ({
  closeBtn: {
    position: "absolute",
    right: 8,
    top: 8
  }
}));
const RefForwardingInfoDialog = (props, forwardedRef) => {
  const { title, open = false, onClose, children, dialogActions } = props;
  const classes = useStyles();
  return /* @__PURE__ */ React.createElement(Dialog, { onClose: (_) => onClose, open, ref: forwardedRef }, /* @__PURE__ */ React.createElement(DialogTitle, null, /* @__PURE__ */ React.createElement(Box, null, /* @__PURE__ */ React.createElement(Typography, { variant: "h5" }, title), /* @__PURE__ */ React.createElement(
    IconButton,
    {
      className: classes.closeBtn,
      "aria-label": "close",
      onClick: onClose
    },
    /* @__PURE__ */ React.createElement(CloseIcon, null)
  ))), /* @__PURE__ */ React.createElement(DialogContent, null, /* @__PURE__ */ React.createElement(Box, null, children)), /* @__PURE__ */ React.createElement(DialogActions, null, dialogActions));
};
const InfoDialog = forwardRef(RefForwardingInfoDialog);

export { InfoDialog, RefForwardingInfoDialog };
//# sourceMappingURL=InfoDialog.esm.js.map
