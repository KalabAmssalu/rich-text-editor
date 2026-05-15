import type { NoteTemplate } from "@/core/types";

const DEFAULT_STORAGE_KEY = "rich-text-editor-custom-note-templates";

export function loadCustomNoteTemplates(storageKey?: string): NoteTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(storageKey ?? DEFAULT_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (t): t is NoteTemplate =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as NoteTemplate).id === "string" &&
        typeof (t as NoteTemplate).title === "string" &&
        typeof (t as NoteTemplate).body === "string",
    );
  } catch {
    return [];
  }
}

export function saveCustomNoteTemplates(
  templates: NoteTemplate[],
  storageKey?: string,
): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(
    storageKey ?? DEFAULT_STORAGE_KEY,
    JSON.stringify(templates),
  );
}

export function addCustomNoteTemplate(
  template: NoteTemplate,
  storageKey?: string,
): NoteTemplate[] {
  const existing = loadCustomNoteTemplates(storageKey);
  const next = [...existing, template];
  saveCustomNoteTemplates(next, storageKey);
  return next;
}

export function createCustomTemplateId(title: string): string {
  const slug = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 40);
  return `custom-${slug || "template"}-${Date.now()}`;
}
