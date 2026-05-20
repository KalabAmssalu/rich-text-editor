"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { buildMentionSearchIndex } from "@/lexical/mention-schema-data";
import type { MentionsRuntimeConfig } from "@/lexical/mention-types";

import type {
  RichTextEditorAutocompleteConfig,
  RichTextEditorConfig,
  RichTextEditorMentionsConfig,
  RichTextEditorSignerConfig,
  RichTextEditorSlotsConfig,
  RichTextEditorTemplatesConfig,
  RichTextEditorToolsConfig,
  StatusBarToolId,
  ToolbarToolId,
} from "./types";

const ALL_TOOLBAR_TOOLS: ToolbarToolId[] = [
  "history",
  "blockFormat",
  "elementFormat",
  "fontFamily",
  "fontSize",
  "fontColor",
  "fontBackground",
  "fontFormat",
  "subSuper",
  "clearFormatting",
  "link",
  "insert",
];

/** Full status bar set; placeholder tools (`aiAssistant`, `voiceTranslator`, `auditLog`) are opt-in via an explicit array or {@link RichTextEditorSlotsConfig}. */
const ALL_STATUS_BAR_TOOLS: StatusBarToolId[] = [
  "characterCount",
  "copyAll",
  "autocompleteToggle",
  "templates",
  "signature",
  "speechToText",
  "importExport",
  "markdown",
  "editMode",
  "clear",
];

const DEFAULT_STATUS_BAR_TOOLS: StatusBarToolId[] = [
  "characterCount",
  "copyAll",
  "importExport",
  "markdown",
  "editMode",
  "clear",
];

function resolveToolbarTools(
  tools: RichTextEditorToolsConfig | undefined,
): Set<ToolbarToolId> {
  if (tools?.toolbar === false) {
    return new Set();
  }
  if (tools?.toolbar === true) {
    return new Set(ALL_TOOLBAR_TOOLS);
  }
  if (Array.isArray(tools?.toolbar)) {
    return new Set(tools.toolbar);
  }
  return new Set(ALL_TOOLBAR_TOOLS);
}

function resolveStatusBarTools(
  tools: RichTextEditorToolsConfig | undefined,
  hasAutocomplete: boolean,
  hasTemplates: boolean,
): Set<StatusBarToolId> {
  if (tools?.statusBar === false) {
    return new Set();
  }
  if (tools?.statusBar === true) {
    return new Set(ALL_STATUS_BAR_TOOLS);
  }
  if (Array.isArray(tools?.statusBar)) {
    return new Set(tools.statusBar);
  }
  const set = new Set(DEFAULT_STATUS_BAR_TOOLS);
  if (hasAutocomplete) set.add("autocompleteToggle");
  if (hasTemplates) set.add("templates");
  return set;
}

function resolveMentions(
  mentions: RichTextEditorMentionsConfig | undefined,
): MentionsRuntimeConfig | null {
  if (!mentions) {
    return null;
  }

  const patients = mentions.patients ?? [];
  const searchIndex =
    mentions.searchIndex ??
    buildMentionSearchIndex(mentions.categoryTree, { patients });

  return {
    categoryTree: mentions.categoryTree,
    searchIndex,
    patients,
    activePatient: mentions.activePatient,
  };
}

function resolveTemplates(
  templates: RichTextEditorTemplatesConfig | undefined,
): RichTextEditorTemplatesConfig | null {
  if (!templates) {
    return null;
  }
  return {
    items: templates.items ?? [],
    customItems: templates.customItems ?? [],
    onCustomItemsChange: templates.onCustomItemsChange,
  };
}

function resolveAutocomplete(
  autocomplete: RichTextEditorAutocompleteConfig | undefined,
): RichTextEditorAutocompleteConfig | null {
  if (!autocomplete) {
    return null;
  }
  return {
    additionalTerms: autocomplete.additionalTerms ?? [],
    enableEnglishDictionary: autocomplete.enableEnglishDictionary ?? true,
    localStorageKey: autocomplete.localStorageKey,
  };
}

export interface RichTextEditorConfigValue {
  mentions: MentionsRuntimeConfig | null;
  showMentions: boolean;
  autocomplete: RichTextEditorAutocompleteConfig | null;
  showAutocomplete: boolean;
  templates: RichTextEditorTemplatesConfig | null;
  signer: RichTextEditorSignerConfig;
  slots: RichTextEditorSlotsConfig;
  onSpeechTranscript?: (transcript: string, isFinal: boolean) => void;
  showToolbar: boolean;
  toolbarTools: Set<ToolbarToolId>;
  isToolbarToolEnabled: (id: ToolbarToolId) => boolean;
  statusBarTools: Set<StatusBarToolId>;
  isStatusBarToolEnabled: (id: StatusBarToolId) => boolean;
}

const RichTextEditorConfigContext =
  createContext<RichTextEditorConfigValue | null>(null);

export function RichTextEditorConfigProvider({
  children,
  config,
}: {
  children: ReactNode;
  config: RichTextEditorConfig;
}) {
  const value = useMemo((): RichTextEditorConfigValue => {
    const mentionsConfig = config.mentions;
    const resolvedMentions = resolveMentions(mentionsConfig);
    const showMentions =
      mentionsConfig !== undefined && config.tools?.mentions !== false;

    const autocomplete = resolveAutocomplete(config.autocomplete);
    const showAutocomplete = autocomplete !== null;

    const templates = resolveTemplates(config.templates);
    const hasTemplates =
      (templates?.items.length ?? 0) > 0 ||
      (templates?.customItems?.length ?? 0) > 0;

    const signer: RichTextEditorSignerConfig = config.signer ?? {
      name: "Signer",
      title: "",
    };

    const toolbarTools = resolveToolbarTools(config.tools);
    const showToolbar = toolbarTools.size > 0;
    const statusBarTools = resolveStatusBarTools(
      config.tools,
      showAutocomplete,
      hasTemplates,
    );

    return {
      mentions: showMentions ? resolvedMentions : null,
      showMentions,
      autocomplete,
      showAutocomplete,
      templates,
      signer,
      slots: config.slots ?? {},
      onSpeechTranscript: config.onSpeechTranscript,
      showToolbar,
      toolbarTools,
      isToolbarToolEnabled: (id) => toolbarTools.has(id),
      statusBarTools,
      isStatusBarToolEnabled: (id) => statusBarTools.has(id),
    };
  }, [config]);

  return (
    <RichTextEditorConfigContext.Provider value={value}>
      {children}
    </RichTextEditorConfigContext.Provider>
  );
}

export function useRichTextEditorConfig(): RichTextEditorConfigValue {
  const ctx = useContext(RichTextEditorConfigContext);
  if (!ctx) {
    throw new Error(
      "useRichTextEditorConfig must be used within RichTextEditorConfigProvider",
    );
  }
  return ctx;
}
