# @kalabamssalu/rich-text-editor

Lexical-based rich text editor for React (Next.js compatible) with a formatting toolbar, status bar, `@` mentions, autocomplete, note templates, import/export, and electronic signatures.

Built for clinical and documentation workflows, but **ships no demo or clinical data** — you provide mentions, templates, and domain terms from your app.

---

## Table of contents

- [Features](#features)
- [Requirements](#requirements)
- [Installation](#installation)
- [Styling](#styling)
- [Quick start](#quick-start)
- [`RichTextEditorBox` props](#richtexteditorbox-props)
- [Saving and loading documents](#saving-and-loading-documents)
- [Configuration](#configuration)
  - [Mentions](#mentions)
  - [Autocomplete](#autocomplete)
  - [Note templates](#note-templates)
  - [Signer](#signer)
  - [Tools (toolbar and status bar)](#tools-toolbar-and-status-bar)
- [Full configuration example](#full-configuration-example)
- [Next.js](#nextjs)
- [Other frameworks](#other-frameworks)
- [Public API exports](#public-api-exports)
- [Troubleshooting](#troubleshooting)
- [Breaking changes (0.1 → 0.2)](#breaking-changes-01--02)
- [License](#license)

---

## Features

| Area | Capabilities |
|------|----------------|
| **Formatting toolbar** | Undo/redo, block type, alignment, fonts, colors, bold/italic/underline, sub/superscript, links, inserts (images, tables, embeds, horizontal rule, columns, date/time, etc.) |
| **Status bar** | Character count, copy all, import/export (`.lexical` JSON, `.docx`), markdown toggle, edit mode, clear |
| **Optional status tools** | Autocomplete toggle, templates, signature, speech-to-text, AI assistant placeholder, voice translator placeholder, audit log placeholder |
| **Mentions** | Type `@` for a searchable category tree with insertable values |
| **Autocomplete** | Inline word suggestions from your terms, mention labels, patients, and optional English dictionary |
| **Templates** | Insert markdown note templates; host-owned custom template storage |
| **Export** | `lexicalJson` (round-trip) + `html` (display/archive) on every change |

---

## Requirements

- **React** 18 or 19
- **Lexical** `^0.44.0` and matching `@lexical/*` packages (see [Installation](#installation))
- **Tailwind CSS** in the host app (utility classes such as `bg-background`, `text-muted-foreground` are used throughout the UI)
- **Client-only rendering** — the editor uses browser APIs and must not run on the server

---

## Installation

```bash
npm install @kalabamssalu/rich-text-editor
```

Install **peer dependencies** at the same Lexical version (required for correct bundling; avoids duplicate Lexical copies):

```bash
npm install lexical@^0.44.0 \
  @lexical/react@^0.44.0 \
  @lexical/code@^0.44.0 \
  @lexical/extension@^0.44.0 \
  @lexical/file@^0.44.0 \
  @lexical/hashtag@^0.44.0 \
  @lexical/html@^0.44.0 \
  @lexical/link@^0.44.0 \
  @lexical/list@^0.44.0 \
  @lexical/markdown@^0.44.0 \
  @lexical/overflow@^0.44.0 \
  @lexical/rich-text@^0.44.0 \
  @lexical/selection@^0.44.0 \
  @lexical/table@^0.44.0 \
  @lexical/text@^0.44.0 \
  @lexical/utils@^0.44.0 \
  react react-dom
```

With **pnpm**, add to `package.json`:

```json
{
  "dependencies": {
    "@kalabamssalu/rich-text-editor": "^0.2.0",
    "lexical": "^0.44.0",
    "@lexical/react": "^0.44.0"
  }
}
```

Then install the remaining `@lexical/*` peers listed above at `^0.44.0`.

---

## Styling

### 1. Import package CSS

Always import the bundled editor theme and mention styles:

```tsx
import "@kalabamssalu/rich-text-editor/styles.css";
```

This file is published at `@kalabamssalu/rich-text-editor/styles.css` and includes Lexical editor theme rules and mention popover styles.

### 2. Tailwind CSS (required for layout and colors)

The UI uses Tailwind utility classes. Your app must generate those utilities from the **built package** output.

**Tailwind CSS v4** — in your global CSS (adjust the path to `node_modules`):

```css
@import "tailwindcss";

@source "../node_modules/@kalabamssalu/rich-text-editor/dist/**/*.{js,mjs}";
```

**Tailwind CSS v3** — add to `content` in `tailwind.config.js`:

```js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@kalabamssalu/rich-text-editor/dist/**/*.{js,mjs}",
  ],
};
```

### 3. Design tokens (shadcn-style)

The editor expects CSS variables used by shadcn/ui, for example:

- `--background`, `--foreground`
- `--muted`, `--muted-foreground`
- `--border`, `--input`, `--ring`
- `--primary`, `--accent`, `--destructive`

If your app uses shadcn/ui or a similar theme, these are usually already defined. Without them, the editor still works but colors may look flat.

### 4. Toast notifications (import/export)

Import and export actions use [Sonner](https://sonner.emilkowal.ski/). Add a toaster once in your app root:

```tsx
import { Toaster } from "sonner";

export function RootLayout({ children }) {
  return (
    <>
      {children}
      <Toaster />
    </>
  );
}
```

---

## Quick start

```tsx
"use client";

import { useState } from "react";
import { RichTextEditorBox } from "@kalabamssalu/rich-text-editor/box";
import type { RichTextEditorDocumentExport } from "@kalabamssalu/rich-text-editor";
import "@kalabamssalu/rich-text-editor/styles.css";

export function NotesEditor() {
  const [doc, setDoc] = useState<RichTextEditorDocumentExport | null>(null);

  return (
    <RichTextEditorBox
      label="Clinical note"
      placeholder="Start typing…"
      onChange={(document) => setDoc(document)}
    />
  );
}
```

---

## Performance (LCP / main thread)

The package splits **types/helpers** and **runtime** so host apps can keep the critical path light:

| Import | Path | Loads |
|--------|------|--------|
| Types, `mergeEditorConfig`, `buildMentionSearchIndex`, etc. | `@kalabamssalu/rich-text-editor` | No Lexical editor runtime |
| `RichTextEditorBox` | `@kalabamssalu/rich-text-editor/box` | Full editor (~800KB+ with peers) |

**Recommended for App Router / LCP-sensitive pages** — dynamic import with `ssr: false`:

```tsx
"use client";

import dynamic from "next/dynamic";
import type { RichTextEditorBoxProps } from "@kalabamssalu/rich-text-editor";

const RichTextEditorBox = dynamic(
  () =>
    import("@kalabamssalu/rich-text-editor/box").then((m) => m.RichTextEditorBox),
  {
    ssr: false,
    loading: () => (
      <div className="min-h-[260px] animate-pulse rounded-md bg-muted/30" />
    ),
  },
);

export function ClinicalRichTextEditor(props: RichTextEditorBoxProps) {
  return <RichTextEditorBox {...props} />;
}
```

Host wrapper pattern (equivalent to splitting `rich-text-editor-package.ts` + `rich-text-editor-box.tsx`):

- **Types/utils barrel** — `import type { … } from "@kalabamssalu/rich-text-editor"` only
- **Runtime wrapper** — `import { RichTextEditorBox } from "@kalabamssalu/rich-text-editor/box"` inside a client file or dynamic import

Inside the package, **Shiki** (`@lexical/code-shiki`) and the **English dictionary** load only when code blocks / autocomplete are used — not on initial parse of the main bundle.

**Dependency dedupe:** If you use Prism/Shiki elsewhere, pin single versions in the host `pnpm.overrides` (e.g. `refractor`, `rehype-prism-plus`) to avoid duplicate highlighters on the main thread.

---

## `RichTextEditorBox` props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `RichTextEditorConfig` | — | Nested configuration object (see below) |
| `mentions` | `RichTextEditorMentionsConfig` | — | Shorthand; overrides `config.mentions` |
| `autocomplete` | `RichTextEditorAutocompleteConfig` | — | Shorthand; overrides `config.autocomplete` |
| `templates` | `RichTextEditorTemplatesConfig` | — | Shorthand; overrides `config.templates` |
| `tools` | `RichTextEditorToolsConfig` | — | Shorthand; overrides `config.tools` |
| `signer` | `RichTextEditorSignerConfig` | — | Shorthand; overrides `config.signer` |
| `namespace` | `string` | `"rich-text-editor"` | Lexical editor namespace (use unique names if multiple editors on one page) |
| `documentKey` | `string` | — | When this identity changes, the composer remounts and reloads snapshot (switching SOAP notes). See [Controlled](#controlled-load-existing-note) |
| `id` | `string` | — | HTML `id` on the wrapper |
| `label` | `string` | — | Accessible label above the editor |
| `placeholder` | `string` | `"Start typing…"` | Placeholder when empty |
| `className` | `string` | — | Classes on the outer wrapper |
| `minHeightClassName` | `string` | `"min-h-[260px]"` (surface) | Tailwind min-height for the typing area |
| `disabled` | `boolean` | `false` | Disables editing and `onChange` |
| `defaultValue` | `string \| null` | — | Initial Lexical JSON string (uncontrolled) |
| `value` | `string \| null` | — | Lexical JSON string to load (see [Saving and loading](#saving-and-loading-documents)) |
| `onChange` | `(doc: RichTextEditorDocumentExport) => void` | — | Called when the document changes |
| `onChangeDebounceMs` | `number` | `0` | Debounce `onChange` (milliseconds). `0` = every update |
| `exportFormat` | `'both' \| 'lexical' \| 'html'` | `'both'` | Fields to compute in `onChange` (omitted fields are `""`) |
| `syncValue` | `boolean` | `false` | Apply external `value` while mounted (see [External sync](#external-value-sync)) |
| `slots` | `RichTextEditorSlotsConfig` | — | Shorthand; overrides `config.slots` |

**Config merge rule:** Top-level props (`mentions`, `autocomplete`, etc.) override the same field inside `config`.

---

## Saving and loading documents

### `onChange` payload

```ts
interface RichTextEditorDocumentExport {
  /** Stringified Lexical EditorState JSON — use for save/load round-trip */
  lexicalJson: string;
  /** HTML snapshot for display, PDF, or search (includes wrapper div) */
  html: string;
}
```

- Use **`lexicalJson`** when you need to reload the editor or preserve custom nodes (mentions, signatures, embeds).
- Use **`html`** for read-only views, printing, or backends that only store HTML.

### Uncontrolled (initial content only)

```tsx
<RichTextEditorBox
  defaultValue={savedLexicalJson}
  onChange={({ lexicalJson }) => {
    // persist lexicalJson to your API
  }}
/>
```

### Controlled (load existing note)

Pass previously saved `lexicalJson`:

```tsx
const [noteJson, setNoteJson] = useState<string | null>(savedFromApi);

<RichTextEditorBox
  value={noteJson ?? undefined}
  documentKey={encounterNoteId}
  onChange={({ lexicalJson }) => setNoteJson(lexicalJson)}
/>
```

When switching to another encounter note, **`documentKey` must change** (or wrap the editor in conditional rendering keyed by note id). That remounts Lexical once with the newly saved snapshot.

```tsx
<RichTextEditorBox
  documentKey={`${soapId}-${revision}`}
  value={storedJson ?? undefined}
  onChange={(doc) => setStoredJson(doc.lexicalJson)}
/>
```

### Focus stays while typing (controlled `value`)

**v0.2.3+:** The editor no longer reconnects `$initialEditorState` on every keystroke. You can safely keep **`value={...}` and `setState(onChange)`** without losing caret focus each character.

Older versions recreated the Lexical composer whenever `lexicalJson` changed; use **v0.2.3+** or, on older builds, **`defaultValue` only** plus your own persistence (no controlled `value` loop).

Still true:

- **`value`** must be **Lexical EditorState JSON**, not HTML.

### External value sync

When another source updates the same note while the editor is open (e.g. WebSocket), use one of:

1. **`documentKey`** — change the key when switching notes (full remount; recommended for note switches).
2. **`syncValue={true}`** — apply `value` even when the editor is focused.
3. **Default** — if `value` changes and the editor is **not** focused, the document syncs automatically (skips when JSON already matches).

```tsx
<RichTextEditorBox
  value={noteJson ?? undefined}
  syncValue={forceApplyRemoteUpdate}
  onChange={({ lexicalJson }) => setNoteJson(lexicalJson)}
/>
```

### Performance: debounce and export format

```tsx
<RichTextEditorBox
  onChangeDebounceMs={300}
  exportFormat="lexical"
  onChange={({ lexicalJson }) => saveDraft(lexicalJson)}
/>
```

Use `exportFormat="lexical"` when you do not need HTML on every keystroke (smaller `onChange` work).

### Invalid `value` errors

Avoid passing **`""`** or stray strings when there is no saved note — use **`undefined`** or omit the prop. Never persist a Lexical snapshot where **`root.children` is empty**; that triggers `setEditorState: the editor state is empty` on load.

**v0.2.2+:** `RichTextEditorBox` **normalizes** `value` / `defaultValue` before init (blank strings, invalid JSON, missing `root`, or empty root `children`). In those cases the editor opens a normal blank document and logs a **`[RichTextEditor]`** warning instead of crashing.

---

## Configuration

Pass everything through `config` or via flat props.

### Mentions

Enable by providing `mentions` with a **`categoryTree`** (required). Type `@` in the editor to open the picker.

```tsx
import { RichTextEditorBox } from "@kalabamssalu/rich-text-editor/box";
import { buildMentionSearchIndex } from "@kalabamssalu/rich-text-editor";
import type { MentionMenuNode } from "@kalabamssalu/rich-text-editor";

const categoryTree: MentionMenuNode[] = [
  {
    id: "vitals",
    label: "Vitals",
    icon: "Activity",
    children: [
      {
        id: "bp",
        label: "Blood pressure",
        icon: "HeartPulse",
        insertValue: "BP 120/80 mmHg",
      },
    ],
  },
  {
    id: "meds",
    label: "Medications",
    icon: "Pill",
    insertValue: "No new medications",
  },
];

<RichTextEditorBox
  config={{
    mentions: {
      categoryTree,
      // Optional: pre-built index (otherwise built automatically)
      searchIndex: buildMentionSearchIndex(categoryTree, { patients: [] }),
      patients: [{ id: "p1", name: "Jane Doe", mrn: "MRN-001" }],
      activePatient: { id: "p1", name: "Jane Doe", mrn: "MRN-001" },
    },
    tools: { mentions: true }, // default when mentions is set; set false to hide @ picker
  }}
/>
```

**`MentionMenuNode` fields**

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Stable id |
| `label` | `string` | Display label |
| `icon` | `MentionIconName` | Lucide-based icon name (e.g. `"Stethoscope"`, `"Pill"`) |
| `children` | `MentionMenuNode[]` | Nested categories |
| `insertValue` | `string` | Text inserted when the row is chosen (leaf nodes) |
| `sampleData` | `string` | Extra text for search indexing |

**Icons:** `UserRound`, `Stethoscope`, `Pill`, `ClipboardList`, `Activity`, `Microscope`, `HeartPulse`, `Hospital`, `CalendarDays`, `FileText`, `IdCard`, `History`, `PillBottle`, `Syringe`, `ClipboardSignature`, `Building2`, `Scan`, `FlaskConical`, `Package`.

Disable mentions while keeping other config:

```tsx
tools: { mentions: false }
```

---

### Autocomplete

Enable by passing `autocomplete` (even `{}`). The status bar shows an autocomplete toggle when autocomplete is configured.

```tsx
<RichTextEditorBox
  config={{
    autocomplete: {
      additionalTerms: ["hypertension", "dyspnea", "SOB"],
      enableEnglishDictionary: true, // default: true
    },
  }}
/>
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `additionalTerms` | `string[]` | `[]` | Domain-specific words |
| `enableEnglishDictionary` | `boolean` | `true` | Built-in English word list (lazy-loaded when autocomplete is enabled) |
| `localStorageKey` | `string` | `emr-rich-text-autocomplete-enabled` | Key for the status-bar autocomplete toggle |

Autocomplete also indexes mention labels, `insertValue`s, patient names/MRNs, and active patient fields when mentions are configured.

Users can toggle autocomplete from the status bar; preference is stored in `localStorage` (see `localStorageKey` above).

---

### Note templates

Template **`body`** is **markdown** (headings `#` / `##` / `###`, paragraphs). Inserting replaces an empty editor or appends to the end.

```tsx
const [customTemplates, setCustomTemplates] = useState<NoteTemplate[]>([]);

<RichTextEditorBox
  config={{
    templates: {
      items: [
        {
          id: "soap",
          title: "SOAP note",
          description: "Subjective, objective, assessment, plan",
          body: "## Subjective\n\n## Objective\n\n## Assessment\n\n## Plan\n",
        },
      ],
      customItems: customTemplates,
      onCustomItemsChange: setCustomTemplates, // host persists to API/localStorage
    },
  }}
/>
```

| Field | Type | Description |
|-------|------|-------------|
| `items` | `NoteTemplate[]` | Built-in templates you define |
| `customItems` | `NoteTemplate[]` | User-created templates (your state) |
| `onCustomItemsChange` | `(templates: NoteTemplate[]) => void` | Called when user adds a custom template |

The templates button appears in the status bar only when `templates` is set and there is at least one item or custom template.

---

### Signer

Used by the electronic signature block in the status bar (when `signature` tool is enabled).

```tsx
config={{
  signer: { name: "Dr. Sam Rivera", title: "Attending Physician" },
}}
```

Default if omitted: `{ name: "Signer", title: "" }`.

---

### Tools (toolbar and status bar)

```tsx
config={{
  tools: {
    toolbar: ["history", "blockFormat", "link", "insert"],
    statusBar: ["characterCount", "copyAll", "clear"],
    mentions: true,
  },
}}
```

| `toolbar` / `statusBar` value | Behavior |
|-------------------------------|----------|
| omitted | Toolbar: all tools. Status bar: default set (see below) |
| `true` | All toolbar tools; status bar default + autocomplete/templates when configured (not placeholder AI/audit/voice tools) |
| `false` | Hidden |
| `ToolbarToolId[]` / `StatusBarToolId[]` | Only listed tools |

**Default status bar** (when `statusBar` is omitted):  
`characterCount`, `copyAll`, `importExport`, `markdown`, `editMode`, `clear`  
Plus `autocompleteToggle` if autocomplete is configured, and `templates` if templates are configured.

#### Toolbar tool IDs

| ID | Feature |
|----|---------|
| `history` | Undo / redo |
| `blockFormat` | Paragraph, headings, lists, quote, code block |
| `elementFormat` | Alignment, indent, line height |
| `fontFamily` | Font family |
| `fontSize` | Font size |
| `fontColor` | Text color |
| `fontBackground` | Highlight color |
| `fontFormat` | Bold, italic, underline, strikethrough |
| `subSuper` | Subscript / superscript |
| `clearFormatting` | Clear inline formatting |
| `link` | Insert / edit links |
| `insert` | Images, tables, embeds, HR, columns, date/time, etc. |

#### Status bar tool IDs

| ID | Feature |
|----|---------|
| `characterCount` | UTF-8 character count |
| `copyAll` | Copy plain text |
| `autocompleteToggle` | Enable/disable autocomplete |
| `templates` | Note template picker |
| `signature` | Insert signature block |
| `speechToText` | Browser speech recognition (where supported) |
| `aiAssistant` | Placeholder dialog, or `config.slots.aiAssistant` |
| `voiceTranslator` | Placeholder dialog, or `config.slots.voiceTranslator` |
| `importExport` | Import `.lexical` / `.docx`, export Lexical file |
| `markdown` | Toggle markdown source view |
| `editMode` | Toggle read-only |
| `clear` | Clear document |
| `auditLog` | Placeholder audit UI, or `config.slots.auditLog` |

#### Status bar slots (host UI)

```tsx
config={{
  tools: { statusBar: ["aiAssistant", "auditLog"] },
  slots: {
    aiAssistant: <MyAiButton />,
    auditLog: <MyAuditPanelTrigger />,
  },
}}
```

#### Speech-to-text callback

```tsx
config={{
  onSpeechTranscript: (transcript, isFinal) => {
    if (isFinal) console.log("Final:", transcript);
  },
}}
```

Minimal toolbar example:

```tsx
<RichTextEditorBox
  config={{
    tools: {
      toolbar: false,
      statusBar: ["characterCount", "clear"],
    },
  }}
/>
```

---

## Full configuration example

```tsx
"use client";

import { useState } from "react";
import { RichTextEditorBox } from "@kalabamssalu/rich-text-editor/box";
import { buildMentionSearchIndex } from "@kalabamssalu/rich-text-editor";
import type {
  NoteTemplate,
  RichTextEditorDocumentExport,
} from "@kalabamssalu/rich-text-editor";
import "@kalabamssalu/rich-text-editor/styles.css";

const categoryTree = [
  {
    id: "dx",
    label: "Diagnosis",
    icon: "Stethoscope" as const,
    insertValue: "Primary diagnosis: ",
  },
];

export function EncounterNoteEditor({
  initialLexicalJson,
}: {
  initialLexicalJson?: string | null;
}) {
  const [customTemplates, setCustomTemplates] = useState<NoteTemplate[]>([]);

  const handleChange = (doc: RichTextEditorDocumentExport) => {
    // await saveToApi({ lexicalJson: doc.lexicalJson, html: doc.html });
  };

  return (
    <RichTextEditorBox
      label="Encounter note"
      value={initialLexicalJson ?? undefined}
      onChange={handleChange}
      config={{
        mentions: {
          categoryTree,
          searchIndex: buildMentionSearchIndex(categoryTree),
        },
        autocomplete: {
          additionalTerms: ["hypertension", "NPO", "PRN"],
          enableEnglishDictionary: false,
        },
        templates: {
          items: [
            {
              id: "hpi",
              title: "HPI",
              description: "History of present illness",
              body: "## History of present illness\n\n",
            },
          ],
          customItems: customTemplates,
          onCustomItemsChange: setCustomTemplates,
        },
        signer: { name: "Dr. Smith", title: "MD" },
        tools: {
          toolbar: true,
          statusBar: [
            "characterCount",
            "copyAll",
            "templates",
            "signature",
            "importExport",
            "markdown",
            "clear",
          ],
        },
      }}
    />
  );
}
```

---

## Next.js

1. **Client component** — the editor must run on the client:

```tsx
"use client";
```

2. **Transpile the package** (App Router or Pages):

```js
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@kalabamssalu/rich-text-editor"],
};

export default nextConfig;
```

3. Import styles in a client layout or page (see [Styling](#styling)).

4. Add `<Toaster />` from `sonner` if you use import/export (`sonner` is an optional peer dependency).

The editor renders a lightweight placeholder until the client mounts (avoids SSR hydration issues).

### Bundle size

The published `dist/index.js` is a single bundle (toolbar, Lexical UI, optional features). The English autocomplete dictionary is loaded at runtime only when `autocomplete` is configured and `enableEnglishDictionary` is not `false`. CI reports `dist/` file sizes on each build.

---

## Other frameworks

- **Vite / CRA / Remix:** Import styles globally; ensure Tailwind scans `node_modules/@kalabamssalu/rich-text-editor/dist`.
- **Multiple editors:** Use a unique `namespace` per instance.
- **Read-only:** `disabled={true}` disables editing and suppresses `onChange`.

---

## Public API exports

```ts
// Runtime component (heavy — use dynamic import on LCP-critical routes)
export { RichTextEditorBox } from "@kalabamssalu/rich-text-editor/box";

// Lightweight: helpers + types (safe on shared barrels / server types)
export { mergeEditorConfig } from "@kalabamssalu/rich-text-editor";
export { buildMentionSearchIndex } from "@kalabamssalu/rich-text-editor";
export { normalizeInitialLexicalJson } from "@kalabamssalu/rich-text-editor";
export { DEFAULT_AUTOCOMPLETE_STORAGE_KEY } from "@kalabamssalu/rich-text-editor";

/** @deprecated Prefer RichTextEditorBox — registers minimal nodes only */
export { createRichTextEditorInitialConfig } from "@kalabamssalu/rich-text-editor";

// Types (from main entry — use `import type` only)
export type {
  RichTextEditorBoxProps,
  RichTextEditorConfig,
  RichTextEditorDocumentExport,
  RichTextEditorExportFormat,
  RichTextEditorSlotsConfig,
  RichTextEditorMentionsConfig,
  RichTextEditorAutocompleteConfig,
  RichTextEditorTemplatesConfig,
  RichTextEditorToolsConfig,
  RichTextEditorSignerConfig,
  ToolbarToolId,
  StatusBarToolId,
  NoteTemplate,
  MentionMenuNode,
  MentionEntry,
  MentionIconName,
  MentionSearchPatient,
} from "@kalabamssalu/rich-text-editor";
```

`createRichTextEditorInitialConfig` registers only basic nodes. **`RichTextEditorBox` from `/box`** registers mentions, images, signatures, embeds, and all extensions.

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---------|----------------|-----|
| **"An error was thrown."** in the editor area | React error inside the content surface (often caught by Lexical’s error boundary) | Open the browser console for the real error. Ensure `@kalabamssalu/rich-text-editor` is up to date (v0.2.0+ includes required `TooltipProvider`). |
| Unstyled / broken layout | Tailwind not scanning the package | Add `@source` or `content` path to `dist` (see [Styling](#styling)). |
| Gray boxes, wrong colors | Missing CSS variables | Add shadcn-style theme variables or match your design tokens. |
| Editor empty / plugins broken | Missing Lexical peers or duplicate Lexical | Install all `@lexical/*` peers at `^0.44.0`; dedupe with `npm ls lexical`. |
| **`setEditorState: … editor state is empty`** | Saved JSON has **`root.children: []`**, invalid JSON, or `value=""` | Use **`undefined`** when no note (not `""`). Don’t persist empty-root snapshots from “clear”; upgrade to ≥0.2.2 which normalizes bad snapshots to a blank doc. |
| **Caret jumps / blur after each keystroke** | Package older than **v0.2.3** with `value` + `setState(onChange)` (composer remounted every update) | Upgrade to **≥0.2.3** or use **`defaultValue` only** (no controlled loop). |
| `value` does not load | Passing HTML instead of Lexical JSON | Use `onChange`’s `lexicalJson` for `value` / `defaultValue`. |
| Import/export toasts missing | No Sonner toaster | Add `<Toaster />` from `sonner` to your app root. |
| Build error: `react-day-picker` | Old install without dependencies | Run `pnpm install` / `npm install` after upgrading the package. |
| Hydration warning in Next.js | Editor rendered on server | Use `"use client"`; do not import `RichTextEditorBox` in Server Components. |

Enable verbose logging: errors are also logged as `[RichTextEditor]` in the console from the editor’s `onError` handler.

---

## Breaking changes (0.2 → 0.3)

- **`RichTextEditorBox` moved to subpath** — import from `@kalabamssalu/rich-text-editor/box` (not the root entry). Root exports types + helpers only.
- See [Performance (LCP / main thread)](#performance-lcp--main-thread) for the recommended dynamic-import pattern.

## Breaking changes (0.1 → 0.2)

- Removed `MEDICAL_AUTOCOMPLETE_TERMS` export and bundled demo data under `src/defaults/`.
- `autocomplete.terms` → `autocomplete.additionalTerms`
- `autocomplete.enableDictionary` → `autocomplete.enableEnglishDictionary`
- `templates.templates` → `templates.items`
- Custom template persistence: use `customItems` + `onCustomItemsChange` (host-owned) instead of package `storageKey`.

---

## License

MIT
