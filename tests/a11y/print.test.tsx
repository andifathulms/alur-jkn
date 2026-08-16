import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { render } from '@testing-library/react';
import { QuestionCard } from '@/components/question/QuestionCard';
import { CitationLine } from '@/components/rules/CitationLine';
import { NetworkMap } from '@/components/pathway/NetworkMap';
import { StationFragment } from '@/components/pathway/StationFragment';
import { payerClasses } from '@/components/handoff/payerStyle';
import { network } from '@/lib/network/definition';
import { computeFullLayout } from '@/lib/network/layout';
import { computeFragment } from '@/lib/network/fragment';

/**
 * DESIGN.md v3 §15, "print is a surface" — build order step 10. Same
 * limitation as tests/a11y/reduced-motion.test.ts: jsdom does not
 * evaluate `@media` conditions against stylesheets, so the mechanism
 * (globals.css's `@media print` block) is asserted on its actual rule
 * text, not by rendering with a simulated print media and reading
 * computed style. Component-level `print:` utility classes ARE asserted
 * on rendered output — those are plain class strings jsdom reports
 * correctly regardless of media-query evaluation.
 */
const globalsCssPath = path.join(__dirname, '..', '..', 'app', 'globals.css');
const globalsCss = readFileSync(globalsCssPath, 'utf-8');

function extractPrintBlock(css: string): string {
  const start = css.indexOf('@media print');
  if (start === -1) return '';
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

describe('print — the actual CSS mechanism', () => {
  const block = extractPrintBlock(globalsCss);

  it('a @media print block exists in globals.css', () => {
    expect(block).not.toBe('');
  });

  it('sets an A4 page size', () => {
    expect(block).toMatch(/@page\s*{[^}]*size:\s*A4/);
  });

  it('forces every colour token to black on white — no --paper fill, DESIGN.md §15', () => {
    expect(block).toMatch(/--color-paper:\s*#fff(fff)?/);
    expect(block).toMatch(/--color-payer-1:\s*#000(000)?/);
    expect(block).toMatch(/--color-payer-2:\s*#000(000)?/);
    expect(block).toMatch(/--color-payer-3:\s*#000(000)?/);
    expect(block).toMatch(/--color-self:\s*#000(000)?/);
    expect(block).toMatch(/--color-care:\s*#000(000)?/);
  });

  it('the emergency banner (bg-care, a baked Tailwind utility) also goes black — no colour token can reach it', () => {
    expect(block).toMatch(/\.bg-care\s*{[^}]*background-color:\s*#000/);
  });

  it('every link prints the URL it points to after the link text', () => {
    expect(block).toMatch(/a\[href\]::after\s*{[^}]*content:\s*['"]\s*\(['"]\s*attr\(href\)/);
  });

  it('.no-print elements are hidden, same rule the app already relied on', () => {
    expect(block).toMatch(/\.no-print\s*{[^}]*display:\s*none\s*!important/);
  });
});

describe('print — colour tokens survive into the SVG diagrams, invariant 18', () => {
  it('NetworkMap reads colour exclusively through var(--color-x), so the print override reaches it with no component change', () => {
    const layout = computeFullLayout(network);
    const { container } = render(<NetworkMap network={network} layout={layout} />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML).toMatch(/var\(--color-/);
    expect(svg?.innerHTML).not.toMatch(/#[0-9A-Fa-f]{3,6}\b/);
  });

  it('StationFragment reads colour exclusively through var(--color-x)', () => {
    const fragment = computeFragment(network, { type: 'station', stationId: 'rumahSakit' });
    const { container } = render(<StationFragment fragment={fragment} />);
    const svg = container.querySelector('svg');
    expect(svg?.innerHTML).toMatch(/var\(--color-/);
    expect(svg?.innerHTML).not.toMatch(/#[0-9A-Fa-f]{3,6}\b/);
  });
});

describe('print — payer lanes fall back to pattern, not colour, DESIGN.md §15', () => {
  it('every payer background carries print:bg-black alongside its screen colour', () => {
    const payers = [
      { type: 'jkn' as const, label: 'JKN' },
      { type: 'jasaRaharja' as const, label: 'Jasa Raharja' },
      { type: 'jaminanKecelakaanKerja' as const, label: 'JKK' },
      { type: 'self' as const, label: 'Mandiri' },
    ];
    for (const payer of payers) {
      expect(payerClasses(payer).bg).toMatch(/print:bg-black/);
    }
  });
});

describe('print — cards and rows avoid splitting across a page boundary', () => {
  it('QuestionCard avoids a mid-card page break', () => {
    const { container } = render(<QuestionCard nextAction="Lakukan X" questionToAsk="Apakah Y?" />);
    expect(container.firstElementChild?.className).toMatch(/print:break-inside-avoid/);
  });

  it('CitationLine avoids a mid-citation page break', () => {
    const { container } = render(
      <ul>
        <CitationLine
          citation={{
            instrument: 'Perpres 82/2018',
            article: 'Pasal 52',
            sourceUrl: 'https://peraturan.bpk.go.id/',
            verifiedAt: '2026-08-16',
          }}
          stale={false}
        />
      </ul>,
    );
    expect(container.querySelector('li')?.className).toMatch(/print:break-inside-avoid/);
  });
});
