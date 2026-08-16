import type { Scenario } from '@/lib/scenario/schema';

export const tanpaRujukan: Scenario = {
  id: 'tanpa-rujukan',
  title: 'Datang ke rumah sakit tanpa surat rujukan',
  explanation:
    'Jalur JKN dimulai dari fasilitas kesehatan tingkat pertama (FKTP) — Puskesmas atau klinik — sebelum ke rumah sakit, kecuali dalam keadaan gawat darurat. Ini yang bisa dilakukan sekarang.',
  routing: { type: 'single', payer: { type: 'self', label: 'Mandiri, kecuali dirujuk balik ke jalur JKN' } },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'rujukan-berjenjang' }],
  nextAction:
    'Tanyakan ke petugas apakah kondisi ini termasuk gawat darurat. Jika bukan, Puskesmas atau klinik terdekat dapat menerbitkan surat rujukan untuk melanjutkan ke rumah sakit melalui jalur JKN.',
  questionToAsk:
    'Tanyakan ke petugas: apakah kasus saya bisa dilayani melalui jalur gawat darurat, atau saya perlu surat rujukan dari FKTP dulu?',
};
