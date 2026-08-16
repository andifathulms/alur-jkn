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
    pattern: /(gejala|diagnosis|derajat\s+nyeri|seberapa\s+parah|sakit\s+apa)/i,
    reason: 'clinical question — invariant 3 allows administrative questions only',
  },
  {
    pattern: /\bRp\.?\s?\d[\d.,]*/i,
    reason:
      'rupiah amount in patient-facing content — PRD.md v2 §6 and DESIGN.md v2 §13 ban tariff figures; the INA-CBG explainer describes the mechanism only',
  },
];
