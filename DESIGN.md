# DESIGN — Alur JKN

Authoritative for every visual and copy decision in this repository. `PRD.md` says what the product is; this says what it looks like, how it speaks, and why each choice exists. When code and this document disagree, this document is right.

**v3 note.** §1, §2, §3, §6, §7, §9, §12 and §13 are unchanged in substance from v2 — the palette, the three-state model, the type stack, the copy rules and the framing rules were right and are not reopened. §1–§13 keep their numbering because `CLAUDE.md` cites them by section; new material is inserted inside existing sections or added as §14–§18.

**What v3 changes.** v2 built one excellent idea — the pathway as a transit map — and used it on one route out of fifteen. Every other screen fell back to a list in a bordered box. v3 makes the map the app's structure rather than one of its pages, specifies the tables §4 already permitted but nobody built, adds a primitive layer, makes print a real surface, and closes two claims this document made that the code does not honour.

---

## 1. Who is holding the phone

**A family in a hospital corridor.** Possibly at 2am, possibly just given bad news, often elderly, often on a cracked mid-range Android on hospital wifi.

**Or a nurse**, standing, in a hurry, under fluorescent light, turning a screen toward a stranger — and looking something up mid-conversation while a patient waits.

What that rules out: **no dark mode** (reads as ominous, fails in bright light), **no dense dashboards**, **no delight**, **nothing below 16px**.

**The reference layer must be fast to scan.** A staff member has fifteen seconds, not sixty. Reference pages are denser than family-mode screens, and that is correct — different user, different state, same type floor.

**A note on ambition.** Nothing in this document should be read as an argument for plainness. This app should be striking, and the way it gets there is by executing printed public-information design properly — Beck, Isotype, transit signage, the good public-health leaflets — not by adding motion or weight. That tradition is rigorous, instantly legible, and almost nobody does it on the web. It is also, not coincidentally, exactly right for someone reading at arm's length in a corridor.

## 2. Colour — the payer, not the verdict

Green-and-red for covered-and-not is the obvious approach and it is wrong. Red in a hospital means bad news; a red badge beside someone's situation turns an explanation into a confrontation.

**Colour encodes who pays.** Each payer is a lane. "You pay out of pocket" is one lane among several, rendered as neutrally as the rest.

```
--paper    #F7F5F0    warm off-white
--ink      #1F2421    warm near-black
--rule     #DCD8CF    hairlines

--payer-1  #2F6B5E    deep teal
--payer-2  #4A5C8A    slate blue
--payer-3  #8A6A3B    bronze
--self     #6E7A72    grey-green — out of pocket

--care     #C2542B    burnt orange — emergency route only
```

Payer colours are deliberately unlike any Indonesian institution's brand. The product must not read as an official channel.

`--self` is load-bearing: neutral by design, because out-of-pocket is a routing outcome, not a stamp.

`--care` is the only loud colour, and the rule behind it — **the strongest colour in this app always points toward getting care, never toward denial.**

**No red. No green-means-good. No traffic-light metaphor. No gradients, no shadows.**

**Every payer also carries a line pattern** (§11): `--payer-1` solid, `--payer-2` long dash, `--payer-3` dash-dot, `--self` fine dot. The pattern is not decoration and not a fallback — it is the primary encoding for anyone who cannot separate the hues, and it must be defined once in `payerStyle.ts` and consumed everywhere, including the states currently reimplemented inline in `OutcomeDisplay`.

## 3. The three states

v1 had payer lanes and nothing else, which forced every outcome into a payer. Real cases have three shapes, and collapsing them is what produced the "not covered" confusion in the first place.

### State A — a payer settles it
Rendered as a payer lane, in that payer's colour and pattern. Includes coordination cases where one payer settles first and JKN continues.

### State B — excluded by regulation
**Only for items enumerated in Perpres 82/2018 Pasal 52.** Rendered in the `--self` lane, **always with its article citation visible inline**. The citation is not optional decoration — it is what distinguishes a genuine regulatory exclusion from staff shorthand.

### State C — depends
Medical indication, hospital capability, tariff package. **Rendered as a pattern, not a colour** — a diagonal hatch over `--rule`, because this is not a payer state at all and giving it a payer colour would be a lie.

**State C is always paired with a question to ask.** It never appears alone. A "depends" with no question is an incomplete screen, not a neutral one.

