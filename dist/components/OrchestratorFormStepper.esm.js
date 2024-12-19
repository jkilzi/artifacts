import React from 'react';
import { makeStyles, Stepper, Step, StepLabel, Typography, Button } from '@material-ui/core';
import { useStepperContext } from '../utils/StepperContext.esm.js';
import SubmitButton from './SubmitButton.esm.js';

const useStyles = makeStyles((theme) => ({
  // Hotfix: this should be fixed in the theme
  step: {
    "& form": {
      "& .field-array > div > div": {
        outline: "inherit !important",
        padding: "inherit !important",
        backgroundColor: "inherit !important",
        "& div > div > div > div": {
          // unfortunately there are no better CSS selectors
          backgroundColor: "inherit !important"
        }
      }
    }
  },
  regularButton: {
    // hotifx for https://issues.redhat.com/browse/FLPATH-1825
    backgroundColor: "inherit !important"
  },
  footer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "right",
    marginTop: theme.spacing(2)
  },
  formWrapper: {
    padding: theme.spacing(2)
  }
}));
const OrchestratorFormStepper = ({
  steps
}) => {
  const { activeStep, reviewStep } = useStepperContext();
  const stepsWithReview = [
    ...steps,
    { content: reviewStep, title: "Review", key: "review" }
  ];
  const styles = useStyles();
  return /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
    Stepper,
    {
      activeStep,
      variant: "elevation",
      style: { overflowX: "auto" },
      alternativeLabel: true
    },
    stepsWithReview?.map((step, index) => /* @__PURE__ */ React.createElement(Step, { key: step.key, className: styles.step }, /* @__PURE__ */ React.createElement(
      StepLabel,
      {
        "aria-label": `Step ${index + 1} ${step.title}`,
        "aria-disabled": "false",
        tabIndex: 0
      },
      /* @__PURE__ */ React.createElement(Typography, { variant: "h6", component: "h2" }, step.title)
    )))
  ), /* @__PURE__ */ React.createElement("div", { className: styles.formWrapper }, stepsWithReview[activeStep].content));
};
const OrchestratorFormToolbar = () => {
  const { activeStep, handleBack, isValidating } = useStepperContext();
  const styles = useStyles();
  return /* @__PURE__ */ React.createElement("div", { className: styles.footer }, /* @__PURE__ */ React.createElement(
    Button,
    {
      disabled: activeStep === 0,
      onClick: handleBack,
      className: styles.regularButton
    },
    "Back"
  ), /* @__PURE__ */ React.createElement(SubmitButton, { submitting: isValidating }, "Next"));
};

export { OrchestratorFormToolbar, OrchestratorFormStepper as default };
//# sourceMappingURL=OrchestratorFormStepper.esm.js.map
