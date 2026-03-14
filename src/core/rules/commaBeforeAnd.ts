/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";

/** ", word and " — missing Oxford comma before "and". */
const MISSING_COMMA_BEFORE_AND = /,\s*\w+\s+and\s+/gi;

export const commaBeforeAnd: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  let m: RegExpExecArray | null;
  MISSING_COMMA_BEFORE_AND.lastIndex = 0;
  while ((m = MISSING_COMMA_BEFORE_AND.exec(text)) !== null) {
    const full = m[0];
    const andIndex = full.toLowerCase().lastIndexOf(" and ");
    if (andIndex === -1) continue;
    const start = m.index + andIndex;
    const end = start + 5;
    issues.push({
      type: "grammar",
      start,
      end,
      message: "Consider adding a comma before \"and\" in a list (Oxford comma)",
      suggestions: [", and"],
    });
  }
  return issues;
};