This is the design system's enforcement of `PRD.md` §3: the only route to "not covered" language runs through State B, and State B requires a Pasal 52 citation.

## 4. The reference layer

Six reference pages, all sharing one layout: a scannable index, then entries.

**Entry shape.** Term, one-line plain-Indonesian definition, the detail, the citation line. Nothing longer than a short paragraph before a break.

**The index is the product** for staff. Alphabetical or grouped, always visible on desktop as a left rail, collapsible on mobile. Search filters it live.

### Tables — specified, because v2 permitted them and none were built

`alat-kesehatan` and `kelas` are tabular data currently rendered as stacked prose cards. That is the single largest functional miss in the reference layer: a staff member scanning for a replacement interval has to read paragraphs instead of finding a cell.

Build a real `<table>`, not a grid of divs:

- Semantic `<table>`, `<caption>`, `<thead>`, `<th scope="col">` and `<th scope="row">`. The caption states what the table covers and is visible, not `sr-only`.
- Row height generous — minimum 48px of clickable/readable height, matching the target token.
- Hairline `--rule` separators. **No zebra striping** — it fights the payer lanes.
- Numeric columns right-aligned, IBM Plex Mono, `font-variant-numeric: tabular-nums`.
- **Reflow to stacked rows below the reference-layer breakpoint and at 200% zoom**, with each cell prefixed by its column header. No horizontal scroll, ever (§11).
- The citation line belongs to the row, not to the table. A ceiling without its instrument is an unsourced number.

**Which content is tabular:** device ceilings and replacement intervals; class tiers and the naik-kelas difference rules; poli referral validity periods. **Which is not:** Pasal 52 (a list, and its plain-language examples matter more than any column), Fornas (prose about a mechanism), INA-CBG (see below).

### INA-CBG is not a table — and it is not a fixed picture either

It is the spine. `CLAUDE.md` requires every condition page to reach it, and it is currently four hardcoded labels reused identically no matter which condition links there.

**The diagram is data-bound.** Each condition supplies the items inside its own package, and the diagram renders *that* package: the outer box is the tariff, the chips inside are what it contains, and the caption states that the box is the same size regardless of which method sits inside it. Appendectomy shows open and laparoscopic as two chips in one box — which is `PRD.md` §3 as a picture, and the most valuable single image in the product.

No rupiah figures inside the box, ever (`CLAUDE.md` invariant 9). The box has no scale; it is a container, not a quantity.

## 5. The pathway — a system, not a page

The referral system as a **transit map**, not a flowchart. Flowchart diamonds read as bureaucracy to someone already frustrated by bureaucracy; everyone understands stations and lines.

One line: first-level facility → hospital (drawn larger, an interchange) → sub-specialist. A second line in `--care` enters the hospital directly, skipping the first station — the emergency bypass, taught in two seconds with no reading. Your position is marked.

Thick strokes, rounded caps, 45° angles only, generous spacing, large labels.

### The out-of-pocket branch

A `--self` branch descends from the hospital interchange through the three things that can still cost money: naik kelas, obat non-Fornas, alkes above ceiling. It is drawn as a branch line, in `--self`'s dot pattern — a route, not a dead end. This is §2's principle made spatial: paying out of pocket is a lane you can be on, not a failure state.

### Pasal 52 sits off the network

**The exclusions are drawn as stations connected to nothing.** A small detached cluster, unlinked to any line, labelled with the article.

This is the most important drawing in the product. `PRD.md` §3 argues in prose that only an enumerated set is genuinely outside the guarantee and everything else is a question of which lane pays. Drawn once, that argument is understood before a word is read — and it inoculates against the staff shorthand the whole product exists to correct.

### The map appears everywhere, not on `/alur`

A **station fragment** — the local piece of the network, with the current location marked — sits at the top of every scenario page, every reference entry page, and every condition page. The way a station sign shows you where you are on the line.

This is what turns fifteen bordered-box screens into one place with fifteen locations in it. It is static inline SVG generated from the content schema's existing position field; it adds no JavaScript.

Fragments are cropped views of one canonical network definition in `lib/`, never separately drawn. If the network changes, every fragment changes with it.

### The home page is the network

Not a heading, a paragraph, and two cards. The full map, at full width, with the emergency bypass and the off-network exclusions visible. Mode selection sits above it as a small pair of links, not as the entire first screen.

