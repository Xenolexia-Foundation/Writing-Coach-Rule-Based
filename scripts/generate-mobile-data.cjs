const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const dictPath = path.join(repoRoot, "src", "data", "dict-en.txt");
const outDir = path.join(repoRoot, "mobile", "src", "data");
const outPath = path.join(outDir, "dict-words.ts");

const words = fs
  .readFileSync(dictPath, "utf8")
  .split(/\r?\n/)
  .map((l) => l.trim().toLowerCase())
  .filter(Boolean);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  outPath,
  "// Generated from ../../src/data/dict-en.txt — run npm run generate:mobile-data to update\n" +
    "export const dictionaryWords: string[] = " +
    JSON.stringify(words) +
    ";\n"
);
console.log("Wrote", words.length, "words to", outPath);
