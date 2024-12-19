import { createErrorHandler, unwrapErrorHandler, validationDataMerge } from '@rjsf/utils';
import validatorAjv from '@rjsf/validator-ajv8';
import { useStepperContext } from './StepperContext.esm.js';

const useValidator = (isMultiStepSchema) => {
  const { activeStep } = useStepperContext();
  const validator = {
    activeStep,
    validateFormData: (formData, _schema, customValidate) => {
      let validationData = validatorAjv.validateFormData(formData, _schema);
      if (customValidate) {
        const errorHandler = customValidate(
          formData,
          createErrorHandler(formData)
        );
        const userErrorSchema = unwrapErrorHandler(errorHandler);
        validationData = validationDataMerge(
          validationData,
          userErrorSchema
        );
      }
      if (!isMultiStepSchema) {
        return validationData;
      }
      const activeKey = Object.keys(_schema.properties || {})[activeStep];
      return {
        errors: validationData.errors.filter(
          (err) => err.property?.startsWith(`.${activeKey}.`)
        ),
        errorSchema: validationData.errorSchema[activeKey] || {}
      };
    },
    toErrorList: (errorSchema, fieldPath) => {
      return validatorAjv.toErrorList(errorSchema, fieldPath);
    },
    isValid: (_schema, formData, rootSchema) => {
      return validatorAjv.isValid(_schema, formData, rootSchema);
    },
    rawValidation: (_schema, formData) => validatorAjv.rawValidation(_schema, formData)
  };
  return validator;
};

export { useValidator as default };
//# sourceMappingURL=useValidator.esm.js.map