A visitor should understand the shape of the referral system before they choose a door.

### Condition pages carry their own route

Each condition renders the network with its own path highlighted and everything else dimmed: which poli, whether the emergency bypass applies, and which out-of-pocket stops are in play for that procedure. Generated from the five §5.3 sections, not hand-drawn per condition.

This is the strongest thing this app can show, and it is the reason the map must be a system rather than a page.

## 6. Type

**Atkinson Hyperlegible throughout** — designed by the Braille Institute for low-vision readability, with letterforms disambiguated from each other. This audience includes elderly patients, people crying, and people reading a cracked screen at arm's length.

**IBM Plex Mono** for regulation references, article numbers, and reference-table figures.

Self-hosted via `next/font`. No runtime CDN request.

```
caption    16px      — the floor, nothing smaller anywhere
body       18px      — minimum
body-lg    20px      — family mode
key        24px      — the one statement that matters
heading    28px
line-height 1.65
```

Weight 400 body, 500 headings, never above 500.

**Map labels use the same scale.** A station label is `body` at minimum. A transit map that needs 12px labels is too dense and should carry fewer stations, per §13's rule about removing content rather than shrinking type.

## 7. Layout — three doors

**Family mode.** One question per screen. Never more than one decision visible. 56px targets, obvious back, no progress pressure.

**Staff mode.** Flat scenario list plus the reference index. Landscape-friendly, desk-readable, optimised for speed.

**Reference mode.** Index rail plus entries, live filter, deep-linkable. Denser than family mode, same type floor.

**Condition pages** use the family-mode column width with the five §5.3 sections as fixed, labelled blocks — always in the same order, so a repeat user learns where to look. The route diagram (§5) sits above the five sections.

**Every mode carries its station fragment** at the top, below the emergency message and above the content. The emergency message is always first in DOM order (§9, `CLAUDE.md` invariant 1); the fragment never precedes it.

## 8. Motion — two moments, both real

**The route drawing forward** when a position is set. Orientation, not decoration. Also used once on page entry for the station fragment: the local line strokes in over 500ms. One reveal per page load, not per element.

**The payer handoff.** v2 specified a bar filling in the first payer's colour to their limit, then continuing in JKN's. The implementation renders a fixed 50/50 split with a `transition-[width]` that can never fire, because nothing changes the width — the app's second motion moment currently animates nothing.

Resolve it one way, deliberately:

