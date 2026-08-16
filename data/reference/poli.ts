import type { Reference } from '@/lib/content/reference';

const RUJUKAN_BERJENJANG_CITATION = {
  instrument: 'Perpres 82/2018 tentang Jaminan Kesehatan',
  article: 'Pasal 51-53',
  sourceUrl: 'https://peraturan.bpk.go.id/Details/103187/perpres-no-82-tahun-2018',
  verifiedAt: '2026-08-16',
} as const;

/**
 * MIGRATION.md step 4 — which specialties need a referral, referral
 * validity, internal referral rules, when re-referral is required. Draft,
 * pending re-verification (UPDATING.md) — validity periods in particular
 * have changed across JKN system versions, so this describes the
 * mechanism rather than asserting a specific day-count it isn't confident
 * about, per CLAUDE.md's "cite the ambiguity rather than resolving it."
 */
export const poli: Reference = {
  contentType: 'reference',
  format: 'entryList',
  slug: 'poli',
  title: 'Poli — rujukan ke spesialis',
  summary: 'Kapan rujukan ke dokter spesialis diperlukan, berapa lama rujukan berlaku, dan kapan rujukan baru dibutuhkan.',
  position: { type: 'station', stationId: 'subSpesialis' },
  tabular: false,
  entries: [
    {
      term: 'Rujukan ke poli spesialis',
      definition: 'Kunjungan ke dokter spesialis di rumah sakit umumnya memerlukan rujukan dari FKTP.',
      detail:
        'Ini berlaku untuk hampir semua poli spesialis, kecuali dalam keadaan gawat darurat. FKTP menilai kebutuhan pelayanan dan menerbitkan rujukan ke poli yang sesuai.',
      citation: RUJUKAN_BERJENJANG_CITATION,
    },
    {
      term: 'Masa berlaku rujukan',
      definition: 'Setiap rujukan berlaku untuk jangka waktu tertentu, bukan selamanya.',
      detail:
        'Jangka waktu persisnya mengikuti ketentuan sistem rujukan yang berlaku saat ini dan dapat berbeda untuk penyakit kronis melalui program rujuk balik. Tanyakan langsung ke FKTP atau petugas BPJS Kesehatan untuk masa berlaku rujukan yang sedang berjalan.',
      citation: RUJUKAN_BERJENJANG_CITATION,
    },
    {
      term: 'Rujukan internal antar-poli',
      definition:
        'Jika di rumah sakit dokter spesialis menemukan kebutuhan ke poli spesialis lain, rujukan internal dapat diterbitkan tanpa kembali ke FKTP.',
      detail:
        'Rujukan internal ini tetap dalam satu episode perawatan di rumah sakit yang sama — bukan rujukan baru dari awal jalur berjenjang.',
      citation: RUJUKAN_BERJENJANG_CITATION,
    },
    {
      term: 'Kapan rujukan baru diperlukan',
      definition: 'Rujukan baru dari FKTP diperlukan setelah rujukan sebelumnya habis masa berlakunya, atau untuk keluhan baru yang tidak terkait.',
      detail:
        'Kembali ke FKTP untuk mendapatkan rujukan baru bila kunjungan berikutnya berada di luar masa berlaku rujukan sebelumnya, atau menyangkut kondisi yang berbeda dari yang dirujuk semula.',
      citation: RUJUKAN_BERJENJANG_CITATION,
    },
    {
      term: 'Program rujuk balik untuk penyakit kronis',
      definition:
        'Untuk penyakit kronis tertentu yang kondisinya stabil, peserta dapat kembali dipantau di FKTP melalui program rujuk balik, dengan pengambilan obat rutin di FKTP.',
      detail:
        'Ini mengurangi kebutuhan bolak-balik ke rumah sakit untuk kondisi yang sudah stabil. Dokter spesialis di rumah sakit yang menentukan kelayakan program rujuk balik untuk kasus tertentu.',
      citation: RUJUKAN_BERJENJANG_CITATION,
    },
  ],
};
