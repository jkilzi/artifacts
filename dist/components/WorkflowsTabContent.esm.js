import React, { useCallback } from 'react';
import { Content, Progress, ResponseErrorPanel } from '@backstage/core-components';
import { useApi } from '@backstage/core-plugin-api';
import Grid from '@material-ui/core/Grid/Grid';
import 'axios';
import '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import { orchestratorApiRef } from '../api/api.esm.js';
import usePolling from '../hooks/usePolling.esm.js';
import { WorkflowsTable } from './WorkflowsTable.esm.js';

const WorkflowsTabContent = () => {
  const orchestratorApi = useApi(orchestratorApiRef);
  const fetchWorkflowOverviews = useCallback(async () => {
    const overviewsResp = await orchestratorApi.listWorkflowOverviews();
    return overviewsResp.data.overviews;
  }, [orchestratorApi]);
  const { loading, error, value } = usePolling(fetchWorkflowOverviews);
  const isReady = React.useMemo(() => !loading && !error, [loading, error]);
  return /* @__PURE__ */ React.createElement(Content, { noPadding: true }, loading ? /* @__PURE__ */ React.createElement(Progress, null) : null, error ? /* @__PURE__ */ React.createElement(ResponseErrorPanel, { error }) : null, isReady ? /* @__PURE__ */ React.createElement(Grid, { container: true, direction: "column" }, /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(WorkflowsTable, { items: value ?? [] }))) : null);
};

export { WorkflowsTabContent };
//# sourceMappingURL=WorkflowsTabContent.esm.js.map
