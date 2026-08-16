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

/** "Tidak ditanggung" and its variants — DESIGN.md v2 §9, CLAUDE.md v2 invariant 3. */
export const TIDAK_DITANGGUNG_PATTERN = /tidak\s+ditanggung|tak\s+ditanggung|tidak\s+dijamin/i;

/** A Pasal (article) reference — "Pasal 52", "Pasal 52 huruf a", etc. */
export const PASAL_ARTICLE_PATTERN = /pasal\s+\d+/i;

export interface Pasal52Entry {
  source: string;
  text: string;
  /** True only for the one composed statement a State B ('excluded') outcome renders. */
  isExcludedStatement: boolean;
}

/**
 * CLAUDE.md v2 invariant 3: "tidak ditanggung" and its variants may appear
 * only on a State B item, and only with its article citation rendered
 * inline. `isExcludedStatement` entries are the actual composed text a
 * State B outcome renders (lib/copy/outcomeStrings.ts's
 * excludedStatementText) — everything else in the app (every other
 * scenario field, every rule statement, every other fixed string) must
 * not contain the phrase at all, regardless of subject or context.
 */
export function scanPasal52Rule(entries: Pasal52Entry[]): CopyViolation[] {
  const violations: CopyViolation[] = [];
  for (const { source, text, isExcludedStatement } of entries) {
    const match = text.match(TIDAK_DITANGGUNG_PATTERN);
    if (!match) continue;

    if (!isExcludedStatement) {
      violations.push({
        source,
        reason: 'PASAL_52_RULE: "tidak ditanggung" outside a State B (excluded) statement',
        match: match[0],
      });
      continue;
    }

    if (!PASAL_ARTICLE_PATTERN.test(text)) {
      violations.push({
        source,
        reason: 'PASAL_52_RULE: State B statement says "tidak ditanggung" but no article citation renders inline',
        match: match[0],
      });
    }
  }
  return violations;
}
