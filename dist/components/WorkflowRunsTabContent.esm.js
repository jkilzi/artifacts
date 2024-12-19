import React, { useState } from 'react';
import { Link, ErrorPanel, InfoCard } from '@backstage/core-components';
import { useApi, useRouteRef } from '@backstage/core-plugin-api';
import { Grid } from '@material-ui/core';
import { ellipsis, capitalize, ProcessInstanceState } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import 'axios';
import { orchestratorApiRef } from '../api/api.esm.js';
import { VALUE_UNAVAILABLE, DEFAULT_TABLE_PAGE_SIZE } from '../constants.esm.js';
import usePolling from '../hooks/usePolling.esm.js';
import { workflowInstanceRouteRef } from '../routes.esm.js';
import { Selector } from './Selector.esm.js';
import OverrideBackstageTable from './ui/OverrideBackstageTable.esm.js';
import { mapProcessInstanceToDetails } from './WorkflowInstancePageContent.esm.js';
import { WorkflowInstanceStatusIndicator } from './WorkflowInstanceStatusIndicator.esm.js';

const makeSelectItemsFromProcessInstanceValues = () => [
  ProcessInstanceState.Active,
  ProcessInstanceState.Error,
  ProcessInstanceState.Completed,
  ProcessInstanceState.Aborted,
  ProcessInstanceState.Suspended
].map(
  (status) => ({
    label: capitalize(status),
    value: status
  })
);
const WorkflowRunsTabContent = () => {
  const orchestratorApi = useApi(orchestratorApiRef);
  const workflowInstanceLink = useRouteRef(workflowInstanceRouteRef);
  const [statusSelectorValue, setStatusSelectorValue] = useState(
    Selector.AllItems
  );
  const fetchInstances = React.useCallback(async () => {
    const instances = await orchestratorApi.listInstances({});
    const clonedData = instances.data.items?.map(mapProcessInstanceToDetails) || [];
    return clonedData;
  }, [orchestratorApi]);
  const { loading, error, value } = usePolling(fetchInstances);
  const columns = React.useMemo(
    () => [
      {
        title: "ID",
        field: "id",
        render: (data) => /* @__PURE__ */ React.createElement(Link, { to: workflowInstanceLink({ instanceId: data.id }) }, ellipsis(data.id)),
        sorting: false
      },
      {
        title: "Name",
        field: "name"
      },
      {
        title: "Status",
        field: "status",
        render: (data) => /* @__PURE__ */ React.createElement(
          WorkflowInstanceStatusIndicator,
          {
            status: data.status
          }
        )
      },
      {
        title: "Category",
        field: "category",
        render: (data) => capitalize(data.category ?? VALUE_UNAVAILABLE)
      },
      { title: "Started", field: "started", defaultSort: "desc" },
      { title: "Duration", field: "duration" }
    ],
    [workflowInstanceLink]
  );
  const statuses = React.useMemo(makeSelectItemsFromProcessInstanceValues, []);
  const filteredData = React.useMemo(
    () => (value ?? []).filter(
      (row) => statusSelectorValue === Selector.AllItems || row.status?.toLocaleLowerCase("en-US") === statusSelectorValue
    ),
    [statusSelectorValue, value]
  );
  const selectors = React.useMemo(
    () => /* @__PURE__ */ React.createElement(Grid, { container: true, alignItems: "center" }, /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(
      Selector,
      {
        label: "Status",
        items: statuses,
        onChange: setStatusSelectorValue,
        selected: statusSelectorValue
      }
    ))),
    [statusSelectorValue, statuses]
  );
  const paging = (value?.length || 0) > DEFAULT_TABLE_PAGE_SIZE;
  return error ? /* @__PURE__ */ React.createElement(ErrorPanel, { error }) : /* @__PURE__ */ React.createElement(InfoCard, { noPadding: true, title: selectors }, /* @__PURE__ */ React.createElement(
    OverrideBackstageTable,
    {
      title: "Workflow Runs",
      options: {
        paging,
        search: true,
        pageSize: DEFAULT_TABLE_PAGE_SIZE
      },
      isLoading: loading,
      columns,
      data: filteredData
    }
  ));
};

export { WorkflowRunsTabContent };
//# sourceMappingURL=WorkflowRunsTabContent.esm.js.map
