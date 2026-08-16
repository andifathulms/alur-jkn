import type { Scenario } from '@/lib/content/scenario';

export const kecelakaanLaluLintas: Scenario = {
  contentType: 'scenario',
  id: 'kecelakaan-lalu-lintas',
  title: 'Kecelakaan lalu lintas',
  explanation:
    'Untuk kasus kecelakaan lalu lintas, program jaminan kecelakaan lalu lintas wajib (Jasa Raharja) menanggung lebih dulu sampai batas tertentu sesuai hak kelas rawat. Setelah batas itu, JKN melanjutkan penjaminan. Ini pembagian antar-penjamin, bukan penolakan.',
  outcome: {
    type: 'payer',
    routing: {
      type: 'coordination',
      primary: { type: 'jasaRaharja', label: 'Jasa Raharja' },
      primaryLimitNote: 'sampai batas nilai sesuai hak kelas rawat peserta',
      continuesWith: { type: 'jkn', label: 'JKN' },
    },
  },
  position: { type: 'station', stationId: 'rumahSakit' },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'kecelakaan-lalu-lintas-koordinasi' }],
  nextAction:
    'Siapkan laporan kepolisian atau bukti kejadian kecelakaan jika ada, untuk proses klaim Jasa Raharja. Pihak fasilitas kesehatan yang akan mengoordinasikan penjaminan dengan Jasa Raharja dan JKN.',
  questionToAsk:
    'Tanyakan ke petugas: berapa batas penjaminan Jasa Raharja untuk kasus ini, dan bagaimana JKN melanjutkan setelah batas itu?',
};
