import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import { axe } from 'jest-axe';
import { SearchBox } from '@/components/search/SearchBox';
import type { SearchItem } from '@/lib/search/searchIndex';
import { SEARCH_LABELS } from '@/lib/copy/searchStrings';

const ITEMS: SearchItem[] = [
  { contentType: 'scenario', title: 'Datang tanpa rujukan', snippet: 'Jalur JKN dimulai dari FKTP.', href: '/id/petugas/tanpa-rujukan' },
  { contentType: 'reference', title: 'Alat kesehatan — Kacamata', snippet: 'Kacamata dijamin JKN.', href: '/id/rujukan/alat-kesehatan#kacamata' },
  { contentType: 'condition', title: 'Operasi usus buntu', snippet: 'Baik operasi terbuka maupun laparoskopi.', href: '/id/kondisi/operasi-usus-buntu' },
];

describe('SearchBox', () => {
  it('has no axe violations in its initial (empty-query) state', async () => {
    const { container } = render(<SearchBox items={ITEMS} />);
    expect(await axe(container)).toHaveNoViolations();
  });

  it('shows the prompt with an empty query, not results or "not found"', () => {
    const { getByText, queryByText } = render(<SearchBox items={ITEMS} />);
    expect(getByText(SEARCH_LABELS.prompt)).toBeInTheDocument();
    expect(queryByText(SEARCH_LABELS.noResults)).not.toBeInTheDocument();
  });

  it('filters results across all three content types as the user types', () => {
    const { getByPlaceholderText, getByText, queryByText } = render(<SearchBox items={ITEMS} />);
    fireEvent.change(getByPlaceholderText(SEARCH_LABELS.placeholder), { target: { value: 'operasi' } });
    expect(getByText('Operasi usus buntu')).toBeInTheDocument();
    expect(queryByText('Alat kesehatan — Kacamata')).not.toBeInTheDocument();
  });

  it('shows the no-results message for a query matching nothing', () => {
    const { getByPlaceholderText, getByText } = render(<SearchBox items={ITEMS} />);
    fireEvent.change(getByPlaceholderText(SEARCH_LABELS.placeholder), { target: { value: 'zzz' } });
    expect(getByText(SEARCH_LABELS.noResults)).toBeInTheDocument();
  });

  it('has no axe violations with results shown', async () => {
    const { container, getByPlaceholderText } = render(<SearchBox items={ITEMS} />);
    fireEvent.change(getByPlaceholderText(SEARCH_LABELS.placeholder), { target: { value: 'jkn' } });
    expect(await axe(container)).toHaveNoViolations();
  });
});
