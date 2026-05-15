import type { RichTextEditorAutocompleteConfig } from "@/core/types";
import type {
  MentionMenuNode,
  MentionsRuntimeConfig,
} from "@/lexical/mention-types";

function collectMentionLabels(nodes: MentionMenuNode[]): string[] {
  const out: string[] = [];
  const walk = (list: MentionMenuNode[]) => {
    for (const n of list) {
      out.push(n.label);
      if (n.insertValue) out.push(n.insertValue);
      if (n.sampleData) out.push(n.sampleData);
      if (n.children?.length) walk(n.children);
    }
  };
  walk(nodes);
  return out;
}

export function getSystemAutocompleteTerms(
  autocomplete: RichTextEditorAutocompleteConfig,
  mentions: MentionsRuntimeConfig | null,
): string[] {
  const terms = new Set<string>(autocomplete.additionalTerms ?? []);

  if (mentions?.activePatient) {
    terms.add(mentions.activePatient.name);
    if (mentions.activePatient.mrn) terms.add(mentions.activePatient.mrn);
  }

  for (const p of mentions?.patients ?? []) {
    terms.add(p.name);
    if (p.mrn) terms.add(p.mrn);
    for (const part of p.name.split(/\s+/)) {
      if (part.length > 1) terms.add(part);
    }
  }

  for (const entry of mentions?.searchIndex ?? []) {
    if (entry.insertValue) terms.add(entry.insertValue);
    terms.add(entry.label);
  }

  if (mentions?.categoryTree.length) {
    for (const label of collectMentionLabels(mentions.categoryTree)) {
      terms.add(label);
    }
  }

  return [...terms];
}

export type SearchPromise = {
  dismiss: () => void;
  promise: Promise<null | string>;
};

const MIN_QUERY_LENGTH = 2;
const LATENCY_MS = 120;

function findSuggestion(
  searchText: string,
  tiers: readonly string[][],
): string | null {
  if (searchText.length < MIN_QUERY_LENGTH) return null;

  const searchTextLength = searchText.length;
  const char0 = searchText.charCodeAt(0);
  const isCapitalized = char0 >= 65 && char0 <= 90;
  const caseInsensitiveSearchText = isCapitalized
    ? String.fromCharCode(char0 + 32) + searchText.substring(1)
    : searchText;

  for (const tier of tiers) {
    const match = tier.find((word) =>
      word.toLowerCase().startsWith(caseInsensitiveSearchText),
    );
    if (match === undefined) continue;

    const matchCapitalized = isCapitalized
      ? match.charAt(0).toUpperCase() + match.slice(1)
      : match;
    const chunk = matchCapitalized.substring(searchTextLength);
    if (chunk.length > 0) return chunk;
  }

  return null;
}

export function createAutocompleteQuery(
  autocomplete: RichTextEditorAutocompleteConfig,
  mentions: MentionsRuntimeConfig | null,
  englishDictionary: readonly string[],
): (searchText: string) => SearchPromise {
  const systemTerms = getSystemAutocompleteTerms(autocomplete, mentions);
  const tiers: string[][] = [systemTerms];

  if (autocomplete.enableEnglishDictionary !== false) {
    tiers.push([...englishDictionary]);
  }

  return (searchText: string): SearchPromise => {
    let isDismissed = false;
    const dismiss = () => {
      isDismissed = true;
    };

    const promise = new Promise<null | string>((resolve, reject) => {
      setTimeout(() => {
        if (isDismissed) return reject("Dismissed");
        resolve(findSuggestion(searchText, tiers));
      }, LATENCY_MS);
    });

    return { dismiss, promise };
  };
}
