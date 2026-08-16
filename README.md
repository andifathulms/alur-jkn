# Alur JKN

Explains the JKN referral and coverage system so patients arrive with correct expectations and the
right question to ask. Static site, GitHub Pages, no backend, no runtime network, no data collection.

See [`PRD.md`](./PRD.md) for what this is and why, [`DESIGN.md`](./DESIGN.md) for how it looks and
speaks, and [`CLAUDE.md`](./CLAUDE.md) for the invariants that gate every change.

**Status:** M1/M2 scaffold. The ten scenarios exist with cited rule packs, staff mode, family mode,
and the pathway map. Rule content is **draft, not re-verified** — see [`UPDATING.md`](./UPDATING.md)
before treating any citation as accurate, and the hospital-staff interviews CLAUDE.md's M0 calls for
haven't happened yet.

## Commands

```bash
pnpm install
pnpm dev                    # http://localhost:3000
pnpm build                  # static export to ./out; runs rules:validate and copy:check first
pnpm preview                # build, then serve ./out under the production basePath (/alur-jkn)
pnpm test                   # vitest watch
pnpm test:run               # vitest once — before every commit
pnpm test:safety            # emergency-first ordering, no-verdict, no clinical question
pnpm test:a11y              # structural a11y (jest-axe) + type-floor + colour-only-encoding
pnpm rules:validate         # instrument, article, sourceUrl, verifiedAt on every rule
pnpm copy:check             # banned-phrase scan over all copy and rule packs
pnpm bundle:check           # per-route gzipped JS budget (120 KB, DESIGN.md §9)
pnpm typecheck
pnpm lint
```

`pnpm test:safety`, `pnpm test:a11y`, `pnpm rules:validate`, and `pnpm copy:check` gate the build —
`pnpm build` runs `rules:validate` and `copy:check` before `next build`; CI additionally runs
`test:safety`, `test:a11y`, and `bundle:check` (`.github/workflows/deploy.yml`).

## What's not yet built

- English content (`/en/*`) — the `[locale]` route is structurally ready but only `id` has copy.
- The print/share sheet (DESIGN.md §5, §8.5) and route-drawing animation (DESIGN.md §6).
- Legal re-verification of the rule packs and the hospital-staff interviews M0 calls for.

## Known deviation from CLAUDE.md's layout tree

CLAUDE.md sketches `(petugas)/` and `(keluarga)/` as Next.js route groups. Route groups don't add a
URL segment, so both would resolve to `/id` and collide. This repo uses plain `petugas/` and
`keluarga/` segments instead (`/id/petugas`, `/id/keluarga`) so the app actually builds and routes.
