/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";

const TYPOS: Record<string, string> = {
  teh: "the",
  adn: "and",
  taht: "that",
  waht: "what",
  tehm: "them",
  wiht: "with",
  from: "from",
  form: "from",
  recieve: "receive",
  recieved: "received",
  occured: "occurred",
  ocurred: "occurred",
  seperate: "separate",
  definately: "definitely",
  accomodate: "accommodate",
  arguement: "argument",
  independant: "independent",
};

export const commonTypos: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  for (const [typo, correction] of Object.entries(TYPOS)) {
    const re = new RegExp(`\\b${escapeRe(typo)}\\b`, "gi");
    let m: RegExpExecArray | null;
    re.lastIndex = 0;
    while ((m = re.exec(text)) !== null) {
      issues.push({
        type: "spelling",
        start: m.index,
        end: m.index + m[0].length,
        message: `Common typo: "${m[0]}"`,
        suggestions: [correction],
      });
    }
  }
  return issues;
};

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
