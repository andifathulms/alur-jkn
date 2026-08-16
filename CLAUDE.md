# CLAUDE.md — Alur JKN

Explains the JKN referral and coverage system so patients arrive with correct expectations and the right question to ask. Static site, GitHub Pages, no backend, no runtime network, no data collection.

Read `PRD.md` before starting any task, and **`DESIGN.md` before writing any UI or any copy** — it governs wording as much as visuals.

**Four rules, in priority order. The first two are safety rules.**

1. **Never discourage anyone from seeking care.** The emergency message appears before any coverage content on every path, and always says go now, sort coverage afterwards. If a change would place a coverage caveat ahead of that message, the change is wrong.
2. **Never render a verdict on a specific case.** The app explains rules and produces the question to ask. It does not know the diagnosis, the coding, the facility's partnership status, or the card status — and a wrong answer waved at an admission desk makes confrontations worse, not better.
3. **Never ask for clinical information.** Administrative questions only. This keeps the product out of medical-advice territory and out of health-data territory in a single move.
4. **Colour encodes the payer, never the verdict.** "You pay" is a lane, not a failure state. `DESIGN.md` §2.

---

## Stack

- Next.js 14, App Router, `output: 'export'` — static only
- TypeScript, `strict: true`
- Tailwind CSS, tokens from `DESIGN.md`
- Zod for rule pack validation
- Vitest, plus axe for automated a11y
- pnpm
- **No component library** — its defaults fight every constraint in `DESIGN.md`.
- **No analytics library. No error reporting. No third-party script of any kind.**
- Fonts via `next/font`, self-hosted and subset.

## Commands

```bash
pnpm dev
pnpm build                  # static export; runs rules:validate and copy:check first
pnpm preview                # serve ./out under the production basePath
pnpm test                   # vitest watch
pnpm test:run               # vitest once — before every commit
pnpm test:safety            # emergency-first ordering, no-verdict, no clinical question
pnpm test:a11y              # contrast, target size, type floor, zoom, colour-only encoding
pnpm rules:validate         # instrument, article, sourceUrl, verifiedAt on every rule
pnpm copy:check             # banned-phrase scan over all copy and rule packs
pnpm bundle:check           # size budget
pnpm typecheck
pnpm lint
```

`pnpm test:safety`, `pnpm test:a11y`, `pnpm rules:validate`, and `pnpm copy:check` all gate the build. **None of them may be skipped, weakened, or flagged around.**

## Layout

```
app/
  [locale]/                 # id (default), en
    (keluarga)/             # family mode — one question per screen
    (petugas)/              # staff mode — flat list, fast lookup
    alur/                   # the pathway map
    aturan/                 # rule reference + verification dates
components/
  pathway/                  # transit map, stations, lines, position marker
  handoff/                  # payer split bar
  question/                 # the question-to-ask card
  emergency/                # fixed-wording emergency banner
  share/                    # WhatsApp card + print sheet
lib/
  rules/                    # schema, loader, validator. Pure.
  scenario/                 # scenario resolution from administrative answers. Pure.
  copy/                     # templated strings, banned-phrase list
data/
  rules/                    # cited packs, one per instrument
  scenarios/                # the ten scenarios + next action + question
tests/
  safety/
  a11y/
  copy/
```

## Invariants

1. **The emergency message is first in DOM order on every screen that discusses coverage.** Fixed wording from `DESIGN.md` §8. Asserted by test. Never move it below the fold, never make it dismissible, never make it conditional on an answer.

2. **No screen states or implies whether the user's case is covered.** No "you are covered", no "your case is not covered", no boolean outcome, no badge, no checkmark, no cross. `pnpm copy:check` scans for second-person verdict phrasing and fails the build.

3. **No clinical question anywhere.** No symptoms, no diagnosis, no severity, no medication, no free-text about a condition. Questions are administrative: did you arrive with a referral, was this a road accident, is the facility partnered. **If a proposed question needs medical knowledge to answer, it does not belong in this product.**

4. **Nothing the user enters is stored, transmitted, or measured.** No localStorage of answers, no URL encoding of answers, no analytics, no error reporting, no beacon. Answers exist in memory for the session and are gone.

5. **Zero network requests at runtime.** No fonts, no tiles, no APIs, no scripts. Offline after first load.

6. **Every rule carries instrument, article, `sourceUrl`, and `verifiedAt`.** Validator-enforced; the build rejects an uncited rule. Scenarios display their verification date; packs past the review threshold render a staleness warning.

7. **Cite the instrument, never reporting.** Perpres, Permenkes, BPJS regulation. News coverage of these rules is frequently imprecise, and this product cannot inherit that.

