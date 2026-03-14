/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

export type IssueType = "grammar" | "spelling" | "word-choice";

export interface Issue {
  type: IssueType;
  start: number;
  end: number;
  message: string;
  suggestions?: string[];
}

/** A rule takes the full text and returns zero or more issues. */
export type Rule = (text: string) => Issue[];
