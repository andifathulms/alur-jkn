import type { Scenario } from '@/lib/scenario/schema';

export const layananDikecualikan: Scenario = {
  id: 'layanan-dikecualikan',
  title: 'Layanan yang dikecualikan dari penjaminan',
  explanation:
    'Sejumlah pelayanan dikecualikan dari penjaminan JKN: tujuan estetika, penanganan infertilitas, pengobatan alternatif dan komplementer yang belum dinyatakan efektif, serta pelayanan yang bersifat eksperimental. Daftar ini tetap terbatas — sebagian besar layanan lain tetap dijamin melalui jalur yang berlaku.',
  routing: { type: 'single', payer: { type: 'self', label: 'Mandiri untuk layanan yang dikecualikan' } },
  ruleRefs: [{ packId: 'perpres-82-2018', ruleId: 'layanan-dikecualikan' }],
  nextAction:
    'Minta petugas menunjukkan apakah layanan yang dimaksud termasuk dalam daftar pengecualian, dan tanyakan alternatif yang tetap dijamin.',
  questionToAsk:
    'Tanyakan ke petugas: apakah layanan ini termasuk dalam daftar pengecualian JKN, dan apa alternatif yang tetap dijamin?',
};
