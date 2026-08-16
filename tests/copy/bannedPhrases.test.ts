import { describe, it, expect } from 'vitest';
import { scanText } from '@/lib/copy/check';

describe('banned-phrase scan', () => {
  it('flags a clean sentence with zero violations', () => {
    expect(scanText('Untuk kasus ini, Jasa Raharja menanggung lebih dulu.', 'fixture')).toEqual([]);
  });

  it.each([
    'Anda tidak ditanggung.',
    'Anda tidak dijamin oleh JKN.',
    'Kasus Anda tidak ditanggung.',
    'You are not covered.',
    'Seharusnya Anda ke Puskesmas dulu.',
    'Anda salah datang ke sini.',
    'Pasien tidak akan dilayani di sini.',
    'Jangan ke IGD dulu.',
    'Apa gejala yang dirasakan?',
    'Tarif paket ini sebesar Rp 4.500.000.',
    'Biaya tambahan Rp500rb per hari.',
  ])('flags: "%s"', (text) => {
    expect(scanText(text, 'fixture').length).toBeGreaterThan(0);
  });
});
