import { createPlugin, createApiFactory, discoveryApiRef, identityApiRef, createRoutableExtension } from '@backstage/core-plugin-api';
import { OrchestratorClient } from './api/OrchestratorClient.esm.js';
import { orchestratorApiRef } from './api/api.esm.js';
import { orchestratorRootRouteRef } from './routes.esm.js';

const orchestratorPlugin = createPlugin({
  id: "orchestrator",
  apis: [
    createApiFactory({
      api: orchestratorApiRef,
      deps: { discoveryApi: discoveryApiRef, identityApi: identityApiRef },
      factory({ discoveryApi, identityApi }) {
        return new OrchestratorClient({ discoveryApi, identityApi });
      }
    })
  ],
  routes: {
    root: orchestratorRootRouteRef
  }
});
const OrchestratorPage = orchestratorPlugin.provide(
  createRoutableExtension({
    name: "OrchestratorPage",
    component: () => import('./components/Router.esm.js').then((m) => m.Router),
    mountPoint: orchestratorRootRouteRef
  })
);

export { OrchestratorPage, orchestratorPlugin };
//# sourceMappingURL=plugin.esm.js.map
