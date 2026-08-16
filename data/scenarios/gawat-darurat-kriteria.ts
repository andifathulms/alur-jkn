import type { Scenario } from '@/lib/scenario/schema';

export const gawatDaruratKriteria: Scenario = {
  id: 'gawat-darurat-kriteria',
  title: 'Apakah ini keadaan gawat darurat?',
  explanation:
    'Kalau ini keadaan gawat darurat, langsung ke IGD sekarang. Urusan jaminan bisa dibereskan setelahnya. Kriteria gawat darurat ditetapkan oleh penilaian tenaga medis di fasilitas kesehatan berdasarkan ancaman terhadap nyawa atau risiko kecacatan — bukan oleh perasaan cemas keluarga, dan bukan sesuatu yang perlu dipastikan sebelum berangkat.',
  routing: { type: 'single', payer: { type: 'jkn', label: 'JKN, tanpa perlu rujukan lebih dulu' } },
  ruleRefs: [
    { packId: 'perpres-82-2018', ruleId: 'gawat-darurat-akses-langsung' },
    { packId: 'permenkes-47-2018', ruleId: 'kriteria-gawat-darurat' },
  ],
  nextAction:
    'Langsung ke IGD fasilitas kesehatan terdekat, bahkan yang tidak bekerja sama dengan BPJS Kesehatan. Setelah kondisi stabil, fasilitas akan mengatur pemindahan ke fasilitas yang bekerja sama bila diperlukan.',
  questionToAsk:
    'Tanyakan ke petugas: apakah kondisi ini masuk kriteria gawat darurat menurut Permenkes 47/2018?',
};
