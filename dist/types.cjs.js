'use strict';

const isJsonObjectSchema = (schema) => typeof schema === "object" && !!schema.properties && Object.values(schema.properties).filter(
  (curSchema) => typeof curSchema !== "object"
).length === 0;
const isComposedSchema = (schema) => !!schema.properties && Object.values(schema.properties).filter(
  (curSchema) => !isJsonObjectSchema(curSchema)
).length === 0;
var WorkflowCategory = /* @__PURE__ */ ((WorkflowCategory2) => {
  WorkflowCategory2["ASSESSMENT"] = "assessment";
  WorkflowCategory2["INFRASTRUCTURE"] = "infrastructure";
  return WorkflowCategory2;
})(WorkflowCategory || {});

exports.WorkflowCategory = WorkflowCategory;
exports.isComposedSchema = isComposedSchema;
exports.isJsonObjectSchema = isJsonObjectSchema;
//# sourceMappingURL=types.cjs.js.map
