import type { Metadata } from 'next';
import { atkinson, plexMono } from './fonts';
import { APP_NAME } from '@/lib/copy/strings';
import './globals.css';

export const metadata: Metadata = {
  title: APP_NAME,
  description:
    'Menjelaskan alur rujukan dan penjaminan JKN, dan menghasilkan pertanyaan yang tepat untuk ditanyakan ke petugas.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${atkinson.variable} ${plexMono.variable}`}>
      <body className="bg-paper text-ink font-sans text-body antialiased">{children}</body>
    </html>
  );
}
