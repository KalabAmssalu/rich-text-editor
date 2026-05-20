/** @vitest-environment jsdom */
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RichTextEditorBox } from "./RichTextEditorBox";
import { normalizeInitialLexicalJson } from "./normalize-initial-editor-json";

const validSnapshot = JSON.stringify({
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

describe("RichTextEditorBox", () => {
  it("renders content editable without error boundary fallback", async () => {
    render(<RichTextEditorBox placeholder="Type here" />);

    await vi.waitFor(
      () => {
        expect(screen.queryByText("An error was thrown.")).toBeNull();
      },
      { timeout: 5000 },
    );
  });

  it("renders with valid controlled value", async () => {
    render(
      <RichTextEditorBox
        value={validSnapshot}
        placeholder="Note"
        onChange={() => {}}
      />,
    );

    await waitFor(
      () => {
        expect(screen.queryByText("An error was thrown.")).toBeNull();
      },
      { timeout: 5000 },
    );
  });

  it("does not show autocomplete toggle without autocomplete config", async () => {
    render(<RichTextEditorBox placeholder="Type here" />);

    await waitFor(
      () => {
        expect(
          screen.queryByRole("button", { name: /autocomplete/i }),
        ).toBeNull();
      },
      { timeout: 5000 },
    );
  });

  it("shows autocomplete toggle when autocomplete is configured", async () => {
    render(
      <RichTextEditorBox
        autocomplete={{ additionalTerms: ["hypertension"] }}
        placeholder="Type here"
      />,
    );

    await waitFor(
      () => {
        expect(
          screen.getByRole("button", { name: /autocomplete/i }),
        ).toBeTruthy();
      },
      { timeout: 5000 },
    );
  });

  it("normalizes invalid value to blank document without crashing", () => {
    expect(normalizeInitialLexicalJson('{"root":{"children":[]}}')).toBeUndefined();
  });
});
