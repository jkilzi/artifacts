import React from 'react';
import ReactJson from 'react-json-view';
import { useTheme } from '@material-ui/core';
import { Paragraph } from './Paragraph.esm.js';

const WorkflowVariablesViewer = ({
  variables = {},
  emptyState = /* @__PURE__ */ React.createElement(Paragraph, null, "No data available")
}) => {
  const theme = useTheme();
  return !variables ? /* @__PURE__ */ React.createElement(React.Fragment, null, emptyState) : /* @__PURE__ */ React.createElement(
    ReactJson,
    {
      src: variables,
      name: false,
      theme: theme.palette.type === "dark" ? "monokai" : "rjv-default"
    }
  );
};
WorkflowVariablesViewer.displayName = "WorkflowVariablesViewer";

export { WorkflowVariablesViewer };
//# sourceMappingURL=WorkflowVariablesViewer.esm.js.map
