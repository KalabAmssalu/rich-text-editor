import { $convertToMarkdownString } from "@lexical/markdown";
import { $getRoot, type LexicalEditor } from "lexical";

import { EDITOR_MARKDOWN_TRANSFORMERS } from "@/config/editor-markdown-transformers";

/** Snapshot of the current note for saving as a custom template. */
export function captureEditorTemplateBody(editor: LexicalEditor): string {
  return editor.getEditorState().read(() => {
    const root = $getRoot();
    const text = root.getTextContent().trim();
    if (!text) {
      return `## New template\n\n`;
    }
    try {
      return $convertToMarkdownString(
        EDITOR_MARKDOWN_TRANSFORMERS,
        undefined,
        false,
      );
    } catch {
      return text;
    }
  });
}
