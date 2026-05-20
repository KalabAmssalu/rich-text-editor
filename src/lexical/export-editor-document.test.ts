import { describe, expect, it, vi } from "vitest";
import type { LexicalEditor } from "lexical";

import { exportEditorDocument } from "./export-editor-document";

function createMockEditor(lexicalState: object, innerHtml: string): LexicalEditor {
  const editorState = {
    toJSON: () => lexicalState,
    read: (fn: () => void) => fn(),
  };
  return {
    getEditorState: () => editorState,
  } as unknown as LexicalEditor;
}

vi.mock("@lexical/html", () => ({
  $generateHtmlFromNodes: () => "inner",
}));

describe("exportEditorDocument", () => {
  it("exports both lexical JSON and HTML by default", () => {
    const editor = createMockEditor({ root: {} }, "inner");
    const result = exportEditorDocument(editor);
    expect(result.lexicalJson).toBe(JSON.stringify({ root: {} }));
    expect(result.html).toContain('data-emr-rich-text-export="true"');
    expect(result.html).toContain("inner");
  });

  it("exports only lexical JSON when format is lexical", () => {
    const editor = createMockEditor({ root: { type: "root" } }, "inner");
    const result = exportEditorDocument(editor, "lexical");
    expect(result.lexicalJson).toContain("root");
    expect(result.html).toBe("");
  });

  it("exports only HTML when format is html", () => {
    const editor = createMockEditor({ root: {} }, "inner");
    const result = exportEditorDocument(editor, "html");
    expect(result.lexicalJson).toBe("");
    expect(result.html).toContain("inner");
  });
});
