# PRD — Alur JKN

**Patients confront hospital staff every day over what JKN covers. This doesn't answer that question — it explains the system, and hands the patient the right question to ask.**

| | |
|---|---|
| **Status** | Draft — pre-implementation |
| **Owner** | Andi Fathul Mukminin Salahuddin |
| **Type** | Public-interest tool, open source |
| **Deployment** | GitHub Pages (static export, no server, no runtime network) |
| **Language** | Plain Indonesian. English secondary. |
| **Design** | See `DESIGN.md`. Authoritative for every visual and copy decision. |
| **Sibling** | Rinci. Cited rule packs, verification dates, refuse-rather-than-guess. |

*Name: explanatory. Uses the programme name (JKN) rather than the institution (BPJS), because the product must never read as an official BPJS channel. Alternative: **Rute JKN**.*

---

## 1. Problem

Medical staff in Indonesian hospitals have the same conversation several times a day. A patient or family arrives expecting coverage, is told the situation is different from what they assumed, and it turns into a confrontation — at a moment when everyone involved is already under strain.

The misunderstandings are not random. They cluster around a small number of rules that are genuinely counterintuitive, and that nothing explains well:

- **Tiered referral.** You start at a first-level facility and get referred up. Arriving directly at a hospital without a referral is not covered — except in emergencies.
- **Self-requested referral** is specifically excluded.
- **Emergency has a definition.** The family's sense of emergency and the triage criteria are different things.
- **Traffic and work injuries route to a different payer first** — the compulsory traffic-accident programme, or work-injury cover. This is almost always heard as "you're not covered."
- **Card status.** An inactive card is an administrative fact discovered at the worst moment.
- **A short list of genuinely excluded services** — aesthetics, infertility treatment, alternative medicine, experimental treatment.

**This is not a knowledge gap that a leaflet fixes**, because the leaflet is read by nobody at 2am. It's fixed by giving staff something to show, and giving families something to take away.

## 2. The three principles

### 2.1 It never renders a verdict

**The app must never tell anyone whether their case is covered.** Coverage depends on medical indication, diagnosis coding, facility partnership status, card status, and clinical judgement — none of which a static site can know.

If a patient waves a wrong answer at an admission desk, the app has made things worse: staff now argue with a screen as well as a person.

So the app explains rules, cites them, and produces **the question to ask**. That is the actual output of every screen. It converts a confrontation into a conversation.

### 2.2 It never discourages seeking care

**Binding, and the highest-priority rule in the product.** If someone reads "this might not be covered" and does not go to an emergency department, the app has caused serious harm.

Every path says: **if this could be an emergency, go now — coverage is sorted afterwards.** That is also what the regulation says. Perpres 82/2018 Pasal 63 provides that a participant needing emergency care can obtain it directly at any health facility, and care at a non-partnered facility is excluded *except in emergencies*, with transfer to a partnered facility once the patient is stable.

That is the single most misunderstood provision in the system, and the one most worth spreading.

### 2.3 Coverage is routing, not judgement

Several of these cases are **coordination between payers, not refusal**. Traffic-accident care is excluded only up to the amount the compulsory traffic-accident programme covers at the participant's ward-class entitlement — so that payer settles first and JKN continues beyond their cap.

*"You're not covered"* and *"someone else pays first, then JKN"* are the same fact and completely different messages. The product is built so the second one is structurally unavoidable: **payer identity is what gets encoded, everywhere, and "you pay" is one lane among several rather than a failure state.** See `DESIGN.md` §2.

## 3. Users

**Primary: hospital staff.** Nurses, admission clerks, BPJS liaison officers. They have the conversation daily, they have an obvious incentive, and they are a repeat audience. Designed as an *explaining aid* — a screen turned toward a family and walked through in sixty seconds.

**Secondary: patients and families**, reached mostly through staff and through sharing. Arriving in crisis, often elderly, often on a poor connection, often distressed.

**Adoption follows the staff.** Aimed directly at patients, it never gets found.

## 4. Scope

**Scenarios in v1** — each a real cause of confrontation:

1. Arrived at hospital without a referral
2. Self-requested referral
3. Is this an emergency? (criteria, and the always-go rule)
4. Traffic accident
5. Work injury
6. Card inactive or in arrears
7. Facility not partnered with BPJS
8. Room class and upgrading
9. Medicines outside the national formulary
10. Genuinely excluded services

**Each scenario produces:** what the rule says, its citation, what happens next, what to bring, and **the question to ask**.

## 5. Non-goals — several are binding

