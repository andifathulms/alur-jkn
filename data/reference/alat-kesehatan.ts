import type { Reference } from '@/lib/content/reference';

const ALKES_CITATION = {
  instrument: 'Peraturan BPJS Kesehatan tentang Kompendium Alat Kesehatan',
  article: 'Ketentuan Umum',
  sourceUrl: 'https://bpjs-kesehatan.go.id/',
  verifiedAt: '2026-08-16',
} as const;

/**
 * MIGRATION.md step 4 — glasses, hearing aids, dentures, prosthetics:
 * tariff ceilings and replacement intervals. No rupiah figures (invariant
 * 9) — ceilings are described qualitatively; replacement intervals are
 * time periods, not monetary amounts, so they're stated directly. Draft,
 * pending re-verification (UPDATING.md).
 */
export const alatKesehatan: Reference = {
  contentType: 'reference',
  format: 'entryList',
  slug: 'alat-kesehatan',
  title: 'Alat kesehatan',
  summary: 'Kacamata, alat bantu dengar, gigi tiruan, dan alat kesehatan lain yang dijamin JKN memiliki batas tarif dan jadwal penggantian tersendiri.',
  position: { type: 'station', stationId: 'alkesAboveCeiling' },
  tabular: true,
  entries: [
    {
      term: 'Kacamata',
      definition: 'Kacamata dijamin JKN dengan batas tarif tersendiri, sesuai kelas kepesertaan, dan jadwal penggantian berkala.',
      detail:
        'Peserta perlu resep dari dokter spesialis mata di fasilitas kesehatan yang bekerja sama. Nilai batas tarif berbeda menurut kelas kepesertaan dan tidak dicantumkan di sini agar tidak dibaca sebagai janji harga.',
      citation: ALKES_CITATION,
    },
    {
      term: 'Alat bantu dengar',
      definition: 'Alat bantu dengar dijamin JKN dengan batas tarif tersendiri dan jadwal penggantian berkala.',
      detail:
        'Diperlukan pemeriksaan dan rekomendasi dari dokter spesialis THT. Sama seperti alat kesehatan lain, nilai batas tarifnya tidak dicantumkan di sini karena bervariasi.',
      citation: ALKES_CITATION,
    },
    {
      term: 'Gigi tiruan (protesa gigi)',
      definition: 'Gigi tiruan lepasan dijamin JKN dengan batas tarif tersendiri per rahang, dan jadwal penggantian berkala.',
      detail:
        'Diperlukan indikasi medis dari dokter gigi di fasilitas kesehatan yang bekerja sama. Penggantian sebelum jadwal berkala umumnya memerlukan indikasi medis khusus.',
      citation: ALKES_CITATION,
    },
    {
      term: 'Kaki dan tangan palsu (protesa anggota gerak)',
      definition: 'Protesa anggota gerak dijamin JKN dengan batas tarif tersendiri sesuai jenis dan tingkat kebutuhan.',
      detail:
        'Diperlukan indikasi medis dan resep dari dokter spesialis terkait. Jenis dan tingkat protesa yang direkomendasikan mengikuti kebutuhan fungsional yang dinilai secara medis, bukan pilihan bebas peserta.',
      citation: ALKES_CITATION,
    },
    {
      term: 'Korset tulang belakang dan penyangga (collar neck, korset)',
      definition: 'Alat penyangga tulang belakang dan leher dijamin JKN dengan batas tarif tersendiri sesuai indikasi medis.',
      detail: 'Diperlukan resep dari dokter yang merawat, sesuai kondisi yang mendasarinya.',
      citation: ALKES_CITATION,
    },
  ],
};
