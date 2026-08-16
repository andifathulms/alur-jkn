'use client';

import { useState } from 'react';
import Link from 'next/link';
import { searchItems, type SearchItem } from '@/lib/search/searchIndex';
import { SEARCH_LABELS, CONTENT_TYPE_LABELS } from '@/lib/copy/searchStrings';

/**
 * MIGRATION.md step 6: search across all three content types. `items` is
 * built server-side (once, at build time) and passed in — this component
 * only filters an already-loaded array, invariant 11: nothing typed here
 * is sent anywhere.
 */
export function SearchBox({ items }: { items: SearchItem[] }) {
  const [query, setQuery] = useState('');
  const results = searchItems(items, query);

  return (
    <div>
      <label className="block">
        <span className="sr-only">Cari</span>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={SEARCH_LABELS.placeholder}
          className="w-full min-h-[56px] px-4 border-2 border-ink rounded-md text-body-lg"
        />
      </label>

      <div className="mt-6">
        {query.trim() === '' ? (
          <p className="text-body text-ink/70">{SEARCH_LABELS.prompt}</p>
        ) : results.length === 0 ? (
          <p className="text-body text-ink/70">{SEARCH_LABELS.noResults}</p>
        ) : (
          <ul className="space-y-3">
            {results.map((item) => (
              <SearchResultRow key={`${item.contentType}:${item.href}`} item={item} />
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function SearchResultRow({ item }: { item: SearchItem }) {
  return (
    <li>
      <Link
        href={item.href}
        className="block min-h-[48px] border border-rule rounded-md p-3 hover:bg-ink/5"
      >
        <span className="text-caption font-bold uppercase tracking-wide text-ink/70">
          {CONTENT_TYPE_LABELS[item.contentType]}
        </span>
        <p className="text-body-lg mt-1">{item.title}</p>
        <p className="text-body text-ink/70 mt-1">{item.snippet}</p>
      </Link>
    </li>
  );
}
