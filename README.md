# Alur JKN

Explains the JKN referral and coverage system so patients arrive with correct expectations and the
right question to ask. Static site, GitHub Pages, no backend, no runtime network, no data collection.

See [`PRD.md`](./PRD.md) for what this is and why, [`DESIGN.md`](./DESIGN.md) for how it looks and
speaks, and [`CLAUDE.md`](./CLAUDE.md) for the invariants that gate every change. This is a v2
revision of a shipped v1 — see [`MIGRATION.md`](./MIGRATION.md) for the brief that drove it.

**Status:** v2, step 2 of 7 (gating checks). The content model now has an outcome state union
(`payer` / `excluded` / `depends`) instead of a payer-only routing field, and the ten scenarios are
reclassified accordingly. `copy:check` enforces that "tidak ditanggung" and its variants appear only
on an `excluded` outcome with its Pasal 52 article rendered inline. The reference layer, the INA-CBG
page, and condition pages (steps 3-7) haven't started. Rule content is **draft, not re-verified** —
see [`UPDATING.md`](./UPDATING.md) before treating any citation as accurate, and the hospital-staff
interviews CLAUDE.md's M0 calls for haven't happened yet.

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
pnpm bundle:check           # per-route gzipped JS budget (120 KB — DESIGN.md v2 §10 allows up to
                             # 140 KB once the reference layer ships; not raised yet since it hasn't)
pnpm typecheck
pnpm lint
```

`pnpm test:safety`, `pnpm test:a11y`, `pnpm content:validate`, and `pnpm copy:check` gate the build —
`pnpm build` runs `content:validate` and `copy:check` before `next build`; CI additionally runs
`test:safety`, `test:a11y`, and `bundle:check` (`.github/workflows/deploy.yml`).

## What's not yet built

- The reference layer, INA-CBG explainer, and condition pages (MIGRATION.md steps 3-5).
- Cross-content-type search and the staff-mode reference index (step 6).
- Share cards and print sheets for the reference/condition types (step 7) — scenarios already have
  these (`components/share/ShareCard.tsx`).
- English content (`/en/*`) — the `[locale]` route is structurally ready but only `id` has copy.
- Legal re-verification of the rule packs and the hospital-staff interviews M0 calls for.

## Known deviation from CLAUDE.md's layout tree

CLAUDE.md sketches `(petugas)/` and `(keluarga)/` as Next.js route groups. Route groups don't add a
URL segment, so both would resolve to `/id` and collide. This repo uses plain `petugas/` and
`keluarga/` segments instead (`/id/petugas`, `/id/keluarga`) so the app actually builds and routes.
