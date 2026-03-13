import type { Rule } from "../types";

/** was/were/is/are + past participle (common -ed/-en and irregulars). */
const PAST_PARTICIPLE =
  /\b(was|were|is|are|be|been|being)\s+(\w+ed|\w+en|been|made|given|taken|done|seen|written|broken|spoken|chosen|driven|ridden|eaten|forgotten|gotten|hidden|ridden|stolen|worn|born|torn|worn|drawn|grown|known|shown|thrown|blown|flown|gone|done|run|won|begun|sung|swum|drunk|sunk|shrunk|stunk|struck|stuck|dug|hung|slung|spun|swung|bound|found|ground|wound|built|burnt|burst|cast|cost|cut|hit|hurt|let|put|quit|set|shut|split|spread)\b/gi;

export const passiveVoice: Rule = (text) => {
  const issues: ReturnType<Rule> = [];
  let m: RegExpExecArray | null;
  PAST_PARTICIPLE.lastIndex = 0;
  while ((m = PAST_PARTICIPLE.exec(text)) !== null) {
    issues.push({
      type: "grammar",
      start: m.index,
      end: m.index + m[0].length,
      message: "Passive voice. Consider using active voice.",
      suggestions: ["Consider active voice"],
    });
  }
  return issues;
};
