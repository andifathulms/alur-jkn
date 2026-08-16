import { UNOFFICIAL_STATEMENT } from '@/lib/copy/strings';

/** CLAUDE.md invariant 12: appears in every screen footer, not only the about page. */
export function Footer() {
  return (
    <footer className="border-t border-rule mt-12 px-4 py-6 sm:px-6">
      <p className="text-caption text-ink/70 max-w-3xl mx-auto">{UNOFFICIAL_STATEMENT}</p>
    </footer>
  );
}
