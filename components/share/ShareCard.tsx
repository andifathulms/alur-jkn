'use client';

import { useState } from 'react';

/**
 * DESIGN.md §5: every scenario has a one-page layout that prints cleanly in
 * black and white and exports as a share card. PRD.md §6.5: sized and
 * worded for WhatsApp — "the family forwards it to the relative asking
 * questions from another city." wa.me is a plain link the user clicks, not
 * a background request — consistent with invariant 5 (zero *runtime*
 * network calls the app initiates on its own).
 */
export function ShareCard({ shareText }: { shareText: string }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    await navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;

  return (
    <div className="no-print flex gap-4 flex-wrap">
      <button
        type="button"
        onClick={() => window.print()}
        className="min-h-[48px] px-4 border-2 border-ink rounded-md text-body font-medium hover:bg-ink/5"
      >
        Cetak
      </button>
      <button
        type="button"
        onClick={copyText}
        className="min-h-[48px] px-4 border-2 border-ink rounded-md text-body font-medium hover:bg-ink/5"
      >
        {copied ? 'Tersalin' : 'Salin teks'}
      </button>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        className="min-h-[48px] px-4 border-2 border-ink rounded-md text-body font-medium hover:bg-ink/5 inline-flex items-center"
      >
        Bagikan lewat WhatsApp
      </a>
    </div>
  );
}
