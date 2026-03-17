/**
 * Copyright (C) 2016-2026 Husain Alamri (H4n) and Xenolexia Foundation.
 * Licensed under the GNU Affero General Public License v3.0 (AGPL-3.0). See LICENSE.
 */

import type { Rule } from "../../src/core/types";
import { doubleSpace } from "../../src/core/rules/doubleSpace";
import { doublePeriod } from "../../src/core/rules/doublePeriod";
import { commonTypos } from "../../src/core/rules/commonTypos";
import { aVsAn } from "../../src/core/rules/aVsAn";
import { createSpellingRule } from "../../src/core/rules/spelling";
import { repeatedWord } from "../../src/core/rules/repeatedWord";
import { capitalization } from "../../src/core/rules/capitalization";
import { commaBeforeAnd } from "../../src/core/rules/commaBeforeAnd";
import { longSentence } from "../../src/core/rules/longSentence";
import { passiveVoice } from "../../src/core/rules/passiveVoice";
import { createWordChoiceRule } from "../../src/core/rules/wordChoice";
import { WORD_CHOICE_MAP } from "@xenolexia/dict";

import { dictionaryWords } from "./data/dict-words";

const dictionary = new Set(dictionaryWords);
const spelling = createSpellingRule(dictionary);
const wordChoice = createWordChoiceRule(WORD_CHOICE_MAP);

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
