/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Issue } from "./types";

export interface TextSegment {
  text: string;
  issue: Issue | null;
}

/**
 * Splits text into segments so that each segment is either plain or covered by
 * exactly one issue. Overlapping issues are not merged; earlier issue wins for
 * overlapping ranges.
 */
export function segmentize(text: string, issues: Issue[]): TextSegment[] {
  const sorted = [...issues].sort((a, b) => a.start - b.start);
  const segments: TextSegment[] = [];
  let pos = 0;

  for (const issue of sorted) {
    if (issue.end <= pos || issue.start >= text.length) continue;
    const start = Math.max(issue.start, pos);
    const end = Math.min(issue.end, text.length);
    if (start >= end) continue;

    if (start > pos) {
      segments.push({
        text: text.slice(pos, start),
        issue: null,
      });
    }
    segments.push({
      text: text.slice(start, end),
      issue,
    });
    pos = end;
  }

  if (pos < text.length) {
    segments.push({
      text: text.slice(pos),
      issue: null,
    });
  }

  return segments;
}
