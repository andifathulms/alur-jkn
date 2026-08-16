import type { Scenario } from '@/lib/scenario/schema';

export const obatDiLuarFornas: Scenario = {
  id: 'obat-di-luar-fornas',
  title: 'Obat di luar Formularium Nasional',
  explanation:
    'Penjaminan obat bagi peserta JKN mengacu pada daftar Formularium Nasional. Obat di luar daftar itu dapat digunakan atas indikasi medis tertentu melalui persetujuan komite medik fasilitas kesehatan, dengan ketentuan penjaminan yang berlaku di fasilitas tersebut.',
  routing: { type: 'single', payer: { type: 'self', label: 'Mandiri, kecuali disetujui komite medik' } },
  ruleRefs: [{ packId: 'permenkes-formularium-nasional', ruleId: 'obat-di-luar-fornas' }],
  nextAction:
    'Minta dokter yang merawat mengajukan usulan penggunaan obat tersebut ke komite medik fasilitas untuk ditinjau.',
  questionToAsk:
    'Tanyakan ke petugas: apakah obat ini bisa diajukan lewat komite medik, dan bagaimana status penjaminannya jika disetujui?',
};
