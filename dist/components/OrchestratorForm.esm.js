import React, { Fragment } from 'react';
import generateUiSchema from '../utils/generateUiSchema.esm.js';
import { StepperContextProvider } from '../utils/StepperContext.esm.js';
import OrchestratorFormStepper, { OrchestratorFormToolbar } from './OrchestratorFormStepper.esm.js';
import OrchestratorFormWrapper from './OrchestratorFormWrapper.esm.js';
import ReviewStep from './ReviewStep.esm.js';

const getNumSteps = (schema) => {
  if (schema.type !== "object" || !schema.properties) return void 0;
  const isMultiStep = Object.values(schema.properties).every(
    (prop) => prop.type === "object"
  );
  return isMultiStep ? Object.keys(schema.properties).length : void 0;
};
const SingleStepForm = ({
  schema,
  initialFormData,
  onSubmit,
  uiSchema
}) => {
  const [_initialFormData, setInitialFormData] = React.useState(initialFormData);
  const _onSubmit = React.useCallback(
    (formData) => {
      setInitialFormData(formData);
      onSubmit(formData);
    },
    [onSubmit, setInitialFormData]
  );
  const steps = React.useMemo(() => {
    return [
      {
        title: schema.title || "Inputs",
        key: "schema",
        content: /* @__PURE__ */ React.createElement(
          OrchestratorFormWrapper,
          {
            schema: { ...schema, title: "" },
            initialFormData: _initialFormData,
            onSubmit: _onSubmit,
            uiSchema
          },
          /* @__PURE__ */ React.createElement(OrchestratorFormToolbar, null)
        )
      }
    ];
  }, [schema, _initialFormData, uiSchema, _onSubmit]);
  return /* @__PURE__ */ React.createElement(OrchestratorFormStepper, { steps });
};
const OrchestratorForm = ({
  schema,
  handleExecute,
  isExecuting,
  data,
  isDataReadonly
}) => {
  const [formData, setFormData] = React.useState(data || {});
  const numStepsInMultiStepSchema = React.useMemo(
    () => getNumSteps(schema),
    [schema]
  );
  const isMultiStep = numStepsInMultiStepSchema !== void 0;
  const _handleExecute = React.useCallback(() => {
    handleExecute(formData || {});
  }, [formData, handleExecute]);
  const onSubmit = React.useCallback(
    (_formData) => {
      setFormData(_formData);
    },
    [setFormData]
  );
  const uiSchema = React.useMemo(() => {
    return generateUiSchema(
      schema,
      isMultiStep,
      isDataReadonly ? data : void 0
    );
  }, [schema, isMultiStep, isDataReadonly, data]);
  const reviewStep = React.useMemo(
    () => /* @__PURE__ */ React.createElement(
      ReviewStep,
      {
        data: formData || {},
        schema,
        busy: isExecuting,
        handleExecute: _handleExecute
      }
    ),
    [formData, schema, isExecuting, _handleExecute]
  );
  return /* @__PURE__ */ React.createElement(StepperContextProvider, { reviewStep }, isMultiStep ? /* @__PURE__ */ React.createElement(
    OrchestratorFormWrapper,
    {
      schema,
      numStepsInMultiStepSchema,
      onSubmit,
      uiSchema,
      initialFormData: data
    },
    /* @__PURE__ */ React.createElement(Fragment, null)
  ) : /* @__PURE__ */ React.createElement(
    SingleStepForm,
    {
      schema,
      onSubmit,
      initialFormData: data,
      uiSchema
    }
  ));
};

export { OrchestratorForm as default };
//# sourceMappingURL=OrchestratorForm.esm.js.map
