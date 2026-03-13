/**
 * Levenshtein (edit) distance between two strings.
 * Used for spelling suggestions: find dictionary words within distance 1 or 2.
 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;

  const row = new Array<number>(n + 1);
  for (let j = 0; j <= n; j++) row[j] = j;

  for (let i = 1; i <= m; i++) {
    let prev: number = row[0] ?? 0;
    row[0] = i;
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      const rj = row[j] ?? j;
      const rj1 = row[j - 1] ?? j - 1;
      const next = Math.min(rj + 1, rj1 + 1, prev + cost);
      prev = rj;
      row[j] = next;
    }
  }
  return row[n] ?? n;
}
