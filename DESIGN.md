# DESIGN — Alur JKN

Authoritative for every visual and copy decision in this repository. `PRD.md` says what the product is; this says what it looks like, how it speaks, and why each choice exists. When code and this document disagree, this document is right.

---

## 1. Who is holding the phone

Every decision here follows from the audience, and this audience invalidates most default UI instincts.

**A family in a hospital corridor.** Possibly at 2am. Possibly just given bad news. Possibly angry before they open it. Often elderly. Often on a cracked mid-range Android, on hospital wifi or an exhausted data plan.

**Or a nurse**, standing, in a hurry, under fluorescent light, turning a screen toward a stranger.

What that rules out:

- **No dark mode.** Dark reads as ominous in a hospital and fails in bright ambient light. There is no dark theme.
- **No dense information design.** A distressed person cannot parse a dashboard.
- **No delight.** No playful motion, no micro-interactions, no charm. Someone frightened does not want to be charmed; they want the information already there.
- **No small type.** Nothing below 16px, anywhere.

## 2. Colour — encoding the payer, not the verdict

**The central design decision.**

Green-and-red for covered-and-not is the obvious approach and it is wrong. Red in a hospital means bad news. A red badge beside someone's situation adds emotional injury to an administrative fact, and it is exactly what turns an explanation into a confrontation.

**So colour encodes who pays, never whether you deserve it.** Each payer is a lane. "You pay out of pocket" is one lane among several, rendered as neutrally as the rest.

This makes the reframe in `PRD.md` §2.3 structural rather than editorial: it becomes difficult to express "you're not covered" in this design system, and easy to express "this payer settles first, then JKN."

### Ground

```
--paper   #F7F5F0    warm off-white
--ink     #1F2421    warm near-black
--rule    #DCD8CF    hairlines
```

Warm, not clinical white. Clinical white plus stress reads cold and institutional, and the product is trying to be the opposite of that.

### Payer lanes

```
--payer-1  #2F6B5E    deep teal
--payer-2  #4A5C8A    slate blue
--payer-3  #8A6A3B    bronze
--self     #6E7A72    grey-green — out of pocket
```

**Deliberately unlike any Indonesian institution's brand colours.** The product must not read as an official channel, so payer identity is carried by consistent arbitrary assignment plus an always-present legend — never by mimicking a logo.

`--self` is the load-bearing one. It is neutral by design. Out-of-pocket is a routing outcome, not a failure, and it must not look like a stamp.

### The one loud colour

```
--care    #C2542B    burnt orange
```

**The emergency route, and nothing else in the product.**

Burnt orange rather than red: high salience without red's blood-and-danger reading in a clinical setting. The rule behind it — **the strongest colour in this app always points toward getting care, never toward denial.**

### Not in the palette

**No red.** Not for errors, not for exclusions, not for warnings.
**No green-means-good.** No traffic-light metaphor anywhere.
**No gradients, no shadows.** Flat, printable, fast.

## 3. The pathway

The signature view: the referral system as a **transit map**.

Not a flowchart with decision diamonds — that reads as bureaucracy to someone already frustrated by bureaucracy. Everyone understands stations and lines.

- **One line** runs first-level facility → hospital → sub-specialist. Drawn in a payer lane colour, with a "needs a referral letter" legend.
- **The hospital is an interchange**, drawn larger.
- **A second line enters the hospital directly from below**, in `--care`, skipping the first station entirely. That's the emergency route, and drawing it as a separate line that bypasses a station teaches the referral-bypass rule in about two seconds with no reading.
- **Your position is marked** on whichever line applies.

Thick strokes, rounded caps, 45° angles only, generous station spacing. Station labels above, sub-labels below, both large.

## 4. Type

**Atkinson Hyperlegible throughout.** A functional choice: designed by the Braille Institute for low-vision readability, with letterforms explicitly disambiguated from one another. This audience includes elderly patients, people crying, and people reading a cracked screen at arm's length.

**IBM Plex Mono** only for regulation references and article numbers.

Self-hosted via `next/font`. No runtime CDN request.

