import React, { forwardRef, useState, useMemo, useCallback, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApi, configApiRef, useRouteRef } from '@backstage/core-plugin-api';
import { EditorEnvelopeLocator, EnvelopeMapping, EnvelopeContentType, ChannelType } from '@kie-tools-core/editor/dist/api';
import { StateControl } from '@kie-tools-core/editor/dist/channel';
import { useEditorRef, EmbeddedEditorChannelApiImpl, EmbeddedEditor } from '@kie-tools-core/editor/dist/embedded';
import { usePromiseState, PromiseStateWrapper } from '@kie-tools-core/react-hooks/dist/PromiseState';
import { useCancelableEffect } from '@kie-tools-core/react-hooks/dist/useCancelableEffect';
import { SwfCombinedEditorChannelApiImpl } from '@kie-tools/serverless-workflow-combined-editor/dist/channel/SwfCombinedEditorChannelApiImpl';
import { SwfPreviewOptionsChannelApiImpl } from '@kie-tools/serverless-workflow-combined-editor/dist/channel/SwfPreviewOptionsChannelApiImpl';
import { DiagnosticSeverity } from 'vscode-languageserver-types';
import { fromWorkflowSource, extractWorkflowFormat, toWorkflowString } from '@red-hat-developer-hub/backstage-plugin-orchestrator-common';
import 'axios';
import { orchestratorApiRef } from '../../api/api.esm.js';
import { workflowDefinitionsRouteRef } from '../../routes.esm.js';
import { WorkflowEditorLanguageService } from './channel/WorkflowEditorLanguageService.esm.js';
import { WorkflowEditorLanguageServiceChannelApiImpl } from './channel/WorkflowEditorLanguageServiceChannelApiImpl.esm.js';

