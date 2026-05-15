import { $createHeadingNode } from "@lexical/rich-text";
import { $convertFromMarkdownString } from "@lexical/markdown";
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  type LexicalEditor,
} from "lexical";

import { EDITOR_MARKDOWN_TRANSFORMERS } from "@/config/editor-markdown-transformers";

function appendMarkdownLines(root: ReturnType<typeof $getRoot>, markdown: string) {
  const lines = markdown.split("\n");
  for (const line of lines) {
    if (line.startsWith("### ")) {
      root.append(
        $createHeadingNode("h3").append($createTextNode(line.slice(4))),
      );
    } else if (line.startsWith("## ")) {
      root.append(
        $createHeadingNode("h2").append($createTextNode(line.slice(3))),
      );
    } else if (line.startsWith("# ")) {
      root.append(
        $createHeadingNode("h1").append($createTextNode(line.slice(2))),
      );
    } else {
      const p = $createParagraphNode();
      if (line.trim()) {
        p.append($createTextNode(line));
      }
      root.append(p);
    }
  }
}

/** Inserts a note template; replaces empty editor or appends to the end. */
export function insertNoteTemplate(editor: LexicalEditor, markdown: string) {
  editor.update(() => {
    const root = $getRoot();
    const isEmpty = root.getTextContentSize() === 0;

    if (isEmpty) {
      $convertFromMarkdownString(
        markdown,
        EDITOR_MARKDOWN_TRANSFORMERS,
        undefined,
        false,
        false,
      );
      root.selectEnd();
      return;
    }

    root.append($createParagraphNode());
    appendMarkdownLines(root, markdown);
    root.selectEnd();
  });
}
