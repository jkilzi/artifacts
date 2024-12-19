import React from 'react';
import ObjectField from '@rjsf/core/lib/components/fields/ObjectField';
import OrchestratorFormStepper, { OrchestratorFormToolbar } from './OrchestratorFormStepper.esm.js';

const StepperObjectField = ({
  formData,
  schema,
  uiSchema,
  onChange,
  registry,
  idSchema,
  errorSchema,
  ...props
}) => {
  if (schema.properties === void 0) {
    throw new Error(
      "Stepper object field is not supported for schema that doesn't contain properties"
    );
  }
  const steps = Object.entries(schema.properties).reduce((prev, [key, subSchema]) => {
    if (typeof subSchema === "boolean") {
      return prev;
    }
    return [
      ...prev,
      {
        content: /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(
          ObjectField,
          {
            ...props,
            schema: { ...subSchema, title: "" },
            uiSchema: uiSchema?.[key] || {},
            formData: formData?.[key] || {},
            onChange: (data) => {
              onChange({ ...formData, [key]: data });
            },
            idSchema: idSchema[key],
            registry: {
              ...registry,
              fields: {
                ...registry.fields,
                ObjectField
                // undo override of objectfield
              }
            },
            errorSchema: errorSchema?.[key]
          }
        ), /* @__PURE__ */ React.createElement(OrchestratorFormToolbar, null)),
        title: subSchema.title || key,
        key
      }
    ];
  }, []);
  return /* @__PURE__ */ React.createElement(OrchestratorFormStepper, { steps });
};

export { StepperObjectField as default };
//# sourceMappingURL=StepperObjectField.esm.js.map
