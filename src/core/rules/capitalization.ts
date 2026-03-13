import type { Rule } from "../types";

/** Sentence start: after . ? ! or start of string, then optional whitespace, then a letter. */
const SENTENCE_START = /(?:^|[.!?]\s+)([a-z])/g;

/** Lowercase "i" as standalone word (pronoun) should be "I". */
const LOWER_I = /\bi\b/g;

export const capitalization: Rule = (text) => {
  const issues: ReturnType<Rule> = [];

  let m: RegExpExecArray | null;
  SENTENCE_START.lastIndex = 0;
  while ((m = SENTENCE_START.exec(text)) !== null) {
    const char = m[1];
    if (char === undefined) continue;
    if (char === char.toLowerCase()) {
      const start = m.index + m[0].length - 1;
      issues.push({
        type: "grammar",
        start,
        end: start + 1,
        message: "Capitalize the first letter of the sentence",
        suggestions: [char.toUpperCase()],
      });
    }
  }

  LOWER_I.lastIndex = 0;
  while ((m = LOWER_I.exec(text)) !== null) {
    issues.push({
      type: "grammar",
      start: m.index,
      end: m.index + 1,
      message: 'Use "I" (capitalized) when referring to yourself',
      suggestions: ["I"],
    });
  }

  return issues;
};
