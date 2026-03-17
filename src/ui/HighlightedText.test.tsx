/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { HighlightedText } from "./HighlightedText";
import type { TextSegment } from "@/core/segmentize";

describe("HighlightedText", () => {
  it("renders plain segments without issue", () => {
    const segments: TextSegment[] = [
      { text: "Hello ", issue: null },
      { text: "world", issue: null },
    ];
    render(<HighlightedText segments={segments} />);
    expect(screen.getByText(/Hello/)).toBeInTheDocument();
    expect(screen.getByText(/world/)).toBeInTheDocument();
  });

  it("renders segment with word-choice issue and replace button when onReplace provided", () => {
    const segments: TextSegment[] = [
      {
        text: "utilize",
        issue: {
          type: "word-choice",
          start: 0,
          end: 7,
          message: "Consider simpler word",
          suggestions: ["apply"],
        },
      },
    ];
    const onReplace = vi.fn();
    render(<HighlightedText segments={segments} onReplace={onReplace} />);
    expect(screen.getByText("utilize")).toBeInTheDocument();
    const btn = screen.getByRole("button", { name: /Replace with .*apply/ });
    fireEvent.click(btn);
    expect(onReplace).toHaveBeenCalledWith(0, 7, "apply");
  });
});
