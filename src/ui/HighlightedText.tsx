/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { IssueType } from "@/core/types";
import type { TextSegment } from "@/core/segmentize";

const issueClass: Record<IssueType, string> = {
  grammar: "highlight-grammar",
  spelling: "highlight-spelling",
  "word-choice": "highlight-word-choice",
};

export interface HighlightedTextProps {
  segments: TextSegment[];
  onReplace?: (start: number, end: number, replacement: string) => void;
  onIgnore?: (word: string) => void;
}

export function HighlightedText({ segments, onReplace, onIgnore }: HighlightedTextProps) {
  return (
    <div className="highlighted-text" aria-live="polite">
      {segments.map((seg, i) => {
        if (seg.issue) {
          const cls = issueClass[seg.issue.type];
          const suggestions = seg.issue.suggestions ?? [];
          const firstSuggestion = suggestions[0];
          const isInstruction = /^(Consider|Split|Remove|Use|Add|Fix|Check)/i.test(
            firstSuggestion ?? ""
          );
          const canReplace =
            onReplace &&
            firstSuggestion &&
            firstSuggestion !== "Check spelling" &&
            !isInstruction;
          const title = [seg.issue.message, ...suggestions].join(" — ");
          return (
            <span key={i} className="highlight-segment-wrap">
              <span
                className={`segment ${cls}`}
                title={title}
                data-tooltip={title}
                role="status"
              >
                {seg.text}
              </span>
              {canReplace && (
                <button
                  type="button"
                  className="highlight-replace-btn"
                  onClick={() => onReplace(seg.issue!.start, seg.issue!.end, firstSuggestion)}
                  title={`Replace with "${firstSuggestion}"`}
                >
                  Replace with “{firstSuggestion}”
                </button>
              )}
              {onIgnore && seg.issue.type === "spelling" && (
                <button
                  type="button"
                  className="highlight-ignore-btn"
                  onClick={() => onIgnore(seg.text)}
                  title="Ignore this word"
                >
                  Ignore
                </button>
              )}
            </span>
          );
        }
        return <span key={i}>{seg.text}</span>;
      })}
    </div>
  );
}
