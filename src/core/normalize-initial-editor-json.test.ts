import { describe, expect, it, vi } from "vitest";

import { normalizeInitialLexicalJson } from "./normalize-initial-editor-json";

describe("normalizeInitialLexicalJson", () => {
  it("returns undefined for null, undefined, empty, whitespace", () => {
    expect(normalizeInitialLexicalJson(null)).toBeUndefined();
    expect(normalizeInitialLexicalJson(undefined)).toBeUndefined();
    expect(normalizeInitialLexicalJson("")).toBeUndefined();
    expect(normalizeInitialLexicalJson("   ")).toBeUndefined();
  });

  it("returns undefined and warns for invalid JSON", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    expect(normalizeInitialLexicalJson("not-json")).toBeUndefined();
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it("returns undefined for empty root children", () => {
    const spy = vi.spyOn(console, "warn").mockImplementation(() => {});
    const emptyRoot = JSON.stringify({
      root: {
        children: [],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    });
    expect(normalizeInitialLexicalJson(emptyRoot)).toBeUndefined();
    spy.mockRestore();
  });

  it("preserves valid snapshot with at least one child", () => {
    const valid = JSON.stringify({
      root: {
        children: [
          {
            children: [],
            direction: null,
            format: "",
            indent: 0,
            type: "paragraph",
            version: 1,
          },
        ],
        direction: null,
        format: "",
        indent: 0,
        type: "root",
        version: 1,
      },
    });
    expect(normalizeInitialLexicalJson(valid)).toBe(valid);
  });
});
