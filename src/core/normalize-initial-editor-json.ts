/**
 * Lexical requires a non-empty root (at least one child node). Passing invalid JSON,
 * empty strings, or snapshots with `root.children: []` throws at init (e.g. setEditorState
 * "the editor state is empty").
 */
export function normalizeInitialLexicalJson(
  lexicalJson: string | null | undefined,
): string | undefined {
  if (lexicalJson == null) {
    return undefined;
  }

  const trimmed = lexicalJson.trim();
  if (trimmed === "") {
    return undefined;
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch {
    console.warn(
      "[RichTextEditor] value/defaultValue is not valid Lexical JSON; starting with a blank document.",
    );
    return undefined;
  }

  if (
    !parsed ||
    typeof parsed !== "object" ||
    Array.isArray(parsed)
  ) {
    console.warn(
      "[RichTextEditor] Lexical snapshot has invalid shape; starting with a blank document.",
    );
    return undefined;
  }

  const root = (parsed as { root?: unknown }).root;
  if (!root || typeof root !== "object" || Array.isArray(root)) {
    console.warn(
      "[RichTextEditor] Lexical snapshot missing root; starting with a blank document.",
    );
    return undefined;
  }

  const children = (root as { children?: unknown }).children;
  if (!Array.isArray(children) || children.length === 0) {
    console.warn(
      "[RichTextEditor] Lexical snapshot has an empty root; starting with a blank document.",
    );
    return undefined;
  }

  return trimmed;
}
