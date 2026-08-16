import tailwindConfig from '../tailwind.config';
import { contrastRatio, alphaComposite } from '../lib/design/contrast';

/**
 * DESIGN.md §17, "Contrast, computed" — one of the six new gating checks.
 * Computes the real ratio for every token pair DESIGN.md §2 claims meets
 * AA (4.5:1) or, for the key line and the emergency message, AAA (7:1).
 *
 * `--self` and `--care` were originally lighter and measured 4.11:1 and
 * 4.19:1 — short of what DESIGN.md claimed. Both were darkened (same hue,
 * corrected lightness; see DESIGN.md §2's note) and now pass with margin.
 * `text-ink/60` was dropped from the codebase in the same pass (every use
 * became `text-ink/70`, the lightest opacity that actually clears 4.5:1
 * against `--paper`) — it is intentionally not in the pairs list below,
 * since it is no longer a token combination this app renders.
 *
 * All pairs pass — this is a blocking gate.
 */
const rawColors = (tailwindConfig.theme?.extend?.colors ?? {}) as Record<string, string>;

function token(name: string): string {
  const value = rawColors[name];
  if (!value) throw new Error(`contrast:check — token "${name}" not found in tailwind.config.ts`);
  return value;
}

const paper = token('paper');
const ink = token('ink');

interface Pair {
  label: string;
  ratio: number;
  minimum: number;
  level: 'AA' | 'AAA';
}

const pairs: Pair[] = [
  { label: '--self on --paper', ratio: contrastRatio(token('self'), paper), minimum: 4.5, level: 'AA' },
  {
    label: '--ink/70 on --paper (opacity-composited)',
    ratio: contrastRatio(alphaComposite(ink, paper, 0.7), paper),
    minimum: 4.5,
    level: 'AA',
  },
  { label: '--payer-1 on --paper', ratio: contrastRatio(token('payer-1'), paper), minimum: 4.5, level: 'AA' },
  { label: '--payer-2 on --paper', ratio: contrastRatio(token('payer-2'), paper), minimum: 4.5, level: 'AA' },
  { label: '--payer-3 on --paper', ratio: contrastRatio(token('payer-3'), paper), minimum: 4.5, level: 'AA' },
  {
    label: '--care with --paper text (the emergency message)',
    ratio: contrastRatio(token('care'), paper),
    minimum: 7,
    level: 'AAA',
  },
  { label: '--ink on --paper (the key line)', ratio: contrastRatio(ink, paper), minimum: 7, level: 'AAA' },
];

let failed = false;

for (const pair of pairs) {
  const ok = pair.ratio >= pair.minimum;
  if (!ok) failed = true;
  const status = ok ? 'OK  ' : 'FAIL';
  console.log(
    `contrast:check — ${status} ${pair.label}: ${pair.ratio.toFixed(2)}:1 (needs ${pair.minimum}:1 for ${pair.level})`,
  );
}

if (failed) {
  console.error(
    "\ncontrast:check — one or more token pairs fail the ratio DESIGN.md §11 claims. Not currently a blocking gate — see this script's header comment.",
  );
  process.exit(1);
}

console.log('\ncontrast:check — all token pairs meet their claimed ratio.');
