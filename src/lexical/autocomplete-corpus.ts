import type { RichTextEditorAutocompleteConfig } from "@/core/types";
import type {
  MentionMenuNode,
  MentionsRuntimeConfig,
} from "@/lexical/mention-types";

/** Common clinical / charting terms (prioritized in search). */
export const MEDICAL_AUTOCOMPLETE_TERMS = [
  "hypertension",
  "hypotension",
  "diabetes",
  "mellitus",
  "hyperlipidemia",
  "dyspnea",
  "tachycardia",
  "bradycardia",
  "febrile",
  "afebrile",
  "anemia",
  "leukocytosis",
  "thrombocytopenia",
  "coagulopathy",
  "sepsis",
  "pneumonia",
  "bronchitis",
  "asthma",
  "COPD",
  "exacerbation",
  "myocardial",
  "infarction",
  "angina",
  "atrial",
  "fibrillation",
  "heart",
  "failure",
  "stroke",
  "transient",
  "ischemic",
  "attack",
  "deep",
  "vein",
  "thrombosis",
  "pulmonary",
  "embolism",
  "cellulitis",
  "abscess",
  "osteoarthritis",
  "rheumatoid",
  "arthritis",
  "gastroenteritis",
  "pancreatitis",
  "cholecystitis",
  "appendicitis",
  "nephrolithiasis",
  "urinary",
  "infection",
  "pyelonephritis",
  "chronic",
  "kidney",
  "disease",
  "acute",
  "renal",
  "hepatic",
  "encephalopathy",
  "cirrhosis",
  "hepatitis",
  "jaundice",
  "nausea",
  "vomiting",
  "diarrhea",
  "constipation",
  "melena",
  "hematochezia",
  "hematuria",
  "proteinuria",
  "edema",
  "dehydration",
  "hypokalemia",
  "hyperkalemia",
  "hyponatremia",
  "hypernatremia",
  "hypoglycemia",
  "hyperglycemia",
  "metabolic",
  "acidosis",
  "alkalosis",
  "lactic",
  "ketosis",
  "DKA",
  "HHS",
  "hypothyroidism",
  "hyperthyroidism",
  "adrenal",
  "insufficiency",
  "Cushing",
  "syndrome",
  "osteoporosis",
  "fracture",
  "dislocation",
  "sprain",
  "strain",
  "contusion",
  "laceration",
  "wound",
  "healing",
  "inflammation",
  "erythema",
  "pruritus",
  "urticaria",
  "rash",
  "lesion",
  "neoplasm",
  "benign",
  "malignant",
  "carcinoma",
  "metastasis",
  "remission",
  "relapse",
  "palliative",
  "hospice",
  "resuscitation",
  "intubation",
  "ventilation",
  "supplemental",
  "nasal",
  "cannula",
  "intravenous",
  "subcutaneous",
  "intramuscular",
  "peroral",
  "transdermal",
  "milligram",
  "microgram",
  "international",
  "units",
  "twice",
  "daily",
  "every",
  "hours",
  "prn",
  "stat",
  "NPO",
  "nil",
  "per",
  "os",
];

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
  const terms = new Set<string>(autocomplete.terms);

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
  const medicalTerms = MEDICAL_AUTOCOMPLETE_TERMS;
  const tiers: string[][] = [
    systemTerms,
    medicalTerms,
    ...(autocomplete.enableDictionary !== false
      ? [[...englishDictionary]]
      : []),
  ];

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