```
caption    16px      — the floor, nothing smaller anywhere
body       18px      — minimum
body-lg    20px      — preferred for family mode
key        24px      — the one statement that matters on the screen
heading    28px
line-height 1.65
```

Larger than normal, deliberately. Weight 400 body, 500 headings, never above 500.

## 5. Layout — two doors

**Staff mode.** A flat scenario list, one tap to the explanation. Landscape-friendly, readable across a desk at arm's length. Optimised entirely for speed — they know what they're looking for.

**Family mode.** One question per screen. Never more than one decision visible. Generous spacing, 48px minimum targets, an obvious back control, no progress pressure.

Same content, two paths. A single unified dashboard would fail both.

**Print and share sheet.** Every scenario has a one-page layout that prints cleanly in black and white and exports as a share card. See §8.

## 6. Motion — two moments

**The route drawing forward.** When a position is set, the path from here to the next step draws along the line. Orientation, not decoration.

**The payer handoff.** A bar filling in the first payer's colour to their limit, then continuing in JKN's. This single animation makes "someone pays first, then JKN" visible in a way no sentence achieves.

**Nothing else moves.** No transitions on navigation, no easing flourishes, no skeleton shimmer, no loading delight.

```
--dur-draw   500ms
--dur-state  180ms
--ease       cubic-bezier(0.2, 0, 0, 1)
```

`prefers-reduced-motion`: both states render complete and instant, with the same information present.

## 7. Accessibility floor

Not a milestone — the starting position, because the audience demands it.

- **48px minimum touch targets**, 56px in family mode.
- **AA contrast minimum everywhere; AAA on the key line and the emergency message.**
- **Full function at 200% zoom** with no horizontal scroll.
- **No meaning by colour alone.** Every payer lane carries a text label and a distinct line pattern in addition to its hue.
- **Complete screen-reader path**, with the emergency message first in DOM order on every screen.
- Focus visible on every interactive element, at 3px.

## 8. Copy — design, more than the visuals

The tone rules matter more here than any colour decision, and they are enforced by review before every release.

**Never a verdict about the person.**
Not *"Anda tidak ditanggung."*
Instead: *"Untuk kasus kecelakaan lalu lintas, Jasa Raharja menanggung lebih dulu sampai batas tertentu. Setelah itu JKN melanjutkan."*

**Never blame.**
Not *"Seharusnya Anda ke Puskesmas dulu."*
Instead: *"Jalur rujukan dimulai dari Puskesmas atau klinik. Ini yang bisa dilakukan sekarang: …"*

**Always a next action.** Every screen ends with something the reader can do.

**Always the question to ask.** The real output of the product:
*"Tanyakan ke petugas: apakah kondisi saya masuk kriteria gawat darurat menurut Permenkes 47/2018?"*

**Plain Indonesian, not legal Indonesian.** Every regulation term glossed on first use. Short sentences. No passive constructions where an active one exists.

**The emergency line is fixed wording and appears before any coverage content**, on every path:
*"Kalau ini keadaan gawat darurat, langsung ke IGD sekarang. Urusan jaminan bisa dibereskan setelahnya."*

## 9. Performance is a design constraint

A hospital corridor is one of the worst network environments there is, and an app that spins is worse than no app.

- Offline after first load. Service worker, precached.
- Total JS under 120 KB gzipped.
- Subset fonts, no icon font, no images beyond inline SVG.
- No third-party scripts of any kind.
- First meaningful paint on a throttled 3G connection under three seconds.

## 10. Trust and framing

- **An explicit unofficial statement** on every screen footer, not only the about page.
- **No institutional colours, logos, seals, or typography.** §2.
- **Every rule shows its instrument, article, and verification date** in a small reference line — visible, not shouted.
- The programme name (JKN) is used to describe the subject; the institution name is not used as branding.

## 11. What not to do

- No verdict about a specific case. Ever.
- No red, no green-means-good, no traffic-light metaphor.
- No dark mode.
- No `--care` outside the emergency route.
- No type below 16px.
- No colour-only encoding.
- No clinical question, anywhere.
- No analytics, storage, or transmission of anything the user types.
- No flowchart diamonds in place of the transit map.
- No component library — its defaults will fight every constraint above.
