# DESIGN — Alur JKN

Authoritative for every visual and copy decision in this repository. `PRD.md` says what the product is; this says what it looks like, how it speaks, and why each choice exists. When code and this document disagree, this document is right.

**v2 note:** the palette, type, motion and accessibility rules are unchanged from v1. §3, §4 and §9 are new — they cover the reference and condition layers, and the three-state model that replaces "covered / not covered".

---

## 1. Who is holding the phone

**A family in a hospital corridor.** Possibly at 2am, possibly just given bad news, often elderly, often on a cracked mid-range Android on hospital wifi.

**Or a nurse**, standing, in a hurry, under fluorescent light, turning a screen toward a stranger — and in v2, also looking something up mid-conversation while a patient waits.

What that rules out: **no dark mode** (reads as ominous, fails in bright light), **no dense dashboards**, **no delight**, **nothing below 16px**.

What v2 adds: **the reference layer must be fast to scan.** A staff member has fifteen seconds, not sixty. Reference pages are denser than family-mode screens, and that is correct — different user, different state, same type floor.

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

## 3. The three states — new in v2

v1 had payer lanes and nothing else, which forced every outcome into a payer. Real cases have three shapes, and collapsing them is what produced the "not covered" confusion in the first place.

### State A — a payer settles it
Rendered as a payer lane, in that payer's colour. Includes coordination cases where one payer settles first and JKN continues.

### State B — excluded by regulation
**Only for items enumerated in Perpres 82/2018 Pasal 52.** Rendered in the `--self` lane, **always with its article citation visible inline**. The citation is not optional decoration — it is what distinguishes a genuine regulatory exclusion from staff shorthand.

### State C — depends
Medical indication, hospital capability, tariff package. **Rendered as a pattern, not a colour** — a diagonal hatch over `--rule`, because this is not a payer state at all and giving it a payer colour would be a lie.

**State C is always paired with a question to ask.** It never appears alone. A "depends" with no question is an incomplete screen, not a neutral one.

This is the design system's enforcement of `PRD.md` §3: the only route to "not covered" language runs through State B, and State B requires a Pasal 52 citation.

## 4. The reference layer — new in v2

Six reference pages, all sharing one layout: a scannable index, then entries.

**Entry shape.** Term, one-line plain-Indonesian definition, the detail, the citation line. Nothing longer than a short paragraph before a break.

**The index is the product** for staff. Alphabetical or grouped, always visible on desktop as a left rail, collapsible on mobile. Search filters it live.

**Tables are allowed here** — device ceilings and poli rules are genuinely tabular. Row height generous, 18px minimum, hairline `--rule` separators, no zebra striping (it fights the payer lanes). Numeric columns right-aligned, tabular figures.

**INA-CBG is not a table.** It is an explainer with one diagram: a package containing several items, with a note that the package is the same regardless of which method is inside it. That single image is the correction the product exists to make — give it room.

## 5. The pathway

The referral system as a **transit map**, not a flowchart. Flowchart diamonds read as bureaucracy to someone already frustrated by bureaucracy; everyone understands stations and lines.

One line: first-level facility → hospital (drawn larger, an interchange) → sub-specialist. A second line in `--care` enters the hospital directly from below, skipping the first station — the emergency bypass, taught in two seconds with no reading. Your position is marked.

Thick strokes, rounded caps, 45° angles only, generous spacing, large labels.

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

## 7. Layout — three doors

**Family mode.** One question per screen. Never more than one decision visible. 56px targets, obvious back, no progress pressure.

**Staff mode.** Flat scenario list plus the reference index. Landscape-friendly, desk-readable, optimised for speed.

**Reference mode.** Index rail plus entries, live filter, deep-linkable. Denser than family mode, same type floor.

**Condition pages** use the family-mode column width with the five §5.3 sections as fixed, labelled blocks — always in the same order, so a repeat user learns where to look.

## 8. Motion — two moments

**The route drawing forward** when a position is set. Orientation, not decoration.

**The payer handoff** — a bar filling in the first payer's colour to their limit, then continuing in JKN's. Makes coordination visible in a way no sentence achieves.

**Nothing else moves.** No navigation transitions, no skeleton shimmer, no loading delight.

```
--dur-draw   500ms
--dur-state  180ms
--ease       cubic-bezier(0.2, 0, 0, 1)
```

`prefers-reduced-motion`: both states render complete and instant.

## 9. Copy — design, more than the visuals

**Never a verdict about the person.**
Not *"Anda tidak ditanggung."*
Instead: *"Untuk kecelakaan lalu lintas, Jasa Raharja menanggung lebih dulu sampai batas tertentu. Setelah itu JKN melanjutkan."*

**Never "tidak ditanggung" outside State B.** This is the v2 rule and it is enforced by a banned-phrase check. For State C, the phrasing is about determinants:
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

## 10. Performance is a design constraint

A hospital corridor is one of the worst network environments there is.

- Offline after first load, precached.
- Total JS under 140 KB gzipped — raised from 120 KB for the reference layer, and no further.
- Subset fonts, no icon font, no images beyond inline SVG.
- No third-party scripts of any kind.
- First meaningful paint under three seconds on throttled 3G.

## 11. Accessibility floor

The starting position, not a milestone.

- **48px minimum targets, 56px in family mode.**
- **AA minimum everywhere; AAA on the key line and the emergency message.**
- **Full function at 200% zoom**, no horizontal scroll — including reference tables, which reflow to stacked rows.
- **No meaning by colour alone.** Payer lanes carry text labels and distinct line patterns. State C's hatch is paired with a text label.
- **Complete screen-reader path**, emergency message first in DOM order.
- Focus visible at 3px on every interactive element.

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
- No type below 16px.
- No colour-only encoding.
- No diagnostic question anywhere.
- No rupiah amounts in patient-facing content.
- No analytics, storage, or transmission of anything the user types.
- No flowchart diamonds in place of the transit map.
- No component library.
