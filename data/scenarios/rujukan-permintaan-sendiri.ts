import type { Scenario } from '@/lib/scenario/schema';

export const rujukanPermintaanSendiri: Scenario = {
  id: 'rujukan-permintaan-sendiri',
  title: 'Rujukan diminta sendiri, bukan atas indikasi medis',
  explanation:
    'Surat rujukan yang sah diterbitkan oleh FKTP berdasarkan kebutuhan pelayanan, bukan atas permintaan peserta semata. Rujukan yang diminta sendiri tanpa indikasi medis dari FKTP tidak berjalan sebagai jalur berjenjang yang dijamin.',
  routing: { type: 'single', payer: { type: 'self', label: 'Mandiri, kecuali FKTP menilai ada indikasi medis' } },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'rujukan-permintaan-sendiri' }],
  nextAction:
    'Kembali ke FKTP dan sampaikan keluhan secara lengkap kepada dokter di sana. Jika dokter menilai ada indikasi medis untuk dirujuk, rujukan akan diterbitkan melalui jalur yang dijamin.',
  questionToAsk:
    'Tanyakan ke petugas FKTP: berdasarkan pemeriksaan, apakah ada indikasi medis untuk merujuk saya ke rumah sakit?',
};
