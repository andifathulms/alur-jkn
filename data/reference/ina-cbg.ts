import type { Reference } from '@/lib/content/reference';

/**
 * PRD.md v2 §3, §5.2 — the spine. MIGRATION.md step 3: mechanism only, no
 * rupiah figures (enforced by lib/copy/bannedPhrases.ts's Rp pattern via
 * copy:check). This is the correction the whole product exists to make:
 * "not covered" is usually staff shorthand for "not deliverable inside
 * this hospital's INA-CBG package," and patients hear it as refusal.
 */
export const inaCbg: Reference = {
  contentType: 'reference',
  format: 'explainer',
  slug: 'ina-cbg',
  title: 'INA-CBG: bagaimana JKN membayar rumah sakit',
  summary:
    'JKN membayar rumah sakit per kelompok kasus dalam satu paket, bukan per tindakan — dan itu menentukan metode apa yang bisa ditawarkan rumah sakit kepada Anda.',
  position: { type: 'station', stationId: 'rumahSakit' },
  sections: [
    {
      heading: 'Paket per kelompok kasus, bukan per tindakan',
      body: 'JKN membayar rumah sakit menggunakan sistem INA-CBG: satu tarif paket untuk satu kelompok kasus (case-mix group), bukan dihitung per tindakan atau per metode yang dipakai. Kelompok kasus ditentukan oleh diagnosis dan prosedur yang tercatat, bukan oleh cara dokter melakukannya.',
    },
    {
      heading: 'Paket yang sama, metode yang berbeda',
      body: 'Tarif paket tetap sama meskipun metode yang dipakai di dalamnya berbeda. Untuk kasus yang bisa ditangani lebih dari satu cara — misalnya operasi terbuka atau laparoskopi — paket INA-CBG-nya tidak berubah karena metode yang dipilih. Yang berbeda adalah biaya yang harus ditanggung rumah sakit sendiri untuk menyediakan metode tersebut di dalam paket itu.',
    },
    {
      heading: 'Tarif bervariasi menurut kelas rumah sakit dan wilayah',
      body: 'Nilai tarif paket berbeda-beda menurut kelas rumah sakit (A, B, C, atau D) dan menurut salah satu dari lima regional tarif yang berlaku secara nasional. Karena itu, angka tarif tidak dicantumkan di sini — nilainya berubah menurut faktor-faktor ini, dan menampilkan satu angka akan menyesatkan untuk rumah sakit lain.',
    },
    {
      heading: 'Yang menentukan pilihan di rumah sakit Anda',
      body: 'Karena tarif paket tetap sama, pilihan metode di rumah sakit ditentukan oleh indikasi medis dari dokter dan oleh kemampuan rumah sakit menyediakan metode itu dalam batas paket yang berlaku — bukan oleh keputusan BPJS Kesehatan menolak metode tertentu. Kesan bahwa suatu metode tidak masuk penjaminan biasanya keliru: yang sebenarnya berlaku adalah keterbatasan rumah sakit dalam paket yang sama.',
    },
  ],
  // Both citations are draft — pending re-verification against the consolidated
  // text before publish, same as every rule pack (see UPDATING.md).
  citations: [
    {
      instrument:
        'Permenkes 3/2023 tentang Standar Tarif Pelayanan Kesehatan dalam Penyelenggaraan Program Jaminan Kesehatan',
      article: 'Pasal 3',
      sourceUrl: 'https://peraturan.bpk.go.id/Search?keywords=Permenkes+3+2023+Standar+Tarif+Pelayanan+Kesehatan',
      verifiedAt: '2026-08-16',
    },
    {
      instrument:
        'Permenkes 3/2023 tentang Standar Tarif Pelayanan Kesehatan dalam Penyelenggaraan Program Jaminan Kesehatan',
      article: 'Lampiran I (tarif menurut kelas rumah sakit dan regional)',
      sourceUrl: 'https://peraturan.bpk.go.id/Search?keywords=Permenkes+3+2023+Standar+Tarif+Pelayanan+Kesehatan',
      verifiedAt: '2026-08-16',
    },
  ],
};
