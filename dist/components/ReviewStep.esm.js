import React from 'react';
import { Content, StructuredMetadataTable } from '@backstage/core-components';
import { makeStyles, Paper, Box, Button } from '@material-ui/core';
import generateReviewTableData from '../utils/generateReviewTableData.esm.js';
import { useStepperContext } from '../utils/StepperContext.esm.js';
import SubmitButton from './SubmitButton.esm.js';

const useStyles = makeStyles((theme) => ({
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "right",
    marginTop: theme.spacing(2)
  },
  paper: {
    // Workaround since the StructuredMetadataTable is neither responsive as it simply uses <table> nor can be customized via props or styles.
    "& > table > tbody > tr": {
      "& > td:nth-child(1)": {
        minWidth: "10rem",
        width: "25%"
      },
      "& > td:nth-child(2)": {
        display: "flex",
        flexDirection: "row",
        justifyContent: "left"
      }
    }
  }
}));
const ReviewStep = ({
  busy,
  schema,
  data,
  handleExecute
}) => {
  const styles = useStyles();
  const { handleBack } = useStepperContext();
  const displayData = React.useMemo(() => {
    return generateReviewTableData(schema, data);
  }, [schema, data]);
  return /* @__PURE__ */ React.createElement(Content, { noPadding: true }, /* @__PURE__ */ React.createElement(Paper, { square: true, elevation: 0, className: styles.paper }, /* @__PURE__ */ React.createElement(StructuredMetadataTable, { dense: true, metadata: displayData }), /* @__PURE__ */ React.createElement(Box, { mb: 4 }), /* @__PURE__ */ React.createElement("div", { className: styles.footer }, /* @__PURE__ */ React.createElement(Button, { onClick: handleBack, disabled: busy }, "Back"), /* @__PURE__ */ React.createElement(
    SubmitButton,
    {
      handleClick: handleExecute,
      submitting: busy,
      focusOnMount: true
    },
    "Run"
  ))));
};

export { ReviewStep as default };
//# sourceMappingURL=ReviewStep.esm.js.map
