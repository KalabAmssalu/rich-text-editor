import type { RichTextEditorDocumentExport } from "@/lexical/export-editor-document";
import type {
  MentionEntry,
  MentionIconName,
  MentionMenuNode,
  MentionSearchPatient,
} from "@/lexical/mention-types";

export type { RichTextEditorDocumentExport };
export type {
  MentionEntry,
  MentionIconName,
  MentionMenuNode,
  MentionSearchPatient,
};

export interface RichTextEditorMentionsConfig {
  categoryTree: MentionMenuNode[];
  searchIndex?: MentionEntry[];
  patients?: MentionSearchPatient[];
  activePatient?: { id: string; name: string; mrn?: string };
}

export interface RichTextEditorAutocompleteConfig {
  /** Domain-specific terms (host-provided). */
  additionalTerms?: string[];
  /** Built-in English dictionary (default: true when autocomplete is enabled). */
  enableEnglishDictionary?: boolean;
}

export interface NoteTemplate {
  id: string;
  title: string;
  description: string;
  body: string;
}

export interface RichTextEditorTemplatesConfig {
  items: NoteTemplate[];
  customItems?: NoteTemplate[];
  onCustomItemsChange?: (templates: NoteTemplate[]) => void;
}

export type StatusBarToolId =
  | "copyAll"
  | "autocompleteToggle"
  | "templates"
  | "signature"
  | "speechToText"
  | "aiAssistant"
  | "voiceTranslator"
  | "importExport"
  | "markdown"
  | "editMode"
  | "clear"
  | "auditLog"
  | "characterCount";

export type ToolbarToolId =
  | "history"
  | "blockFormat"
  | "elementFormat"
  | "fontFamily"
  | "fontSize"
  | "fontColor"
  | "fontBackground"
  | "fontFormat"
  | "subSuper"
  | "clearFormatting"
  | "link"
  | "insert";

/** @deprecated Use StatusBarToolId */
export type RichTextEditorToolId = StatusBarToolId;

export interface RichTextEditorToolsConfig {
  toolbar?: ToolbarToolId[] | boolean;
  statusBar?: StatusBarToolId[] | boolean;
  /** When false, disables @ mentions even if `mentions` config is provided. */
  mentions?: boolean;
}

export interface RichTextEditorSignerConfig {
  name: string;
  title?: string;
}

export interface RichTextEditorConfig {
  mentions?: RichTextEditorMentionsConfig;
  autocomplete?: RichTextEditorAutocompleteConfig;
  templates?: RichTextEditorTemplatesConfig;
  signer?: RichTextEditorSignerConfig;
  tools?: RichTextEditorToolsConfig;
}

export interface RichTextEditorBoxProps {
  config?: RichTextEditorConfig;
  namespace?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (document: RichTextEditorDocumentExport) => void;
  minHeightClassName?: string;
  mentions?: RichTextEditorMentionsConfig;
  autocomplete?: RichTextEditorAutocompleteConfig;
  templates?: RichTextEditorTemplatesConfig;
  tools?: RichTextEditorToolsConfig;
  signer?: RichTextEditorSignerConfig;
}
