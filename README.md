# @kalabamssalu/rich-text-editor

Lexical-based rich text editor for React (Next.js compatible) with configurable mentions, autocomplete, note templates, and status-bar tools.

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

## Configuration props

| Prop | Description |
|------|-------------|
| `mentions` | Category tree, search index, patients, active patient |
| `autocomplete` | `terms[]` and optional `enableDictionary` |
| `templates` | Note template list + optional `storageKey` |
| `tools` | Enable/disable toolbar and status-bar plugins |
| `signer` | Name/title for signature blocks |

Omit props to use minimal built-in demo data.

## Next.js

```js
// next.config.mjs
export default {
  transpilePackages: ['@kalabamssalu/rich-text-editor'],
};
```

## License

MIT
