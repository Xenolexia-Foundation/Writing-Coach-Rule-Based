import type { Issue } from "./types";

/**
 * Returns hard-coded issues for Phase 1 demo.
 * First issue: first word (0–5). Second: a span around mid text if long enough.
 */
export function getDummyIssues(text: string): Issue[] {
  const issues: Issue[] = [];

  if (text.length >= 5) {
    issues.push({
      type: "grammar",
      start: 0,
      end: 5,
      message: "Sample grammar issue (dummy)",
      suggestions: ["Replace with a better phrase"],
    });
  }

  if (text.length >= 20) {
    const start = Math.min(10, text.length - 10);
    const end = Math.min(start + 6, text.length);
    if (end > start) {
      issues.push({
        type: "spelling",
        start,
        end,
        message: "Possible spelling mistake (dummy)",
        suggestions: ["suggestion"],
      });
    }
  }

  return issues;
}
