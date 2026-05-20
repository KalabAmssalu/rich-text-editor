import type { ReactNode } from "react";

import type {
  RichTextEditorDocumentExport,
  RichTextEditorExportFormat,
} from "@/lexical/export-editor-document";
import type {
  MentionEntry,
  MentionIconName,
  MentionMenuNode,
  MentionSearchPatient,
} from "@/lexical/mention-types";

export type { RichTextEditorDocumentExport, RichTextEditorExportFormat };
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

export const DEFAULT_AUTOCOMPLETE_STORAGE_KEY =
  "emr-rich-text-autocomplete-enabled";

export interface RichTextEditorAutocompleteConfig {
  /** Domain-specific terms (host-provided). */
  additionalTerms?: string[];
  /** Built-in English dictionary (default: true when autocomplete is enabled). */
  enableEnglishDictionary?: boolean;
  /** `localStorage` key for the autocomplete toggle (default: {@link DEFAULT_AUTOCOMPLETE_STORAGE_KEY}). */
  localStorageKey?: string;
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

export interface RichTextEditorSlotsConfig {
  /** Replaces the default AI assistant placeholder when `aiAssistant` is in the status bar. */
  aiAssistant?: ReactNode;
  /** Replaces the default voice translator placeholder when `voiceTranslator` is in the status bar. */
  voiceTranslator?: ReactNode;
  /** Replaces the default audit log placeholder when `auditLog` is in the status bar. */
  auditLog?: ReactNode;
}

export interface RichTextEditorConfig {
  mentions?: RichTextEditorMentionsConfig;
  autocomplete?: RichTextEditorAutocompleteConfig;
  templates?: RichTextEditorTemplatesConfig;
  signer?: RichTextEditorSignerConfig;
  tools?: RichTextEditorToolsConfig;
  slots?: RichTextEditorSlotsConfig;
  /** Called with interim/final speech recognition transcripts. */
  onSpeechTranscript?: (transcript: string, isFinal: boolean) => void;
}

export interface RichTextEditorBoxProps {
  config?: RichTextEditorConfig;
  namespace?: string;
  /**
   * When this identity changes (e.g. SOAP note id), the Lexical composer remounts and reloads `value` / `defaultValue`.
   * Use when switching notes; omit if you rely on conditional rendering `{note && <Editor />}` only.
   */
  documentKey?: string;
  id?: string;
  label?: string;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  value?: string | null;
  defaultValue?: string | null;
  onChange?: (document: RichTextEditorDocumentExport) => void;
  /**
   * Debounce `onChange` (ms). `0` = fire on every update (default).
   */
  onChangeDebounceMs?: number;
  /**
   * What to include in `onChange` payloads. Default: `'both'`.
   * Omitted formats are returned as empty strings.
   */
  exportFormat?: RichTextEditorExportFormat;
  /**
   * When true, apply external `value` updates while mounted (default: only when editor is not focused).
   * Prefer `documentKey` when switching entire documents.
   */
  syncValue?: boolean;
  minHeightClassName?: string;
  mentions?: RichTextEditorMentionsConfig;
  autocomplete?: RichTextEditorAutocompleteConfig;
  templates?: RichTextEditorTemplatesConfig;
  tools?: RichTextEditorToolsConfig;
  signer?: RichTextEditorSignerConfig;
  slots?: RichTextEditorSlotsConfig;
  onSpeechTranscript?: (transcript: string, isFinal: boolean) => void;
}