- **If a coordination case has a stated limit** in its rule pack (Jasa Raharja's ceiling, for instance), the bar animates to the real proportion on entry and the limit is named in the caption. This is the version worth having: it makes coordination visible in a way no sentence achieves.
- **If no limit is stated**, render an equal split with no transition and a caption saying the split is illustrative. Delete the inert transition classes.

**Nothing else moves.** No navigation transitions, no skeleton shimmer, no loading delight. There is no third moment, and a request for one should be refused.

```
--dur-draw   500ms
--dur-state  180ms
--ease       cubic-bezier(0.2, 0, 0, 1)
```

`prefers-reduced-motion`: both states render complete and instant. This is asserted by a test that renders with the preference simulated and checks the outcome, not by a test that checks the animated element exists (§17).

## 9. Copy — design, more than the visuals

**Never a verdict about the person.**
Not *"Anda tidak ditanggung."*
Instead: *"Untuk kecelakaan lalu lintas, Jasa Raharja menanggung lebih dulu sampai batas tertentu. Setelah itu JKN melanjutkan."*

**Never "tidak ditanggung" outside State B.** Enforced by a banned-phrase check. For State C, the phrasing is about determinants:
Not *"Laparoskopi tidak ditanggung."*
Instead: *"Paket JKN sama untuk kedua metode. Metode yang dipakai tergantung indikasi medis dan apakah rumah sakit ini bisa melakukannya dalam paket tersebut."*

**Never blame.**
Not *"Seharusnya Anda ke Puskesmas dulu."*
Instead: *"Jalur rujukan dimulai dari Puskesmas atau klinik. Ini yang bisa dilakukan sekarang: …"*

**Always a next action. Always the question to ask** — the real output of the product:
*"Tanyakan ke petugas: apakah kondisi saya masuk kriteria gawat darurat menurut Permenkes 47/2018?"*

**Plain Indonesian, not legal Indonesian.** Every regulation term glossed on first use. Short active sentences.

**The emergency line is fixed wording and comes before any coverage content**, on every path:
*"Kalau ini keadaan gawat darurat, langsung ke IGD sekarang. Urusan jaminan bisa dibereskan setelahnya."*

**Diagram labels are copy.** Every station name, branch label and caption in the map passes the same banned-phrase scan as prose. A diagram is not exempt because it is a picture — `collectContentCopy.ts` must reach map labels.

**One string per meaning.** Two different "not found" messages currently exist for the same state. Every user-visible string lives in `lib/copy/` exactly once.

## 10. Performance is a design constraint

A hospital corridor is one of the worst network environments there is.

- **Offline after first load, precached — actually built.** v2 asserted this and nothing implemented it; the only offline behaviour present is the browser HTTP cache, which is default behaviour, not a feature. See §18.
- Total route JS under 140 KB gzipped — raised from 120 KB for the reference layer, and no further.
- Subset fonts, no icon font, no images beyond inline SVG.
- No third-party runtime scripts. One build-time exception, §18.
- First meaningful paint under three seconds on throttled 3G.

**The map costs nothing.** Every diagram in this document — network, fragments, condition routes, INA-CBG packages — is inline SVG generated at build time from the content schema. None of it ships JavaScript. If a proposed diagram needs a client-side library, the diagram is wrong for this app.

## 11. Accessibility floor

The starting position, not a milestone.

- **48px minimum targets, 56px in family mode.** Use the `target` / `target-family` spacing tokens by name — they are currently declared and never consumed, with fourteen hand-written `min-h-[48px]` arbitrary values instead.
- **AA minimum everywhere; AAA on the key line and the emergency message** — verified, not asserted. See §17.
- **Full function at 200% zoom**, no horizontal scroll, including reference tables, which reflow to stacked rows.
- **No meaning by colour alone.** Payer lanes carry text labels and distinct line patterns (§2). State C's hatch is paired with a text label. **Map lines carry their pattern too** — a network distinguished only by hue fails this rule as surely as a badge would.
- **The map has a text equivalent.** Every diagram is `aria-hidden` and accompanied by a `sr-only` ordered list of its stations, branches and the current position. A diagram without a text path is not finished.
- **Complete screen-reader path**, emergency message first in DOM order.
- Focus visible at 3px on every interactive element. Map stations that are links are focusable in reading order and show the same 3px outline.

## 12. Trust and framing

- **Explicit unofficial statement in every screen footer**, not only the about page.
- **No institutional colours, logos, seals, or typography.**
- **Every rule and every reference entry shows its instrument, article, and verification date** in a small reference line.
- The programme name describes the subject; the institution name is not used as branding.

## 13. What not to do

- No verdict about a specific case.
- **No "tidak ditanggung" outside a Pasal 52 item with its citation shown.**
- No State C without a question to ask.
- No red, no green-means-good, no traffic-light metaphor.
- No dark mode.
- No `--care` outside the emergency route.
- No type below 16px, including map labels.
- No colour-only encoding, including map lines.
- No diagnostic question anywhere.
- No rupiah amounts in patient-facing content, including inside the INA-CBG box.
- No analytics, storage, or transmission of anything the user types.
- No flowchart diamonds in place of the transit map.
- No component library.
- **No third motion moment.**
- **No diagram that requires client-side JavaScript to render.**

---

## 14. The primitive layer — new in v3

There is no `components/ui`. The bordered-button className string is written out near-identically in three components. The payer colour-and-pattern mapping is centralised in `payerStyle.ts` and then reimplemented inline in `OutcomeDisplay` for two of the three states. Two different strings exist for "not found".

This is how a design system decays: not through a bad decision, but through the fourth copy of a className drifting one class away from the other three.

Build a thin primitive layer — `Button`, `Card`, `Field`, `Table`, `StationFragment` — with no variants beyond what is actually used twice. **This is not a component library** (§13); it is this app's own five components, hand-written, no dependency. Every spacing and radius value in them comes from the token scale.

The rule: **a className string that appears in three files is a component.**

## 15. Print is a surface — new in v3

`PRD.md` M6 lists print sheets and the app has a `window.print()` button and a `.no-print` class. That is not a print design.

A hospital desk pinning a one-page reference to a wall is this product reaching people who will never open the site. It is the highest-leverage distribution this app has, and it is the natural endpoint of a public-information aesthetic.

- A print stylesheet per content type: scenario, reference entry, condition, and **the full network map as a single sheet**.
- Black on white, hairlines, no `--paper` background fill. Payer lanes print as their line patterns — which is exactly why §2 requires patterns in the first place.
- The citation line, instrument, article and verification date print. **The unofficial-project statement prints.** A sheet on a wall outlives the browser tab and must carry its own framing.
- Every URL that a link points to is printed after the link text.
- One sheet, A4, no orphaned second page. If it does not fit, remove content (§13), do not shrink type.

## 16. What this document does not govern

The condition list itself. Which eight to twelve procedures get pages is chosen with the hospital team by observed frequency of confrontation, per `PRD.md` §5.3 — not by which ones diagram well. If a high-frequency condition makes a boring route diagram, it still gets the page.

## 17. Verification — every claim here has a check — new in v3

Two claims in v2 were not true of the code: offline-after-first-load, and AA/AAA contrast. Both had been stated in this document for a release cycle.

The contrast case is the instructive one. `tests/a11y/axe.test.tsx` runs axe under jsdom, which has no layout engine, so the colour-contrast rule is inert on every run — a test that passes and measures nothing. `--self` on `--paper` and `text-ink/60` are the likely failures and remain unmeasured.

**The rule: a claim in this document with nothing verifying it is a bug in this document.**

Add to the gating checks:

- **Contrast, computed.** A build-time script computing the actual ratio for every token pair this document claims — `--self` on `--paper`, `--ink/60` and `--ink/70` on `--paper`, every payer on `--paper`, `--care` with white text — and failing under 4.5:1, or under 7:1 for the key line and the emergency message. Pure arithmetic on the token values; no browser needed.
- **Reduced motion, behavioural.** Render with the preference simulated and assert the end state is complete and instant. The current test asserts the animated element exists and has the right stroke colour, which is not the same claim.
- **Offline, asserted.** A smoke test that the service worker registers and that a second load succeeds with the network blocked.
- **Token consumption.** Fail on a hand-written `min-h-[48px]` where `min-h-target` exists, and on a raw hex in `app/` or `components/`.
- **Map coverage.** Every route that renders coverage content carries a station fragment; every diagram has its `sr-only` text equivalent.
- **String uniqueness.** No user-visible string literal defined in two places.

## 18. The one permitted dependency — new in v3

`CLAUDE.md` bans third-party scripts of any kind. That rule stays, with one amendment.

**Workbox, or `next-pwa`, at build time only, to generate the service worker §10 promises.**

The reasoning, so this is not read as a general loosening:

- It runs at build time. The emitted worker is first-party, self-hosted, and sits outside the per-route JS budget the bundle check gates.
- It makes the zero-network invariant *more* true, not less: a precached app makes no requests at all on a second load.
- Hand-writing a correct service worker — cache versioning, update flow, stale-asset eviction — is exactly the kind of error-prone work where a well-tested build tool is the safer choice, and getting it wrong on a public-interest tool means serving a stale regulation.

**Nothing else is admitted.** Specifically not an animation library: §8 permits two moments, both achievable in CSS keyframes that already exist, and 35KB of a 140KB budget spent on motion this document forbids would be a bad trade twice over.

`CLAUDE.md`'s stack section should be amended to read: *no third-party runtime script of any kind; one build-time exception, the service-worker generator, per `DESIGN.md` §18.*

---

## Build order for v3

1. **The canonical network** in `lib/` — one definition, with the out-of-pocket branch and the off-network Pasal 52 cluster. Nothing renders yet.
2. **`StationFragment`** and the `sr-only` text equivalent, generated from that definition.
3. **The home page** rebuilt as the full network.
4. **Fragments on every coverage route.**
5. **The contrast script** and the reduced-motion behavioural test — before more surface is added on top of unverified claims.
6. **Tables** for `alat-kesehatan` and `kelas`, with the 200% reflow.
7. **The primitive layer**, absorbing the duplicated className strings and the inline payer styles.
8. **Data-bound INA-CBG diagram**, then condition route diagrams.
9. **Service worker** (§18) and the offline smoke test.
10. **Print stylesheets**, network sheet last.

Check every step at 200% zoom on a 375px viewport. That combination — a phone, doubled — is this app's real hardest case, and it is the one a family in a corridor is most likely to be using.