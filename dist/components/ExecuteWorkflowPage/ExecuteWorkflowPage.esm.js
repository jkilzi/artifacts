import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAsync } from 'react-use';
import { useQueryParamState, Progress, ResponseErrorPanel, InfoCard } from '@backstage/core-components';
import { useApi, useRouteRefParams, useRouteRef } from '@backstage/core-plugin-api';
import { Grid } from '@material-ui/core';
import { QUERY_PARAM_INSTANCE_ID, QUERY_PARAM_ASSESSMENT_INSTANCE_ID } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import { OrchestratorForm } from '@red-hat-developer-hub/backstage-plugin-orchestrator-form-react';
import 'axios';
import { orchestratorApiRef } from '../../api/api.esm.js';
import { executeWorkflowRouteRef, workflowInstanceRouteRef } from '../../routes.esm.js';
import { getErrorObject } from '../../utils/ErrorUtils.esm.js';
import { BaseOrchestratorPage } from '../BaseOrchestratorPage.esm.js';
import JsonTextAreaForm from './JsonTextAreaForm.esm.js';

const ExecuteWorkflowPage = () => {
  const orchestratorApi = useApi(orchestratorApiRef);
  const { workflowId } = useRouteRefParams(executeWorkflowRouteRef);
  const [isExecuting, setIsExecuting] = useState(false);
  const [updateError, setUpdateError] = React.useState();
  const [instanceId] = useQueryParamState(QUERY_PARAM_INSTANCE_ID);
  const [assessmentInstanceId] = useQueryParamState(
    QUERY_PARAM_ASSESSMENT_INSTANCE_ID
  );
  const navigate = useNavigate();
  const instanceLink = useRouteRef(workflowInstanceRouteRef);
  const {
    value,
    loading,
    error: responseError
  } = useAsync(async () => {
    const res = await orchestratorApi.getWorkflowDataInputSchema(
      workflowId,
      assessmentInstanceId || instanceId
    );
    return res.data;
  }, [orchestratorApi, workflowId]);
  const schema = value?.inputSchema;
  const data = value?.data;
  const {
    value: workflowName,
    loading: workflowNameLoading,
    error: workflowNameError
  } = useAsync(async () => {
    const res = await orchestratorApi.getWorkflowOverview(workflowId);
    return res.data.name || "";
  }, [orchestratorApi, workflowId]);
  const handleExecute = useCallback(
    async (parameters) => {
      setUpdateError(void 0);
      try {
        setIsExecuting(true);
        const response = await orchestratorApi.executeWorkflow({
          workflowId,
          parameters,
          businessKey: assessmentInstanceId
        });
        navigate(instanceLink({ instanceId: response.data.id }));
      } catch (err) {
        setUpdateError(getErrorObject(err));
      } finally {
        setIsExecuting(false);
      }
    },
    [orchestratorApi, workflowId, navigate, instanceLink, assessmentInstanceId]
  );
  const error = responseError || workflowNameError;
  let pageContent;
  if (loading || workflowNameLoading) {
    pageContent = /* @__PURE__ */ React.createElement(Progress, null);
  } else if (error) {
    pageContent = /* @__PURE__ */ React.createElement(ResponseErrorPanel, { error });
  } else {
    pageContent = /* @__PURE__ */ React.createElement(Grid, { container: true, spacing: 2, direction: "column", wrap: "nowrap" }, updateError && /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(ResponseErrorPanel, { error: updateError })), /* @__PURE__ */ React.createElement(Grid, { item: true }, /* @__PURE__ */ React.createElement(InfoCard, { title: "Run workflow" }, !!schema ? /* @__PURE__ */ React.createElement(
      OrchestratorForm,
      {
        schema,
        handleExecute,
        isExecuting,
        isDataReadonly: !!assessmentInstanceId,
        data
      }
    ) : /* @__PURE__ */ React.createElement(
      JsonTextAreaForm,
      {
        handleExecute,
        isExecuting
      }
    ))));
  }
  return /* @__PURE__ */ React.createElement(
    BaseOrchestratorPage,
    {
      noPadding: workflowNameLoading,
      title: workflowName,
      type: "Workflows",
      typeLink: "/orchestrator"
    },
    pageContent
  );
};

export { ExecuteWorkflowPage };
//# sourceMappingURL=ExecuteWorkflowPage.esm.js.map
