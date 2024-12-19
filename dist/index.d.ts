/// <reference types="react" />
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { JsonObject } from '@backstage/types';
import { FormProps } from '@rjsf/core';
import { ErrorSchema, UiSchema } from '@rjsf/utils';
import { JSONSchema7 } from 'json-schema';

/**
 * @public
 * FormDecoratorProps
 *
 * Type definition for properties passed to a form decorator component.
 * This interface extends selected fields from `FormProps` provided by `react-jsonschema-form`,
 * with additional custom functionality.
 *
 * @see {@link https://rjsf-team.github.io/react-jsonschema-form/docs/api-reference/form-props|RJSF Form Props Documentation}
 *
 * Core properties include:
 * - formData: The form's current data
 * - formContext: Contextual data shared across form components
 * - widgets: Custom widget components for form fields
 * - onChange: Handler for form data changes
 * - customValidate: Custom validation function
 *
 * Additional properties:
 * - getExtraErrors: Async function to fetch additional validation errors.
 *   This replaces the static 'extraErrors' prop from react-jsonschema-form, which can't be used as is, since onSubmit isn't exposed.
 *   The orchestrator form component will call getExtraErrors when running onSubmit.
 */
type FormDecoratorProps = Pick<FormProps<JsonObject, JSONSchema7>, 'formData' | 'formContext' | 'widgets' | 'onChange' | 'customValidate'> & {
    getExtraErrors?: (formData: JsonObject) => Promise<ErrorSchema<JsonObject>> | undefined;
};
/**
 * @public
 * OrchestratorFormDecorator
 *
 */
type OrchestratorFormDecorator = (FormComponent: React.ComponentType<FormDecoratorProps>) => React.ComponentType;
/**
 * @public
 * OrchestratorFormApi
 * API to be implemented by factory in a custom plugin
 */
interface OrchestratorFormApi {
    /**
     * @public
     * getFormDecorator
     * return the form decorator
     */
    getFormDecorator(schema: JSONSchema7, uiSchema: UiSchema<JsonObject, JSONSchema7>, initialFormData?: JsonObject): OrchestratorFormDecorator;
}
/**
 * @public
 * OrchestratorFormApiRef
 *
 */
declare const orchestratorFormApiRef: _backstage_core_plugin_api.ApiRef<OrchestratorFormApi>;

export { type FormDecoratorProps, type OrchestratorFormApi, type OrchestratorFormDecorator, orchestratorFormApiRef };
