"use client";

import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { normalizeInitialLexicalJson } from "@/core/normalize-initial-editor-json";

export interface ValueSyncPluginProps {
  value?: string | null;
  /** When true, apply external `value` even if the editor is focused. Default: sync only when blurred. */
  syncValue?: boolean;
}

export function ValueSyncPlugin({ value, syncValue }: ValueSyncPluginProps) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const normalized = normalizeInitialLexicalJson(value ?? undefined);
    if (normalized === undefined) {
      return;
    }

    const rootElement = editor.getRootElement();
    const isFocused =
      rootElement !== null &&
      (rootElement.contains(document.activeElement) ||
        document.activeElement === rootElement);

    if (!syncValue && isFocused) {
      return;
    }

    const currentJson = JSON.stringify(editor.getEditorState().toJSON());
    if (currentJson === normalized) {
      return;
    }

    editor.setEditorState(editor.parseEditorState(normalized));
  }, [editor, value, syncValue]);

  return null;
}
