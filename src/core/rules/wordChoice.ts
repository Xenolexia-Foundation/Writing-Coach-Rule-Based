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
