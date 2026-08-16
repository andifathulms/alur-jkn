# PRD — Alur JKN

**Patients confront hospital staff every day over what JKN covers. This explains the system properly — the routes, the exclusions, the tariff logic — and hands the patient the right question instead of a verdict.**

| | |
|---|---|
| **Status** | v2 — revision of a shipped v1 |
| **Owner** | Andi Fathul Mukminin Salahuddin |
| **Type** | Public-interest tool, open source |
| **Deployment** | GitHub Pages (static export, no server, no runtime network) |
| **Language** | Plain Indonesian. English secondary. |
| **Design** | See `DESIGN.md`. Authoritative for every visual and copy decision. |

---

## 1. What changed from v1, and why

v1 shipped too thin. It carried ten administrative scenarios and nothing else, because an earlier constraint — "the app never asks a clinical question" — was drawn too broadly and removed the entire reference layer along with it.

**That constraint conflated two different things:**

- **Diagnostic questions** — *what are your symptoms, how severe is it* — genuinely dangerous, and still banned.
- **Navigational lookups** — *which poli, which procedure, which device, which drug* — administrative reference material, and most of what users actually need.

v2 keeps every safety rail and adds the layer that was missing.

**And v2 corrects a misconception that v1 did nothing about** — one that is probably the single largest cause of confrontation in this domain. See §3.

## 2. The three principles (unchanged)

**2.1 Never a verdict on a specific case.** Coverage depends on medical indication, diagnosis coding, facility partnership, card status and clinical judgement. The app explains rules and produces **the question to ask**.

**2.2 Never discourage seeking care.** Binding, highest priority. Every path leads with: if this could be an emergency, go now — coverage is sorted afterwards. Perpres 82/2018 Pasal 63 provides that a participant needing emergency care can be served directly at any facility, and non-partnered facilities are covered in emergencies with transfer once stable.

**2.3 Coverage is routing, not judgement.** Payer identity is what gets encoded. "You pay" is a lane, not a failure.

## 3. The correction v2 exists to make

**"Not covered" is usually staff shorthand for something else, and patients hear it as refusal.**

Take appendectomy. Coverage applies to appendectomy both conventionally and laparoscopically, as long as a doctor recommends it on medical grounds. A BPJS official put the underlying principle plainly: BPJS Kesehatan does not sort by type of illness and procedure.

What actually determines what you're offered is the tariff system. BPJS pays by package under **INA-CBG**, so cost is not itemised by surgical method — but the hospital has its own rules about which method it can deliver fully within that package. Open surgery is typically easier to approve; laparoscopy depends on medical indication and hospital policy. The appendectomy tariff itself varies by hospital class A–D and across five regional bands.

So a clinician saying *"laparoskopi nggak ditanggung"* is being accurate about their hospital and inaccurate about the regulation. The patient becomes angry at BPJS for something BPJS did not do.

**Teaching this one distinction is the highest-value thing the product can do**, and it becomes a hard rule in the content model:

> **The only things this app may describe as "not covered" are the items enumerated in Perpres 82/2018 Pasal 52.** Everything else is routing, tariff, medical indication, or hospital capability — and must be described as such.

## 4. Users

**Primary: hospital staff.** They have the conversation daily and are a repeat audience. v2's reference layer serves them directly — poli rules, device ceilings, the exclusion list — as a lookup they can trust mid-conversation.

**Secondary: patients and families**, reached through staff and through sharing.

## 5. Content model — three types

v1 had one. v2 has three, and this is the core structural change.

### 5.1 Scenario — guided
An administrative situation, one question per screen, ending in a next action and a question to ask. The v1 content, retained.

*Arrived without a referral · Self-requested referral · Is this an emergency · Traffic accident · Work injury · Card inactive · Facility not partnered · Room class and upgrading · Medicines outside the formulary · Excluded services*

### 5.2 Reference — browsable
Authoritative material, searchable, staff-oriented. **This is what v1 lacked.**