- **No coverage verdict.** §2.1.
- **No medical advice, no triage, no symptom assessment.**
- **The app never asks for clinical information.** Questions are administrative only — did you come with a referral, was this a road accident, is the facility partnered. This keeps the product out of medical-advice territory and out of health-data territory in one move.
- **No card status lookup, no login, no queue booking, no facility finder.** Those need authentication and a backend, and they are Mobile JKN's job.
- **Zero data collection.** No analytics on inputs, no storage of answers, nothing leaves the device.
- **No claim of official status.** Not a BPJS product, not a government channel. Visually and explicitly distinct. See `DESIGN.md` §2 on why the palette avoids institutional colours.
- **No cost estimates or tariff figures.**

## 6. Features

### 6.1 The pathway
The referral system drawn as a transit map — first-level facility, hospital as an interchange, sub-specialist onward, and the emergency route entering the hospital directly as a separate line. Your position is marked. `DESIGN.md` §3.

### 6.2 The two doors
**Staff mode** — flat scenario list, one tap to the explanation, readable across a desk, optimised for speed.
**Family mode** — one question per screen, generous spacing, slower on purpose.

Same content, two entry paths.

### 6.3 The payer handoff
For coordination cases, the split rendered as a bar: the first payer's portion up to their limit, then JKN continuing. Makes §2.3 visible rather than asserted.

### 6.4 The question card
Every scenario ends with a plainly worded question to ask staff, with the regulation reference attached. Copyable and shareable.

### 6.5 Share
A clean card per scenario, sized and worded for WhatsApp. This is how it actually spreads — the family forwards it to the relative asking questions from another city.

### 6.6 Rule reference
Every parameter with its instrument, article, and verification date. Browsable independently.

## 7. Rules and sources

Cited rule packs, Rinci's architecture: each entry records the value, its instrument and article, a source URL, and `verifiedAt`. **The build fails on an uncited rule.**

Primary instruments: Perpres 82/2018 and its amendments (Perpres 75/2019, 64/2020, 59/2024); Permenkes 47/2018 for emergency criteria; Permenkes 28/2014; BPJS Kesehatan regulations.

**Staleness is a safety issue here, not a tidiness issue.** Rules change and wrong guidance has a real cost. Every scenario shows its verification date; packs past a review threshold display a warning; `UPDATING.md` documents re-verification for a stranger.

## 8. Milestones

| | | |
|---|---|---|
| **M0** | Listen | **Interview hospital staff before writing code.** They know the exact five misconceptions and the words patients use. Half a day, worth more than any spec. Then: rule schema, validator, citation architecture. |
| **M1** | Rules | The ten scenarios as cited packs, each with next action and question. Console only. |
| **M2** | The pathway | Transit map, position marking, emergency route, family mode. **Ship publicly here.** |
| **M3** | Staff mode | Fast scenario list, desk-readable layout, print sheet. |
| **M4** | Coordination | Payer handoff visual for accident and work-injury cases. |
| **M5** | Distribution | WhatsApp share cards, rule reference, `UPDATING.md`. |

## 9. Success criteria

- No screen anywhere states or implies whether the user's case is covered.
- Every scenario ends with a next action and a question to ask.
- The emergency "go now" message appears before any coverage content on every path.
- No clinical question is asked anywhere.
- Every rule carries an instrument, article, and verification date.
- Nothing is collected, stored, or transmitted.
- Works offline, on a slow connection, on an old Android.
- Meets the type, contrast, and target-size floors in `DESIGN.md` §7.
- A staff member can explain a scenario from the screen in under sixty seconds.

## 10. Deployment

`output: 'export'`, `basePath` matching the repository name, `.nojekyll` in the output root. Rule validation gates the deploy. Fonts self-hosted. Verify under the production `basePath` with `pnpm preview` before pushing.

## 11. Risks

| Risk | Mitigation |
|---|---|
| **Wrong guidance sends someone away from care.** | §2.2 is binding. Emergency message precedes all coverage content, asserted by test. Never a discouraging framing. |
| **A verdict makes confrontations worse.** | §2.1 binding, banned-phrase check in CI, copy review before release. |
| **Rule staleness.** | Per-rule verification dates surfaced in the UI, review thresholds, `UPDATING.md`. |
| **Read as an official BPJS channel.** | Programme name not institution name, no institutional colours, explicit unofficial statement, no government branding. |
| **Health data exposure.** | The app never asks a clinical question and never stores anything. Structural, not policy. |
| **Author is an ASN publishing about a government programme.** | Plainly personal and unofficial. Worth a word with OIKN and with the hospital before launch. |
| **Staff never adopt it.** | M0 is interviews, not code. If staff don't recognise their own daily conversation in it, rebuild it before shipping. |
