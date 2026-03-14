/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

/**
 * Tokenizes text into words with character ranges.
 * Words are sequences of letters and apostrophes (for contractions like "don't").
 */

export interface Token {
  word: string;
  start: number;
  end: number;
}

const WORD_RE = /\b[A-Za-z][A-Za-z']*\b/g;

export function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  let m: RegExpExecArray | null;
  WORD_RE.lastIndex = 0;
  while ((m = WORD_RE.exec(text)) !== null) {
    tokens.push({
      word: m[0],
      start: m.index,
      end: m.index + m[0].length,
    });
  }
  return tokens;
}
