# CLAUDE.md — Alur JKN

Explains the JKN referral and coverage system so patients arrive with correct expectations and the right question to ask. Static site, GitHub Pages, no backend, no runtime network, no data collection.

Read `PRD.md` before starting any task, and **`DESIGN.md` before writing any UI or any copy** — it governs wording as much as visuals.

**Five rules, in priority order. The first two are safety rules.**

1. **Never discourage anyone from seeking care.** The emergency message appears before any coverage content on every path and always says go now, sort coverage afterwards. If a change would place a coverage caveat ahead of it, the change is wrong.
2. **Never render a verdict on a specific case.** The app explains rules and produces the question to ask. It cannot know the diagnosis, the coding, the facility's partnership status, or the card status.
3. **Only Pasal 52 items may be called "not covered".** Everything else is routing, tariff, medical indication, or hospital capability. This is the correction the product exists to make — see `PRD.md` §3.
4. **Navigational lookups are fine; diagnostic questions are not.** Which poli, which procedure, which device, which drug — all legitimate. Symptoms, severity, triage — never.
5. **Colour encodes the payer, never the verdict.** "You pay" is a lane. `DESIGN.md` §2.

---

## Stack

- Next.js 14, App Router, `output: 'export'` — static only
- TypeScript, `strict: true`
- Tailwind CSS, tokens from `DESIGN.md`
- Zod for rule and content schema validation
- Vitest, plus axe for automated a11y
- pnpm
- **No component library. No analytics library. No error reporting. No third-party script of any kind.**
- Fonts via `next/font`, self-hosted and subset.

## Commands

```bash
pnpm dev
pnpm build                  # static export; runs content:validate and copy:check first
pnpm preview                # serve ./out under the production basePath
pnpm test                   # vitest watch
pnpm test:run               # vitest once — before every commit
pnpm test:safety            # emergency-first, no-verdict, Pasal 52 rule, no diagnostic fields
pnpm test:a11y              # contrast, target size, type floor, zoom, colour-only encoding
pnpm content:validate       # citations, verifiedAt, condition-page completeness
pnpm copy:check             # banned-phrase scan across all copy and content
pnpm bundle:check           # size budget
pnpm typecheck
pnpm lint
```

All four gating checks run in `build` and CI. **None may be skipped, weakened, or flagged around.**

## Layout

```
app/
  [locale]/
    (keluarga)/             # family mode — one question per screen
    (petugas)/              # staff mode — scenario list + reference index
    alur/                   # the pathway map
    rujukan/                # reference layer
      ina-cbg/              # THE SPINE — everything links here
      pengecualian/         # Pasal 52, the only "not covered" content
      poli/                 # specialty referral rules
      alat-kesehatan/       # device ceilings
      obat/                 # Fornas
      kelas/                # class and naik kelas
    kondisi/[slug]/         # per-condition pages
components/
  pathway/                  # transit map
  handoff/                  # payer split bar
  question/                 # the question-to-ask card
  emergency/                # fixed-wording banner
  state/                    # A: payer lane | B: Pasal 52 + citation | C: depends, hatched
  reference/                # index rail, entry, table
  condition/                # the five fixed sections
lib/
  rules/                    # schema, loader, validator. Pure.
  content/                  # scenario | reference | condition loaders. Pure.
  copy/                     # templated strings, banned-phrase list
data/
  rules/                    # cited packs, one per instrument
  scenarios/                # the ten administrative scenarios
  reference/                # the six reference sections
  conditions/               # per-condition entries
tests/
  safety/  a11y/  copy/
```

## Invariants

1. **The emergency message is first in DOM order on every screen that discusses coverage.** Fixed wording, `DESIGN.md` §9. Never below the fold, never dismissible, never conditional.

2. **No screen states or implies whether the user's case is covered.** No "you are covered", no boolean outcome, no badge, no checkmark or cross. `copy:check` scans for second-person verdict phrasing.

3. **"Tidak ditanggung" and its variants may appear only on a State B item** — an entry enumerated in Perpres 82/2018 Pasal 52 — **and only with its article citation rendered inline.** Asserted by test. Anywhere else it is a bug, not a wording preference.

4. **There is no coverage boolean in the schema.** Outcomes are `{ type: 'payer' | 'excluded' | 'depends' }`. `excluded` requires a `pasal52Article` field; `depends` requires a `question` field. **The schema makes the wrong answer unrepresentable — do not add an `isCovered` field.**

5. **State C never ships without a question to ask.** Validator-enforced.

6. **Every condition page carries all five sections** — route, what determines the method, why one option may be offered, what can still cost money, the question. Validator-enforced; a missing section fails the build.

7. **Every condition page links to the INA-CBG reference.** It is the spine; a condition page that doesn't reach it will be read as a verdict.

