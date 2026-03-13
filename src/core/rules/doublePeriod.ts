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
