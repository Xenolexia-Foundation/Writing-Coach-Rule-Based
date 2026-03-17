/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import { useCallback, useMemo, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { runRules } from "../src/core/engine";
import { segmentize } from "../src/core/segmentize";
import type { Issue, IssueType } from "../src/core/types";
import type { TextSegment } from "../src/core/segmentize";
import { rules, ruleIds } from "./src/rules";

const DEBOUNCE_MS = 400;

function useDebouncedValue<T>(value: T, delayMs: number): T {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delayMs);
    return () => clearTimeout(id);
  }, [value, delayMs]);
  return debounced;
}

function countByType(issues: Issue[]): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const i of issues) {
    counts[i.type] = (counts[i.type] ?? 0) + 1;
  }
  return counts;
}

const issueColors: Record<IssueType, string> = {
  grammar: "#c49a2e",
  spelling: "#b84d4d",
  "word-choice": "#5078b4",
};

function HighlightedText({
  segments,
  onReplace,
  onIgnore,
}: {
  segments: TextSegment[];
  onReplace?: (start: number, end: number, replacement: string) => void;
  onIgnore?: (word: string) => void;
}) {
  return (
    <Text style={styles.previewText} selectable>
      {segments.map((seg, i) => {
        if (seg.issue) {
          const suggestion = seg.issue.suggestions?.[0];
          const canReplace =
            suggestion &&
            suggestion !== "Check spelling" &&
            !/^(Consider|Split|Remove|Use|Add|Fix)/i.test(suggestion);
          return (
            <Text key={i}>
              <Text
                style={[
                  styles.highlight,
                  { backgroundColor: issueColors[seg.issue.type] + "30" },
                ]}
              >
                {seg.text}
              </Text>
              {canReplace && onReplace && (
                <Text
                  style={styles.inlineAction}
                  onPress={() => onReplace(seg.issue!.start, seg.issue!.end, suggestion!)}
                >
                  {" "}[Replace: {suggestion}]
                </Text>
              )}
              {seg.issue.type === "spelling" && onIgnore && (
                <Text style={styles.inlineAction} onPress={() => onIgnore(seg.text)}>
                  {" "}[Ignore]
                </Text>
              )}
            </Text>
          );
        }
        return <Text key={i}>{seg.text}</Text>;
      })}
    </Text>
  );
}

export default function App() {
  const [text, setText] = useState(
    "Type here.  Try double  space or teh typo. Utilize simpler words."
  );
  const [ignoredWords, setIgnoredWords] = useState<Set<string>>(new Set());
  const debouncedText = useDebouncedValue(text, DEBOUNCE_MS);

  const rawIssues = useMemo(
    () => runRules(debouncedText, rules, ruleIds),
    [debouncedText]
  );

  const issues = useMemo(() => {
    if (ignoredWords.size === 0) return rawIssues;
    return rawIssues.filter((i) => {
      if (i.type !== "spelling") return true;
      const word = debouncedText.slice(i.start, i.end).toLowerCase();
      return !ignoredWords.has(word);
    });
  }, [rawIssues, ignoredWords, debouncedText]);

  const segments = useMemo(() => segmentize(text, issues), [text, issues]);
  const summaryByType = useMemo(() => countByType(issues), [issues]);

  const handleReplace = useCallback((start: number, end: number, replacement: string) => {
    setText((prev) => prev.slice(0, start) + replacement + prev.slice(end));
  }, []);

  const handleIgnore = useCallback((word: string) => {
    setIgnoredWords((prev) => new Set(prev).add(word.toLowerCase()));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.label}>Your text</Text>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Start typing..."
          multiline
          textAlignVertical="top"
          placeholderTextColor="#999"
        />
        <Text style={styles.previewLabel}>Preview (highlights)</Text>
        <View style={styles.previewBox}>
          <HighlightedText
            segments={segments}
            onReplace={handleReplace}
            onIgnore={handleIgnore}
          />
        </View>
        {issues.length > 0 && (
          <Text style={styles.summary}>
            {Object.entries(summaryByType)
              .map(([type, n]) => `${n} ${type.replace("-", " ")}`)
              .join(", ")}
          </Text>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f2ed",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#1a1a1a",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 120,
    color: "#1a1a1a",
  },
  previewLabel: {
    fontSize: 12,
    color: "#666",
    marginTop: 16,
    marginBottom: 6,
  },
  previewBox: {
    backgroundColor: "#fafafa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    padding: 12,
  },
  previewText: {
    fontSize: 16,
    color: "#1a1a1a",
    lineHeight: 24,
  },
  highlight: {
    textDecorationLine: "underline",
  },
  inlineAction: {
    fontSize: 12,
    color: "#2d6a9f",
    fontWeight: "500",
  },
  summary: {
    fontSize: 13,
    color: "#555",
    marginTop: 12,
  },
});
