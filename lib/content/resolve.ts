/**
 * Family mode's one-question-per-screen flow (DESIGN.md §5). Every field
 * here is administrative — CLAUDE.md invariant 3. No symptom, no diagnosis,
 * no severity ever belongs in this type.
 */
export interface AdministrativeAnswers {
  kecelakaanLaluLintas: boolean | null;
  kecelakaanKerja: boolean | null;
  kartuAktif: boolean | null;
  adaRujukan: boolean | null;
  rujukanPermintaanSendiri: boolean | null;
  fasilitasBekerjaSama: boolean | null;
}

export const emptyAnswers: AdministrativeAnswers = {
  kecelakaanLaluLintas: null,
  kecelakaanKerja: null,
  kartuAktif: null,
  adaRujukan: null,
  rujukanPermintaanSendiri: null,
  fasilitasBekerjaSama: null,
};

/**
 * The next unanswered administrative question, or null once enough is known
 * to resolve a scenario. Pure — no side effects, nothing stored (invariant 4).
 */
export function nextQuestion(answers: AdministrativeAnswers): keyof AdministrativeAnswers | null {
  if (answers.kecelakaanLaluLintas === null) return 'kecelakaanLaluLintas';
  if (answers.kecelakaanLaluLintas) return null; // resolves to kecelakaan-lalu-lintas

  if (answers.kecelakaanKerja === null) return 'kecelakaanKerja';
  if (answers.kecelakaanKerja) return null; // resolves to kecelakaan-kerja

  if (answers.kartuAktif === null) return 'kartuAktif';
  if (!answers.kartuAktif) return null; // resolves to kartu-nonaktif

  if (answers.fasilitasBekerjaSama === null) return 'fasilitasBekerjaSama';
  if (!answers.fasilitasBekerjaSama) return null; // resolves to fasilitas-tidak-bekerjasama

  if (answers.adaRujukan === null) return 'adaRujukan';
  if (answers.adaRujukan) return null; // no routing complication — nothing further to ask here

  if (answers.rujukanPermintaanSendiri === null) return 'rujukanPermintaanSendiri';
  return null; // resolves to rujukan-permintaan-sendiri or tanpa-rujukan
}

/**
 * The scenario id this set of answers resolves to, once nextQuestion is
 * null. Returns null when no confrontation scenario applies — the referral,
 * card, and facility checks all came back clear — in which case the caller
 * should point at the pathway map (app/[locale]/alur/) instead.
 */
export function resolveScenarioId(answers: AdministrativeAnswers): string | null {
  if (nextQuestion(answers) !== null) return null;

  if (answers.kecelakaanLaluLintas) return 'kecelakaan-lalu-lintas';
  if (answers.kecelakaanKerja) return 'kecelakaan-kerja';
  if (answers.kartuAktif === false) return 'kartu-nonaktif';
  if (answers.fasilitasBekerjaSama === false) return 'fasilitas-tidak-bekerjasama';
  if (answers.adaRujukan) return null;
  if (answers.rujukanPermintaanSendiri) return 'rujukan-permintaan-sendiri';
  return 'tanpa-rujukan';
}
