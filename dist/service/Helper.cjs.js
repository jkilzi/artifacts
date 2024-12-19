'use strict';

var fs = require('fs-extra');
var os = require('os');

function _interopDefaultCompat (e) { return e && typeof e === 'object' && 'default' in e ? e : { default: e }; }

var fs__default = /*#__PURE__*/_interopDefaultCompat(fs);
var os__default = /*#__PURE__*/_interopDefaultCompat(os);

async function retryAsyncFunction(args) {
  let result;
  for (let i = 0; i < args.maxAttempts; i++) {
    result = await args.asyncFn();
    if (result !== void 0) {
      return result;
    }
    await new Promise((resolve) => setTimeout(resolve, args.delayMs));
  }
  throw new Error("Exceeded maximum number of retries for async function");
}
async function getWorkingDirectory(config, logger) {
  if (!config.has("backend.workingDirectory")) {
    return os__default.default.tmpdir();
  }
  const workingDirectory = config.getString("backend.workingDirectory");
  try {
    await fs__default.default.access(workingDirectory, fs__default.default.constants.F_OK | fs__default.default.constants.W_OK);
    logger.info(`using working directory: ${workingDirectory}`);
  } catch (err) {
    logger.error(
      `working directory ${workingDirectory} ${err.code === "ENOENT" ? "does not exist" : "is not writable"}`
    );
    throw err;
  }
  return workingDirectory;
}
async function executeWithRetry(action, maxErrors = 15) {
  let response;
  let errorCount = 0;
  const backoff = 5e3;
  while (errorCount < maxErrors) {
    try {
      response = await action();
      if (response.status >= 400) {
        errorCount++;
        await delay(backoff);
      } else {
        return response;
      }
    } catch (e) {
      errorCount++;
      await delay(backoff);
    }
  }
  throw new Error("Unable to execute query.");
}
function delay(time) {
  return new Promise((r) => setTimeout(r, time));
}

exports.delay = delay;
exports.executeWithRetry = executeWithRetry;
exports.getWorkingDirectory = getWorkingDirectory;
exports.retryAsyncFunction = retryAsyncFunction;
//# sourceMappingURL=Helper.cjs.js.map
