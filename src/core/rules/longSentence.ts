import type { Rule } from "../types";

const MAX_WORDS = 40;
const SENTENCE_BOUNDARY = /[.!?]+/g;

function findSentenceRanges(text: string): { start: number; end: number; wordCount: number }[] {
  const ranges: { start: number; end: number; wordCount: number }[] = [];
  let start = 0;
  let m: RegExpExecArray | null;
  SENTENCE_BOUNDARY.lastIndex = 0;

  while ((m = SENTENCE_BOUNDARY.exec(text)) !== null) {
    const end = m.index + m[0].length;
    const sentence = text.slice(start, end);
    const wordCount = sentence.trim() ? sentence.trim().split(/\s+/).length : 0;
    ranges.push({ start, end, wordCount });
    start = end;
  }

  if (start < text.length) {
    const sentence = text.slice(start);
    const wordCount = sentence.trim() ? sentence.trim().split(/\s+/).length : 0;
    ranges.push({ start, end: text.length, wordCount });
  }

  return ranges;
}

export const longSentence: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  const ranges = findSentenceRanges(text);

  for (const { start, end, wordCount } of ranges) {
    if (wordCount > MAX_WORDS) {
      issues.push({
        type: "grammar",
        start,
        end,
        message: `Long sentence (${wordCount} words). Consider splitting.`,
        suggestions: ["Split into shorter sentences"],
      });
    }
  }

  return issues;
};
