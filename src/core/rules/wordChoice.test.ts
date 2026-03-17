/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { describe, it, expect } from "vitest";
import { createWordChoiceRule } from "./wordChoice";

describe("createWordChoiceRule", () => {
  it("returns no issues when no map match", () => {
    const rule = createWordChoiceRule({ utilize: "use" });
    expect(rule("Hello world")).toEqual([]);
  });

  it("returns one issue when one word matches (lowercase)", () => {
    const rule = createWordChoiceRule({ utilize: "use" });
    const issues = rule("We should utilize this.");
    expect(issues).toHaveLength(1);
    expect(issues[0].type).toBe("word-choice");
    expect(issues[0].suggestions).toEqual(["use"]);
    expect(issues[0].message).toContain("simpler");
  });

  it("matches case-insensitively", () => {
    const rule = createWordChoiceRule({ utilize: "use" });
    const issues = rule("Utilize it.");
    expect(issues).toHaveLength(1);
    expect(issues[0].suggestions).toEqual(["use"]);
  });

  it("returns multiple issues for multiple matches", () => {
    const rule = createWordChoiceRule({ utilize: "use", facilitate: "help" });
    const issues = rule("We utilize this to facilitate work.");
    expect(issues).toHaveLength(2);
  });
});
