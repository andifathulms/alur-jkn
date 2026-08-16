/**
 * DESIGN.md v2 §3/§9, CLAUDE.md v2 invariant 3: "tidak ditanggung" and its
 * variants may appear only here — on a State B ('excluded') outcome, and
 * only paired with its Pasal 52 article. This is the sole template that may
 * use that phrase; step 2's copy:check extension enforces the scope.
 */
export const PASAL_52_INSTRUMENT = 'Perpres 82/2018 tentang Jaminan Kesehatan';

export const OUTCOME_LABELS = {
  excludedPrefix: 'Tidak ditanggung JKN — dikecualikan berdasarkan',
  dependsPrefix: 'Bergantung pada jawaban petugas:',
} as const;

/**
 * The exact plain-text a State B outcome renders — components/state/
 * OutcomeDisplay.tsx composes the same three pieces (prefix, instrument,
 * article) via JSX interpolation, so this string always matches its
 * flattened textContent. This single function is what proves, statically,
 * that the citation renders inline: scripts/copy-check.ts and
 * tests/safety/pasal52-rule.test.ts both validate its *output*, not the
 * component's JSX, so there is exactly one place the "tidak ditanggung"
 * phrase and its citation are assembled together.
 */
export function excludedStatementText(pasal52Article: string): string {
  return `${OUTCOME_LABELS.excludedPrefix} ${PASAL_52_INSTRUMENT}, ${pasal52Article}.`;
}
