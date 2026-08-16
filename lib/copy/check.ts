import { bannedPhrases } from './bannedPhrases';

export interface CopyViolation {
  source: string;
  reason: string;
  match: string;
}

/** Pure: scans one string, returns every banned-phrase hit. */
export function scanText(text: string, source: string): CopyViolation[] {
  const violations: CopyViolation[] = [];
  for (const { pattern, reason } of bannedPhrases) {
    const match = text.match(pattern);
    if (match) {
      violations.push({ source, reason, match: match[0] });
    }
  }
  return violations;
}

/** Scans a { source: text } map — the shape scripts/copy-check.ts builds from all copy. */
export function scanAll(entries: Record<string, string>): CopyViolation[] {
  return Object.entries(entries).flatMap(([source, text]) => scanText(text, source));
}
