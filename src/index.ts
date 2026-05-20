export { RichTextEditorBox } from "./core/RichTextEditorBox";
export { mergeEditorConfig } from "./core/merge-editor-config";
export { normalizeInitialLexicalJson } from "./core/normalize-initial-editor-json";
export { createRichTextEditorInitialConfig } from "./config/editor-config";
export { buildMentionSearchIndex } from "./lexical/mention-schema-data";
export { DEFAULT_AUTOCOMPLETE_STORAGE_KEY } from "./core/types";
export type {
  RichTextEditorBoxProps,
  RichTextEditorConfig,
  RichTextEditorDocumentExport,
  RichTextEditorExportFormat,
  RichTextEditorMentionsConfig,
  RichTextEditorAutocompleteConfig,
  RichTextEditorTemplatesConfig,
  RichTextEditorToolsConfig,
  RichTextEditorSignerConfig,
  RichTextEditorSlotsConfig,
  RichTextEditorToolId,
  StatusBarToolId,
  ToolbarToolId,
  NoteTemplate,
  MentionMenuNode,
  MentionEntry,
  MentionIconName,
  MentionSearchPatient,
} from "./core/types";
