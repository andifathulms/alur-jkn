import type { Reference } from '@/lib/content/reference';

const CITATION = {
  instrument: 'Perpres 82/2018 tentang Jaminan Kesehatan',
  article: 'Pasal 52',
  sourceUrl: 'https://peraturan.bpk.go.id/Details/103187/perpres-no-82-tahun-2018',
  verifiedAt: '2026-08-16',
} as const;

/**
 * MIGRATION.md step 4, PRD.md §3 — "the only things this app may describe
 * as 'not covered' are the items enumerated in Perpres 82/2018 Pasal 52."
 * Every entry's `detail` ends with the citation mentioned inline in the
 * prose itself (not just structurally attached), so copy:check's Pasal 52
 * rule validates the real authored text, not a synthetic reconstruction.
 *
 * This list is DRAFT and NOT asserted complete. PRD.md §5.2 describes the
 * real list as "around twenty-one items" — this repo's author has
 * reasonable confidence in the items below from general policy knowledge,
 * not from having re-read the consolidated regulation entry by entry. Do
 * not treat this as the full enumeration until it's re-verified against
 * JDIH BPK (UPDATING.md) — a missing item here is a bigger safety problem
 * than a missing item anywhere else in the app, because pengecualian is
 * the one place "not covered" is allowed to be said at all.
 */
export const pengecualian: Reference = {
  contentType: 'reference',
  format: 'entryList',
  slug: 'pengecualian',
  title: 'Pengecualian — Pasal 52',
  summary:
    'Pelayanan yang benar-benar tidak ditanggung JKN, berdasarkan Perpres 82/2018 Pasal 52 — daftar ini sedang diverifikasi ulang dan belum dipastikan lengkap.',
  // The whole off-network cluster, not one item — no single station/off-network id fits.
  position: null,
  entries: [
    {
      term: 'Pelayanan estetik',
      definition: 'Pelayanan untuk tujuan kecantikan atau estetik tidak ditanggung JKN.',
      detail:
        'Contoh: perawatan kulit atau bentuk tubuh yang dilakukan tanpa indikasi medis, semata untuk penampilan. Tindakan medis dengan indikasi medis yang jelas — misalnya rekonstruksi akibat kecelakaan atau kelainan bawaan — bukan pelayanan estetik dan tidak termasuk pengecualian ini (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Penanganan infertilitas',
      definition: 'Pelayanan untuk mengatasi ketidaksuburan (kemandulan) tidak ditanggung JKN.',
      detail:
        'Contoh: program bayi tabung dan prosedur kesuburan lain. Ini berlaku untuk penanganan infertilitas itu sendiri, terlepas dari layanan kesehatan reproduksi lain yang tetap dijamin di luar konteks ini (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Perataan gigi (ortodonsi)',
      definition: 'Perawatan meratakan gigi untuk tujuan kerapian tidak ditanggung JKN.',
      detail:
        'Contoh: pemasangan kawat gigi untuk alasan estetik. Perawatan gigi dengan indikasi medis di luar perataan — pencabutan, penambalan, perawatan saluran akar — tetap mengikuti jalur penjaminan yang berlaku (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Ketergantungan obat dan/atau alkohol',
      definition: 'Gangguan kesehatan akibat ketergantungan obat terlarang dan/atau alkohol tidak ditanggung JKN.',
      detail:
        'Ini merujuk pada gangguan kesehatan yang timbul akibat penyalahgunaan zat tersebut. Layanan rehabilitasi dan kesehatan jiwa di luar konteks ini mengikuti ketentuan yang berlaku umum (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Akibat menyakiti diri sendiri atau hobi berisiko tinggi',
      definition:
        'Gangguan kesehatan akibat sengaja menyakiti diri sendiri, atau akibat hobi yang membahayakan diri, tidak ditanggung JKN.',
      detail:
        'Contoh: cedera akibat olahraga ekstrem yang secara sengaja mengambil risiko tinggi di luar keperluan medis atau keselamatan. Penilaian atas kasus tertentu ada di tangan petugas, bukan pasien atau keluarga (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Pengobatan alternatif dan komplementer',
      definition:
        'Pengobatan komplementer, alternatif, dan tradisional yang belum dinyatakan efektif berdasarkan penilaian teknologi kesehatan tidak ditanggung JKN.',
      detail:
        'Contoh: pengobatan tradisional atau komplementer yang belum melalui dan lulus penilaian teknologi kesehatan (health technology assessment) resmi. Metode yang sudah dinyatakan efektif melalui penilaian tersebut mengikuti jalur penjaminan biasa (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Pengobatan dan tindakan eksperimental',
      definition: 'Pengobatan dan tindakan medis yang dikategorikan sebagai percobaan (eksperimen) tidak ditanggung JKN.',
      detail:
        'Ini mencakup metode yang belum ditetapkan sebagai standar pelayanan kesehatan yang berlaku. Uji klinis yang diselenggarakan secara resmi biasanya memiliki skema pembiayaan tersendiri di luar JKN (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Alat kontrasepsi, kosmetik, dan perbekalan kesehatan rumah tangga',
      definition: 'Alat kontrasepsi, kosmetik, dan perbekalan kesehatan rumah tangga tidak ditanggung JKN.',
      detail:
        'Contoh: sabun antiseptik, plester, termometer rumah tangga. Program keluarga berencana pemerintah punya skema pembiayaannya sendiri di luar JKN, terpisah dari pengecualian ini (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Pelayanan pada masa tanggap darurat bencana atau wabah',
      definition:
        'Pelayanan kesehatan akibat bencana pada masa tanggap darurat dan kejadian luar biasa/wabah tidak ditanggung JKN.',
      detail:
        'Penanganan pada periode ini biasanya dibiayai melalui skema penanggulangan bencana atau kedaruratan kesehatan masyarakat tersendiri, bukan melalui JKN (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Pelayanan yang dilakukan di luar negeri',
      definition: 'Pelayanan kesehatan yang dilakukan di luar wilayah Indonesia tidak ditanggung JKN.',
      detail:
        'JKN adalah program dalam negeri; penjaminannya tidak berlaku untuk layanan yang diperoleh di fasilitas kesehatan luar negeri (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
    {
      term: 'Pelayanan lain di luar manfaat jaminan kesehatan',
      definition: 'Pelayanan yang tidak ada hubungannya dengan manfaat jaminan kesehatan yang diberikan tidak ditanggung JKN.',
      detail:
        'Ini adalah ketentuan penutup yang mencakup layanan di luar cakupan manfaat JKN secara umum, bukan kategori tersendiri dengan contoh spesifik (Perpres 82/2018 Pasal 52).',
      citation: CITATION,
    },
  ],
};
