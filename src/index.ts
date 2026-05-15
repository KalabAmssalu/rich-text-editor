export { RichTextEditorBox } from "./core/RichTextEditorBox";
export { mergeEditorConfig } from "./core/merge-editor-config";
export { createRichTextEditorInitialConfig } from "./config/editor-config";
export { buildMentionSearchIndex } from "./lexical/mention-schema-data";
export type {
  RichTextEditorBoxProps,
  RichTextEditorConfig,
  RichTextEditorDocumentExport,
  RichTextEditorMentionsConfig,
  RichTextEditorAutocompleteConfig,
  RichTextEditorTemplatesConfig,
  RichTextEditorToolsConfig,
  RichTextEditorSignerConfig,
  RichTextEditorToolId,
  StatusBarToolId,
  ToolbarToolId,
  NoteTemplate,
  MentionMenuNode,
  MentionEntry,
  MentionIconName,
  MentionSearchPatient,
} from "./core/types";
