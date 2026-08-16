import type { Scenario } from '@/lib/content/scenario';

export const tanpaRujukan: Scenario = {
  contentType: 'scenario',
  id: 'tanpa-rujukan',
  title: 'Datang ke rumah sakit tanpa surat rujukan',
  explanation:
    'Jalur JKN dimulai dari fasilitas kesehatan tingkat pertama (FKTP) — Puskesmas atau klinik — sebelum ke rumah sakit, kecuali dalam keadaan gawat darurat. Ini yang bisa dilakukan sekarang.',
  outcome: {
    type: 'depends',
    question: 'Apakah kondisi ini masuk kriteria gawat darurat, atau perlu rujukan dari FKTP dulu?',
  },
  position: { type: 'station', stationId: 'rumahSakit' },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'rujukan-berjenjang' }],
  nextAction:
    'Tanyakan ke petugas apakah kondisi ini termasuk gawat darurat. Jika bukan, Puskesmas atau klinik terdekat dapat menerbitkan surat rujukan untuk melanjutkan ke rumah sakit melalui jalur JKN.',
  questionToAsk:
    'Tanyakan ke petugas: apakah kasus saya bisa dilayani melalui jalur gawat darurat, atau saya perlu surat rujukan dari FKTP dulu?',
};
