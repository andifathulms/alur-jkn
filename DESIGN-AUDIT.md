# Design audit — Alur JKN

Factual as-built audit. Describes what the code and content currently do, not what the governance
docs (`PRD.md`, `DESIGN.md`, `CLAUDE.md`) say it should do, except where noted for comparison.

## 1. What this app is

Per `PRD.md`/`CLAUDE.md`: a static Indonesian-language explainer for the JKN (national health
insurance) referral and coverage system. It exists so patients arrive at a hospital desk with
correct expectations and a specific administrative question to ask staff, rather than a claim about
whether their case is covered — the app is explicitly built to never state or imply a coverage
verdict. Primary audience is hospital staff (a repeat, mid-conversation lookup tool); secondary
audience is patients/families, reached through staff and through sharing.

The core object the app manipulates is **the referral pathway as a transit-map diagram**: stations
(`FKTP` → `Rumah Sakit` → `Sub-spesialis`) connected by a line, with a second line entering the
hospital directly (the emergency bypass), and an optional position marker. It is rendered by
`components/pathway/PathwayMap.tsx` (a hand-built inline SVG, `viewBox="0 0 440 220"`), wrapped by
`components/pathway/PathwayExplorer.tsx` (adds a position-picker control), on the route
`app/[locale]/alur/page.tsx`.

A second, arguably co-equal object is the **three-state outcome model** (`payer` / `excluded` /
`depends`, `lib/content/outcome.ts`) that drives most other screens — every scenario and the payer
side of most reference/condition content is expressed as one of these three states and rendered by
`components/state/OutcomeDisplay.tsx` (dispatching to `PayerHandoffBar`, or two inline `<div>`
blocks for the other two states).

## 2. Stack & constraints

- **Framework**: Next.js 14.2.35, App Router, `output: 'export'` (`next.config.js`) — static HTML
  export only, no server runtime.
- **Build tool**: Next's own build (webpack under the hood via `next build`); package manager pnpm
  9.15.9 (pinned via `packageManager` field).
- **Deploy target**: GitHub Pages, via `.github/workflows/deploy.yml` (`actions/deploy-pages@v4`).
  `basePath` is hardcoded to `/alur-jkn` in production (`next.config.js`), `trailingSlash: true`,
  images `unoptimized: true`.
- **Routing**: App Router with a single dynamic segment, `app/[locale]/...`. `generateStaticParams()`
  in `app/[locale]/layout.tsx` returns only `[{ locale: 'id' }]` — English is not generated. One
  dynamic content route, `app/[locale]/kondisi/[slug]/page.tsx`, plus a dynamic scenario route
  `app/[locale]/petugas/[scenario]/page.tsx`, both statically generated via `generateStaticParams`.
- **Styling**: Tailwind CSS 3.4.13, utility classes only, no CSS-in-JS, no component library. Full
  token config, verbatim from `tailwind.config.ts`:

  ```ts
  theme: {
    extend: {
      colors: {
        paper: '#F7F5F0',
        ink: '#1F2421',
        rule: '#DCD8CF',
        'payer-1': '#2F6B5E',
        'payer-2': '#4A5C8A',
        'payer-3': '#8A6A3B',
        self: '#6E7A72',
        care: '#C2542B',
      },
      fontFamily: {
        sans: ['var(--font-atkinson)'],
        mono: ['var(--font-plex-mono)'],
      },
      fontSize: {
        caption: ['16px', { lineHeight: '1.65' }],
        body: ['18px', { lineHeight: '1.65' }],
        'body-lg': ['20px', { lineHeight: '1.65' }],
        key: ['24px', { lineHeight: '1.65' }],
        heading: ['28px', { lineHeight: '1.65' }],
      },
      spacing: {
        target: '48px',
        'target-family': '56px',
      },
      transitionDuration: {
        draw: '500ms',
        state: '180ms',
      },
      transitionTimingFunction: {
        alur: 'cubic-bezier(0.2, 0, 0, 1)',
      },
      borderWidth: {
        focus: '3px',
      },
    },
  },
  ```

  `darkMode: undefined`. Global CSS (`app/globals.css`) additionally defines `:focus-visible`
  (3px outline), a `@keyframes pathway-draw` + `.pathway-progress` class, a
  `prefers-reduced-motion` block collapsing all animation/transition durations to `0.01ms`, and a
  `@media print { .no-print { display: none } }` rule.

