import type { Scenario } from '@/lib/content/scenario';

export const kartuNonaktif: Scenario = {
  contentType: 'scenario',
  id: 'kartu-nonaktif',
  title: 'Status kartu tidak aktif',
  explanation:
    'Status kepesertaan yang menunggak iuran dapat menjadi tidak aktif. Kalau ini keadaan gawat darurat, langsung ke IGD sekarang — status kartu diurus setelahnya. Di luar keadaan gawat darurat, pelayanan dapat diproses ulang setelah tunggakan dilunasi.',
  outcome: {
    type: 'depends',
    question: 'Berapa besar tunggakan dan denda pelayanan yang berlaku, dan bagaimana proses pengaktifan kembali?',
  },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'kartu-tidak-aktif' }],
  nextAction:
    'Lunasi tunggakan iuran melalui kanal resmi BPJS Kesehatan (Mobile JKN, kantor cabang, atau mitra pembayaran) untuk mengaktifkan kembali status kepesertaan.',
  questionToAsk:
    'Tanyakan ke petugas: berapa besar tunggakan dan denda pelayanan yang berlaku untuk kasus ini, dan bagaimana proses pengaktifan kembali?',
};
