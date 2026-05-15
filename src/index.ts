export { RichTextEditorBox } from "./core/RichTextEditorBox";
export { createRichTextEditorInitialConfig } from "./config/editor-config";
export { buildMentionSearchIndex } from "./lexical/mention-schema-data";
export { MEDICAL_AUTOCOMPLETE_TERMS } from "./lexical/autocomplete-corpus";
export type {
  RichTextEditorBoxProps,
  RichTextEditorDocumentExport,
  RichTextEditorMentionsConfig,
  RichTextEditorAutocompleteConfig,
  RichTextEditorTemplatesConfig,
  RichTextEditorToolsConfig,
  RichTextEditorToolId,
  RichTextEditorSignerConfig,
  NoteTemplate,
  MentionMenuNode,
  MentionEntry,
  MentionIconName,
  MentionSearchPatient,
} from "./core/types";