- **Vis/animation/chart libraries actually imported**: none. `package.json` dependencies are `next`,
  `react`, `react-dom`, `zod` only — no D3, no charting library, no animation library, no icon
  library. The transit map and the INA-CBG diagram are both hand-authored inline SVG with raw
  coordinate math in the component. The one CSS keyframe animation (`pathway-draw`) and the one
  Tailwind `transition-[width]` (in `PayerHandoffBar`) are the only motion in the app.
- **Fonts**: `next/font/google` (`app/fonts.ts`) — Atkinson Hyperlegible (weights 400/700) and IBM
  Plex Mono (weights 400/500), both self-hosted at build time via Next's font pipeline.
- **Constraints actually enforced by code/CI** (`.github/workflows/deploy.yml`,
  `scripts/bundle-check.ts`, `scripts/validate-content.ts`, `scripts/copy-check.ts`):
  - Static hosting / no backend: `output: 'export'`, no API routes exist, no server components with
    data fetching (`fetch` doesn't appear anywhere in `app/`/`components/`).
  - Bundle size: `scripts/bundle-check.ts` fails the build if any route's gzipped JS exceeds
    `140 * 1024` bytes (comment states this was raised from 120 KB once `/cari` needed it).
  - Zero network at runtime: no `fetch`/`XMLHttpRequest`/analytics/error-reporting call anywhere in
    `app/`, `components/`, or `lib/`.
  - i18n: structurally present (`[locale]` segment, `lang="id"` hardcoded in `app/layout.tsx`) but
    only Indonesian content exists; no `/en` route is generated.
  - Mobile: Tailwind responsive prefixes (`sm:`, `md:`) are used throughout; no separate mobile
    build or device-specific code path.
  - Offline: `DESIGN.md` §10 claims "Offline after first load, precached," but no service worker,
    manifest, or precache mechanism exists anywhere in the repo (`public/` contains only
    `.nojekyll`). This is a documentation/implementation gap, stated factually — see §6.

## 3. Visual system as-built

**Colour literals** (raw hex/rgba, outside the Tailwind token layer), with occurrence counts from a
repo-wide grep of `app/` and `components/`:

| Literal | Occurrences | Where |
|---|---|---|
| `#2F6B5E` (= `payer-1`) | 3 | `InaCbgDiagram.tsx` (×2), `PathwayMap.tsx` |
| `#DCD8CF` (= `rule`) | 3 | `InaCbgDiagram.tsx`, `PathwayMap.tsx` (×2) |
| `#C2542B` (= `care`) | 2 | `PathwayMap.tsx` (×2) |
| `#F7F5F0` (= `paper`) | 1 | `PathwayMap.tsx` |
| `#1F2421` (= `ink`) | 2 | `PathwayMap.tsx` (×2) |
| `rgba(247,245,240,0.35)` | 2 (each used twice in a `repeating-linear-gradient`) | `payerStyle.ts`, `OutcomeDisplay.tsx` |
| `rgba(247,245,240,0.45)` | 1 | `payerStyle.ts` (radial-gradient dot pattern) |
| `rgba(31,36,33,0.18)` | 1 (used twice in one gradient) | `OutcomeDisplay.tsx` (State C hatch) |

All raw hex values above are the token values re-typed as literal SVG `stroke`/`fill` attributes
(SVG presentation attributes don't take Tailwind classes), not new colours — every literal matches a
`tailwind.config.ts` token exactly. `CLAUDE.md`'s own convention says "Never raw hex in components";
`PathwayMap.tsx` and `InaCbgDiagram.tsx` violate that literally, while staying within the token
palette. Everywhere else, colour is applied via Tailwind utility classes referencing the named
tokens (`bg-care`, `text-ink`, `border-ink/20`, `bg-payer-1`, `bg-self`, `bg-rule`, etc.).

Tailwind token-class occurrence counts (repo-wide grep):

| Class | Count |
|---|---|
| `text-ink` | 24 |
| `border-ink` | 17 |
| `bg-ink` | 12 |
| `border-rule` | 7 |
| `bg-paper` | 2 |
| `bg-rule` | 1 |
| `bg-payer-1` / `bg-payer-2` / `bg-payer-3` | 1 each (all inside `payerStyle.ts`) |
| `bg-self` | 2 |
| `bg-care` | 1 (`EmergencyBanner.tsx`) |

No `red` family colour anywhere (grep for hex/rgb red values and Tailwind `red-`/`rose-` classes
returns nothing). No `dark:` variant anywhere.

**Font**: one family for UI text (`font-sans` → `var(--font-atkinson)`, 1 occurrence — set once on
`<body>` in `app/layout.tsx`), one for citations/mono figures (`font-mono` → `var(--font-plex-mono)`,
2 occurrences: `CitationLine.tsx`, `OutcomeDisplay.tsx`'s excluded-state citation span). Sizes are
the five named tokens above (`text-caption` 23 uses, `text-body-lg` 20, `text-body` 18, `text-key`
13, `text-heading` 10 — all via the token classes, no arbitrary `text-[Npx]` found anywhere). Weights
in use: `font-medium` (30), `font-bold` (13); `font-normal`/400 is never applied explicitly (it's the
body-text default, inherited).

**Spacing / radius / shadow**: no `shadow-*` class or CSS `box-shadow` anywhere except a doc comment
in `InaCbgDiagram.tsx` stating "no gradients or shadows." Border radius is two values only:
`rounded-md` (16 uses) and `rounded-lg` (6 uses) — no other radius value appears. The two named
spacing tokens (`target`/`target-family`, 48px/56px) are never referenced by their token names;
every touch-target height in the codebase is written as the Tailwind arbitrary value `min-h-[48px]`
(14 occurrences) or `min-h-[56px]` (4 occurrences) instead, so the token declarations in
`tailwind.config.ts` are currently dead — nothing consumes `spacing.target`/`spacing['target-family']`
by name. `max-w-3xl` (5), `max-w-5xl` (3), `max-w-xl` (3), `max-w-2xl` (2) are the only container
widths used. `space-y-*`/`gap-*`/`px-*`/`py-*` values in use are all from Tailwind's default numeric
scale (`space-y-2/3/4/6/8/10`, `gap-2/3/4/8`, `px-3/4/6`, `py-2/4/6/8/10`) — no arbitrary spacing
values beyond the two `min-h-[…px]` cases above.

**Centralisation**: colour, font-family, font-size, transition-duration/ease, and one border-width
token (`focus`, 3px, — though it's actually applied via a raw `outline: 3px solid` in
`globals.css:7`, not the `border-focus` Tailwind class it defines) live in `tailwind.config.ts`.
Payer→colour/pattern mapping is centralised in one function, `components/handoff/payerStyle.ts`
(consumed by `PayerHandoffBar.tsx` and duplicated inline, not reused, inside
`components/state/OutcomeDisplay.tsx`'s `excluded`/`depends` cases — those two blocks hardcode their
own `bg-self`/`bg-rule` + gradient strings rather than calling `payerClasses`). Fixed UI copy is
centralised per-feature in `lib/copy/*.ts` files (`strings.ts`, `outcomeStrings.ts`,
`searchStrings.ts`, `conditionStrings.ts`, `shareText.ts`), each imported into
`lib/copy/collectContentCopy.ts` for the banned-phrase/Pasal-52 scan. Spacing/radius are scattered as
inline Tailwind utility classes on every element — no `components/ui` primitive layer exists (no
`Button`, `Card`, `Input` component); every button/input/card is its own hand-written `<button>` /
`<input>` / `<div>` with a full className string, repeated per component (e.g. the
`min-h-[48px] px-4 border-2 border-ink rounded-md text-body font-medium hover:bg-ink/5` pattern
appears near-verbatim in `ShareCard.tsx`, `PathwayExplorer.tsx`, and `FamilyWizard.tsx`
independently).

**Dark mode**: absent. `tailwind.config.ts` sets `darkMode: undefined`; no `dark:` class exists in
any component; no `prefers-color-scheme` query in `globals.css`.

## 4. Screen & component inventory

**Routes** (all under `app/[locale]/`, locale fixed to `id`):

| Route | Purpose | Components, top to bottom |
|---|---|---|
| `/` (`app/page.tsx`) | Redirect to `/id` | — (`redirect()` call only) |
| `/id` (`page.tsx`) | Home — mode selection | `EmergencyBanner`, page heading + intro paragraph, two `Link` cards ("Mode petugas" / "Mode keluarga") in a 2-col grid, one text link to `/id/alur` |
| `/id/alur` | The pathway map | `EmergencyBanner`, heading + paragraph, `PathwayExplorer` (position buttons + `PathwayMap` SVG) |
| `/id/petugas` | Staff mode index | `EmergencyBanner`, heading, 2-col grid: scenario list (10 links) / reference-section list (6 links) |
| `/id/petugas/[scenario]` | One scenario's detail | `EmergencyBanner`, back-link, 2-col grid: (title, explanation, `OutcomeDisplay`, `QuestionCard`) / (`ShareCard`, `RuleCitationList`) |
| `/id/keluarga` | Family mode entry | `EmergencyBanner`, `FamilyWizard` (client) |
| `/id/keluarga` (wizard states) | One-question-at-a-time flow, then a resolved scenario or a fallback message | Yes/Tidak buttons, back link; on resolution: title, explanation, `QuestionCard`, `ShareCard`, back + "Lihat peta alur" links |
| `/id/rujukan` | Redirect to `/id/rujukan/ina-cbg` | — |
| `/id/rujukan/*` (layout) | Shared reference-layer chrome | `EmergencyBanner`, `ReferenceRail` (nav + live filter), `{children}` |
| `/id/rujukan/ina-cbg` | The INA-CBG explainer ("the spine") | Title/summary, `ShareCard`, `InaCbgDiagram`, 4 section blocks, `ReferenceCitationList` |
| `/id/rujukan/pengecualian` | Pasal 52 exclusion list (11 entries) | Title/summary, `ShareCard`, `ReferenceEntryList` |
| `/id/rujukan/poli` | Referral/poli rules (5 entries) | Same shape as above |
| `/id/rujukan/alat-kesehatan` | Device ceilings (5 entries) | Same shape |
| `/id/rujukan/obat` | Fornas rules (3 entries) | Same shape |
| `/id/rujukan/kelas` | Class/naik-kelas rules (3 entries) | Same shape |
| `/id/kondisi/[slug]` | One condition's 5-section page (2 slugs exist) | `EmergencyBanner`, `ConditionTemplate` (title/summary, `ShareCard`, 5 labelled `<section>` blocks — one with an inline link to `/id/rujukan/ina-cbg` — plus `RuleCitationList`) |
| `/id/cari` | Cross-content-type search | `EmergencyBanner`, heading, `SearchBox` (input + result list or prompt/no-results message) |
| `/id/aturan` | Raw rule-pack browser (v1 holdover, separate from the `/rujukan` reference layer) | Heading, one `<section>` per rule pack (4 packs) each with `RuleCitationList` — no `EmergencyBanner` on this route |

**Reusable components**, one line each:

- `EmergencyBanner` — a full-width burnt-orange (`bg-care`) bar with fixed white bold text, `role="alert"`.
- `Footer` — a thin top-bordered strip with the unofficial-project disclaimer in small grey text; present on every page via the locale `layout.tsx`.
- `PathwayMap` — the inline-SVG transit-map diagram (stations, lines, optional animated position marker).
- `PathwayExplorer` — a row of pill-style toggle buttons above `PathwayMap`, client-side state only.
- `OutcomeDisplay` — a small `switch` that renders one of three shapes: a payer bar, a muted self-coloured strip + citation text, or a hatched strip + question text.
- `PayerHandoffBar` — a rounded bar, either solid (single payer) or split 50/50 with a patterned fill (coordination), plus a caption line.
- `QuestionCard` — a bordered box with two labelled stacked paragraphs ("what to do" / "what to ask").
- `ShareCard` — three buttons in a row: Cetak (print), Salin teks (copy to clipboard), Bagikan lewat WhatsApp (a `wa.me` link); hidden on print via `no-print`.
- `RuleCitationList` / `ReferenceCitationList` / `CitationLine` — a bordered card per citation showing instrument+article (mono), a "Diverifikasi …" line with a source link, and an optional bold staleness warning; the first two are thin wrappers around the third.
- `ReferenceRail` — a left sidebar: a `<details>`-collapsible search input plus a link list, active item inverted (dark background), sticky on desktop.
- `ReferenceEntryList` — a stacked list of bordered cards (term, definition, detail, nested `CitationLine`), each with an anchor `id`.
- `ReferenceEntryListPage` — the shared page body for the five entry-list reference routes (title/summary + `ShareCard` + `ReferenceEntryList`).
- `InaCbgDiagram` — a fixed, non-interactive inline SVG: one outer box, four labelled inner chips, a caption line.
- `ConditionTemplate` — the fixed five-section condition-page layout.
- `SearchBox` — a large search input plus a live-filtered result list (or a prompt / "not found" message), each result a linked card with a content-type label.

**Which component holds the §1 core object, and how much of the viewport it occupies**: `PathwayMap`
(inside `PathwayExplorer`, on `/id/alur`). It is an `<svg viewBox="0 0 440 220" className="w-full
h-auto">` inside a `max-w-3xl` (768px-capped) column with `px-4`/`sm:px-6` padding. On a desktop
viewport ≥768px wide, the SVG's rendered width is capped at roughly 720–736px (768px minus padding)
regardless of window width, giving a 2:1 aspect box — width is a fixed ceiling, so as a fraction of
viewport it shrinks as the window widens (e.g. ~51% of a 1440px-wide viewport, ~37% of a 1920px one);
height is a small fraction of viewport height either way (roughly 360–368px wide × 180–184px tall at
the 768px cap, well under 20% of a typical desktop viewport height). On a mobile viewport (e.g.
375–414px), the SVG fills nearly the full width minus 32px of padding (~89–91% of viewport width),
with height scaling proportionally (~170–185px, a modest fraction of a phone's viewport height). These
are computed from the container/viewBox constraints, not measured in a browser.

## 5. Interaction & state

**Everything the user can do**:
- Click/tap navigation links (every page-to-page move is a plain `<a>`/`next/link`, no client-side router state beyond Next's default).
- On `/id/alur`: click one of 5 toggle buttons (`PathwayExplorer`) to set/clear a pathway position; `aria-pressed` reflects state.
- On `/id/keluarga`: click "Ya"/"Tidak" per question (`FamilyWizard`, up to 6 sequential yes/no administrative questions depending on path), click "← Kembali" to undo one step at a time.
- On `/id/rujukan/*`: type into the rail's search input to live-filter the 6-item section list; the rail is a native `<details>` element, so it is natively collapsible/expandable by click/tap/Enter/Space on its `<summary>` on mobile (summary hidden via `md:hidden` on desktop, content always visible there).
- On `/id/cari`: type into a search input to live-filter across scenarios/reference entries/conditions.
- On any scenario/reference/condition page: click "Cetak" (calls `window.print()`), "Salin teks" (calls `navigator.clipboard.writeText`, then shows "Tersalin" for 2s via `setTimeout`), or "Bagikan lewat WhatsApp" (an `<a href="https://wa.me/?text=...">`, opens in a new tab).
- Keyboard: no custom key handlers exist anywhere (`onKeyDown`/`onKeyUp`/`tabIndex` do not appear in the codebase) — all interaction is via native `<button>`, `<a>`, `<input>`, and `<details>`/`<summary>` elements, so keyboard operability (Tab, Enter/Space activation, native `<details>` toggle) comes entirely from browser-native semantics, not app code.
- Gestures: none beyond default browser scroll/tap; no swipe, drag, or pinch handling anywhere.

**Animation**: two mechanisms, matching `DESIGN.md`'s "two moments" claim structurally, though the
map is the more elaborate of the two:
1. `PathwayMap`'s progress line — a `<line className="pathway-progress" pathLength={1}>` whose
   `stroke-dasharray`/`stroke-dashoffset` are set by a CSS `@keyframes pathway-draw` rule in
   `globals.css`, 500ms, `cubic-bezier(0.2, 0, 0, 1)`, triggered by React re-mounting the element
   (`key={progress-${position}}`) when the selected position changes.
2. `PayerHandoffBar`'s coordination split — plain Tailwind `transition-[width] duration-draw
   ease-alur` classes on two flex children, but both children are hardcoded to `w-1/2` with no state
   change that alters the width, so in the current code this transition never actually fires (there
   is nothing that changes the width value to transition to/from).

Both respect `prefers-reduced-motion` via the global rule in `globals.css` that forces all animation/
transition durations to `0.01ms`.

**Loading / empty / error / no-result / first-visit states**:
- **Loading**: none exist. No `loading.tsx` anywhere in `app/`, no spinner/skeleton component, no
  `isLoading` state variable anywhere in the codebase (grep confirms zero matches). Consistent with
  the app being fully statically exported with no client data fetching.
- **Empty**: `FamilyWizard` has one explicit empty/fallback state — when the wizard resolves to no
  matching scenario, it shows a plain sentence ("Dari jawaban Anda, tidak ada hal khusus…") instead
  of a scenario card.
- **Error**: no `error.tsx` or `global-error.tsx` exists anywhere in `app/`; unhandled render errors
  fall through to Next's untouched default error UI.
- **No-result**: two independent implementations, not shared — `ReferenceRail` shows "Tidak
  ditemukan." (hardcoded string literal in the component) and `SearchBox` shows
  `SEARCH_LABELS.noResults` ("Tidak ditemukan. Coba kata kunci lain.", from
  `lib/copy/searchStrings.ts`) — same Indonesian phrase, different string constants, slightly
  different wording, defined in two places.
- **404 / not-found**: `notFound()` is called in three dynamic-lookup pages
  (`kondisi/[slug]`, `petugas/[scenario]`, `rujukan/ina-cbg`, and inside
  `ReferenceEntryListPage`), but no custom `not-found.tsx` exists, so it renders Next's default,
  unstyled 404 page.
- **First-visit**: no distinct first-visit/onboarding state. `/id` (the home page) is the only
  entry point that differs from a returning-user view, and it is a static two-card chooser with no
  first-time-only content, no dismissible tips, and nothing persisted about visit history
  (consistent with invariant 10 — nothing is stored).

## 6. Weak points, stated plainly

- **Home page (`/id`) is a generic two-card grid with a heading and a paragraph above it** —
  structurally a "hero + two feature cards" layout with no app-specific visual element; the pathway
  map, the payer-lane colour system, and the three-state model are all absent from the first screen
  a user sees.
- **`/id/petugas` and every `/id/rujukan/*` and `/id/aturan` page is a plain list-in-a-bordered-box
  or a list-of-cards** — scenario list, reference-section list, `ReferenceEntryList`,
  `RuleCitationList` are all the same visual shape (bordered `<li>` rows or cards in a `<ul>`), no
  differentiation beyond text content. This is most of the app's screen count.
- **The core "spatial" object (the referral pathway) is used on exactly one route** (`/id/alur`);
  every other screen that discusses a payer/routing outcome falls back to a small horizontal bar
  (`PayerHandoffBar`) or a one-line text block (`OutcomeDisplay`'s excluded/depends cases) rather
  than any positional or diagrammatic representation, even though the underlying data (which
  station, which payer, which citation) is inherently structured/relational, not prose.
- **Reference entries with numeric/interval content are rendered as prose paragraphs, not a table or
  any tabular layout** — e.g. `alat-kesehatan` (device ceilings + replacement intervals) and `kelas`
  (class tiers) are lists of `{term, definition, detail}` text blocks
  (`components/reference/ReferenceEntryList.tsx`), despite `DESIGN.md` §4 stating tables are
  "genuinely tabular" and allowed for exactly this content; no `<table>` element exists anywhere in
  the codebase (grep confirms zero).
- **The INA-CBG diagram (`InaCbgDiagram.tsx`) is static and non-interactive** — four hardcoded
  example labels ("Operasi terbuka", "Laparoskopi", "Rawat inap", "Obat & alkes") in fixed positions,
  no data binding, no per-condition customisation, reused identically regardless of which condition
  page links to it.
- **A11y — contrast**: not verified anywhere in the codebase or CI. The a11y test suite's own comment
  (`tests/a11y/axe.test.tsx`) states jsdom has no layout engine, so axe's colour-contrast check is
  inert in every automated run; no browser-based or visual-regression contrast check exists in the
  repo. `--self` (`#6E7A72`) on `--paper` (`#F7F5F0`) and `text-ink/60`/`text-ink/70` (opacity-reduced
  near-black on off-white) are the colour pairs most likely to be contrast-marginal, but this audit
  did not compute their ratios.
- **A11y — focus states**: a single global `:focus-visible` rule (3px solid outline) covers every
  interactive element uniformly; no component defines its own focus treatment, so focus visibility
  is consistent but also undifferentiated (a focused search input looks the same as a focused nav
  link).
- **A11y — keyboard traps**: none found — no custom keyboard handling exists at all (see §5), so
  there is nothing in the app that could trap focus; conversely there is also no custom
  keyboard-shortcut support (e.g. no "/" to focus search).
- **A11y — reduced motion**: handled at the CSS level globally (`globals.css`), not per-component;
  this is complete for the two animations that exist, but there is no test that renders with
  `prefers-reduced-motion: reduce` simulated and asserts on the result — `tests/a11y/pathway-motion.test.tsx`
  checks that the animated elements exist and carry the right stroke colour, not the reduced-motion
  behaviour itself.
- **Duplicated visual/logic patterns**: the payer-lane colour+pattern mapping is defined once
  (`payerStyle.ts`) but re-implemented inline (different Tailwind arbitrary-gradient strings, not a
  shared call) inside `OutcomeDisplay.tsx` for the `excluded`/`depends` cases; the "bordered button"
  className string is repeated near-identically across `ShareCard.tsx`, `PathwayExplorer.tsx`, and
  `FamilyWizard.tsx` rather than factored into one component; two different "no results" strings
  exist for what is conceptually the same state (`ReferenceRail` vs. `SearchBox`).
- **Claimed-but-absent feature**: `DESIGN.md` §10 and `PRD.md` §9 both assert the app "works offline"
  / "offline after first load, precached" — no service worker, no `manifest.json`, and no caching
  mechanism of any kind exists in the repository. A user's browser HTTP cache is the only offline
  behaviour present, which is default browser behaviour, not something this app implements.

## Open questions

- Whether `--self` on `--paper` and `text-ink/60` / `text-ink/70` on `--paper` meet the WCAG AA
  contrast ratios `DESIGN.md` §11 claims — not computable from source alone; needs a rendered-page
  contrast check.
- Whether the `border-focus` (3px) Tailwind token in `tailwind.config.ts` is used anywhere as a class
  (`border-focus`) versus only via the raw `outline: 3px solid` CSS rule in `globals.css` — grep found
  no `border-focus` class usage, but could not confirm intent (dead token vs. reserved for future use).
- Whether `PayerHandoffBar`'s coordination-state `transition-[width]` was intended to animate a
  proportional split (e.g. based on the payer limit) and that logic was never wired up, or whether
  the always-50/50 split with a no-op transition is the intended final design — not stated in
  `DESIGN.md`, which only describes "a bar filling in the first payer's colour to their limit."
  `PayerHandoffBar.tsx`'s own comment says "No numeric claim distorts the split, so segments render
  equal width," which reads as intentional, but then leaves the `transition-[width]` classes
  currently inert — unclear if that's a leftover from an earlier design or deliberate future-proofing.
  See `components/handoff/PayerHandoffBar.tsx`.
- Real gzipped bundle sizes per route at the current commit — `scripts/bundle-check.ts` computes this
  at build time from `.next/app-build-manifest.json`, which isn't checked in; this audit did not run
  a build, so current per-route KB figures aren't reported here (see prior conversation history for
  the last-measured figure, ~118 KB on the heaviest route, which may be stale).
- Whether the `/id/aturan` route (no `EmergencyBanner`) is an intentional exception to invariant 1
  ("first in DOM order on every screen that discusses coverage") on the reasoning that a raw
  rule-pack browser doesn't "discuss coverage" in the sense the invariant means, or an oversight —
  not stated anywhere in the docs or code comments.
