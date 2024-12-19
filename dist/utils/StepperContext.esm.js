import React from 'react';

const context = React.createContext(null);
const useStepperContext = () => {
  const multiStepFormContext = React.useContext(context);
  if (!multiStepFormContext) {
    throw new Error("Context StepperContext is not defined");
  }
  return multiStepFormContext;
};
const StepperContextProvider = ({
  children,
  reviewStep
}) => {
  const [activeStep, setActiveStep] = React.useState(0);
  const [isValidating, setIsValidating] = React.useState(false);
  const contextData = React.useMemo(() => {
    return {
      activeStep,
      handleNext: () => {
        setActiveStep((curActiveStep) => curActiveStep + 1);
      },
      handleBack: () => setActiveStep((curActiveStep) => curActiveStep - 1),
      reviewStep,
      isValidating,
      handleValidateStarted: () => setIsValidating(true),
      handleValidateEnded: () => setIsValidating(false)
    };
  }, [setActiveStep, activeStep, reviewStep, isValidating, setIsValidating]);
  return /* @__PURE__ */ React.createElement(context.Provider, { value: contextData }, children);
};

export { StepperContextProvider, useStepperContext };
//# sourceMappingURL=StepperContext.esm.js.map
