/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";

const REPEATED_WORD = /(\b\w+\b)\s+\1/gi;

export const repeatedWord: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  let m: RegExpExecArray | null;
  REPEATED_WORD.lastIndex = 0;
  while ((m = REPEATED_WORD.exec(text)) !== null) {
    const word = m[1];
    const start = m.index;
    const end = m.index + m[0].length;
    issues.push({
      type: "grammar",
      start,
      end,
      message: `Repeated word: "${word}"`,
      suggestions: [`Remove repeated "${word}"`],
    });
  }
  return issues;
};
