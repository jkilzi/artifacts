import React from 'react';
import { JsonObject } from '@backstage/types';
import { JSONSchema7 } from 'json-schema';

/**
 * @public
 * OrchestratorForm component properties
 */
type OrchestratorFormProps = {
    schema: JSONSchema7;
    isExecuting: boolean;
    handleExecute: (parameters: JsonObject) => Promise<void>;
    data?: JsonObject;
    isDataReadonly?: boolean;
};
/**
 * @public
 * The component contains the react-json-schema-form and serves as an extensible form. It allows loading a custom plugin decorator to override the default react-json-schema-form properties.
 */
declare const OrchestratorForm: ({ schema, handleExecute, isExecuting, data, isDataReadonly, }: OrchestratorFormProps) => React.JSX.Element;

/**
 * @public
 * Button with loading state.
 */
declare const SubmitButton: ({ submitting, handleClick, children, focusOnMount, }: {
    submitting: boolean;
    handleClick?: (() => void) | undefined;
    children: React.ReactNode;
    focusOnMount?: boolean | undefined;
}) => React.JSX.Element;

export { OrchestratorForm, type OrchestratorFormProps, SubmitButton };
