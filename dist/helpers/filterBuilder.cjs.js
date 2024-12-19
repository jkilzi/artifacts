'use strict';

var backstagePluginOrchestratorCommon = require('@red-hat-developer-hub/backstage-plugin-orchestrator-common');
var V2Mappings = require('../service/api/mapping/V2Mappings.cjs.js');

function isLogicalFilter(filter) {
  return filter.filters !== void 0;
}
function handleLogicalFilter(introspection, type, filter) {
  if (!filter.operator) return "";
  const subClauses = filter.filters.map(
    (f) => buildFilterCondition(introspection, type, f)
  );
  return `${filter.operator.toLowerCase()}: {${subClauses.join(", ")}}`;
}
function handleBetweenOperator(filter) {
  if (!Array.isArray(filter.value) || filter.value.length !== 2) {
    throw new Error("Between operator requires an array of two elements");
  }
  return `${filter.field}: {${getGraphQLOperator(
    backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Between
  )}: {from: "${filter.value[0]}", to: "${filter.value[1]}"}}`;
}
function handleIsNullOperator(filter) {
  return `${filter.field}: {${getGraphQLOperator(
    backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.IsNull
  )}: ${convertToBoolean(filter.value)}}`;
}
function isEnumFilter(fieldName, type) {
  if (type === "ProcessInstance") {
    if (fieldName === "state") {
      return true;
    }
  }
  return false;
}
function convertEnumValue(fieldName, fieldValue, type) {
  if (type === "ProcessInstance") {
    if (fieldName === "state") {
      const state = backstagePluginOrchestratorCommon.ProcessInstanceStatusDTO[fieldValue];
      if (!state) {
        throw new Error(
          `status ${fieldValue} is not a valid value of ProcessInstanceStatusDTO`
        );
      }
      return V2Mappings.getProcessInstanceStateFromStatusDTOString(state).valueOf();
    }
  }
  throw new Error(
    `Unsupported enum ${fieldName}: can't convert value ${fieldValue}`
  );
}
function isValidEnumOperator(operator) {
  return operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.In || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Eq;
}
function handleBinaryOperator(binaryFilter, fieldDef, type) {
  if (isEnumFilter(binaryFilter.field, type)) {
    if (!isValidEnumOperator(binaryFilter.operator)) {
      throw new Error(
        `Invalid operator ${binaryFilter.operator} for enum field ${binaryFilter.field} filter`
      );
    }
    binaryFilter.value = convertEnumValue(
      binaryFilter.field,
      binaryFilter.value,
      type
    );
  }
  const formattedValue = Array.isArray(binaryFilter.value) ? `[${binaryFilter.value.map((v) => formatValue(binaryFilter.field, v, fieldDef, type)).join(", ")}]` : formatValue(binaryFilter.field, binaryFilter.value, fieldDef, type);
  return `${binaryFilter.field}: {${getGraphQLOperator(
    binaryFilter.operator
  )}: ${formattedValue}}`;
}
function buildFilterCondition(introspection, type, filters) {
  if (!filters) {
    return "";
  }
  if (isLogicalFilter(filters)) {
    return handleLogicalFilter(introspection, type, filters);
  }
  if (!isOperatorSupported(filters.operator)) {
    throw new Error(`Unsopported operator ${filters.operator}`);
  }
  const fieldDef = introspection.find((f) => f.name === filters.field);
  if (!fieldDef) {
    throw new Error(`Can't find field "${filters.field}" definition`);
  }
  if (!isOperatorAllowedForField(filters.operator, fieldDef)) {
    throw new Error(`Unsupported field type ${fieldDef.type.name}`);
  }
  switch (filters.operator) {
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.IsNull:
      return handleIsNullOperator(filters);
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Between:
      return handleBetweenOperator(filters);
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Eq:
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Like:
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.In:
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Gt:
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Gte:
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Lt:
    case backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Lte:
      return handleBinaryOperator(filters, fieldDef, type);
    default:
      throw new Error(`Can't build filter condition`);
  }
}
function isOperatorSupported(operator) {
  return operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Eq || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Like || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.In || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.IsNull || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Gt || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Gte || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Lt || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Lte || operator === backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Between;
}
function isFieldFilterSupported(fieldDef) {
  return fieldDef?.type.name === backstagePluginOrchestratorCommon.TypeName.String;
}
function isOperatorAllowedForField(operator, fieldDef) {
  const allowedOperators = {
    [backstagePluginOrchestratorCommon.TypeName.String]: [
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.In,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Like,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.IsNull,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Eq
    ],
    [backstagePluginOrchestratorCommon.TypeName.Id]: [
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.In,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.IsNull,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Eq
    ],
    [backstagePluginOrchestratorCommon.TypeName.Date]: [
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.IsNull,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Eq,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Gt,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Gte,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Lt,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Lte,
      backstagePluginOrchestratorCommon.FieldFilterOperatorEnum.Between
    ],
    [backstagePluginOrchestratorCommon.TypeName.StringArray]: []
  };
  const allowedForType = allowedOperators[fieldDef.type.name];
  return allowedForType ? allowedForType.includes(operator) : false;
}
function convertToBoolean(value) {
  if (typeof value === "boolean") {
    return value;
  }
  if (typeof value === "string") {
    return value.toLowerCase() === "true";
  }
  if (typeof value === "number") {
    return value === 1;
  }
  return false;
}
function formatValue(fieldName, fieldValue, fieldDef, type) {
  if (!isFieldFilterSupported) {
    throw new Error(`Unsupported field type ${fieldDef.type.name}`);
  }
  if (isEnumFilter(fieldName, type)) {
    return `${fieldValue}`;
  }
  if (fieldDef.type.name === backstagePluginOrchestratorCommon.TypeName.String || fieldDef.type.name === backstagePluginOrchestratorCommon.TypeName.Id || fieldDef.type.name === backstagePluginOrchestratorCommon.TypeName.Date) {
    return `"${fieldValue}"`;
  }
  throw new Error(
    `Failed to format value for ${fieldName} ${fieldValue} with type ${fieldDef.type.name}`
  );
}
function getGraphQLOperator(operator) {
  switch (operator) {
    case "EQ":
      return "equal";
    case "LIKE":
      return "like";
    case "IN":
      return "in";
    case "IS_NULL":
      return "isNull";
    case "GT":
      return "greaterThan";
    case "GTE":
      return "greaterThanEqual";
    case "LT":
      return "lessThan";
    case "LTE":
      return "lessThanEqual";
    // case 'CONTAINS':
    //  return "contains"
    // case 'CONTAINS_ALL':
    // case 'CONTAINS_ANY':
    case "BETWEEN":
      return "between";
    default:
      throw new Error(`Operation "${operator}" not supported`);
  }
}

exports.buildFilterCondition = buildFilterCondition;
//# sourceMappingURL=filterBuilder.cjs.js.map
