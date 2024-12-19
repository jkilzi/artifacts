import React from 'react';
import { useTheme, Grid, Box } from '@material-ui/core';
import { Alert, AlertTitle } from '@material-ui/lab';
import { Editor } from '@monaco-editor/react';
import { SubmitButton } from '@red-hat-developer-hub/backstage-plugin-orchestrator-form-react';

const DEFAULT_VALUE = JSON.stringify({ myKey: "myValue" }, null, 4);
const JsonTextAreaForm = ({
  isExecuting,
  handleExecute
}) => {
  const [jsonText, setJsonText] = React.useState(DEFAULT_VALUE);
  const theme = useTheme();
  const getParameters = () => {
    if (!jsonText) {
      return {};
    }
    const parameters = JSON.parse(jsonText);
    return parameters;
  };
  return /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 2 }, /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12 }, /* @__PURE__ */ React.createElement(Alert, { severity: "info", style: { width: "100%" } }, /* @__PURE__ */ React.createElement(AlertTitle, null, "Missing JSON Schema for Input Form."), "Type the input data in JSON format below.", /* @__PURE__ */ React.createElement("br", null), "If you prefer using a form to start the workflow, ensure a valid JSON schema is provided in the 'dataInputSchema' property of your workflow definition file.")), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12 }, /* @__PURE__ */ React.createElement(Box, { style: { border: `1px solid ${theme.palette.border}` } }, /* @__PURE__ */ React.createElement(
    Editor,
    {
      value: jsonText,
      language: "json",
      onChange: (value) => setJsonText(value ?? ""),
      height: "30rem",
      theme: theme.palette.type === "dark" ? "vs-dark" : "light",
      options: {
        minimap: { enabled: false }
      }
    }
  ))), /* @__PURE__ */ React.createElement(Grid, { item: true, xs: 12 }, /* @__PURE__ */ React.createElement(
    SubmitButton,
    {
      submitting: isExecuting,
      handleClick: () => handleExecute(getParameters())
    },
    "Run"
  )));
};

export { JsonTextAreaForm as default };
//# sourceMappingURL=JsonTextAreaForm.esm.js.map
