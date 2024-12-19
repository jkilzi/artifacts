import get from 'lodash/get';
import set from 'lodash/set';

const getSchemaDefinition = (ref, rootSchema) => {
  const path = ref.replace(/^#\//, "").replace(/\//g, ".");
  return get(rootSchema, path);
};
const getStringAfterDot = (input) => input.startsWith(".") ? input.slice(1) : input;
function replaceSparseArrayElementsdWithEmptyObject(value) {
  if (Array.isArray(value)) {
    return [...value].map((item) => {
      return item ? replaceSparseArrayElementsdWithEmptyObject(item) : {};
    });
  } else if (value && typeof value === "object") {
    return Object.keys(value).reduce(
      (acc, key) => {
        acc[key] = replaceSparseArrayElementsdWithEmptyObject(value[key]);
        return acc;
      },
      {}
    );
  }
  return value;
}
function extractUiSchema(mixedSchema) {
  const rootSchema = mixedSchema;
  const result = {};
  const processObjectProperties = (properties, path) => {
    for (const [key, value] of Object.entries(properties)) {
      processObject(value, `${path}.${key}`);
    }
  };
  const processObject = (curSchema, path) => {
    if (typeof curSchema === "boolean") {
      return;
    }
    if (curSchema.$ref) {
      processObject(getSchemaDefinition(curSchema.$ref, rootSchema), path);
    } else if (curSchema.properties) {
      processObjectProperties(curSchema.properties, path);
    } else if (curSchema.items) {
      processArraySchema(curSchema, path);
    } else {
      processLeafSchema(curSchema, path);
    }
    processComposedSchema(curSchema, path);
  };
  const processLeafSchema = (leafSchema, path) => {
    for (const [subSchemaKey, value] of Object.entries(leafSchema)) {
      if (subSchemaKey.startsWith("ui:")) {
        set(result, getStringAfterDot(`${path}.${subSchemaKey}`), value);
      }
    }
  };
  const processArrayItems = (items, path) => {
    for (let i = 0; i < items.length; ++i) {
      processObject(items[i], `${path}[${i}]`);
    }
  };
  const processArraySchema = (schema, path) => {
    if (Array.isArray(schema.items)) {
      processArrayItems(schema.items, `${path}.items`);
    } else if (typeof schema.items === "object") {
      processObject(schema.items, `${path}.items`);
    }
    if (schema.additionalItems && typeof schema.additionalItems === "object") {
      processObject(schema.additionalItems, `${path}.additinalItems`);
    }
  };
  const processComposedSchema = (curSchema, path) => {
    if (curSchema.anyOf) {
      processArrayItems(curSchema.anyOf, `${path}.anyOf`);
    } else if (curSchema.oneOf) {
      processArrayItems(curSchema.oneOf, `${path}.oneOf`);
    } else if (curSchema.allOf) {
      processArrayItems(curSchema.allOf, `${path}.allOf`);
    } else if (curSchema.then) {
      processObject(curSchema.then, `${path}`);
      if (curSchema.else) {
        processObject(curSchema.else, `${path}`);
      }
    }
  };
  processObject(mixedSchema, "");
  return replaceSparseArrayElementsdWithEmptyObject(result);
}
const addReadonly = (data, uiSchema, isMultiStep) => {
  if (!isMultiStep) {
    for (const key of Object.keys(data)) {
      uiSchema[key] = {
        ...uiSchema[key],
        "ui:readonly": true
      };
    }
    return;
  }
  for (const [stepKey, stepValue] of Object.entries(data)) {
    uiSchema[stepKey] = {
      ...uiSchema[stepKey]
    };
    for (const key of Object.keys(stepValue)) {
      uiSchema[stepKey][key] = {
        ...uiSchema[stepKey][key],
        "ui:readonly": true
      };
    }
  }
};
const addFocusOnFirstElement = (schema, uiSchema, isMultiStep) => {
  if (!schema.properties) {
    return;
  }
  if (!isMultiStep) {
    const firstKey = Object.keys(schema.properties)[0];
    uiSchema[firstKey] = {
      ...uiSchema[firstKey],
      "ui:autofocus": true
    };
  }
  for (const [stepKey, subSchema] of Object.entries(schema.properties)) {
    if (typeof subSchema !== "object") {
      return;
    }
    const _subSchema = subSchema.$ref ? getSchemaDefinition(subSchema.$ref, schema) : subSchema;
    if (!_subSchema.properties) {
      return;
    }
    const subSchemaFirstKey = Object.keys(_subSchema.properties)[0];
    uiSchema[stepKey] = {
      ...uiSchema[stepKey],
      [subSchemaFirstKey]: {
        ...uiSchema[stepKey]?.[subSchemaFirstKey],
        "ui:autofocus": true
      }
    };
  }
};
const generateUiSchema = (schema, isMultiStep, readonlyData) => {
  const uiSchema = extractUiSchema(schema);
  if (readonlyData) {
    addReadonly(readonlyData, uiSchema, isMultiStep);
  }
  addFocusOnFirstElement(schema, uiSchema, isMultiStep);
  return uiSchema;
};

export { generateUiSchema as default };
//# sourceMappingURL=generateUiSchema.esm.js.map
