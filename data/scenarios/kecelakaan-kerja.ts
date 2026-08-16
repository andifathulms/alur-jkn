import type { Scenario } from '@/lib/scenario/schema';

export const kecelakaanKerja: Scenario = {
  id: 'kecelakaan-kerja',
  title: 'Kecelakaan kerja atau penyakit akibat kerja',
  explanation:
    'Untuk kasus kecelakaan kerja atau penyakit akibat kerja, program jaminan kecelakaan kerja menanggung lebih dulu. JKN melanjutkan penjaminan apabila hak jaminan kecelakaan kerja telah habis atau tidak mencakup layanan yang diperlukan. Ini pembagian antar-penjamin, bukan penolakan.',
  routing: {
    type: 'coordination',
    primary: { type: 'jaminanKecelakaanKerja', label: 'Jaminan Kecelakaan Kerja' },
    primaryLimitNote: 'sampai hak jaminan kecelakaan kerja habis atau tidak lagi mencakup layanan',
    continuesWith: { type: 'jkn', label: 'JKN' },
  },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'kecelakaan-kerja-koordinasi' }],
  nextAction:
    'Sampaikan ke bagian administrasi tempat kerja atau BPJS Ketenagakerjaan mengenai kejadian ini, untuk proses klaim jaminan kecelakaan kerja. Fasilitas kesehatan akan mengoordinasikan penjaminan dengan JKN bila diperlukan.',
  questionToAsk:
    'Tanyakan ke petugas: apakah kasus ini sudah diproses melalui jaminan kecelakaan kerja, dan bagaimana JKN melanjutkan jika hak tersebut telah habis?',
};
