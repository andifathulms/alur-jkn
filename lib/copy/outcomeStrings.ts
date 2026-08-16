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