8. **Payer identity is the only thing colour encodes.** `--care` burnt orange is the emergency route and nothing else. **No red anywhere in the product**, no green-means-good, no traffic-light metaphor. `DESIGN.md` §2.

9. **No meaning by colour alone.** Every payer lane carries a text label and a distinct line pattern. Asserted by test.

10. **Type floor 16px, body 18px, targets 48px (56px in family mode).** Asserted by test. There is no exception for dense screens — if a screen needs smaller type, it needs less content.

11. **Every scenario ends with a next action and a question to ask.** Asserted by test. A scenario without both is incomplete, not shippable.

12. **Never imply official status.** No BPJS or government logo, seal, colour, or typography. The unofficial statement appears in every screen footer. The programme name describes the subject; the institution name is not branding.

13. **No card status lookup, no auth, no backend, no facility finder, no queue booking.** Those need a server and belong to Mobile JKN.

14. **Copy is reviewed before every release** against `DESIGN.md` §8: no verdict, no blame, next action present, question present, plain Indonesian.

15. **Nothing is computed in a component.**

## Working style

- **M0 is interviews, not code.** Talk to the hospital staff having these conversations. If the shipped scenarios don't match the words patients actually use, the product fails regardless of how well it's built.
- **Read `DESIGN.md` before writing copy**, not just before writing UI. The tone rules are the product here.
- **When drafting a scenario, write the question to ask first**, then work backwards to the explanation. The question is the output; the explanation is support.
- **When a rule is unclear, cite the ambiguity rather than resolving it.** Say what the instrument says and what to ask. Guessing here has a real cost to a real person.
- **When tempted to add a "covered / not covered" indicator, stop.** It is the most likely bad idea in this repository and it inverts the product's purpose.
- **Prefer removing content over shrinking type.** §10 above.
- **Don't touch `next.config.js`, the Actions workflow, or any of the four gating checks without saying so explicitly.**
- **Never weaken a test to make something pass**, and never `test:safety` or `test:a11y` under any circumstances.

## Conventions

- Named exports; defaults only where Next requires them.
- Discriminated unions for scenarios, payers, and outcomes, keyed on `type`. Exhaustive `switch` with a `never` default — this is how adding a payer surfaces every site that must handle it.
- No `any`. No non-null `!` in `lib/`.
- Outcomes are modelled as **payer routing**, never as a boolean. There is no `isCovered` field in this codebase, and introducing one is a design regression.
- Indonesian domain vocabulary in identifiers and UI: `rujukan`, `rujukanBerjenjang`, `fktp`, `fkrtl`, `gawatDarurat`, `naikKelas`, `kartuAktif`. Do not substitute English approximations.
- Comments cite the instrument and article any rule implements.
- Scenario ids stable and readable: `tanpa-rujukan`, `rujukan-permintaan-sendiri`, `kecelakaan-lalu-lintas`, `kartu-nonaktif`. They appear in URLs and share cards.
- Tailwind tokens named exactly as in `DESIGN.md` — `paper`, `ink`, `rule`, `payer-1`…`payer-3`, `self`, `care`. Never raw hex in components.

## Testing rules

- `pnpm test:run` before every commit; all four gating checks before any commit touching copy, rules, or scenarios.
- Emergency-first ordering asserted on every coverage screen.
- Banned-phrase scan over all copy and rule pack strings — second-person verdicts, blame constructions, discouraging framings.
- Every scenario asserted to carry a next action and a question to ask.
- No clinical field asserted across the scenario schema.
- Rule citation completeness asserted; staleness warning asserted past the review threshold.
- a11y suite: contrast, target size, type floor, 200% zoom without horizontal scroll, colour-only encoding, focus visibility, screen-reader order.
- Bundle size asserted against the budget; zero-network asserted by intercepting fetch in a smoke test.
- Bug fix → failing test first.

## Deployment

`main` builds and deploys via Actions; all four checks gate it. `basePath` must match the repository name; `.nojekyll` must exist in `out/`. Verify with `pnpm preview` before pushing, and test on a real low-end Android on a throttled connection before any release.

## Framing

The site states on every screen that it is an independent, unofficial project, not a BPJS or government channel, and that it cannot determine whether any particular case is covered. Every rule shows its instrument and verification date. Mobile JKN is named as the official application. No OIKN or government branding anywhere.

## Current state

M0 — not yet scaffolded. Next: **interview hospital staff**, then the rule schema and validator. **No scenario content before the validator exists, and no UI before the safety and a11y checks are wired.**
