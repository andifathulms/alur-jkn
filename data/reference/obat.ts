import type { Reference } from '@/lib/content/reference';

const FORNAS_CITATION = {
  instrument: 'Keputusan Menteri Kesehatan tentang Formularium Nasional',
  article: 'Ketentuan Umum',
  sourceUrl: 'https://farmalkes.kemkes.go.id/',
  verifiedAt: '2026-08-16',
} as const;

/**
 * MIGRATION.md step 4 — Fornas: covered medicines come from the national
 * formulary, and what happens when a doctor prescribes outside it.
 * Complements the existing obat-di-luar-fornas scenario with the fuller
 * mechanism. Draft, pending re-verification (UPDATING.md).
 */
export const obat: Reference = {
  contentType: 'reference',
  format: 'entryList',
  slug: 'obat',
  title: 'Obat — Formularium Nasional',
  summary: 'Obat yang dijamin JKN mengacu pada Formularium Nasional (Fornas); obat di luar daftar itu mengikuti jalur persetujuan tersendiri.',
  position: { type: 'station', stationId: 'obatNonFornas' },
  tabular: false,
  entries: [
    {
      term: 'Formularium Nasional (Fornas)',
      definition: 'Fornas adalah daftar obat yang penggunaannya dijamin dalam program JKN.',
      detail:
        'Daftar ini disusun dan diperbarui secara berkala oleh Kementerian Kesehatan berdasarkan pertimbangan efektivitas, keamanan, dan efisiensi biaya. Peresepan sesuai Fornas berjalan melalui jalur penjaminan normal di fasilitas kesehatan yang bekerja sama.',
      citation: FORNAS_CITATION,
    },
    {
      term: 'Obat di luar Fornas',
      definition: 'Obat yang tidak tercantum dalam Fornas dapat digunakan atas indikasi medis tertentu, melalui persetujuan komite medik fasilitas kesehatan.',
      detail:
        'Dokter yang merawat mengajukan usulan penggunaan ke komite atau panitia farmasi dan terapi fasilitas kesehatan tersebut. Status penjaminannya bergantung pada keputusan komite dan kebijakan fasilitas — bukan sesuatu yang bisa dipastikan sebelum diajukan.',
      citation: FORNAS_CITATION,
    },
    {
      term: 'Pengambilan obat program rujuk balik',
      definition: 'Untuk penyakit kronis dalam program rujuk balik, obat rutin dapat diambil di FKTP tanpa perlu ke rumah sakit setiap kali.',
      detail:
        'Ini berlaku untuk peserta yang sudah dinyatakan stabil oleh dokter spesialis dan masuk program rujuk balik. Jenis obat yang diberikan tetap mengacu pada Fornas.',
      citation: FORNAS_CITATION,
    },
  ],
};
