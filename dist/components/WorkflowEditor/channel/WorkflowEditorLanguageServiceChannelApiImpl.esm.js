class WorkflowEditorLanguageServiceChannelApiImpl {
  constructor(ls) {
    this.ls = ls;
  }
  async kogitoSwfLanguageService__getCompletionItems(args) {
    return this.ls.getCompletionItems(args);
  }
  async kogitoSwfLanguageService__getCodeLenses(args) {
    return this.ls.getCodeLenses(args);
  }
}

export { WorkflowEditorLanguageServiceChannelApiImpl };
//# sourceMappingURL=WorkflowEditorLanguageServiceChannelApiImpl.esm.js.map
