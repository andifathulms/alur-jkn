/**
 * Greedy word-wrap for SVG text, which has no CSS `text-wrap` of its own —
 * every multi-line label in the network diagrams (currently the
 * off-network cluster's real Pasal 52 terms, some over 60 characters) is
 * rendered as one `<tspan>` per line returned here. Pure — invariant 18,
 * same discipline as `computeFullLayout`, which calls this to size each
 * cluster row.
 */
export function wrapLabel(text: string, maxCharsPerLine: number): string[] {
  const words = text.split(' ').filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = words[0]!;

  for (const word of words.slice(1)) {
    const candidate = `${current} ${word}`;
    if (candidate.length <= maxCharsPerLine) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  lines.push(current);

  return lines;
}
