# Claude Code — Alur JKN v1 → v2 migration brief

Drop the three updated files (`PRD.md`, `DESIGN.md`, `CLAUDE.md`) into the repo root, replacing the existing ones, then paste the block below.

---

```
This repo is a shipped v1. PRD.md, DESIGN.md and CLAUDE.md have been replaced with v2.
Read all three fully before touching anything.

v1 is too thin because an earlier constraint — "never ask a clinical question" — was drawn
too broadly and removed the whole reference layer. v2 keeps every safety rail and adds
what was missing.

Do NOT start over. v1's scenario content is correct and migrates unchanged.

Work in this order and stop for review after each numbered step.

1. CONTENT MODEL
   Extend the content model from one type to three: scenario, reference, condition.
   - Move existing scenario content into the new shape without changing its wording.
   - Add an outcome state union: { type: 'payer' | 'excluded' | 'depends' }.
     - 'excluded' REQUIRES a pasal52Article field.
     - 'depends'  REQUIRES a question field.
   - There must be NO coverage boolean anywhere. Do not add isCovered, covered, or
     any equivalent. The schema must make a coverage verdict unrepresentable.
   - Update the Zod schemas and the validator to enforce both requirements.
   Report what you changed before moving on.

2. GATING CHECKS
   Extend the existing checks, do not replace them:
   - copy:check — add the Pasal 52 rule: "tidak ditanggung" and its variants may appear
     ONLY on an 'excluded' entry, and only where its article citation renders inline.
     Fail the build anywhere else.
   - content:validate — assert every 'depends' has a question; every condition page has
     all five sections; every condition page links to the INA-CBG reference.
   - test:safety — add assertions for the above, plus: no diagnostic field in any schema,
     no rupiah amount in patient-facing content.
   Keep every existing v1 assertion. Do not weaken any of them.

3. THE INA-CBG REFERENCE PAGE
   Build this before any other new content. Everything links back to it.
   It explains: JKN pays by package per case group, not itemised by method; the package
   is the same regardless of which method is inside it; the tariff varies by hospital
   class A–D and across five regional bands; so what a hospital offers depends on medical
   indication and on what it can deliver within that package.
   One diagram: a package containing several items, with the note that the package does
   not change when the method inside it changes.
   NO rupiah figures. Mechanism only.
   This page is the correction the whole product exists to make — give it room.

4. REFERENCE LAYER
   Add the remaining five sections under /rujukan, sharing one layout with an index rail
   and live filter:
   - pengecualian  — Perpres 82/2018 Pasal 52 in full, plain Indonesian, with examples.
                     This is the ONLY place the app says "not covered", and every entry
                     shows its article inline.
   - poli          — which specialties need a referral, referral validity, internal
                     referral rules, when re-referral is required.
   - alat-kesehatan — glasses, hearing aids, dentures, prosthetics: tariff ceilings and
                     replacement intervals.
   - obat          — Fornas: covered medicines come from the national formulary, and what
                     happens when a doctor prescribes outside it.
   - kelas         — class entitlement and the naik kelas difference rules.
   Tables are allowed here (see DESIGN.md §4). Every entry carries instrument, article,
   sourceUrl and verifiedAt.

5. CONDITION PAGES
   Build the template first, then two example pages, then stop for review.
   Five fixed sections, always in this order:
     1. The route — which poli, referral or emergency bypass
     2. What determines the method — medical indication, not a coverage rule
     3. Why you may be offered one option — the package tariff, linked to INA-CBG
     4. What can still cost money — class upgrade, non-formulary drugs, devices over ceiling
     5. The question to ask
   Never a verdict. If something is not in Pasal 52, do not write that it is not covered —
   write what actually determines it.

6. NAVIGATION
   Search across all three content types. Staff mode gets the reference index alongside
   the scenario list. Reference entries are deep-linkable.

7. DISTRIBUTION
   Share cards and print sheets for reference entries and condition pages, matching the
   existing scenario share card.

Constraints that do not change and must not be relaxed:
- The emergency message stays first in DOM order on every coverage screen.
- No verdict on a specific case, anywhere.
- No diagnostic questions. Navigational lookups only.
- Nothing stored, transmitted, or measured.
- Zero runtime network requests.
- Type floor 16px, body 18px, targets 48px / 56px family mode.
- No red, no green-means-good, no component library, no dark mode.
- Bundle budget rises to 140 KB gzipped for the reference layer. Not further.

If any step conflicts with DESIGN.md, DESIGN.md wins — tell me rather than resolving it
yourself.
```