- **INA-CBG explained.** The package system, class and regional variation, and why it produces the "not covered" shorthand. **The spine of the whole product** — every condition page links back to it.
- **The Pasal 52 exclusion list, in full.** Around twenty-one items in plain language with real examples. Genuinely authoritative, genuinely a list, and the only place the app says "not covered".
- **Poli directory.** Which specialties need a referral, referral validity, internal referral rules, when re-referral is required.
- **Devices and their ceilings.** Glasses, hearing aids, dentures, prosthetics — tariff caps and replacement intervals.
- **Fornas.** Covered medicines come from the national formulary; what happens when a doctor prescribes outside it.
- **Class and naik kelas.** The rules on paying the difference.

### 5.3 Condition — per-procedure
For a named procedure or condition, and **never a verdict**:

1. **The route** — which poli, referral or emergency bypass
2. **What determines the method** — medical indication, not a coverage rule
3. **Why you may be offered one option** — the package tariff, linked to the INA-CBG reference
4. **What can still cost money** — class upgrade, non-formulary drugs, devices above ceiling
5. **The question to ask** — e.g. *"Metode mana yang sesuai indikasi medis saya, dan apakah rumah sakit ini bisa melakukannya dalam paket JKN?"*

**v1 target: eight to twelve conditions**, chosen with the hospital team by frequency of confrontation.

## 6. Non-goals

- **No coverage verdict.** §2.1.
- **No diagnostic questions, no symptom entry, no triage, no severity assessment.** Navigational lookups are fine; diagnosis is not.
- **No cost estimates, no tariff figures shown to patients.** The INA-CBG explainer describes the *mechanism*; it does not publish rupiah amounts, which vary by class and region and would be read as a promise.
- **No card status lookup, no login, no queue booking, no facility finder.** Backend, and Mobile JKN's job.
- **Zero data collection.** Nothing stored, transmitted, or measured.
- **No claim of official status.**

## 7. Rules and sources

Cited rule packs: value, instrument, article, source URL, `verifiedAt`. **The build fails on an uncited rule.**

Primary instruments: Perpres 82/2018 and amendments (75/2019, 64/2020, 59/2024); Permenkes 47/2018 (emergency criteria); Permenkes 28/2014; the INA-CBG tariff Permenkes; Fornas and the device compendium; BPJS Kesehatan regulations.

Staleness is a safety issue here. Verification dates surface in the UI; packs past review threshold warn; `UPDATING.md` documents re-verification for a stranger.

## 8. Milestones (from the shipped v1)

| | | |
|---|---|---|
| **M1** | Model | Content model extended to three types. Scenario content migrated unchanged. |
| **M2** | The spine | INA-CBG reference page. **Build this first** — everything else links to it. |
| **M3** | Reference | Pasal 52 list, poli directory, device ceilings, Fornas, class rules. |
| **M4** | Conditions | Eight to twelve condition pages on the §5.3 template. |
| **M5** | Navigation | Search across all three types; staff-mode reference index. |
| **M6** | Distribution | Share cards per reference and condition; print sheets. |

## 9. Success criteria

- No screen states or implies whether the user's case is covered.
- **Nothing outside Pasal 52 is described as "not covered"** — asserted by test.
- Every condition page carries all five sections in §5.3.
- Emergency message precedes coverage content on every path.
- No diagnostic question anywhere.
- Every rule carries instrument, article, and verification date.
- Nothing collected, stored, or transmitted.
- Works offline, on a slow connection, on an old Android.
- A staff member can answer a poli or device question from the reference in under fifteen seconds.

## 10. Risks

| Risk | Mitigation |
|---|---|
| **Wrong guidance sends someone away from care.** | §2.2 binding; emergency-first asserted by test. |
| **A condition page drifts into a verdict.** | The Pasal 52 rule in §3 is enforced by a banned-phrase check plus a schema that has no coverage boolean. |
| **Tariff figures read as a price promise.** | No rupiah amounts in patient-facing content. Mechanism only. |
| **Reference content goes stale.** | Verification dates surfaced, review thresholds, `UPDATING.md`. |
| **Read as an official channel.** | Programme name not institution name, no institutional colours, explicit unofficial statement. |
| **Condition list chosen by guesswork.** | Chosen with the hospital team by observed frequency, not by what's easy to write. |
