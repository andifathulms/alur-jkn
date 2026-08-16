'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export interface RailItem {
  slug: string;
  title: string;
}

/**
 * DESIGN.md v2 §4: "the index is the product for staff" — always visible
 * on desktop as a left rail, collapsible on mobile (native <details>, no
 * JS needed for the collapse itself), search filters it live. Nothing
 * typed here is stored or transmitted — invariant 10, it's a local filter
 * over an already-loaded list, not a search request.
 */
export function ReferenceRail({ items }: { items: RailItem[] }) {
  const [query, setQuery] = useState('');
  const pathname = usePathname();
  const filtered = items.filter((item) => item.title.toLowerCase().includes(query.trim().toLowerCase()));

  return (
    <nav aria-label="Daftar referensi" className="no-print">
      <details open>
        <summary className="md:hidden min-h-target flex items-center px-3 font-medium cursor-pointer border-2 border-ink rounded-md mb-3">
          Daftar referensi
        </summary>
        <div className="md:sticky md:top-4">
          <label className="block mb-3">
            <span className="sr-only">Cari referensi</span>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Cari referensi…"
              className="w-full min-h-target px-3 border-2 border-ink rounded-md text-body bg-paper"
            />
          </label>
          <ul className="space-y-1">
            {filtered.map((item) => {
              const href = `/id/rujukan/${item.slug}`;
              const active = pathname === href;
              return (
                <li key={item.slug}>
                  <Link
                    href={href}
                    aria-current={active ? 'page' : undefined}
                    className={`min-h-target flex items-center px-3 rounded-md text-body ${
                      active ? 'bg-ink text-paper' : 'hover:bg-ink/5'
                    }`}
                  >
                    {item.title}
                  </Link>
                </li>
              );
            })}
            {filtered.length === 0 && <li className="text-caption text-ink/70 px-3 py-2">Tidak ditemukan.</li>}
          </ul>
        </div>
      </details>
    </nav>
  );
}
