import type { Issue, Rule } from "./types";

export interface RuleConfig {
  /** Rule ids to skip (e.g. ["passiveVoice", "wordChoice"]). */
  disabled?: Set<string> | string[];
}

/**
 * Runs all rules on the text, merges and sorts issues by start index.
 * Overlapping ranges are kept (segmentize will let the first win); no dedup.
 * If ruleIds and config.disabled are provided, rules whose id is in disabled are skipped.
 */
export function runRules(
  text: string,
  rules: Rule[],
  ruleIds?: string[],
  config?: RuleConfig
): Issue[] {
  const disabledSet =
    config?.disabled instanceof Set
      ? config.disabled
      : config?.disabled
        ? new Set(config.disabled)
        : undefined;

  const issues: Issue[] = [];
  for (let i = 0; i < rules.length; i++) {
    const id = ruleIds?.[i];
    if (id !== undefined && disabledSet?.has(id)) continue;
    const rule = rules[i];
    if (rule) issues.push(...rule(text));
  }
  return issues.sort((a, b) => a.start - b.start);
}
