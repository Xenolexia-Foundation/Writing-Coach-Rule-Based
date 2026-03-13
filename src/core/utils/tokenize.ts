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
