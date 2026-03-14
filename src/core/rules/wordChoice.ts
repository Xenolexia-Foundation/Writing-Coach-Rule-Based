/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";
import { tokenize } from "../utils/tokenize";

export function createWordChoiceRule(map: Record<string, string>): Rule {
  return (text) => {
    const issues: ReturnType<Rule> = [];
    const tokens = tokenize(text);

    for (const { word, start, end } of tokens) {
      const lower = word.toLowerCase();
      const suggestion = map[lower] ?? map[word];
      if (suggestion === undefined) continue;

      issues.push({
        type: "word-choice",
        start,
        end,
        message: `Consider simpler word: "${word}"`,
        suggestions: [suggestion],
      });
    }

    return issues;
  };
}
