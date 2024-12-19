import globalAxios from 'axios';
import { assertParamExists, DUMMY_BASE_URL, setSearchParams, toPathString, serializeDataIfNeeded, createRequestFunction } from './common.esm.js';
import { operationServerMap, BaseAPI, BASE_PATH } from './base.esm.js';

const FieldFilterOperatorEnum = {
  Eq: "EQ",
  Gt: "GT",
  Gte: "GTE",
  Lt: "LT",
  Lte: "LTE",
  In: "IN",
  IsNull: "IS_NULL",
  Contains: "CONTAINS",
  ContainsAll: "CONTAINS_ALL",
  ContainsAny: "CONTAINS_ANY",
  Like: "LIKE",
  Between: "BETWEEN"
};
const LogicalFilterOperatorEnum = {
  And: "AND",
  Or: "OR",
  Not: "NOT"
};
const PaginationInfoDTOOrderDirectionEnum = {
  Asc: "ASC",
  Desc: "DESC"
};
const ProcessInstanceStatusDTO = {
  Active: "Active",
  Error: "Error",
  Completed: "Completed",
  Aborted: "Aborted",
  Suspended: "Suspended",
  Pending: "Pending"
};
const WorkflowCategoryDTO = {
  Assessment: "assessment",
  Infrastructure: "infrastructure"
};
const WorkflowFormatDTO = {
  Yaml: "yaml",
  Json: "json"
};
const WorkflowResultDTOCompletedWithEnum = {
  Error: "error",
  Success: "success"
};
const WorkflowResultDTOOutputsInnerFormatEnum = {
  Text: "text",
  Number: "number",
  Link: "link"
};
const DefaultApiAxiosParamCreator = function(configuration) {
  return {
    /**
     * Aborts a workflow instance identified by the provided instanceId.
     * @summary Abort a workflow instance
     * @param {string} instanceId The identifier of the workflow instance to abort.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    abortWorkflow: async (instanceId, options = {}) => {
      assertParamExists("abortWorkflow", "instanceId", instanceId);
      const localVarPath = `/v2/workflows/instances/{instanceId}/abort`.replace(`{${"instanceId"}}`, encodeURIComponent(String(instanceId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "DELETE", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Execute a workflow
     * @summary Execute a workflow
     * @param {string} workflowId ID of the workflow to execute
     * @param {ExecuteWorkflowRequestDTO} executeWorkflowRequestDTO 
     * @param {string} [businessKey] ID of the parent workflow
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    executeWorkflow: async (workflowId, executeWorkflowRequestDTO, businessKey, options = {}) => {
      assertParamExists("executeWorkflow", "workflowId", workflowId);
      assertParamExists("executeWorkflow", "executeWorkflowRequestDTO", executeWorkflowRequestDTO);
      const localVarPath = `/v2/workflows/{workflowId}/execute`.replace(`{${"workflowId"}}`, encodeURIComponent(String(workflowId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      if (businessKey !== void 0) {
        localVarQueryParameter["businessKey"] = businessKey;
      }
      localVarHeaderParameter["Content-Type"] = "application/json";
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      localVarRequestOptions.data = serializeDataIfNeeded(executeWorkflowRequestDTO, localVarRequestOptions, configuration);
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Get a workflow execution/run (instance)
     * @summary Get Workflow Instance by ID
     * @param {string} instanceId ID of the workflow instance
     * @param {boolean} [includeAssessment] Whether to include assessment
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInstanceById: async (instanceId, includeAssessment, options = {}) => {
      assertParamExists("getInstanceById", "instanceId", instanceId);
      const localVarPath = `/v2/workflows/instances/{instanceId}`.replace(`{${"instanceId"}}`, encodeURIComponent(String(instanceId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      if (includeAssessment !== void 0) {
        localVarQueryParameter["includeAssessment"] = includeAssessment;
      }
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Retrieve an array of workflow executions (instances)
     * @summary Get instances
     * @param {GetInstancesRequest} [getInstancesRequest] Parameters for retrieving instances
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInstances: async (getInstancesRequest, options = {}) => {
      const localVarPath = `/v2/workflows/instances`;
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      localVarHeaderParameter["Content-Type"] = "application/json";
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      localVarRequestOptions.data = serializeDataIfNeeded(getInstancesRequest, localVarRequestOptions, configuration);
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Get the workflow input schema. It defines the input fields of the workflow
     * @param {string} workflowId ID of the workflow to fetch
     * @param {string} [instanceId] ID of instance
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowInputSchemaById: async (workflowId, instanceId, options = {}) => {
      assertParamExists("getWorkflowInputSchemaById", "workflowId", workflowId);
      const localVarPath = `/v2/workflows/{workflowId}/inputSchema`.replace(`{${"workflowId"}}`, encodeURIComponent(String(workflowId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      if (instanceId !== void 0) {
        localVarQueryParameter["instanceId"] = instanceId;
      }
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Retrieve an array of workflow executions (instances) for the given workflow
     * @summary Get instances for a specific workflow
     * @param {string} workflowId ID of the workflow
     * @param {SearchRequest} [searchRequest] Parameters for retrieving workflow instances
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowInstances: async (workflowId, searchRequest, options = {}) => {
      assertParamExists("getWorkflowInstances", "workflowId", workflowId);
      const localVarPath = `/v2/workflows/{workflowId}/instances`.replace(`{${"workflowId"}}`, encodeURIComponent(String(workflowId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      localVarHeaderParameter["Content-Type"] = "application/json";
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      localVarRequestOptions.data = serializeDataIfNeeded(searchRequest, localVarRequestOptions, configuration);
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Returns the key fields of the workflow including data on the last run instance
     * @param {string} workflowId Unique identifier of the workflow
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowOverviewById: async (workflowId, options = {}) => {
      assertParamExists("getWorkflowOverviewById", "workflowId", workflowId);
      const localVarPath = `/v2/workflows/{workflowId}/overview`.replace(`{${"workflowId"}}`, encodeURIComponent(String(workflowId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Get the workflow\'s definition
     * @param {string} workflowId ID of the workflow to fetch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowSourceById: async (workflowId, options = {}) => {
      assertParamExists("getWorkflowSourceById", "workflowId", workflowId);
      const localVarPath = `/v2/workflows/{workflowId}/source`.replace(`{${"workflowId"}}`, encodeURIComponent(String(workflowId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Retrieve array with the status of all instances
     * @summary Get workflow status list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowStatuses: async (options = {}) => {
      const localVarPath = `/v2/workflows/instances/statuses`;
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "GET", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Returns the key fields of the workflow including data on the last run instance
     * @param {SearchRequest} [searchRequest] Pagination and filters
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowsOverview: async (searchRequest, options = {}) => {
      const localVarPath = `/v2/workflows/overview`;
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      localVarHeaderParameter["Content-Type"] = "application/json";
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      localVarRequestOptions.data = serializeDataIfNeeded(searchRequest, localVarRequestOptions, configuration);
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    },
    /**
     * Retrigger an instance
     * @summary Retrigger an instance
     * @param {string} workflowId ID of the workflow
     * @param {string} instanceId ID of the instance to retrigger
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    retriggerInstance: async (workflowId, instanceId, options = {}) => {
      assertParamExists("retriggerInstance", "workflowId", workflowId);
      assertParamExists("retriggerInstance", "instanceId", instanceId);
      const localVarPath = `/v2/workflows/{workflowId}/{instanceId}/retrigger`.replace(`{${"workflowId"}}`, encodeURIComponent(String(workflowId))).replace(`{${"instanceId"}}`, encodeURIComponent(String(instanceId)));
      const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
      let baseOptions;
      if (configuration) {
        baseOptions = configuration.baseOptions;
      }
      const localVarRequestOptions = { method: "POST", ...baseOptions, ...options };
      const localVarHeaderParameter = {};
      const localVarQueryParameter = {};
      setSearchParams(localVarUrlObj, localVarQueryParameter);
      let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
      localVarRequestOptions.headers = { ...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers };
      return {
        url: toPathString(localVarUrlObj),
        options: localVarRequestOptions
      };
    }
  };
};
const DefaultApiFp = function(configuration) {
  const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration);
  return {
    /**
     * Aborts a workflow instance identified by the provided instanceId.
     * @summary Abort a workflow instance
     * @param {string} instanceId The identifier of the workflow instance to abort.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async abortWorkflow(instanceId, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.abortWorkflow(instanceId, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.abortWorkflow"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Execute a workflow
     * @summary Execute a workflow
     * @param {string} workflowId ID of the workflow to execute
     * @param {ExecuteWorkflowRequestDTO} executeWorkflowRequestDTO 
     * @param {string} [businessKey] ID of the parent workflow
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async executeWorkflow(workflowId, executeWorkflowRequestDTO, businessKey, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.executeWorkflow(workflowId, executeWorkflowRequestDTO, businessKey, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.executeWorkflow"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Get a workflow execution/run (instance)
     * @summary Get Workflow Instance by ID
     * @param {string} instanceId ID of the workflow instance
     * @param {boolean} [includeAssessment] Whether to include assessment
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getInstanceById(instanceId, includeAssessment, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getInstanceById(instanceId, includeAssessment, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getInstanceById"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Retrieve an array of workflow executions (instances)
     * @summary Get instances
     * @param {GetInstancesRequest} [getInstancesRequest] Parameters for retrieving instances
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getInstances(getInstancesRequest, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getInstances(getInstancesRequest, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getInstances"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Get the workflow input schema. It defines the input fields of the workflow
     * @param {string} workflowId ID of the workflow to fetch
     * @param {string} [instanceId] ID of instance
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getWorkflowInputSchemaById(workflowId, instanceId, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getWorkflowInputSchemaById(workflowId, instanceId, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getWorkflowInputSchemaById"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Retrieve an array of workflow executions (instances) for the given workflow
     * @summary Get instances for a specific workflow
     * @param {string} workflowId ID of the workflow
     * @param {SearchRequest} [searchRequest] Parameters for retrieving workflow instances
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getWorkflowInstances(workflowId, searchRequest, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getWorkflowInstances(workflowId, searchRequest, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getWorkflowInstances"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Returns the key fields of the workflow including data on the last run instance
     * @param {string} workflowId Unique identifier of the workflow
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getWorkflowOverviewById(workflowId, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getWorkflowOverviewById(workflowId, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getWorkflowOverviewById"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Get the workflow\'s definition
     * @param {string} workflowId ID of the workflow to fetch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getWorkflowSourceById(workflowId, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getWorkflowSourceById(workflowId, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getWorkflowSourceById"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Retrieve array with the status of all instances
     * @summary Get workflow status list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getWorkflowStatuses(options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getWorkflowStatuses(options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getWorkflowStatuses"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Returns the key fields of the workflow including data on the last run instance
     * @param {SearchRequest} [searchRequest] Pagination and filters
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async getWorkflowsOverview(searchRequest, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.getWorkflowsOverview(searchRequest, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.getWorkflowsOverview"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    },
    /**
     * Retrigger an instance
     * @summary Retrigger an instance
     * @param {string} workflowId ID of the workflow
     * @param {string} instanceId ID of the instance to retrigger
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    async retriggerInstance(workflowId, instanceId, options) {
      const localVarAxiosArgs = await localVarAxiosParamCreator.retriggerInstance(workflowId, instanceId, options);
      const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
      const localVarOperationServerBasePath = operationServerMap["DefaultApi.retriggerInstance"]?.[localVarOperationServerIndex]?.url;
      return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
    }
  };
};
const DefaultApiFactory = function(configuration, basePath, axios) {
  const localVarFp = DefaultApiFp(configuration);
  return {
    /**
     * Aborts a workflow instance identified by the provided instanceId.
     * @summary Abort a workflow instance
     * @param {string} instanceId The identifier of the workflow instance to abort.
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    abortWorkflow(instanceId, options) {
      return localVarFp.abortWorkflow(instanceId, options).then((request) => request(axios, basePath));
    },
    /**
     * Execute a workflow
     * @summary Execute a workflow
     * @param {string} workflowId ID of the workflow to execute
     * @param {ExecuteWorkflowRequestDTO} executeWorkflowRequestDTO 
     * @param {string} [businessKey] ID of the parent workflow
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    executeWorkflow(workflowId, executeWorkflowRequestDTO, businessKey, options) {
      return localVarFp.executeWorkflow(workflowId, executeWorkflowRequestDTO, businessKey, options).then((request) => request(axios, basePath));
    },
    /**
     * Get a workflow execution/run (instance)
     * @summary Get Workflow Instance by ID
     * @param {string} instanceId ID of the workflow instance
     * @param {boolean} [includeAssessment] Whether to include assessment
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInstanceById(instanceId, includeAssessment, options) {
      return localVarFp.getInstanceById(instanceId, includeAssessment, options).then((request) => request(axios, basePath));
    },
    /**
     * Retrieve an array of workflow executions (instances)
     * @summary Get instances
     * @param {GetInstancesRequest} [getInstancesRequest] Parameters for retrieving instances
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getInstances(getInstancesRequest, options) {
      return localVarFp.getInstances(getInstancesRequest, options).then((request) => request(axios, basePath));
    },
    /**
     * Get the workflow input schema. It defines the input fields of the workflow
     * @param {string} workflowId ID of the workflow to fetch
     * @param {string} [instanceId] ID of instance
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowInputSchemaById(workflowId, instanceId, options) {
      return localVarFp.getWorkflowInputSchemaById(workflowId, instanceId, options).then((request) => request(axios, basePath));
    },
    /**
     * Retrieve an array of workflow executions (instances) for the given workflow
     * @summary Get instances for a specific workflow
     * @param {string} workflowId ID of the workflow
     * @param {SearchRequest} [searchRequest] Parameters for retrieving workflow instances
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowInstances(workflowId, searchRequest, options) {
      return localVarFp.getWorkflowInstances(workflowId, searchRequest, options).then((request) => request(axios, basePath));
    },
    /**
     * Returns the key fields of the workflow including data on the last run instance
     * @param {string} workflowId Unique identifier of the workflow
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowOverviewById(workflowId, options) {
      return localVarFp.getWorkflowOverviewById(workflowId, options).then((request) => request(axios, basePath));
    },
    /**
     * Get the workflow\'s definition
     * @param {string} workflowId ID of the workflow to fetch
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowSourceById(workflowId, options) {
      return localVarFp.getWorkflowSourceById(workflowId, options).then((request) => request(axios, basePath));
    },
    /**
     * Retrieve array with the status of all instances
     * @summary Get workflow status list
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowStatuses(options) {
      return localVarFp.getWorkflowStatuses(options).then((request) => request(axios, basePath));
    },
    /**
     * Returns the key fields of the workflow including data on the last run instance
     * @param {SearchRequest} [searchRequest] Pagination and filters
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    getWorkflowsOverview(searchRequest, options) {
      return localVarFp.getWorkflowsOverview(searchRequest, options).then((request) => request(axios, basePath));
    },
    /**
     * Retrigger an instance
     * @summary Retrigger an instance
     * @param {string} workflowId ID of the workflow
     * @param {string} instanceId ID of the instance to retrigger
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     */
    retriggerInstance(workflowId, instanceId, options) {
      return localVarFp.retriggerInstance(workflowId, instanceId, options).then((request) => request(axios, basePath));
    }
  };
};
class DefaultApi extends BaseAPI {
  /**
   * Aborts a workflow instance identified by the provided instanceId.
   * @summary Abort a workflow instance
   * @param {string} instanceId The identifier of the workflow instance to abort.
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  abortWorkflow(instanceId, options) {
    return DefaultApiFp(this.configuration).abortWorkflow(instanceId, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Execute a workflow
   * @summary Execute a workflow
   * @param {string} workflowId ID of the workflow to execute
   * @param {ExecuteWorkflowRequestDTO} executeWorkflowRequestDTO 
   * @param {string} [businessKey] ID of the parent workflow
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  executeWorkflow(workflowId, executeWorkflowRequestDTO, businessKey, options) {
    return DefaultApiFp(this.configuration).executeWorkflow(workflowId, executeWorkflowRequestDTO, businessKey, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Get a workflow execution/run (instance)
   * @summary Get Workflow Instance by ID
   * @param {string} instanceId ID of the workflow instance
   * @param {boolean} [includeAssessment] Whether to include assessment
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getInstanceById(instanceId, includeAssessment, options) {
    return DefaultApiFp(this.configuration).getInstanceById(instanceId, includeAssessment, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Retrieve an array of workflow executions (instances)
   * @summary Get instances
   * @param {GetInstancesRequest} [getInstancesRequest] Parameters for retrieving instances
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getInstances(getInstancesRequest, options) {
    return DefaultApiFp(this.configuration).getInstances(getInstancesRequest, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Get the workflow input schema. It defines the input fields of the workflow
   * @param {string} workflowId ID of the workflow to fetch
   * @param {string} [instanceId] ID of instance
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getWorkflowInputSchemaById(workflowId, instanceId, options) {
    return DefaultApiFp(this.configuration).getWorkflowInputSchemaById(workflowId, instanceId, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Retrieve an array of workflow executions (instances) for the given workflow
   * @summary Get instances for a specific workflow
   * @param {string} workflowId ID of the workflow
   * @param {SearchRequest} [searchRequest] Parameters for retrieving workflow instances
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getWorkflowInstances(workflowId, searchRequest, options) {
    return DefaultApiFp(this.configuration).getWorkflowInstances(workflowId, searchRequest, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Returns the key fields of the workflow including data on the last run instance
   * @param {string} workflowId Unique identifier of the workflow
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getWorkflowOverviewById(workflowId, options) {
    return DefaultApiFp(this.configuration).getWorkflowOverviewById(workflowId, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Get the workflow\'s definition
   * @param {string} workflowId ID of the workflow to fetch
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getWorkflowSourceById(workflowId, options) {
    return DefaultApiFp(this.configuration).getWorkflowSourceById(workflowId, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Retrieve array with the status of all instances
   * @summary Get workflow status list
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getWorkflowStatuses(options) {
    return DefaultApiFp(this.configuration).getWorkflowStatuses(options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Returns the key fields of the workflow including data on the last run instance
   * @param {SearchRequest} [searchRequest] Pagination and filters
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  getWorkflowsOverview(searchRequest, options) {
    return DefaultApiFp(this.configuration).getWorkflowsOverview(searchRequest, options).then((request) => request(this.axios, this.basePath));
  }
  /**
   * Retrigger an instance
   * @summary Retrigger an instance
   * @param {string} workflowId ID of the workflow
   * @param {string} instanceId ID of the instance to retrigger
   * @param {*} [options] Override http request option.
   * @throws {RequiredError}
   * @memberof DefaultApi
   */
  retriggerInstance(workflowId, instanceId, options) {
    return DefaultApiFp(this.configuration).retriggerInstance(workflowId, instanceId, options).then((request) => request(this.axios, this.basePath));
  }
}

export { DefaultApi, DefaultApiAxiosParamCreator, DefaultApiFactory, DefaultApiFp, FieldFilterOperatorEnum, LogicalFilterOperatorEnum, PaginationInfoDTOOrderDirectionEnum, ProcessInstanceStatusDTO, WorkflowCategoryDTO, WorkflowFormatDTO, WorkflowResultDTOCompletedWithEnum, WorkflowResultDTOOutputsInnerFormatEnum };
//# sourceMappingURL=api.esm.js.map
