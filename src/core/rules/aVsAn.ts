/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";

/** Words that typically take "an" (vowel sound). Lowercase for comparison. */
const AN_WORDS = new Set([
  "hour", "honor", "honest", "heir", "honour",
  "apple", "orange", "umbrella", "idea", "elephant",
  "egg", "ice", "owl", "ant", "artist",
  "hour", "honor", "honest", "MBA", "SUV",
  "a", "e", "i", "o", "u",
  "european", "one", "once", "unique", "university", "uniform",
]);

/** Words that typically take "a" (consonant sound) even if they start with a vowel letter. */
const A_WORDS = new Set([
  "university", "uniform", "union", "unique", "one", "once",
  "european", "euro", "user", "utopia",
]);

function getNextWord(text: string, afterIndex: number): { word: string; start: number; end: number } | null {
  const rest = text.slice(afterIndex);
  const match = rest.match(/\b([a-zA-Z']+)\b/);
  if (!match || match.index === undefined || match[1] === undefined) return null;
  const word = match[1];
  const start = afterIndex + match.index;
  const end = start + word.length;
  return { word: word.toLowerCase(), start, end };
}

export const aVsAn: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  // "a " followed by word that needs "an"
  const aRe = /\ba\s+/gi;
  let m: RegExpExecArray | null;
  aRe.lastIndex = 0;
  while ((m = aRe.exec(text)) !== null) {
    const next = getNextWord(text, m.index + m[0].length);
    if (next && AN_WORDS.has(next.word) && !A_WORDS.has(next.word)) {
      issues.push({
        type: "grammar",
        start: m.index,
        end: m.index + 1,
        message: `Use "an" before a vowel sound ("${next.word}")`,
        suggestions: ["an"],
      });
    }
  }
  // "an " followed by word that needs "a"
  const anRe = /\ban\s+/gi;
  anRe.lastIndex = 0;
  while ((m = anRe.exec(text)) !== null) {
    const next = getNextWord(text, m.index + m[0].length);
    if (next && A_WORDS.has(next.word)) {
      issues.push({
        type: "grammar",
        start: m.index,
        end: m.index + 2,
        message: `Use "a" before a consonant sound ("${next.word}")`,
        suggestions: ["a"],
      });
    }
  }
  return issues;
};
