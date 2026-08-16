import type { Scenario } from '@/lib/scenario/schema';

export const naikKelasRawat: Scenario = {
  id: 'naik-kelas-rawat',
  title: 'Naik kelas rawat inap',
  explanation:
    'Peserta dapat memilih naik kelas rawat inap di atas haknya. Selisih biaya antara tarif kelas yang dipilih dan tarif kelas hak peserta dibayar secara mandiri atau melalui asuransi tambahan, sementara hak dasar tetap dijamin JKN.',
  routing: {
    type: 'coordination',
    primary: { type: 'jkn', label: 'JKN, sebesar hak kelas rawat' },
    primaryLimitNote: 'sampai tarif kelas hak peserta',
    continuesWith: { type: 'self', label: 'Mandiri untuk selisih biaya kelas yang dipilih' },
  },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'naik-kelas-rawat' }],
  nextAction:
    'Sampaikan ke bagian administrasi rumah sakit keinginan naik kelas, dan minta rincian selisih biaya per hari sebelum menyetujui.',
  questionToAsk:
    'Tanyakan ke petugas: berapa selisih biaya per hari untuk naik ke kelas yang saya minta, dan apakah ada asuransi tambahan yang bisa menutupnya?',
};
