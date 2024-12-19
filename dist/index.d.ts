/// <reference types="react" />
import * as react from 'react';
import react__default from 'react';
import * as _backstage_core_plugin_api from '@backstage/core-plugin-api';
import { SvgIconProps } from '@material-ui/core';

/**
 * @public
 * Orchestrator Plugin
 */
declare const orchestratorPlugin: _backstage_core_plugin_api.BackstagePlugin<{
    root: _backstage_core_plugin_api.RouteRef<undefined>;
}, {}, {}>;
/**
 * @public
 * Orchestrator Page
 */
declare const OrchestratorPage: () => react.JSX.Element;

/**
 * @public
 * Orchestrator icon
 */
declare const OrchestratorIcon: (props: SvgIconProps) => react__default.JSX.Element;

export { OrchestratorIcon, OrchestratorPage, orchestratorPlugin };
