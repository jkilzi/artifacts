import React from 'react';
import { ErrorPanel } from '@backstage/core-components';
import { useApiHolder } from '@backstage/core-plugin-api';
import { Grid } from '@material-ui/core';
import { withTheme } from '@rjsf/core';
import { Theme } from '@rjsf/material-ui';
import omit from 'lodash/omit';
import { orchestratorFormApiRef } from '@red-hat-developer-hub/backstage-plugin-orchestrator-form-api';
import { defaultFormExtensionsApi } from '../DefaultFormApi.esm.js';
import { useStepperContext } from '../utils/StepperContext.esm.js';
import useValidator from '../utils/useValidator.esm.js';
import StepperObjectField from './StepperObjectField.esm.js';

const MuiForm = withTheme(Theme);
const WrapperFormPropsContext = React.createContext(null);
const useWrapperFormPropsContext = () => {
  const context = React.useContext(WrapperFormPropsContext);
  if (context === null) {
    throw new Error("OrchestratorFormWrapperProps not provided");
  }
  return context;
};
const FormComponent = (decoratorProps) => {
  const props = useWrapperFormPropsContext();
  const {
    numStepsInMultiStepSchema,
    uiSchema,
    schema,
    onSubmit: _onSubmit,
    initialFormData,
    children
  } = props;
  const [extraErrors, setExtraErrors] = React.useState();
  const [formData, setFormData] = React.useState(
    initialFormData || {}
  );
  const isMultiStep = numStepsInMultiStepSchema !== void 0;
  const { handleNext, activeStep, handleValidateStarted, handleValidateEnded } = useStepperContext();
  const [validationError, setValidationError] = React.useState();
  const validator = useValidator(isMultiStep);
  const getActiveKey = () => {
    if (!isMultiStep) {
      return void 0;
    }
    return Object.keys(schema.properties || {})[activeStep];
  };
  const onSubmit = async (_formData) => {
    setExtraErrors(void 0);
    let _extraErrors = void 0;
    let _validationError = void 0;
    if (decoratorProps.getExtraErrors) {
      try {
        handleValidateStarted();
        _extraErrors = await decoratorProps.getExtraErrors(formData);
        const activeKey = getActiveKey();
        setExtraErrors(
          activeKey && _extraErrors?.[activeKey] ? _extraErrors[activeKey] : _extraErrors
        );
      } catch (err) {
        _validationError = err;
      } finally {
        handleValidateEnded();
      }
    }
    setValidationError(_validationError);
    if ((!_extraErrors || Object.keys(_extraErrors).length === 0) && !_validationError && activeStep < (numStepsInMultiStepSchema || 1)) {
      _onSubmit(_formData);
      handleNext();
    }
  };
  return /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 2, direction: "column", wrap: "nowrap" }, validationError && /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(ErrorPanel, { error: validationError })), /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(
    MuiForm,
    {
      ...omit(decoratorProps, "getExtraErrors"),
      fields: isMultiStep ? { ObjectField: StepperObjectField } : {},
      uiSchema,
      validator,
      schema,
      formData: decoratorProps.formData || formData,
      noHtml5Validate: true,
      extraErrors,
      onSubmit: (e) => onSubmit(e.formData || {}),
      onChange: (e) => {
        setFormData(e.formData || {});
        if (decoratorProps.onChange) {
          decoratorProps.onChange(e);
        }
      }
    },
    children
  )));
};
const OrchestratorFormWrapper = ({
  schema,
  uiSchema,
  initialFormData,
  ...props
}) => {
  const formApi = useApiHolder().get(orchestratorFormApiRef) || defaultFormExtensionsApi;
  const NewComponent = React.useMemo(() => {
    const formDecorator = formApi.getFormDecorator(
      schema,
      uiSchema,
      initialFormData
    );
    return formDecorator(FormComponent);
  }, [schema, uiSchema, formApi, initialFormData]);
  return /* @__PURE__ */ React.createElement(
    WrapperFormPropsContext.Provider,
    {
      value: { schema, uiSchema, initialFormData, ...props }
    },
    /* @__PURE__ */ React.createElement(NewComponent, null)
  );
};

export { OrchestratorFormWrapper as default };
//# sourceMappingURL=OrchestratorFormWrapper.esm.js.map
