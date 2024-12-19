import { Draft07 } from 'json-schema-library';

function isJsonObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function processSchema(key, value, schema, formState) {
  const parsedSchema = new Draft07(schema);
  const definitionInSchema = key === "" ? schema : parsedSchema.getSchema({
    pointer: `#/${key}`,
    data: formState
  });
  const name = definitionInSchema?.title ?? key;
  if (definitionInSchema) {
    if (definitionInSchema["ui:widget"] === "password") {
      return { [name]: "******" };
    }
    if (isJsonObject(value)) {
      const nestedValue = Object.entries(value).reduce(
        (prev, [nestedKey, _nestedValue]) => {
          const curKey = key ? `${key}/${nestedKey}` : nestedKey;
          return {
            ...prev,
            ...processSchema(curKey, _nestedValue, schema, formState)
          };
        },
        {}
      );
      return { [name]: nestedValue };
    }
  }
  return { [name]: value };
}
function generateReviewTableData(schema, data) {
  schema.title = "";
  const result = processSchema("", data, schema, data);
  return result[""];
}

export { generateReviewTableData as default, isJsonObject, processSchema };
//# sourceMappingURL=generateReviewTableData.esm.js.map
