import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';

/**
 * DESIGN.md §17, "Reduced motion, behavioural" — one of the six new
 * gating checks. §8: "prefers-reduced-motion: both states render complete
 * and instant. This is asserted by a test that renders with the
 * preference simulated and checks the outcome, not by a test that checks
 * the animated element exists."
 *
 * A DOM-rendered version of that test was tried first and abandoned:
 * jsdom's `getComputedStyle` does not evaluate `@media` conditions against
 * a page's stylesheets at all — mocking `window.matchMedia` to report
 * `prefers-reduced-motion: reduce` has no effect on which CSS rule
 * `getComputedStyle` returns, verified directly (a `.thing { animation-
 * duration: 500ms }` base rule plus a `@media (prefers-reduced-motion:
 * reduce) { .thing { animation-duration: 0.01ms !important } }` override
 * still reports `500ms` under a mocked reduced-motion `matchMedia`,
 * because jsdom's style engine and its `matchMedia` stub are unconnected).
 * A real browser-accurate version would need an actual browser test
 * runner, which is out of scope here.
 *
 * What this checks instead is the actual rule text in app/globals.css:
 * that a `prefers-reduced-motion: reduce` block exists, that it forces
 * `animation-duration` and `transition-duration` to near-zero with
 * `!important` (so it wins the cascade regardless of specificity), and
 * that its selector is broad enough to reach both of DESIGN.md §8's "two
 * moments" — the pathway `.pathway-progress` animation and
 * `PayerHandoffBar`'s `transition-[width]`. This is a real assertion
 * about the mechanism that produces the behaviour, not a placeholder.
 */
const globalsCssPath = path.join(__dirname, '..', '..', 'app', 'globals.css');
const globalsCss = readFileSync(globalsCssPath, 'utf-8');

function extractReducedMotionBlock(css: string): string {
  const start = css.indexOf('@media (prefers-reduced-motion: reduce)');
  if (start === -1) return '';
  // Grab from the media query to its closing brace by counting braces.
  let depth = 0;
  let end = start;
  for (let i = start; i < css.length; i++) {
    if (css[i] === '{') depth++;
    if (css[i] === '}') {
      depth--;
      if (depth === 0) {
        end = i + 1;
        break;
      }
    }
  }
  return css.slice(start, end);
}

describe('reduced motion — the actual CSS mechanism', () => {
  const block = extractReducedMotionBlock(globalsCss);

  it('a prefers-reduced-motion: reduce block exists in globals.css', () => {
    expect(block).not.toBe('');
  });

  it('forces animation-duration to near-zero with !important', () => {
    expect(block).toMatch(/animation-duration:\s*0(\.\d+)?ms\s*!important/);
  });

  it('forces transition-duration to near-zero with !important', () => {
    expect(block).toMatch(/transition-duration:\s*0(\.\d+)?ms\s*!important/);
  });

  it('its selector is the universal selector, so it reaches every animated element without per-component opt-in', () => {
    // Matches `*,` or `*::before` etc. inside the block's selector list.
    expect(block).toMatch(/\*\s*[,{]/);
  });

  it('the durations it overrides are non-zero in their base rules — proving there is something to override', () => {
    expect(globalsCss).toMatch(/animation:\s*pathway-draw\s+500ms/);
  });
});
