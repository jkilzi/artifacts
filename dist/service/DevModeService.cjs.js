'use strict';

var fs = require('fs-extra');
var backstagePluginOrchestratorCommon = require('@red-hat-developer-hub/backstage-plugin-orchestrator-common');
var child_process = require('child_process');
var path = require('path');
var GitService = require('./GitService.cjs.js');
var Helper = require('./Helper.cjs.js');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefaultCompat(fs);

const SONATA_FLOW_RESOURCES_PATH = "/home/kogito/serverless-workflow-project/src/main/resources";
class DevModeService {
  constructor(config, logger) {
    this.logger = logger;
    this.connection = this.extractConnectionConfig(config);
    this.gitService = new GitService.GitService(logger, config);
  }
  connection;
  gitService;
  get devModeUrl() {
    if (!this.connection.port) {
      return this.connection.host;
    }
    return `${this.connection.host}:${this.connection.port}`;
  }
  async launchDevMode() {
    await this.loadDevWorkflows();
    const isAlreadyUp = await this.isSonataFlowUp(false, this.devModeUrl);
    if (isAlreadyUp) {
      return true;
    }
    this.launchSonataFlow();
    return await this.isSonataFlowUp(true, this.devModeUrl);
  }
  async isSonataFlowUp(withRetry, endpoint) {
    const healthUrl = `${endpoint}/q/health`;
    this.logger.info(`Checking SonataFlow health at: ${healthUrl}`);
    try {
      const response = await Helper.executeWithRetry(
        () => fetch(healthUrl),
        withRetry ? 15 : 1
      );
      if (response.ok) {
        this.logger.info("SonataFlow is up and running");
        return true;
      }
    } catch (e) {
      this.logger.error(`Error when checking SonataFlow health: ${e}`);
    }
    return false;
  }
  launchSonataFlow() {
    const launcherCmd = this.createLauncherCommand();
    this.logger.info(
      `Auto starting SonataFlow through: ${launcherCmd.command} ${launcherCmd.args.join(" ")}`
    );
    const process = child_process.spawn(launcherCmd.command, launcherCmd.args, {
      shell: false
    });
    process.on("close", (code) => {
      this.logger.info(`SonataFlow process exited with code ${code}`);
    });
    process.on("exit", (code) => {
      this.logger.info(`SonataFlow process exited with code ${code}`);
    });
    process.on("error", (error) => {
      this.logger.error(`SonataFlow process error: ${error}`);
    });
  }
  createLauncherCommand() {
    const resourcesAbsPath = path.resolve(
      path.join(this.connection.resourcesPath, backstagePluginOrchestratorCommon.DEFAULT_WORKFLOWS_PATH)
    );
    const launcherArgs = [
      "run",
      "--name",
      "backstage-internal-sonataflow",
      "--add-host",
      "host.docker.internal:host-gateway"
    ];
    launcherArgs.push("-e", `QUARKUS_HTTP_PORT=${this.connection.port}`);
    launcherArgs.push("-p", `${this.connection.port}:${this.connection.port}`);
    launcherArgs.push("-e", `KOGITO_SERVICE_URL=${this.devModeUrl}`);
    launcherArgs.push(
      "-v",
      `${resourcesAbsPath}:${SONATA_FLOW_RESOURCES_PATH}:Z`
    );
    launcherArgs.push("-e", "KOGITO.CODEGEN.PROCESS.FAILONERROR=false");
    launcherArgs.push(
      "-e",
      `QUARKUS_EMBEDDED_POSTGRESQL_DATA_DIR=${this.connection.persistencePath}`
    );
    launcherArgs.push(this.connection.containerImage);
    return {
      command: "docker",
      args: launcherArgs
    };
  }
  extractConnectionConfig(config) {
    const host = config.getOptionalString("orchestrator.sonataFlowService.baseUrl") ?? backstagePluginOrchestratorCommon.DEFAULT_SONATAFLOW_BASE_URL;
    const port = config.getOptionalNumber(
      "orchestrator.sonataFlowService.port"
    );
    const resourcesPath = config.getOptionalString(
      "orchestrator.sonataFlowService.workflowsSource.localPath"
    ) ?? "";
    const containerImage = config.getOptionalString("orchestrator.sonataFlowService.container") ?? backstagePluginOrchestratorCommon.DEFAULT_SONATAFLOW_CONTAINER_IMAGE;
    const persistencePath = config.getOptionalString(
      "orchestrator.sonataFlowService.persistence.path"
    ) ?? backstagePluginOrchestratorCommon.DEFAULT_SONATAFLOW_PERSISTENCE_PATH;
    const repoUrl = config.getOptionalString(
      "orchestrator.sonataFlowService.workflowsSource.gitRepositoryUrl"
    ) ?? "";
    return {
      host,
      port,
      containerImage,
      resourcesPath,
      persistencePath,
      repoUrl
    };
  }
  async loadDevWorkflows() {
    if (!this.connection.repoUrl) {
      this.logger.info(
        "No Git repository configured. Skipping dev workflows loading."
      );
      return;
    }
    this.logger.info(`Loading dev workflows from ${this.connection.repoUrl}`);
    const localPath = this.connection.resourcesPath;
    if (await fs__default.default.pathExists(localPath)) {
      this.logger.info(`Path ${localPath} already exists. Skipping clone.`);
      return;
    }
    await this.gitService.clone(this.connection.repoUrl, localPath);
  }
}

exports.DevModeService = DevModeService;
//# sourceMappingURL=DevModeService.cjs.js.map