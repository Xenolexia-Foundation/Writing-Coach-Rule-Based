/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";
import { tokenize } from "../utils/tokenize";
import { levenshtein } from "../utils/levenshtein";

/** Most common English words (often missing from alphabetical subset). */
export const COMMON_WORDS =
  "the and is to it for that with on at by this have from or one had not but what all were when we there can an your which their said each she how some if will up out many then them these so no way could than first people into been more only about other would may made over after also where much before through back years right being still found while here take again give same both might under never last come think another go work life new just long down own part get place see number too little world say high every near such turn hand play spell away live most know thing name very form sentence great help line move old any tell boy follow went want show around three small set put end does well large must big even because why ask men read need land different home us try kind picture change off animal house point page letter mother answer study learn should America".split(
    " "
  );

const MAX_SUGGESTION_DISTANCE = 2;
const MAX_SUGGESTIONS = 5;
const LENGTH_SLOP = 2;

/** Common contractions not necessarily in the word list. */
const CONTRACTIONS = new Set([
  "don't", "it's", "we're", "they're", "can't", "won't", "isn't", "aren't",
  "wasn't", "weren't", "haven't", "hasn't", "hadn't", "wouldn't", "couldn't",
  "shouldn't", "i'm", "you're", "he's", "she's", "that's", "what's",
  "there's", "here's", "who's", "let's", "we've", "they've", "i've", "you've",
]);

function isAllCaps(word: string): boolean {
  return word.length > 1 && word === word.toUpperCase();
}

function looksLikeNumberOrUrl(word: string): boolean {
  return /^\d+$/.test(word) || /^https?:\/\//i.test(word) || /^[\w.-]+\.(com|org|net)$/i.test(word);
}

export function createSpellingRule(dictionary: Set<string>): Rule {
  const dict = new Set(dictionary);
  COMMON_WORDS.forEach((w) => dict.add(w));
  const dictionaryArray = Array.from(dict);

  function getSpellingSuggestions(word: string): string[] {
    const lower = word.toLowerCase();
    const len = lower.length;
    const candidates: { word: string; dist: number }[] = [];

    for (const dictWord of dictionaryArray) {
      if (Math.abs(dictWord.length - len) > LENGTH_SLOP) continue;
      const dist = levenshtein(lower, dictWord);
      if (dist >= 1 && dist <= MAX_SUGGESTION_DISTANCE) {
        candidates.push({ word: dictWord, dist });
      }
    }

    candidates.sort((a, b) => a.dist - b.dist);
    return [...new Set(candidates.slice(0, MAX_SUGGESTIONS * 2).map((c) => c.word))].slice(
      0,
      MAX_SUGGESTIONS
    );
  }

  return (text) => {
    const issues: ReturnType<Rule> = [];
    const tokens = tokenize(text);

    for (const { word, start, end } of tokens) {
      const lower = word.toLowerCase();
      if (dict.has(lower)) continue;
      if (CONTRACTIONS.has(lower)) continue;
      if (isAllCaps(word)) continue;
      if (looksLikeNumberOrUrl(word)) continue;

      const suggestions = getSpellingSuggestions(word);
      issues.push({
        type: "spelling",
        start,
        end,
        message: "Possible spelling mistake",
        suggestions: suggestions.length > 0 ? suggestions : ["Check spelling"],
      });
    }

    return issues;
  };
}
