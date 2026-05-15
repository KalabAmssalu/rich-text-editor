# @kalabamssalu/rich-text-editor

Lexical-based rich text editor for React (Next.js compatible) with configurable mentions, autocomplete, note templates, and toolbars.

## Install

```bash
npm install @kalabamssalu/rich-text-editor
```

Peer dependencies: `react`, `react-dom`, `lexical`, and matching `@lexical/*` packages at `^0.44.0`.

## Quick start

```tsx
'use client';

import { RichTextEditorBox } from '@kalabamssalu/rich-text-editor';
import '@kalabamssalu/rich-text-editor/styles.css';

export function NotesEditor() {
  return (
    <RichTextEditorBox
      label="Notes"
      onChange={({ lexicalJson, html }) => {
        console.log(lexicalJson, html);
      }}
    />
  );
}
```

## Tailwind CSS v4

In your global CSS:

```css
@source "../node_modules/@kalabamssalu/rich-text-editor/dist/**/*.{js,mjs}";
```

## Configuration (v0.2.0)

Pass a single `config` object (flat props override nested fields):

```tsx
<RichTextEditorBox
  config={{
    mentions: { categoryTree: [...] },
    autocomplete: {
      additionalTerms: ['hypertension', 'dyspnea'],
      enableEnglishDictionary: true,
    },
    templates: {
      items: [{ id: '1', title: 'SOAP', description: '...', body: '...' }],
      customItems: customTemplates,
      onCustomItemsChange: setCustomTemplates,
    },
    tools: {
      toolbar: ['history', 'blockFormat', 'link'],
      statusBar: ['characterCount', 'copyAll', 'clear'],
      mentions: true,
    },
    signer: { name: 'Dr. Smith', title: 'Attending' },
  }}
  onChange={({ lexicalJson, html }) => { /* parent useState */ }}
/>
```

| Field | Description |
|-------|-------------|
| `mentions` | Category tree, optional search index, patients, active patient |
| `autocomplete` | `additionalTerms` and optional `enableEnglishDictionary` |
| `templates` | `items`, optional `customItems` + `onCustomItemsChange` (host-owned persistence) |
| `tools.toolbar` | `false`, `true`, or a `ToolbarToolId[]` |
| `tools.statusBar` | `false`, `true`, or a `StatusBarToolId[]` |
| `tools.mentions` | Set `false` to disable @ mentions |
| `signer` | Name/title for signature blocks |

There is no built-in clinical or demo data in v0.2.0 — configure everything from your app.

## Breaking changes (0.1 → 0.2)

- Removed `MEDICAL_AUTOCOMPLETE_TERMS` export and `src/defaults/` demo data.
- `autocomplete.terms` → `autocomplete.additionalTerms`
- `autocomplete.enableDictionary` → `autocomplete.enableEnglishDictionary`
- `templates.templates` → `templates.items`; use `customItems` + `onCustomItemsChange` instead of package `storageKey`.

## Next.js

```js
// next.config.mjs
export default {
  transpilePackages: ['@kalabamssalu/rich-text-editor'],
};
```

## License

MIT
