/**
 * Scanned over every copy string and rule-pack statement by
 * scripts/copy-check.ts. CLAUDE.md invariant 2 and DESIGN.md §8: no
 * second-person verdict, no blame construction, no discouraging framing.
 */
export interface BannedPhrase {
  pattern: RegExp;
  reason: string;
}

export const bannedPhrases: BannedPhrase[] = [
  {
    pattern: /anda\s+(tidak\s+)?ditanggung/i,
    reason: 'second-person verdict — states whether "you" are covered',
  },
  {
    pattern: /anda\s+(tidak\s+)?dijamin/i,
    reason: 'second-person verdict — states whether "you" are guaranteed coverage',
  },
  {
    pattern: /kasus\s+anda\s+(tidak\s+)?(ditanggung|dijamin)/i,
    reason: 'second-person verdict on a specific case',
  },
  {
    pattern: /anda\s+(tidak\s+)?covered/i,
    reason: 'second-person verdict, English loanword form',
  },
  {
    pattern: /you\s+are\s+(not\s+)?covered/i,
    reason: 'second-person verdict, English',
  },
  {
    pattern: /seharusnya\s+anda/i,
    reason: 'blame construction directed at the reader',
  },
  {
    pattern: /anda\s+(salah|keliru)/i,
    reason: 'blame construction directed at the reader',
  },
  {
    pattern: /tidak\s+akan\s+dilayani/i,
    reason: 'discouraging framing — reads as a refusal of care',
  },
  {
    pattern: /jangan\s+ke\s+(igd|rumah\s+sakit|dokter)/i,
    reason: 'discourages seeking care — violates the highest-priority rule',
  },
  {
    // Narrowed to solicitations directed at the reader, not the bare nouns —
    // v2's reference layer legitimately discusses diagnosis/procedure *codes*
    // as an administrative billing concept (INA-CBG groups by them), which
    // isn't the app asking the patient a clinical question. What's still
    // banned: asking the reader for their symptoms, diagnosis, or pain level.
    pattern: /apa\s+gejala|gejala\s+(apa|yang\s+(anda|dirasakan))|diagnosis\s+anda|apa\s+diagnosis(nya)?|sebutkan\s+diagnosis|derajat\s+nyeri|seberapa\s+parah|sakit\s+apa/i,
    reason: 'clinical question — invariant 3 allows administrative questions only',
  },
  {
    pattern: /\bRp\.?\s?\d[\d.,]*/i,
    reason:
      'rupiah amount in patient-facing content — PRD.md v2 §6 and DESIGN.md v2 §13 ban tariff figures; the INA-CBG explainer describes the mechanism only',
  },
];
