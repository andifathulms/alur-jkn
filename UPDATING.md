# UPDATING — re-verifying rule packs

This documents how to re-verify a rule pack, written so a stranger to the project can do it correctly.

## Current status: DRAFT

Every rule pack in `data/rules/` was drafted from the instruments named in `PRD.md` §7
(Perpres 82/2018 and its amendments, Permenkes 47/2018, Permenkes 28/2014, BPJS Kesehatan
regulations, the national formulary decree) plus the one citation already verified in
`PRD.md` §2.2 (Perpres 82/2018 Pasal 63). Article numbers beyond that one citation are
**drafted from general policy knowledge, not re-checked against the current consolidated
text**, and each carries a `status: "draft — pending re-verification"` note in its JSON.

Per `CLAUDE.md`, **M0 is interviews, not code**: the rule schema and validator now exist
(satisfying "no scenario content before the validator exists"), but the actual legal
re-verification and the hospital-staff interviews have not happened yet. Do not treat the
current content as citation-accurate. Do not publish it as-is.

## How to re-verify a rule

1. Find the current consolidated text of the instrument at a primary source — JDIH BPK
   (`https://peraturan.bpk.go.id`) or the issuing ministry/agency's own JDIH.
2. Locate the specific pasal/ayat that supports the rule's `statement`. If the amendment
   history (Perpres 75/2019, 64/2020, 59/2024) changed the article, cite the current one.
3. Update `article` and `sourceUrl` to the exact article and the URL you read.
4. Set `verifiedAt` to the date you read the source, in `YYYY-MM-DD`.
5. Remove the `status: "draft…"` note once verified.
6. Run `pnpm content:validate` — it fails the build on a missing citation field and warns on
   any rule whose `verifiedAt` is older than 365 days.
7. If the rule's wording changed in a way that affects a scenario's next action or
   question-to-ask, update the scenario in `data/scenarios/` in the same change, and get
   copy review against `DESIGN.md` §8 before release (`CLAUDE.md` working style).

## Review threshold

`STALENESS_THRESHOLD_DAYS` in `lib/rules/schema.ts` is 365 days. A pack past that renders
a staleness warning in the rule reference screen (`app/[locale]/aturan/`).
