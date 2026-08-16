import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { ReferenceEntryList } from '@/components/reference/ReferenceEntryList';
import { ReferenceCitationList } from '@/components/reference/ReferenceCitationList';
import { ReferenceRail } from '@/components/reference/ReferenceRail';
import { getReference, referenceEntries } from '@/data/reference';
import { isStale } from '@/lib/rules/schema';
import { slugify } from '@/lib/content/slugify';

const SAMPLE_CITATION = {
  instrument: 'Perpres 82/2018 tentang Jaminan Kesehatan',
  article: 'Pasal 52',
  sourceUrl: 'https://peraturan.bpk.go.id/',
  verifiedAt: '2026-08-16',
};

describe('reference layer components', () => {
  it('ReferenceEntryList has no axe violations', async () => {
    const { container } = render(
      <ReferenceEntryList
        entries={[
          {
            entry: {
              term: 'Contoh',
              definition: 'Definisi contoh.',
              detail: 'Rincian contoh (Pasal 52).',
              citation: SAMPLE_CITATION,
            },
            stale: false,
          },
        ]}
      />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('renders each entry with a deep-linkable anchor id — MIGRATION.md step 6', () => {
    const { container } = render(
      <ReferenceEntryList
        entries={[
          {
            entry: { term: 'Kacamata', definition: 'Definisi.', detail: 'Rincian.', citation: SAMPLE_CITATION },
            stale: false,
          },
        ]}
      />,
    );
    expect(container.querySelector(`#${slugify('Kacamata')}`)).not.toBeNull();
  });

  it('ReferenceCitationList has no axe violations', async () => {
    const { container } = render(
      <ReferenceCitationList citations={[{ citation: SAMPLE_CITATION, stale: false }]} />,
    );
    expect(await axe(container)).toHaveNoViolations();
  });

  it('every entryList section renders through ReferenceEntryList without axe violations', async () => {
    const now = new Date();
    for (const slug of ['pengecualian', 'poli', 'alat-kesehatan', 'obat', 'kelas']) {
      const reference = getReference(slug);
      if (reference?.format !== 'entryList') throw new Error(`${slug}: expected entryList format`);
      const displayEntries = reference.entries.map((item) => ({
        entry: item,
        stale: isStale(item.citation.verifiedAt, now),
      }));
      const { container } = render(<ReferenceEntryList entries={displayEntries} />);
      expect(await axe(container)).toHaveNoViolations();
    }
  });
});

describe('ReferenceRail', () => {
  const items = referenceEntries.map((r) => ({ slug: r.slug, title: r.title }));

  it('has no axe violations and lists every reference section', async () => {
    const { container, getByText } = render(<ReferenceRail items={items} />);
    expect(await axe(container)).toHaveNoViolations();
    for (const item of items) {
      expect(getByText(item.title)).toBeInTheDocument();
    }
  });

  it('the live filter narrows the list without a network request', () => {
    const inaCbgTitle = items.find((i) => i.slug === 'ina-cbg')?.title ?? '';
    const pengecualianTitle = items.find((i) => i.slug === 'pengecualian')?.title ?? '';
    const { getByPlaceholderText, queryByText } = render(<ReferenceRail items={items} />);
    const search = getByPlaceholderText('Cari referensi…');
    fireEvent.change(search, { target: { value: 'INA-CBG' } });
    expect(queryByText(inaCbgTitle)).toBeInTheDocument();
    expect(queryByText(pengecualianTitle)).not.toBeInTheDocument();
  });

  it('shows a no-results message for a query matching nothing', () => {
    const { getByPlaceholderText, getByText } = render(<ReferenceRail items={items} />);
    fireEvent.change(getByPlaceholderText('Cari referensi…'), { target: { value: 'zzz-tidak-ada' } });
    expect(getByText('Tidak ditemukan.')).toBeInTheDocument();
  });
});
