/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";

const MULTIPLE_DOTS = /\.{2,}/g;

export const doublePeriod: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  let m: RegExpExecArray | null;
  MULTIPLE_DOTS.lastIndex = 0;
  while ((m = MULTIPLE_DOTS.exec(text)) !== null) {
    issues.push({
      type: "grammar",
      start: m.index,
      end: m.index + m[0].length,
      message: "Multiple periods",
      suggestions: ["Use … (ellipsis) or a single period"],
    });
  }
  return issues;
};
