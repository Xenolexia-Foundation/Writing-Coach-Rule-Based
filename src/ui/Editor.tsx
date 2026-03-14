/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { useState, useMemo, useEffect } from "react";
import { runRules } from "@/core/engine";
import { rules, ruleIds } from "@/core/rules";
import { segmentize } from "@/core/segmentize";
import { HighlightedText } from "./HighlightedText";

const DEBOUNCE_MS = 350;

const RULE_LABELS: Record<string, string> = {
  doubleSpace: "Double spaces",
  doublePeriod: "Multiple periods",
  commonTypos: "Common typos",
  aVsAn: "A vs an",
  repeatedWord: "Repeated words",
  capitalization: "Capitalization",
  commaBeforeAnd: "Oxford comma",
  longSentence: "Long sentences",
  passiveVoice: "Passive voice",
  wordChoice: "Word choice",
  spelling: "Spelling",
};

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function countByType(issues: { type: string }[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const i of issues) {
    counts[i.type] = (counts[i.type] ?? 0) + 1;
  }
  return counts;
}

export function Editor() {
  const [text, setText] = useState("Type here.  Try double  space or teh typo. Utilize simpler words.");
  const [disabledRules, setDisabledRules] = useState<Set<string>>(new Set());
  const [ignoredWords, setIgnoredWords] = useState<Set<string>>(new Set());
  const debouncedText = useDebouncedValue(text, DEBOUNCE_MS);

  const rawIssues = useMemo(
    () => runRules(debouncedText, rules, ruleIds, { disabled: disabledRules }),
    [debouncedText, disabledRules]
  );

  const issues = useMemo(() => {
    if (ignoredWords.size === 0) return rawIssues;
    return rawIssues.filter((i) => {
      if (i.type !== "spelling") return true;
      const word = debouncedText.slice(i.start, i.end).toLowerCase();
      return !ignoredWords.has(word);
    });
  }, [rawIssues, ignoredWords, debouncedText]);

  const segments = useMemo(
    () => segmentize(text, issues),
    [text, issues]
  );

  const summaryByType = useMemo(() => countByType(issues), [issues]);

  const handleReplace = (start: number, end: number, replacement: string) => {
    setText((prev) => prev.slice(0, start) + replacement + prev.slice(end));
  };

  const handleIgnore = (word: string) => {
    setIgnoredWords((prev) => new Set(prev).add(word.toLowerCase()));
  };

  const toggleRule = (id: string) => {
    setDisabledRules((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <section className="editor">
      <label htmlFor="writing-input" className="editor-label">
        Your text
      </label>
      <textarea
        id="writing-input"
        className="editor-input"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Start typing..."
        rows={6}
        spellCheck={false}
      />
      <div className="editor-rules">
        <span className="editor-rules-label">Rules:</span>
        <div className="editor-rules-list">
          {ruleIds.map((id) => (
            <label key={id} className="editor-rule-check">
              <input
                type="checkbox"
                checked={!disabledRules.has(id)}
                onChange={() => toggleRule(id)}
              />
              {RULE_LABELS[id] ?? id}
            </label>
          ))}
        </div>
      </div>
      <div className="editor-preview">
        <span className="editor-preview-label">Preview (highlights):</span>
        <HighlightedText
          segments={segments}
          onReplace={handleReplace}
          onIgnore={handleIgnore}
        />
      </div>
      {issues.length > 0 && (
        <p className="editor-summary">
          {Object.entries(summaryByType).map(([type, n], idx) => (
            <span key={type} className={`editor-summary-type editor-summary-${type}`}>
              {idx > 0 && ", "}
              {n} {type.replace("-", " ")}
            </span>
          ))}
        </p>
      )}
    </section>
  );
}
