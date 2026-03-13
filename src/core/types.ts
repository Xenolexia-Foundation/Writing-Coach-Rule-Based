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
