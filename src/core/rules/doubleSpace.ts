/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";

const DOUBLE_SPACE = /\s{2,}/g;

export const doubleSpace: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  let m: RegExpExecArray | null;
  DOUBLE_SPACE.lastIndex = 0;
  while ((m = DOUBLE_SPACE.exec(text)) !== null) {
    issues.push({
      type: "grammar",
      start: m.index,
      end: m.index + m[0].length,
      message: "Multiple spaces",
      suggestions: ["Use a single space"],
    });
  }
  return issues;
};
