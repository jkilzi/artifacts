class DefaultFormApi {
  getFormDecorator(_schema) {
    return (FormComponent) => FormComponent;
  }
}
const defaultFormExtensionsApi = new DefaultFormApi();

export { defaultFormExtensionsApi };
//# sourceMappingURL=DefaultFormApi.esm.js.map
