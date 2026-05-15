import { $generateHtmlFromNodes } from "@lexical/html";
import type { LexicalEditor } from "lexical";

export const EMR_RICH_TEXT_HTML_WRAPPER_CLASS = "emr-rich-text-html-export";

export interface RichTextEditorDocumentExport {
  /** Lexical EditorState JSON — reload in RichTextEditorBox via `value` */
  lexicalJson: string;
  /** HTML snapshot with custom blocks (mentions, signatures, embeds, etc.) */
  html: string;
}

/**
 * Serializes the editor for backend save: Lexical JSON (round-trip) + HTML (display/archive).
 */
export function exportEditorDocument(
  editor: LexicalEditor,
): RichTextEditorDocumentExport {
  const lexicalJson = JSON.stringify(editor.getEditorState().toJSON());

  let innerHtml = "";
  editor.getEditorState().read(() => {
    innerHtml = $generateHtmlFromNodes(editor, null);
  });

  const html = `<div class="${EMR_RICH_TEXT_HTML_WRAPPER_CLASS}" data-emr-rich-text-export="true">${innerHtml}</div>`;

  return { lexicalJson, html };
}
