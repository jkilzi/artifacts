'use strict';

var rootHttpRouter = require('@backstage/backend-defaults/rootHttpRouter');
var backendPluginApi = require('@backstage/backend-plugin-api');
var pluginPermissionCommon = require('@backstage/plugin-permission-common');
var pluginPermissionNode = require('@backstage/plugin-permission-node');
var pluginRbacCommon = require('@backstage-community/plugin-rbac-common');
var backstagePluginAuditLogNode = require('@janus-idp/backstage-plugin-audit-log-node');
var formats = require('ajv-formats/dist/formats');
var express = require('express');
var openapiBackend = require('openapi-backend');
var backstagePluginOrchestratorCommon = require('@red-hat-developer-hub/backstage-plugin-orchestrator-common');
var _package = require('../package.json.cjs.js');
var pagination = require('../types/pagination.cjs.js');
var v2 = require('./api/v2.cjs.js');
var constants = require('./constants.cjs.js');
var DataIndexService = require('./DataIndexService.cjs.js');
var DataInputSchemaService = require('./DataInputSchemaService.cjs.js');
var OrchestratorService = require('./OrchestratorService.cjs.js');
var ScaffolderService = require('./ScaffolderService.cjs.js');
var SonataFlowService = require('./SonataFlowService.cjs.js');
var WorkflowCacheService = require('./WorkflowCacheService.cjs.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e : { default: e }; }

var express__default = /*#__PURE__*/_interopDefaultCompat(express);

const authorize = async (request, permission, permissionsSvc, httpAuth) => {
  const decision = (await permissionsSvc.authorize([{ permission }], {
    credentials: await httpAuth.credentials(request)
  }))[0];
  return decision;
};
async function createBackendRouter(options) {
  const {
    config,
    logger,
    discovery,
    catalogApi,
    urlReader,
    scheduler,
    permissions,
    auth,
    httpAuth
  } = options;
  const publicServices = initPublicServices(logger, config, scheduler);
  const routerApi = await initRouterApi(publicServices.orchestratorService);
  const auditLogger = new backstagePluginAuditLogNode.DefaultAuditLogger({
    logger,
    authService: auth,
    httpAuthService: httpAuth
  });
  const router = express.Router();
  const permissionsIntegrationRouter = pluginPermissionNode.createPermissionIntegrationRouter({
    permissions: backstagePluginOrchestratorCommon.orchestratorPermissions
  });
  router.use(express__default.default.json());
  router.use(permissionsIntegrationRouter);
  router.use("/workflows", express__default.default.text());
  router.use("/static", express__default.default.static(backendPluginApi.resolvePackagePath(_package.name, "static")));
  router.get("/health", (_, response) => {
    logger.info("PONG!");
    response.json({ status: "ok" });
  });
  const scaffolderService = new ScaffolderService.ScaffolderService(
    logger,
    config,
    catalogApi,
    urlReader
  );
  setupInternalRoutes(
    publicServices,
    routerApi,
    permissions,
    httpAuth,
    auditLogger
  );
  setupExternalRoutes(router, discovery, scaffolderService, auditLogger);
  router.use((req, res, next) => {
    if (!next) {
      throw new Error("next is undefined");
    }
    return routerApi.openApiBackend.handleRequest(
      req,
      req,
      res,
      next
    );
  });
  const middleware = rootHttpRouter.MiddlewareFactory.create({ logger, config });
  router.use(middleware.error());
  return router;
}
function initPublicServices(logger, config, scheduler) {
  const dataIndexUrl = config.getString("orchestrator.dataIndexService.url");
  const dataIndexService = new DataIndexService.DataIndexService(dataIndexUrl, logger);
  const sonataFlowService = new SonataFlowService.SonataFlowService(dataIndexService, logger);
  const workflowCacheService = new WorkflowCacheService.WorkflowCacheService(
    logger,
    dataIndexService,
    sonataFlowService
  );
  workflowCacheService.schedule({ scheduler });
  const orchestratorService = new OrchestratorService.OrchestratorService(
    sonataFlowService,
    dataIndexService,
    workflowCacheService
  );
  const dataInputSchemaService = new DataInputSchemaService.DataInputSchemaService();
  return {
    orchestratorService,
    dataInputSchemaService
  };
}
async function initRouterApi(orchestratorService) {
  const openApiBackend = new openapiBackend.OpenAPIBackend({
    definition: backstagePluginOrchestratorCommon.openApiDocument,
    strict: false,
    ajvOpts: {
      strict: false,
      strictSchema: false,
      verbose: true,
      addUsedSchema: false,
      formats: formats.fullFormats
      // open issue: https://github.com/openapistack/openapi-backend/issues/280
    },
    handlers: {
      validationFail: async (c, _req, res) => {
        console.log("validationFail", c.operation);
        res.status(400).json({ err: c.validation.errors });
      },
      notFound: async (_c, req, res) => {
        res.status(404).json({ err: `${req.path} path not found` });
      },
      notImplemented: async (_c, req, res) => res.status(500).json({ err: `${req.path} not implemented` })
    }
  });
  await openApiBackend.init();
  const v2$1 = new v2.V2(orchestratorService);
  return { v2: v2$1, openApiBackend };
}
function setupInternalRoutes(services, routerApi, permissions, httpAuth, auditLogger) {
  function manageDenyAuthorization(endpointName, endpoint, req) {
    const error = new pluginRbacCommon.UnauthorizedError();
    auditLogger.auditLog({
      eventName: `${endpointName}EndpointHit`,
      stage: "authorization",
      status: "failed",
      level: "error",
      request: req,
      response: {
        status: 403,
        body: {
          errors: [
            {
              name: error.name,
              message: error.message
            }
          ]
        }
      },
      errors: [error],
      message: `Not authorize to request the ${endpoint} endpoint`
    });
    throw error;
  }
  function auditLogRequestError(error, endpointName, endpoint, req) {
    auditLogger.auditLog({
      eventName: `${endpointName}EndpointHit`,
      stage: "completion",
      status: "failed",
      level: "error",
      request: req,
      response: {
        status: 500,
        body: {
          errors: [
            {
              name: error.name,
              message: error.message || constants.INTERNAL_SERVER_ERROR_MESSAGE
            }
          ]
        }
      },
      errors: [error],
      message: `Error occured while requesting the '${endpoint}' endpoint`
    });
  }
  routerApi.openApiBackend.register(
    "getWorkflowsOverview",
    async (_c, req, res, next) => {
      const endpointName = "getWorkflowsOverview";
      const endpoint = "/v2/workflows/overview";
      auditLogger.auditLog({
        eventName: "getWorkflowsOverview",
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowInstancesReadPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, req);
      }
      return routerApi.v2.getWorkflowsOverview(pagination.buildPagination(req), getRequestFilters(req)).then((result) => res.json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "getWorkflowSourceById",
    async (c, _req, res, next) => {
      const workflowId = c.request.params.workflowId;
      const endpointName = "getWorkflowSourceById";
      const endpoint = `/v2/workflows/${workflowId}/source`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: _req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        _req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowReadPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, _req);
      }
      try {
        const result = await routerApi.v2.getWorkflowSourceById(workflowId);
        res.status(200).contentType("text/plain").send(result);
      } catch (error) {
        auditLogRequestError(error, endpointName, endpoint, _req);
        next(error);
      }
    }
  );
  routerApi.openApiBackend.register(
    "executeWorkflow",
    async (c, req, res, next) => {
      const workflowId = c.request.params.workflowId;
      const endpointName = "executeWorkflow";
      const endpoint = `/v2/workflows/${workflowId}/execute`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowExecutePermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, req);
      }
      const businessKey = routerApi.v2.extractQueryParam(
        c.request,
        backstagePluginOrchestratorCommon.QUERY_PARAM_BUSINESS_KEY
      );
      const executeWorkflowRequestDTO = req.body;
      return routerApi.v2.executeWorkflow(executeWorkflowRequestDTO, workflowId, businessKey).then((result) => res.status(200).json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "retriggerInstance",
    async (c, req, res, next) => {
      const workflowId = c.request.params.workflowId;
      const instanceId = c.request.params.instanceId;
      const endpointName = "retriggerInstance";
      const endpoint = `/v2/workflows/${workflowId}/${instanceId}/retrigger`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowExecutePermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, req);
      }
      await routerApi.v2.retriggerInstance(workflowId, instanceId).then((result) => res.status(200).json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "getWorkflowOverviewById",
    async (c, _req, res, next) => {
      const workflowId = c.request.params.workflowId;
      const endpointName = "getWorkflowOverviewById";
      const endpoint = `/v2/workflows/${workflowId}/overview`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: _req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        _req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowReadPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, _req);
      }
      return routerApi.v2.getWorkflowOverviewById(workflowId).then((result) => res.json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, _req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "getWorkflowStatuses",
    async (_c, _req, res, next) => {
      const endpointName = "getWorkflowStatuses";
      const endpoint = "/v2/workflows/instances/statuses";
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: _req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        _req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowInstanceReadPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, _req);
      }
      return routerApi.v2.getWorkflowStatuses().then((result) => res.status(200).json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, _req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "getWorkflowInputSchemaById",
    async (c, req, res, next) => {
      const workflowId = c.request.params.workflowId;
      const instanceId = c.request.query.instanceId;
      const endpointName = "getWorkflowInputSchemaById";
      const endpoint = `/v2/workflows/${workflowId}/inputSchema`;
      try {
        auditLogger.auditLog({
          eventName: endpointName,
          stage: "start",
          status: "succeeded",
          level: "debug",
          request: req,
          message: `Received request to '${endpoint}' endpoint`
        });
        const decision = await authorize(
          req,
          backstagePluginOrchestratorCommon.orchestratorWorkflowInstanceReadPermission,
          permissions,
          httpAuth
        );
        if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
          manageDenyAuthorization(endpointName, endpoint, req);
        }
        const workflowDefinition = await services.orchestratorService.fetchWorkflowInfo({
          definitionId: workflowId,
          cacheHandler: "throw"
        });
        if (!workflowDefinition) {
          throw new Error(
            `Failed to fetch workflow info for workflow ${workflowId}`
          );
        }
        const serviceUrl = workflowDefinition.serviceUrl;
        if (!serviceUrl) {
          throw new Error(
            `Service URL is not defined for workflow ${workflowId}`
          );
        }
        const definition = await services.orchestratorService.fetchWorkflowDefinition({
          definitionId: workflowId,
          cacheHandler: "throw"
        });
        if (!definition) {
          throw new Error(
            "Failed to fetch workflow definition for workflow ${workflowId}"
          );
        }
        if (!definition.dataInputSchema) {
          res.status(200).json({});
          return;
        }
        const instanceVariables = instanceId ? await services.orchestratorService.fetchInstanceVariables({
          instanceId,
          cacheHandler: "throw"
        }) : void 0;
        const workflowData = instanceVariables ? services.dataInputSchemaService.extractWorkflowData(
          instanceVariables
        ) : void 0;
        const workflowInfo = await routerApi.v2.getWorkflowInputSchemaById(workflowId, serviceUrl).catch((error) => {
          auditLogRequestError(error, endpointName, endpoint, req);
          res.status(500).json({
            message: error.message || constants.INTERNAL_SERVER_ERROR_MESSAGE
          });
        });
        if (!workflowInfo || !workflowInfo.inputSchema || !workflowInfo.inputSchema.properties) {
          res.status(200).json({});
          return;
        }
        const inputSchemaProps = workflowInfo.inputSchema.properties;
        let inputData;
        if (workflowData) {
          inputData = Object.keys(inputSchemaProps).filter((k) => k in workflowData).reduce((result, k) => {
            if (!workflowData[k]) {
              return result;
            }
            result[k] = workflowData[k];
            return result;
          }, {});
        }
        res.status(200).json({
          inputSchema: workflowInfo.inputSchema,
          data: inputData
        });
      } catch (err) {
        auditLogRequestError(err, endpointName, endpoint, req);
        next(err);
      }
    }
  );
  routerApi.openApiBackend.register(
    "getWorkflowInstances",
    async (c, req, res, next) => {
      const endpointName = "getWorkflowInstances";
      const workflowId = c.request.params.workflowId;
      const endpoint = `/v2/workflows/${workflowId}/instances`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowInstancesReadPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, req);
      }
      return routerApi.v2.getInstances(pagination.buildPagination(req), getRequestFilters(req), workflowId).then((result) => res.json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "getInstances",
    async (_c, req, res, next) => {
      const endpointName = "getInstances";
      const endpoint = `/v2/workflows/instances`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowInstancesReadPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, req);
      }
      return routerApi.v2.getInstances(pagination.buildPagination(req), getRequestFilters(req)).then((result) => res.json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "getInstanceById",
    async (c, _req, res, next) => {
      const instanceId = c.request.params.instanceId;
      const endpointName = "getInstanceById";
      const endpoint = `/v2/workflows/instances/${instanceId}`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: _req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        _req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowInstanceReadPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, _req);
      }
      const includeAssessment = routerApi.v2.extractQueryParam(
        c.request,
        backstagePluginOrchestratorCommon.QUERY_PARAM_INCLUDE_ASSESSMENT
      );
      return routerApi.v2.getInstanceById(instanceId, !!includeAssessment).then((result) => res.status(200).json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, _req);
        next(error);
      });
    }
  );
  routerApi.openApiBackend.register(
    "abortWorkflow",
    async (c, _req, res, next) => {
      const instanceId = c.request.params.instanceId;
      const endpointName = "abortWorkflow";
      const endpoint = `/v2/workflows/instances/${instanceId}/abort`;
      auditLogger.auditLog({
        eventName: endpointName,
        stage: "start",
        status: "succeeded",
        level: "debug",
        request: _req,
        message: `Received request to '${endpoint}' endpoint`
      });
      const decision = await authorize(
        _req,
        backstagePluginOrchestratorCommon.orchestratorWorkflowInstanceAbortPermission,
        permissions,
        httpAuth
      );
      if (decision.result === pluginPermissionCommon.AuthorizeResult.DENY) {
        manageDenyAuthorization(endpointName, endpoint, _req);
      }
      return routerApi.v2.abortWorkflow(instanceId).then((result) => res.json(result)).catch((error) => {
        auditLogRequestError(error, endpointName, endpoint, _req);
        next(error);
      });
    }
  );
}
function setupExternalRoutes(router, discovery, scaffolderService, auditLogger) {
  router.get("/actions", async (req, res) => {
    auditLogger.auditLog({
      eventName: "ActionsEndpointHit",
      stage: "start",
      status: "succeeded",
      level: "debug",
      request: req,
      message: `Received request to '/actions' endpoint`
    });
    const scaffolderUrl = await discovery.getBaseUrl("scaffolder");
    const response = await fetch(`${scaffolderUrl}/v2/actions`);
    const json = await response.json();
    res.status(response.status).json(json);
  });
  router.post("/actions/:actionId", async (req, res) => {
    const { actionId } = req.params;
    auditLogger.auditLog({
      eventName: "ActionsActionIdEndpointHit",
      stage: "start",
      status: "succeeded",
      level: "debug",
      request: req,
      message: `Received request to '/actions/${actionId}' endpoint`
    });
    const instanceId = req.header("kogitoprocinstanceid");
    const body = await req.body;
    const filteredBody = Object.fromEntries(
      Object.entries(body).filter(
        ([, value]) => value !== void 0 && value !== null
      )
    );
    const result = await scaffolderService.executeAction({
      actionId,
      instanceId,
      input: filteredBody
    });
    res.status(200).json(result);
  });
}
function getRequestFilters(req) {
  return req.body.filters ? req.body.filters : void 0;
}

exports.createBackendRouter = createBackendRouter;
//# sourceMappingURL=router.cjs.js.map
