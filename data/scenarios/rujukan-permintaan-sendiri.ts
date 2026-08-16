import type { Scenario } from '@/lib/content/scenario';

export const rujukanPermintaanSendiri: Scenario = {
  contentType: 'scenario',
  id: 'rujukan-permintaan-sendiri',
  title: 'Rujukan diminta sendiri, bukan atas indikasi medis',
  explanation:
    'Surat rujukan yang sah diterbitkan oleh FKTP berdasarkan kebutuhan pelayanan, bukan atas permintaan peserta semata. Rujukan yang diminta sendiri tanpa indikasi medis dari FKTP tidak berjalan sebagai jalur berjenjang yang dijamin.',
  outcome: {
    type: 'depends',
    question: 'Berdasarkan pemeriksaan, apakah ada indikasi medis untuk merujuk ke rumah sakit?',
  },
  position: { type: 'station', stationId: 'fktp' },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'rujukan-permintaan-sendiri' }],
  nextAction:
    'Kembali ke FKTP dan sampaikan keluhan secara lengkap kepada dokter di sana. Jika dokter menilai ada indikasi medis untuk dirujuk, rujukan akan diterbitkan melalui jalur yang dijamin.',
  questionToAsk:
    'Tanyakan ke petugas FKTP: berdasarkan pemeriksaan, apakah ada indikasi medis untuk merujuk saya ke rumah sakit?',
};
