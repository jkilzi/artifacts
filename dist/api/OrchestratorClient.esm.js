import axios, { isAxiosError } from 'axios';
import { Configuration, DefaultApi } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';

const getError = (err) => {
  if (isAxiosError(err) && err.response?.data?.error?.message) {
    const error = new Error(err.response?.data?.error?.message);
    error.name = err.response?.data?.error?.name || "Error";
    return error;
  }
  return err;
};
class OrchestratorClient {
  discoveryApi;
  identityApi;
  axiosInstance;
  baseUrl = null;
  constructor(options) {
    this.discoveryApi = options.discoveryApi;
    this.identityApi = options.identityApi;
    this.axiosInstance = options.axiosInstance;
  }
  async getDefaultAPI() {
    const baseUrl = await this.getBaseUrl();
    const { token: idToken } = await this.identityApi.getCredentials();
    this.axiosInstance = this.axiosInstance || axios.create({
      baseURL: baseUrl,
      headers: {
        ...idToken && { Authorization: `Bearer ${idToken}` }
      },
      withCredentials: true
    });
    const config = new Configuration({
      basePath: baseUrl
    });
    return new DefaultApi(config, baseUrl, this.axiosInstance);
  }
  async getBaseUrl() {
    if (!this.baseUrl) {
      this.baseUrl = await this.discoveryApi.getBaseUrl("orchestrator");
    }
    return this.baseUrl;
  }
  async executeWorkflow(args) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    try {
      return await defaultApi.executeWorkflow(
        args.workflowId,
        { inputData: args.parameters },
        args.businessKey,
        reqConfigOption
      );
    } catch (err) {
      throw getError(err);
    }
  }
  async abortWorkflowInstance(instanceId) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    try {
      return await defaultApi.abortWorkflow(instanceId, reqConfigOption);
    } catch (err) {
      throw getError(err);
    }
  }
  async getWorkflowSource(workflowId) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    reqConfigOption.responseType = "text";
    try {
      return await defaultApi.getWorkflowSourceById(
        workflowId,
        reqConfigOption
      );
    } catch (err) {
      throw getError(err);
    }
  }
  async listWorkflowOverviews(paginationInfo, filters) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    try {
      return await defaultApi.getWorkflowsOverview(
        { paginationInfo, filters },
        reqConfigOption
      );
    } catch (err) {
      throw getError(err);
    }
  }
  async listInstances(args) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    try {
      return await defaultApi.getInstances(args, reqConfigOption);
    } catch (err) {
      throw getError(err);
    }
  }
  async getInstance(instanceId, includeAssessment = false) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    try {
      return await defaultApi.getInstanceById(
        instanceId,
        includeAssessment,
        reqConfigOption
      );
    } catch (err) {
      throw getError(err);
    }
  }
  async getWorkflowDataInputSchema(workflowId, instanceId) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    try {
      return await defaultApi.getWorkflowInputSchemaById(
        workflowId,
        instanceId,
        reqConfigOption
      );
    } catch (err) {
      throw getError(err);
    }
  }
  async getWorkflowOverview(workflowId) {
    const defaultApi = await this.getDefaultAPI();
    const reqConfigOption = await this.getDefaultReqConfig();
    try {
      return await defaultApi.getWorkflowOverviewById(
        workflowId,
        reqConfigOption
      );
    } catch (err) {
      throw getError(err);
    }
  }
  // getDefaultReqConfig is a convenience wrapper that includes authentication and other necessary headers
  async getDefaultReqConfig(additionalHeaders) {
    const idToken = await this.identityApi.getCredentials();
    const reqConfigOption = {
      baseURL: await this.getBaseUrl(),
      headers: {
        Authorization: `Bearer ${idToken.token}`,
        ...additionalHeaders
      }
    };
    return reqConfigOption;
  }
}

export { OrchestratorClient };
//# sourceMappingURL=OrchestratorClient.esm.js.map
