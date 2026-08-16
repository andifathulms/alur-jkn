'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  emptyAnswers,
  nextQuestion,
  resolveScenarioId,
  type AdministrativeAnswers,
} from '@/lib/content/resolve';
import { getScenario } from '@/data/scenarios';
import { rulePacks } from '@/data/rules';
import { findRule } from '@/lib/rules/loader';
import { scenarioShareText } from '@/lib/copy/shareText';
import { QuestionCard } from '@/components/question/QuestionCard';
import { ShareCard } from '@/components/share/ShareCard';

const PROMPTS: Record<keyof AdministrativeAnswers, string> = {
  kecelakaanLaluLintas: 'Apakah ini berkaitan dengan kecelakaan lalu lintas?',
  kecelakaanKerja: 'Apakah ini berkaitan dengan kecelakaan kerja?',
  kartuAktif: 'Apakah status kartu JKN Anda aktif?',
  fasilitasBekerjaSama: 'Apakah fasilitas ini bekerja sama dengan BPJS Kesehatan?',
  adaRujukan: 'Apakah Anda datang dengan surat rujukan dari FKTP (Puskesmas atau klinik)?',
  rujukanPermintaanSendiri: 'Apakah surat rujukan ini diminta sendiri, tanpa pemeriksaan dari FKTP?',
};

/** Answers live only in this component's state — nothing stored, invariant 4. */
export function FamilyWizard() {
  const [answers, setAnswers] = useState<AdministrativeAnswers>(emptyAnswers);
  const [history, setHistory] = useState<Array<keyof AdministrativeAnswers>>([]);

  const question = nextQuestion(answers);

  function answer(field: keyof AdministrativeAnswers, value: boolean) {
    setAnswers((prev) => ({ ...prev, [field]: value }));
    setHistory((prev) => [...prev, field]);
  }

  function goBack() {
    setHistory((prev) => {
      const last = prev[prev.length - 1];
      if (!last) return prev;
      setAnswers((a) => ({ ...a, [last]: null }));
      return prev.slice(0, -1);
    });
  }

  if (question) {
    return (
      <div className="max-w-xl mx-auto px-4 py-10 sm:px-6">
        <p className="text-body-lg mb-6">{PROMPTS[question]}</p>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => answer(question, true)}
            className="flex-1 min-h-[56px] rounded-lg border-2 border-ink text-key font-medium hover:bg-ink/5"
          >
            Ya
          </button>
          <button
            type="button"
            onClick={() => answer(question, false)}
            className="flex-1 min-h-[56px] rounded-lg border-2 border-ink text-key font-medium hover:bg-ink/5"
          >
            Tidak
          </button>
        </div>
        {history.length > 0 && (
          <button
            type="button"
            onClick={goBack}
            className="mt-6 min-h-[48px] px-4 underline underline-offset-4 text-body"
          >
            ← Kembali
          </button>
        )}
      </div>
    );
  }

  const scenarioId = resolveScenarioId(answers);
  const scenario = scenarioId ? getScenario(scenarioId) : undefined;
  const citedRules = scenario?.ruleRefs.map((ref) => findRule(rulePacks, ref.packId, ref.ruleId)) ?? [];

  return (
    <div className="max-w-xl mx-auto px-4 py-10 sm:px-6 space-y-6">
      {scenario ? (
        <>
          <h1 className="text-heading font-medium">{scenario.title}</h1>
          <p className="text-body-lg">{scenario.explanation}</p>
          <QuestionCard nextAction={scenario.nextAction} questionToAsk={scenario.questionToAsk} />
          <ShareCard shareText={scenarioShareText(scenario, citedRules)} />
        </>
      ) : (
        <p className="text-body-lg">
          Dari jawaban Anda, tidak ada hal khusus yang perlu diperjelas lebih dulu. Lihat peta alur untuk
          memahami tahapan berikutnya.
        </p>
      )}
      <div className="flex gap-4 flex-wrap">
        <button
          type="button"
          onClick={goBack}
          className="min-h-[48px] px-4 underline underline-offset-4 text-body"
        >
          ← Kembali
        </button>
        <Link href="/id/alur" className="min-h-[48px] px-4 underline underline-offset-4 text-body">
          Lihat peta alur →
        </Link>
      </div>
    </div>
  );
}
