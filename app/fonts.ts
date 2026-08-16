import { Atkinson_Hyperlegible, IBM_Plex_Mono } from 'next/font/google';

/**
 * DESIGN.md §4: Atkinson Hyperlegible throughout, IBM Plex Mono only for
 * regulation references. next/font downloads and self-hosts at build time —
 * no runtime request, satisfying invariant 5.
 */
export const atkinson = Atkinson_Hyperlegible({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-atkinson',
  display: 'swap',
});

export const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});