8. **No diagnostic field anywhere in the content schema.** No symptom, severity, duration, or free-text clinical entry. If answering a proposed question requires medical knowledge, it does not belong here.

9. **No rupiah amounts in patient-facing content.** The INA-CBG explainer describes the mechanism; tariff figures vary by class and region and would be read as a price promise.

10. **Nothing the user enters is stored, transmitted, or measured.** No localStorage of answers, no URL encoding of answers, no analytics, no beacon.

11. **Zero network requests at runtime.** Offline after first load.

12. **Every rule and reference entry carries instrument, article, `sourceUrl`, and `verifiedAt`.** Validator-enforced. Staleness warnings past the review threshold.

13. **Cite the instrument, never reporting.** Coverage of these rules is frequently imprecise and this product cannot inherit that.

14. **No red anywhere. No green-means-good.** `--care` is the emergency route only. `DESIGN.md` §2.

15. **No meaning by colour alone.** Payer lanes carry labels and line patterns; State C's hatch carries a text label.

16. **Type floor 16px, body 18px, targets 48px (56px family mode).** If a screen needs smaller type, it needs less content.

17. **Never imply official status.** No institutional logo, seal, colour, or typography. Unofficial statement in every screen footer.

18. **Nothing is computed in a component.**

## Working style

- **Build the INA-CBG page before any condition page.** It is the spine, and conditions written without it drift into verdicts.
- **Write the question to ask first**, then work backwards to the explanation. The question is the output.
- **When a rule is unclear, cite the ambiguity rather than resolving it.** Say what the instrument says and what to ask.
- **When tempted to add a covered/not-covered indicator, stop.** It is the most likely bad idea here and it inverts the product's purpose.
- **When writing about a procedure, check yourself against rule 3.** If it isn't in Pasal 52, the sentence is about indication, tariff, or hospital capability — write that instead.
- **Choose condition pages with the hospital team**, by observed frequency of confrontation, not by what's easy to write.
- **Prefer removing content over shrinking type.**
- **Don't touch `next.config.js`, the Actions workflow, or any gating check without saying so explicitly.**
- **Never weaken a test to make something pass**, and never `test:safety` or `test:a11y` under any circumstances.

## Conventions

- Named exports; defaults only where Next requires them.
- Discriminated unions for content types, outcome states, and payers, keyed on `type`. Exhaustive `switch` with a `never` default.
- No `any`. No non-null `!` in `lib/`.
- Indonesian domain vocabulary in identifiers and UI: `rujukan`, `rujukanBerjenjang`, `fktp`, `fkrtl`, `gawatDarurat`, `naikKelas`, `kartuAktif`, `inaCbg`, `fornas`, `alkes`. Do not substitute English approximations.
- Comments cite the instrument and article any rule implements.
- Ids stable and readable: `tanpa-rujukan`, `kecelakaan-lalu-lintas`, `operasi-usus-buntu`, `alkes-kacamata`. They appear in URLs and share cards.
- Tailwind tokens exactly as in `DESIGN.md` — `paper`, `ink`, `rule`, `payer-1`…`payer-3`, `self`, `care`. Never raw hex in components.

## Testing rules

- `pnpm test:run` before every commit; all four gating checks before any commit touching copy, rules, or content.
- Emergency-first ordering asserted on every coverage screen.
- **Pasal 52 rule asserted:** "tidak ditanggung" phrasing appears only on State B entries carrying a citation.
- Banned-phrase scan over all copy and content strings — second-person verdicts, blame constructions, discouraging framings.
- Every scenario asserted to carry a next action and a question.
- Every condition asserted to carry all five sections and an INA-CBG link.
- Every State C asserted to carry a question.
- No diagnostic field asserted across all schemas.
- No rupiah amount asserted in patient-facing content.
- Citation completeness and staleness warnings asserted.
- a11y suite: contrast, target size, type floor, 200% zoom without horizontal scroll including tables, colour-only encoding, focus visibility, screen-reader order.
- Bundle budget asserted; zero-network asserted by intercepting fetch in a smoke test.
- Bug fix → failing test first.

## Deployment

`main` builds and deploys via Actions; all four checks gate it. `basePath` must match the repository name; `.nojekyll` must exist in `out/`. Verify with `pnpm preview` before pushing, and test on a real low-end Android on a throttled connection before any release.

## Framing

Every screen states that this is an independent, unofficial project, not a BPJS or government channel, and that it cannot determine whether any particular case is covered. Every rule shows its instrument and verification date. Mobile JKN is named as the official application. No OIKN or government branding anywhere.

## Current state

**v2 revision of a shipped v1.** Scenario content exists and migrates unchanged. Next: extend the content model to three types, then build the INA-CBG reference page before anything else depends on it.
