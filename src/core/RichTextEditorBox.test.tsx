/** @vitest-environment jsdom */
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { RichTextEditorBox } from "./RichTextEditorBox";

describe("RichTextEditorBox", () => {
  it("renders content editable without error boundary fallback", async () => {
    render(<RichTextEditorBox placeholder="Type here" />);

    await vi.waitFor(
      () => {
        expect(screen.queryByText("An error was thrown.")).toBeNull();
      },
      { timeout: 3000 },
    );
  });
});
