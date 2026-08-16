import type { Scenario } from '@/lib/content/scenario';

export const fasilitasTidakBekerjasama: Scenario = {
  contentType: 'scenario',
  id: 'fasilitas-tidak-bekerjasama',
  title: 'Fasilitas tidak bekerja sama dengan BPJS Kesehatan',
  explanation:
    'Penjaminan JKN berjalan melalui fasilitas kesehatan yang bekerja sama dengan BPJS Kesehatan, kecuali dalam keadaan gawat darurat. Kalau ini keadaan gawat darurat, langsung dapat pelayanan di fasilitas mana pun sekarang — peserta akan dipindahkan ke fasilitas yang bekerja sama setelah kondisi stabil, dan penjaminan mengikuti jalur itu.',
  outcome: {
    type: 'depends',
    question: 'Apakah fasilitas ini bekerja sama dengan BPJS Kesehatan, dan kalau tidak, fasilitas mana terdekat yang bekerja sama?',
  },
  position: { type: 'station', stationId: 'rumahSakit' },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'gawat-darurat-akses-langsung' }],
  nextAction:
    'Jika bukan keadaan gawat darurat, minta rujukan atau arahan ke fasilitas kesehatan terdekat yang bekerja sama dengan BPJS Kesehatan.',
  questionToAsk:
    'Tanyakan ke petugas: apakah fasilitas ini bekerja sama dengan BPJS Kesehatan, dan kalau tidak, fasilitas mana terdekat yang bekerja sama?',
};
