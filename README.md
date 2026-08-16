# Alur JKN

Explains the JKN referral and coverage system so patients arrive with correct expectations and the
right question to ask. Static site, GitHub Pages, no backend, no runtime network, no data collection.

See [`PRD.md`](./PRD.md) for what this is and why, [`DESIGN.md`](./DESIGN.md) for how it looks and
speaks, and [`CLAUDE.md`](./CLAUDE.md) for the invariants that gate every change. This is a v2
revision of a shipped v1 — see [`MIGRATION.md`](./MIGRATION.md) for the brief that drove it.

**Status:** v2 complete — all seven `MIGRATION.md` steps done. All three content types exist —
scenario, reference, and condition — with an outcome state union (`payer` / `excluded` / `depends`)
instead of a payer-only routing field; `copy:check` enforces that "tidak ditanggung" and its variants
appear only on a genuine Pasal 52 item with its article rendered inline, and never on a condition page
at all. `/id/cari` searches across all three content types at once (reference results are deep-linked
to the specific entry, e.g. `/rujukan/alat-kesehatan#kacamata`); staff mode (`/id/petugas`) shows the
reference index alongside the scenario list; every scenario, reference, and condition page now has a
share card (print, copy, WhatsApp), matching the pattern the scenario share card set in v1. Content is
**draft, not re-verified** — see [`UPDATING.md`](./UPDATING.md) before treating any citation as
accurate (the `pengecualian` list especially — it's explicitly not asserted complete), and the
hospital-staff interviews CLAUDE.md's M0 calls for haven't happened yet. That re-verification pass —
not more v2 features — is the real remaining work before this could ship.

## Commands

```bash
pnpm install
pnpm dev                    # http://localhost:3000
pnpm build                  # static export to ./out; runs content:validate and copy:check first
pnpm preview                # build, then serve ./out under the production basePath (/alur-jkn)
pnpm test                   # vitest watch
pnpm test:run               # vitest once — before every commit
pnpm test:safety            # emergency-first, no-verdict, Pasal 52 rule, no diagnostic fields, no rupiah
pnpm test:a11y              # structural a11y (jest-axe) + type-floor + colour-only-encoding
pnpm content:validate       # rule citations, verifiedAt, scenario outcome-branch completeness
pnpm copy:check             # banned-phrase scan + Pasal 52 rule, across all copy and content
pnpm bundle:check           # per-route gzipped JS budget — 140 KB, DESIGN.md v2 §10's full
                             # reference-layer allowance (raised from 120 KB once /cari needed it)
pnpm typecheck
pnpm lint
```

`pnpm test:safety`, `pnpm test:a11y`, `pnpm content:validate`, and `pnpm copy:check` gate the build —
`pnpm build` runs `content:validate` and `copy:check` before `next build`; CI additionally runs
`test:safety`, `test:a11y`, and `bundle:check` (`.github/workflows/deploy.yml`).

## What's not yet built

- A conditions list/nav entry — reachable via search or direct URL only. MIGRATION.md step 6 named
  search and the reference index specifically for navigation, not a conditions list, so this is a
  deliberate scope reading, not an oversight.
- More than two condition pages — PRD.md §5.3 targets eight to twelve, "chosen with the hospital
  team by frequency of confrontation." MIGRATION.md step 5 asked for the template plus two examples
  only, so the third condition onward is a scope decision for later, not an oversight.
- English content (`/en/*`) — the `[locale]` route is structurally ready but only `id` has copy.
- **Legal re-verification of everything in `data/rules/` and `data/reference/`, and the
  hospital-staff interviews M0 calls for.** This is the actual blocker to shipping, not any
  remaining feature — see [`UPDATING.md`](./UPDATING.md).

## Known deviation from CLAUDE.md's layout tree

CLAUDE.md sketches `(petugas)/` and `(keluarga)/` as Next.js route groups. Route groups don't add a
URL segment, so both would resolve to `/id` and collide. This repo uses plain `petugas/` and
`keluarga/` segments instead (`/id/petugas`, `/id/keluarga`) so the app actually builds and routes.
