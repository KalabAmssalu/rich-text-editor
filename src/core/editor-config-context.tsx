"use client";

import {
  createContext,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import {
  DEMO_ACTIVE_PATIENT,
  DEMO_MENTION_CATEGORY_TREE,
  DEMO_MENTION_PATIENTS,
} from "@/defaults/demo-mentions";
import { DEMO_AUTOCOMPLETE_TERMS } from "@/defaults/demo-autocomplete";
import { DEMO_NOTE_TEMPLATES } from "@/defaults/demo-templates";
import { buildMentionSearchIndex } from "@/lexical/mention-schema-data";
import type { MentionsRuntimeConfig } from "@/lexical/mention-types";

import type {
  RichTextEditorAutocompleteConfig,
  RichTextEditorMentionsConfig,
  RichTextEditorSignerConfig,
  RichTextEditorTemplatesConfig,
  RichTextEditorToolId,
  RichTextEditorToolsConfig,
} from "./types";

const ALL_STATUS_BAR_TOOLS: RichTextEditorToolId[] = [
  "characterCount",
  "copyAll",
  "autocompleteToggle",
  "templates",
  "signature",
  "speechToText",
  "aiAssistant",
  "voiceTranslator",
  "importExport",
  "markdown",
  "editMode",
  "clear",
  "auditLog",
];

const DEFAULT_STATUS_BAR_TOOLS: RichTextEditorToolId[] = [
  "characterCount",
  "copyAll",
  "importExport",
  "markdown",
  "editMode",
  "clear",
];

function resolveStatusBarTools(
  tools: RichTextEditorToolsConfig | undefined,
  hasAutocomplete: boolean,
  hasTemplates: boolean,
): Set<RichTextEditorToolId> {
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
    return {
      categoryTree: DEMO_MENTION_CATEGORY_TREE,
      searchIndex: buildMentionSearchIndex(DEMO_MENTION_CATEGORY_TREE, {
        patients: DEMO_MENTION_PATIENTS,
      }),
      patients: DEMO_MENTION_PATIENTS,
      activePatient: DEMO_ACTIVE_PATIENT,
    };
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

export interface RichTextEditorConfigValue {
  mentions: MentionsRuntimeConfig | null;
  showMentions: boolean;
  autocomplete: RichTextEditorAutocompleteConfig;
  templates: RichTextEditorTemplatesConfig;
  signer: RichTextEditorSignerConfig;
  showToolbar: boolean;
  statusBarTools: Set<RichTextEditorToolId>;
  isStatusBarToolEnabled: (id: RichTextEditorToolId) => boolean;
}

const RichTextEditorConfigContext =
  createContext<RichTextEditorConfigValue | null>(null);

export function RichTextEditorConfigProvider({
  children,
  mentions: mentionsProp,
  autocomplete: autocompleteProp,
  templates: templatesProp,
  tools,
  signer: signerProp,
}: {
  children: ReactNode;
  mentions?: RichTextEditorMentionsConfig;
  autocomplete?: RichTextEditorAutocompleteConfig;
  templates?: RichTextEditorTemplatesConfig;
  tools?: RichTextEditorToolsConfig;
  signer?: RichTextEditorSignerConfig;
}) {
  const value = useMemo((): RichTextEditorConfigValue => {
    const resolvedMentions = resolveMentions(mentionsProp);
    const hasExplicitMentions = mentionsProp !== undefined;
    const showMentions =
      tools?.mentions !== false && (hasExplicitMentions || resolvedMentions !== null);

    const autocomplete: RichTextEditorAutocompleteConfig = {
      terms: autocompleteProp?.terms ?? DEMO_AUTOCOMPLETE_TERMS,
      enableDictionary: autocompleteProp?.enableDictionary ?? true,
    };

    const templates: RichTextEditorTemplatesConfig = {
      templates: templatesProp?.templates ?? DEMO_NOTE_TEMPLATES,
      storageKey:
        templatesProp?.storageKey ?? "rich-text-editor-custom-note-templates",
    };

    const signer: RichTextEditorSignerConfig = signerProp ?? {
      name: "Signer",
      title: "",
    };

    const hasAutocomplete = autocomplete.terms.length > 0;
    const hasTemplates = templates.templates.length > 0;
    const statusBarTools = resolveStatusBarTools(
      tools,
      hasAutocomplete,
      hasTemplates,
    );

    return {
      mentions: showMentions ? resolvedMentions : null,
      showMentions,
      autocomplete,
      templates,
      signer,
      showToolbar: tools?.toolbar !== false,
      statusBarTools,
      isStatusBarToolEnabled: (id) => statusBarTools.has(id),
    };
  }, [mentionsProp, autocompleteProp, templatesProp, tools, signerProp]);

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
