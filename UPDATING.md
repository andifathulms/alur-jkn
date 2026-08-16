# UPDATING — re-verifying rule packs and reference content

This documents how to re-verify a rule pack or reference entry, written so a stranger to the
project can do it correctly.

## Current status: DRAFT

Every rule pack in `data/rules/` and every entry in `data/reference/` was drafted from the
instruments named in `PRD.md` §7 (Perpres 82/2018 and its amendments, Permenkes 47/2018,
Permenkes 28/2014, the INA-CBG tariff Permenkes, Fornas and the device compendium, BPJS
Kesehatan regulations) plus the one citation already verified in `PRD.md` §2.2 (Perpres
82/2018 Pasal 63). Everything else is **drafted from general policy knowledge, not
re-checked against the current consolidated text**.

**`data/reference/pengecualian.ts` is the highest-priority item to re-verify.** It's the one
place the app is allowed to say "not covered" at all (`CLAUDE.md` invariant 3), and its
eleven entries are explicitly *not* asserted to be the complete Pasal 52 list — PRD.md §5.2
describes the real list as "around twenty-one items." A missing or wrong entry here is a
bigger safety problem than anywhere else in the app. Re-verify this file first, and treat an
incomplete list as more dangerous than an admittedly-incomplete one: don't round it up to
"looks complete enough" without checking against the primary source.

`data/reference/poli.ts` and `data/reference/kelas.ts` also hedge deliberately on specifics
(referral-validity day-counts; the KRIS class-transition status under Perpres 59/2024) that
the author wasn't confident about, rather than asserting precision that isn't there.

Per `CLAUDE.md`, **M0 is interviews, not code**: the rule schema and validator now exist
(satisfying "no scenario content before the validator exists"), but the actual legal
re-verification and the hospital-staff interviews have not happened yet. Do not treat the
current content as citation-accurate. Do not publish it as-is.

## How to re-verify a rule or reference entry

Same process for both — a reference entry's `citation` field is the same shape as a rule's.

1. Find the current consolidated text of the instrument at a primary source — JDIH BPK
   (`https://peraturan.bpk.go.id`) or the issuing ministry/agency's own JDIH.
2. Locate the specific pasal/ayat that supports the rule's `statement` (or the reference
   entry's `definition`/`detail`). If the amendment history (Perpres 75/2019, 64/2020,
   59/2024) changed the article, cite the current one.
3. Update `article` and `sourceUrl` to the exact article and the URL you read.
4. Set `verifiedAt` to the date you read the source, in `YYYY-MM-DD`.
5. For a pengecualian entry specifically: check whether the entry still belongs in the Pasal
   52 list at all, and while you're re-reading the consolidated text, note any items missing
   from the current eleven-entry list — this file isn't asserted complete (see above).
6. Run `pnpm content:validate` — it fails the build on a missing citation field and warns on
   anything whose `verifiedAt` is older than 365 days.
7. If the wording changed in a way that affects a scenario's next action, question-to-ask, or
   a reference entry's detail, update it in the same change, and get copy review against
   `DESIGN.md` §9 before release (`CLAUDE.md` working style) — run `pnpm copy:check` too, since
   a pengecualian rewrite is exactly the kind of change the Pasal 52 rule is there to catch.

## Review threshold

`STALENESS_THRESHOLD_DAYS` in `lib/rules/schema.ts` is 365 days. A rule pack past that
renders a staleness warning in the rule reference screen (`app/[locale]/aturan/`); a
reference entry past that renders the same warning on its `/rujukan/*` page.
