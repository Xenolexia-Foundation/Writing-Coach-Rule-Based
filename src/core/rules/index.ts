/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../types";
import { doubleSpace } from "./doubleSpace";
import { doublePeriod } from "./doublePeriod";
import { commonTypos } from "./commonTypos";
import { aVsAn } from "./aVsAn";
import { createSpellingRule } from "./spelling";
import { repeatedWord } from "./repeatedWord";
import { capitalization } from "./capitalization";
import { commaBeforeAnd } from "./commaBeforeAnd";
import { longSentence } from "./longSentence";
import { passiveVoice } from "./passiveVoice";
import { createWordChoiceRule } from "./wordChoice";

import dictRaw from "@/data/dict-en.txt?raw";
import wordChoiceMap from "@/data/word-choice.json";

const dictionary = new Set(
  dictRaw
    .split(/\r?\n/)
    .map((line) => line.trim().toLowerCase())
    .filter(Boolean)
);

const spelling = createSpellingRule(dictionary);
const wordChoice = createWordChoiceRule(wordChoiceMap as Record<string, string>);

export const rules: Rule[] = [
  doubleSpace,
  doublePeriod,
  commonTypos,
  aVsAn,
  repeatedWord,
  capitalization,
  commaBeforeAnd,
  longSentence,
  passiveVoice,
  wordChoice,
  spelling,
];

export const ruleIds: string[] = [
  "doubleSpace",
  "doublePeriod",
  "commonTypos",
  "aVsAn",
  "repeatedWord",
  "capitalization",
  "commaBeforeAnd",
  "longSentence",
  "passiveVoice",
  "wordChoice",
  "spelling",
];
