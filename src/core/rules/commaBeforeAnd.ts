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
