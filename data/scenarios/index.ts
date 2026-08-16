import { ScenarioSchema, type Scenario } from '@/lib/content/scenario';
import { findRule } from '@/lib/rules/loader';
import { rulePacks } from '@/data/rules';

import { tanpaRujukan } from './tanpa-rujukan';
import { rujukanPermintaanSendiri } from './rujukan-permintaan-sendiri';
import { gawatDaruratKriteria } from './gawat-darurat-kriteria';
import { kecelakaanLaluLintas } from './kecelakaan-lalu-lintas';
import { kecelakaanKerja } from './kecelakaan-kerja';
import { kartuNonaktif } from './kartu-nonaktif';
import { fasilitasTidakBekerjasama } from './fasilitas-tidak-bekerjasama';
import { naikKelasRawat } from './naik-kelas-rawat';
import { obatDiLuarFornas } from './obat-di-luar-fornas';
import { layananDikecualikan } from './layanan-dikecualikan';

const rawScenarios: Scenario[] = [
  tanpaRujukan,
  rujukanPermintaanSendiri,
  gawatDaruratKriteria,
  kecelakaanLaluLintas,
  kecelakaanKerja,
  kartuNonaktif,
  fasilitasTidakBekerjasama,
  naikKelasRawat,
  obatDiLuarFornas,
  layananDikecualikan,
];

export const scenarios: Scenario[] = rawScenarios.map((scenario) => {
  const parsed = ScenarioSchema.parse(scenario);
  // Every ruleRef must resolve — throws on a broken citation link.
  for (const ref of parsed.ruleRefs) {
    findRule(rulePacks, ref.packId, ref.ruleId);
  }
  return parsed;
});

export function getScenario(id: string): Scenario | undefined {
  return scenarios.find((s) => s.id === id);
}