var EditorViewKind = /* @__PURE__ */ ((EditorViewKind2) => {
  EditorViewKind2["DIAGRAM_VIEWER"] = "DIAGRAM_VIEWER";
  EditorViewKind2["EXTENDED_DIAGRAM_VIEWER"] = "EXTENDED_DIAGRAM_VIEWER";
  EditorViewKind2["RUNTIME"] = "RUNTIME";
  return EditorViewKind2;
})(EditorViewKind || {});
const LOCALE = "en";
const RefForwardingWorkflowEditor = (props, forwardedRef) => {
  const orchestratorApi = useApi(orchestratorApiRef);
  const configApi = useApi(configApiRef);
  const contextPath = `${configApi.getString(
    "backend.baseUrl"
  )}/api/orchestrator/static/generated/envelope`;
  const { workflowId, kind, format, editorMode = "full" } = props;
  const { editor, editorRef } = useEditorRef();
  const [embeddedFile, setEmbeddedFile] = useState();
  const [workflowDefinitionPromise, setWorkflowDefinitionPromise] = usePromiseState();
  const [canRender, setCanRender] = useState(false);
  const [ready, setReady] = useState(false);
  const navigate = useNavigate();
  const viewWorkflowLink = useRouteRef(workflowDefinitionsRouteRef);
  const currentProcessInstance = useMemo(() => {
    if (kind !== "RUNTIME" /* RUNTIME */) {
      return void 0;
    }
    return props.processInstance;
  }, [props, kind]);
  const envelopeLocator = useMemo(
    () => new EditorEnvelopeLocator(window.location.origin, [
      new EnvelopeMapping({
        type: "workflow",
        filePathGlob: "**/*.sw.+(json|yml|yaml)",
        resourcesPathPrefix: contextPath,
        envelopeContent: {
          type: EnvelopeContentType.PATH,
          path: `${contextPath}/serverless-workflow-combined-editor-envelope.html`
        }
      })
    ]),
    [contextPath]
  );
  const stateControl = useMemo(() => new StateControl(), []);
  const languageService = useMemo(() => {
    if (!embeddedFile) {
      return void 0;
    }
    const workflowEditorLanguageService = new WorkflowEditorLanguageService();
    return workflowEditorLanguageService.getLs(embeddedFile.path);
  }, [embeddedFile]);
  const validate = useCallback(async () => {
    if (!editor || !languageService || !embeddedFile) {
      return [];
    }
    const content = await editor.getContent();
    const lsDiagnostics = await languageService.getDiagnostics({
      content,
      uriPath: embeddedFile.path
    });
    return lsDiagnostics.map(
      (lsDiagnostic) => ({
        path: "",
        // empty to not group them by path, as we're only validating one file.
        severity: lsDiagnostic.severity === DiagnosticSeverity.Error ? "ERROR" : "WARNING",
        message: `${lsDiagnostic.message} [Line ${lsDiagnostic.range.start.line + 1}]`,
        type: "PROBLEM",
        position: {
          startLineNumber: lsDiagnostic.range.start.line + 1,
          startColumn: lsDiagnostic.range.start.character + 1,
          endLineNumber: lsDiagnostic.range.end.line + 1,
          endColumn: lsDiagnostic.range.end.character + 1
        }
      })
    );
  }, [editor, embeddedFile, languageService]);
  const getContent = useCallback(async () => editor?.getContent(), [editor]);
  const customEditorApi = useMemo(() => {
    if (!embeddedFile || !languageService) {
      return void 0;
    }
    const defaultApiImpl = new EmbeddedEditorChannelApiImpl(
      stateControl,
      embeddedFile,
      LOCALE,
      {
        kogitoEditor_ready: () => {
          setReady(true);
        }
      }
    );
    const workflowEditorLanguageServiceChannelApiImpl = new WorkflowEditorLanguageServiceChannelApiImpl(languageService);
    const workflowEditorPreviewOptionsChannelApiImpl = new SwfPreviewOptionsChannelApiImpl({
      editorMode,
      defaultWidth: "50%"
    });
    return new SwfCombinedEditorChannelApiImpl({
      defaultApiImpl,
      swfLanguageServiceChannelApiImpl: workflowEditorLanguageServiceChannelApiImpl,
      swfPreviewOptionsChannelApiImpl: workflowEditorPreviewOptionsChannelApiImpl
    });
  }, [editorMode, embeddedFile, languageService, stateControl]);
  useImperativeHandle(forwardedRef, () => {
    return {
      validate,
      getContent,
      workflowDefinition: workflowDefinitionPromise.data,
      isReady: ready
    };
  }, [validate, getContent, workflowDefinitionPromise.data, ready]);
  useCancelableEffect(
    useCallback(
      ({ canceled }) => {
        setCanRender(false);
        orchestratorApi.getWorkflowSource(workflowId).then((source) => {
          if (canceled.get()) {
            return;
          }
          const definition = fromWorkflowSource(source.data);
          setWorkflowDefinitionPromise({ data: definition });
          const workflowFormat = extractWorkflowFormat(source.data);
          if (format && workflowId && format !== workflowFormat) {
            const link = viewWorkflowLink({
              workflowId,
              format: workflowFormat
            });
            navigate(link, { replace: true });
            return;
          }
          const filename = `workflow.sw.${workflowFormat}`;
          setEmbeddedFile({
            path: filename,
            getFileContents: async () => toWorkflowString(definition, workflowFormat),
            isReadOnly: true,
            fileExtension: workflowFormat,
            fileName: filename
          });
          setCanRender(true);
        }).catch((e) => {
          setWorkflowDefinitionPromise({ error: e });
        });
      },
      [
        orchestratorApi,
        workflowId,
        setWorkflowDefinitionPromise,
        format,
        viewWorkflowLink,
        navigate
      ]
    )
  );
  const embeddedEditorWrapper = useMemo(
    () => /* @__PURE__ */ React.createElement(
      PromiseStateWrapper,
      {
        promise: workflowDefinitionPromise,
        resolved: (workflowDefinition) => canRender && embeddedFile && /* @__PURE__ */ React.createElement(
          EmbeddedEditor,
          {
            key: currentProcessInstance?.id ?? workflowDefinition.id,
            ref: editorRef,
            file: embeddedFile,
            channelType: ChannelType.ONLINE,
            editorEnvelopeLocator: envelopeLocator,
            customChannelApiImpl: customEditorApi,
            stateControl,
            locale: LOCALE,
            isReady: ready
          }
        )
      }
    ),
    [
      canRender,
      currentProcessInstance?.id,
      customEditorApi,
      editorRef,
      embeddedFile,
      envelopeLocator,
      ready,
      stateControl,
      workflowDefinitionPromise
    ]
  );
  return embeddedEditorWrapper;
};
const WorkflowEditor = forwardRef(RefForwardingWorkflowEditor);

export { EditorViewKind, WorkflowEditor };
//# sourceMappingURL=WorkflowEditor.esm.js.map
