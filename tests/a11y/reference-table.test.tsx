import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ReferenceEntryTable } from '@/components/reference/ReferenceEntryTable';
import { getReference } from '@/data/reference';
import { isStale } from '@/lib/rules/schema';
import { slugify } from '@/lib/content/slugify';

/**
 * DESIGN.md v3 §4, "Tables — specified": real `<table>` markup for
 * alat-kesehatan and kelas, not a grid of divs. Checks the structural
 * requirements a browser-rendered contrast/layout test can't reach in
 * jsdom (real column widths, actual 200% zoom) but the markup itself can
 * assert: semantic elements, a visible caption, scoped headers, one
 * citation per row, and the reflow classes that collapse the table to
 * stacked rows below the breakpoint (same reasoning as
 * tests/a11y/reduced-motion.test.ts — jsdom doesn't evaluate `@media`, so
 * this asserts on the responsive classes being present, not on computed
 * layout).
 */
const now = new Date();

function displayEntriesFor(slug: string) {
  const reference = getReference(slug);
  if (reference?.format !== 'entryList') throw new Error(`${slug}: expected entryList format`);
  return reference.entries.map((item) => ({ entry: item, stale: isStale(item.citation.verifiedAt, now) }));
}

describe('ReferenceEntryTable', () => {
  it('both tabular references (alat-kesehatan, kelas) are marked tabular: true', () => {
    for (const slug of ['alat-kesehatan', 'kelas']) {
      const reference = getReference(slug);
      if (reference?.format !== 'entryList') throw new Error(`${slug}: expected entryList format`);
      expect(reference.tabular).toBe(true);
    }
  });

  it.each(['alat-kesehatan', 'kelas'])('%s has no axe violations', async (slug) => {
    const { container } = render(<ReferenceEntryTable entries={displayEntriesFor(slug)} caption="Contoh tabel" />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders a real <table> with a visible caption and scoped headers', () => {
    const { container } = render(
      <ReferenceEntryTable entries={displayEntriesFor('alat-kesehatan')} caption="Batas tarif dan jadwal penggantian" />,
    );
    const table = container.querySelector('table');
    expect(table).not.toBeNull();
    const caption = container.querySelector('caption');
    expect(caption?.textContent).toBe('Batas tarif dan jadwal penggantian');
    expect(caption?.className).not.toContain('sr-only');
    const colHeaders = container.querySelectorAll('th[scope="col"]');
    expect(colHeaders.length).toBeGreaterThan(0);
    const rowHeaders = container.querySelectorAll('th[scope="row"]');
    expect(rowHeaders.length).toBe(displayEntriesFor('alat-kesehatan').length);
  });

  it('never uses zebra striping — no alternating row background classes', () => {
    const { container } = render(<ReferenceEntryTable entries={displayEntriesFor('kelas')} caption="Kelas" />);
    for (const row of container.querySelectorAll('tbody tr')) {
      expect(row.className).not.toMatch(/bg-/);
    }
  });

  it('carries one citation per row, not one for the whole table', () => {
    const entries = displayEntriesFor('kelas');
    const { container } = render(<ReferenceEntryTable entries={entries} caption="Kelas" />);
    const citations = container.querySelectorAll('tbody tr .border.border-rule.rounded-md');
    expect(citations.length).toBe(entries.length);
  });

  it('each row carries a deep-linkable anchor id', () => {
    const entries = displayEntriesFor('alat-kesehatan');
    const { container } = render(<ReferenceEntryTable entries={entries} caption="Alat kesehatan" />);
    for (const { entry } of entries) {
      expect(container.querySelector(`#${slugify(entry.term)}`)).not.toBeNull();
    }
  });

  it('reflows to stacked rows below the breakpoint — header hidden, cells blocked, per-cell labels present', () => {
    const { container } = render(<ReferenceEntryTable entries={displayEntriesFor('kelas')} caption="Kelas" />);
    const thead = container.querySelector('thead');
    expect(thead?.className).toMatch(/hidden/);
    const firstRow = container.querySelector('tbody tr');
    expect(firstRow?.className).toMatch(/\bblock\b/);
    for (const cell of container.querySelectorAll('tbody td')) {
      expect(cell.className).toMatch(/\bblock\b/);
    }
    // every td below the row header carries a visible column label for the stacked layout
    const labelledCells = container.querySelectorAll('tbody td span[aria-hidden]');
    expect(labelledCells.length).toBeGreaterThan(0);
  });

  it('table never scrolls horizontally by itself — no nowrap/overflow-x wrapper forcing a wide row', () => {
    const { container } = render(<ReferenceEntryTable entries={displayEntriesFor('kelas')} caption="Kelas" />);
    const table = container.querySelector('table');
    expect(table?.className).not.toMatch(/overflow-x/);
    expect(table?.className).not.toMatch(/whitespace-nowrap/);
  });
});
