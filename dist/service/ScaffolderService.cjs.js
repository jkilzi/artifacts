'use strict';

var backendCommon = require('@backstage/backend-common');
var integration = require('@backstage/integration');
var pluginScaffolderBackend = require('@backstage/plugin-scaffolder-backend');
var fs = require('fs-extra');
var crypto = require('crypto');
var path = require('path');
var stream = require('stream');
var Helper = require('./Helper.cjs.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
var path__default = /*#__PURE__*/_interopDefaultCompat(path);

class ScaffolderService {
  constructor(logger, config, catalogApi, urlReader) {
    this.logger = logger;
    this.config = config;
    this.catalogApi = catalogApi;
    this.urlReader = urlReader;
    this.actionRegistry = new pluginScaffolderBackend.TemplateActionRegistry();
  }
  actionRegistry;
  streamLogger = new stream.PassThrough();
  loadActions() {
    const actions = [
      ...pluginScaffolderBackend.createBuiltinActions({
        integrations: integration.ScmIntegrations.fromConfig(this.config),
        catalogClient: this.catalogApi,
        reader: this.urlReader,
        config: this.config
      })
    ];
    actions.forEach((a) => this.actionRegistry.register(a));
  }
  getAction(id) {
    return this.actionRegistry.get(id);
  }
  async executeAction(actionExecutionContext) {
    if (this.actionRegistry.list().length === 0) {
      this.loadActions();
    }
    const action = this.getAction(
      actionExecutionContext.actionId
    );
    const stepOutput = {};
    let workspacePath;
    try {
      const workingDirectory = await Helper.getWorkingDirectory(
        this.config,
        this.logger
      );
      workspacePath = path__default.default.join(
        workingDirectory,
        actionExecutionContext.instanceId ?? crypto.randomUUID()
      );
    } catch (err) {
      this.logger.error(
        `Error getting working directory to execute action ${actionExecutionContext.actionId}`,
        err
      );
      throw err;
    }
    const actionContext = {
      input: actionExecutionContext.input,
      workspacePath,
      // TODO: Move this to LoggerService after scaffolder-node moves to LoggerService
      // https://github.com/backstage/backstage/issues/26933
      logger: backendCommon.loggerToWinstonLogger(this.logger),
      logStream: this.streamLogger,
      createTemporaryDirectory: async () => await fs__default.default.mkdtemp(`${workspacePath}_step-${0}-`),
      output(name, value) {
        stepOutput[name] = value;
      },
      getInitiatorCredentials: async () => {
        return {
          $$type: "@backstage/BackstageCredentials",
          principal: "mock-principal"
        };
      },
      checkpoint: async (key, fn) => {
        this.logger.info(`Orchestrator ScaffolderService checkpoint ${key}`);
        return fn();
      }
    };
    await action.handler(actionContext);
    return stepOutput;
  }
}

exports.ScaffolderService = ScaffolderService;
//# sourceMappingURL=ScaffolderService.cjs.js.map
