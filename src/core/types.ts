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
  terms: string[];
  enableDictionary?: boolean;
}

export interface NoteTemplate {
  id: string;
  title: string;
  description: string;
  body: string;
}

export interface RichTextEditorTemplatesConfig {
  templates: NoteTemplate[];
  storageKey?: string;
}

export type RichTextEditorToolId =
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

export interface RichTextEditorToolsConfig {
  statusBar?: RichTextEditorToolId[] | boolean;
  toolbar?: boolean;
  mentions?: boolean;
}

export interface RichTextEditorSignerConfig {
  name: string;
  title?: string;
}

export interface RichTextEditorBoxProps {
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
