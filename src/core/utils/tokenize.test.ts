/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { describe, it, expect } from "vitest";
import { tokenize } from "./tokenize";

describe("tokenize", () => {
  it("returns empty array for empty string", () => {
    expect(tokenize("")).toEqual([]);
  });

  it("splits words by boundaries", () => {
    const tokens = tokenize("Hello world");
    expect(tokens).toHaveLength(2);
    expect(tokens[0]).toEqual({ word: "Hello", start: 0, end: 5 });
    expect(tokens[1]).toEqual({ word: "world", start: 6, end: 11 });
  });

  it("includes apostrophes in words (contractions)", () => {
    const tokens = tokenize("don't can't");
    expect(tokens.map((t) => t.word)).toEqual(["don't", "can't"]);
  });

  it("returns start/end indices", () => {
    const tokens = tokenize("Hi");
    expect(tokens[0].start).toBe(0);
    expect(tokens[0].end).toBe(2);
  });

  it("ignores non-word characters", () => {
    const tokens = tokenize("Hello, world! 123");
    expect(tokens.map((t) => t.word)).toEqual(["Hello", "world"]);
  });
});
