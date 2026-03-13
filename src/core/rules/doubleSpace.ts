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
