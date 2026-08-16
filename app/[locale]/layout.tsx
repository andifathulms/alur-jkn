import Link from 'next/link';
import { Footer } from '@/components/layout/Footer';
import { APP_NAME } from '@/lib/copy/strings';

export function generateStaticParams() {
  // English is structurally supported but not yet content-complete — see app/fonts.ts sibling note.
  return [{ locale: 'id' }];
}

const NAV = [
  { href: '/id/alur', label: 'Alur' },
  { href: '/id/petugas', label: 'Mode petugas' },
  { href: '/id/keluarga', label: 'Mode keluarga' },
  { href: '/id/rujukan', label: 'Referensi JKN' },
  { href: '/id/aturan', label: 'Referensi aturan' },
] as const;

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="no-print border-b border-rule px-4 py-4 sm:px-6 flex items-center justify-between flex-wrap gap-3">
        <Link href="/id" className="text-key font-medium">
          {APP_NAME}
        </Link>
        <nav className="flex gap-4 flex-wrap text-body">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="underline underline-offset-4">
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
