---
phase: 2
slug: feed-catch-post
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 2 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | jest-expo 55.x (nainštalovaný z Phase 1) |
| **Config file** | `jest.config.js` (existuje z Phase 1) |
| **Quick run command** | `npm test -- --testPathPattern='__tests__/unit' --passWithNoTests` |
| **Full suite command** | `npm test -- --passWithNoTests` |
| **Estimated runtime** | ~15 seconds |

---

## Sampling Rate

- **After every task commit:** Run `npm test -- --testPathPattern='__tests__/unit' --passWithNoTests`
- **After every plan wave:** Run `npm test -- --passWithNoTests`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 15 seconds

---

## Per-Task Verification Map

| Task ID | Req ID | Behavior | Test Type | Automated Command | File Exists | Status |
|---------|--------|----------|-----------|-------------------|-------------|--------|
| PHOTO-01 | PHOTO-01 | ImagePicker returns max 5 assets | unit | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 | ⬜ pending |
| PHOTO-02 | PHOTO-02 | Kompresia výsledok < 500KB | unit | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 | ⬜ pending |
| PHOTO-03 | PHOTO-03 | Upload progress callback sa volá | unit (mock) | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 | ⬜ pending |
| PHOTO-04 | PHOTO-04 | generateBlurhashAsync vracia string | unit | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 | ⬜ pending |
| DIARY-01 | DIARY-01 | Catch schema má všetky required polia | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 | ⬜ pending |
| DIARY-02 | DIARY-02 | fetchWeatherForCatch vracia valid weather objekt | unit (mock fetch) | `npm test -- --testPathPattern='weather'` | ❌ Wave 0 | ⬜ pending |
| DIARY-03 | DIARY-03 | Filter query — where clause sa správne stavia | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 | ⬜ pending |
| DIARY-04 | DIARY-04 | Catch detail má weather snapshot | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 | ⬜ pending |
| DIARY-05 | DIARY-05 | Delete catch — Firestore delete sa volá | unit (mock) | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 | ⬜ pending |
| DIARY-06 | DIARY-06 | Fire-and-forget — docRef.set sa volá bez await | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 | ⬜ pending |
| DIARY-07 | DIARY-07 | fishSpecies.ts obsahuje 100+ druhov | unit | `npm test -- --testPathPattern='fishSpecies'` | ❌ Wave 0 | ⬜ pending |
| PROF-01 | PROF-01 | UserDocument schema validácia | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 | ⬜ pending |
| PROF-02 | PROF-02 | getUserStats vracia correct agregácie | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 | ⬜ pending |
| PROF-03 | PROF-03 | Catches query má limit(12) orderBy createdAt desc | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 | ⬜ pending |
| PROF-04 | PROF-04 | isOwnProfile boolean logika | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 | ⬜ pending |
| PROF-05 | PROF-05 | UserDocument má karma + badges polia | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `src/__tests__/unit/imageUpload.test.ts` — PHOTO-01 až PHOTO-04
- [ ] `src/__tests__/unit/catches.test.ts` — DIARY-01 až DIARY-06
- [ ] `src/__tests__/unit/fishSpecies.test.ts` — DIARY-07
- [ ] `src/__tests__/unit/weather.test.ts` — DIARY-02
- [ ] `src/__tests__/unit/profile.test.ts` — PROF-01 až PROF-05

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Catch wizard <90s flow | DIARY-01 | UX timing — stopky merateľné | Otvoriť appku, stlačiť + FAB, prejsť wizard, merať čas do submit |
| Blurhash placeholder viditeľný | PHOTO-04 | Vizuálny efekt | Pomalé sieťové spojenie, overiť že placeholder sa zobrazí pred plnou fotkou |
| Pull-to-refresh feed | DIARY (feed) | Gesturálna interakcia | Potiahnuť feed nadol, overiť refresh indikátor |
| Offline optimistický UI | DIARY-06 | Vyžaduje simuláciu offline módu | Airplane mode → pridať úlovok → overiť okamžité zobrazenie |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 15s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
