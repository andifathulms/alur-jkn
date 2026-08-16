import type { Reference } from '@/lib/content/reference';

const KELAS_CITATION = {
  instrument: 'Perpres 82/2018 tentang Jaminan Kesehatan, sebagaimana diubah dengan Perpres 59/2024',
  article: 'Pasal 51 ayat (3)',
  sourceUrl: 'https://peraturan.bpk.go.id/Details/103187/perpres-no-82-tahun-2018',
  verifiedAt: '2026-08-16',
} as const;

/**
 * MIGRATION.md step 4 — class entitlement and the naik kelas difference
 * rules. Perpres 59/2024 introduced a transition toward a single Kelas
 * Rawat Inap Standar (KRIS), replacing the three-tier kelas 1/2/3 system —
 * this repo's author is not confident about the current implementation
 * status of that transition, so this hedges explicitly rather than
 * asserting a specific current state (CLAUDE.md: "cite the ambiguity
 * rather than resolving it"). Draft, pending re-verification (UPDATING.md).
 */
export const kelas: Reference = {
  contentType: 'reference',
  format: 'entryList',
  slug: 'kelas',
  title: 'Kelas rawat inap',
  summary: 'Hak kelas rawat inap ditentukan oleh segmen kepesertaan, dan peserta dapat memilih naik kelas dengan membayar selisih.',
  position: { type: 'station', stationId: 'naikKelas' },
  entries: [
    {
      term: 'Hak kelas rawat inap',
      definition: 'Hak kelas rawat inap peserta JKN ditentukan oleh segmen kepesertaan — misalnya penerima bantuan iuran (PBI) atau peserta mandiri sesuai kelas iuran yang dipilih.',
      detail:
        'Perpres 82/2018 mengalami perubahan melalui Perpres 59/2024 yang mengarah pada penyeragaman kelas rawat inap menjadi Kelas Rawat Inap Standar (KRIS). Status penerapan KRIS dapat berbeda antar fasilitas kesehatan pada masa transisi — tanyakan langsung ke petugas mengenai kelas yang berlaku saat ini.',
      citation: KELAS_CITATION,
    },
    {
      term: 'Naik kelas rawat inap',
      definition: 'Peserta dapat memilih naik kelas rawat inap di atas haknya, dengan membayar selisih biaya secara mandiri atau melalui asuransi tambahan.',
      detail:
        'JKN tetap menanggung sebesar hak kelas peserta; selisih antara tarif kelas yang dipilih dan tarif kelas hak peserta dibayar terpisah. Ini pembagian pembiayaan, bukan pengecualian penjaminan (lihat juga skenario "Naik kelas rawat inap" di mode petugas/keluarga).',
      citation: KELAS_CITATION,
    },
    {
      term: 'Kelas Rawat Inap Standar (KRIS)',
      definition: 'KRIS adalah kebijakan penyeragaman kelas rawat inap menjadi satu standar, menggantikan sistem kelas 1/2/3 secara bertahap.',
      detail:
        'Kebijakan ini masih dalam masa transisi implementasi menurut Perpres 59/2024. Karena statusnya dapat berbeda antar rumah sakit dan berubah dari waktu ke waktu, halaman ini tidak memastikan status penerapannya di fasilitas tertentu — tanyakan langsung ke petugas.',
      citation: KELAS_CITATION,
    },
  ],
};
