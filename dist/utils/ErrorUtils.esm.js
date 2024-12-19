import { isError } from '@backstage/errors';

const getErrorObject = (err) => {
  if (isError(err)) {
    return err;
  }
  if (typeof err === "string") {
    return new Error(err);
  }
  return new Error("Unexpected error");
};

export { getErrorObject };
//# sourceMappingURL=ErrorUtils.esm.js.map
