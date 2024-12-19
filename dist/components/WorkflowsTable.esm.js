import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from '@backstage/core-components';
import { useRouteRef } from '@backstage/core-plugin-api';
import { usePermission } from '@backstage/plugin-permission-react';
import Pageview from '@material-ui/icons/Pageview';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { orchestratorWorkflowExecutePermission, capitalize } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import { VALUE_UNAVAILABLE } from '../constants.esm.js';
import WorkflowOverviewFormatter from '../dataFormatters/WorkflowOverviewFormatter.esm.js';
import { workflowDefinitionsRouteRef, executeWorkflowRouteRef } from '../routes.esm.js';
import OverrideBackstageTable from './ui/OverrideBackstageTable.esm.js';
import { WorkflowInstanceStatusIndicator } from './WorkflowInstanceStatusIndicator.esm.js';

const WorkflowsTable = ({ items }) => {
  const navigate = useNavigate();
  const definitionLink = useRouteRef(workflowDefinitionsRouteRef);
  const executeWorkflowLink = useRouteRef(executeWorkflowRouteRef);
  const [data, setData] = useState([]);
  const permittedToExecute = usePermission({
    permission: orchestratorWorkflowExecutePermission
  });
  const initialState = useMemo(
    () => items.map(WorkflowOverviewFormatter.format),
    [items]
  );
  useEffect(() => {
    setData(initialState);
  }, [initialState]);
  const handleView = useCallback(
    (rowData) => {
      navigate(
        definitionLink({ workflowId: rowData.id, format: rowData.format })
      );
    },
    [definitionLink, navigate]
  );
  const handleExecute = useCallback(
    (rowData) => {
      navigate(executeWorkflowLink({ workflowId: rowData.id }));
    },
    [executeWorkflowLink, navigate]
  );
  const actions = useMemo(() => {
    const actionItems = [
      {
        icon: PlayArrow,
        tooltip: "Execute",
        disabled: !permittedToExecute.allowed,
        onClick: (_, rowData) => handleExecute(rowData)
      },
      {
        icon: Pageview,
        tooltip: "View",
        onClick: (_, rowData) => handleView(rowData)
      }
    ];
    return actionItems;
  }, [handleExecute, handleView, permittedToExecute]);
  const columns = useMemo(
    () => [
      {
        title: "Name",
        field: "name",
        render: (rowData) => /* @__PURE__ */ React.createElement(
          Link,
          {
            to: definitionLink({
              workflowId: rowData.id,
              format: rowData.format
            })
          },
          rowData.name
        )
      },
      {
        title: "Category",
        field: "category",
        render: (rowData) => capitalize(rowData.category)
      },
      { title: "Last run", field: "lastTriggered" },
      {
        title: "Last run status",
        field: "lastRunStatus",
        render: (rowData) => rowData.lastRunStatus !== VALUE_UNAVAILABLE && rowData.lastRunId !== VALUE_UNAVAILABLE ? /* @__PURE__ */ React.createElement(
          WorkflowInstanceStatusIndicator,
          {
            status: rowData.lastRunStatus,
            lastRunId: rowData.lastRunId
          }
        ) : VALUE_UNAVAILABLE
      },
      { title: "Description", field: "description", minWidth: "25vw" }
    ],
    [definitionLink]
  );
  const options = useMemo(
    () => ({
      search: true,
      paging: false,
      actionsColumnIndex: columns.length
    }),
    [columns.length]
  );
  return /* @__PURE__ */ React.createElement(
    OverrideBackstageTable,
    {
      title: "Workflows",
      options,
      columns,
      data,
      actions
    }
  );
};

export { WorkflowsTable };
//# sourceMappingURL=WorkflowsTable.esm.js.map
