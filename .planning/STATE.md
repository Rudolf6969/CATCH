---
gsd_state_version: 1.0
milestone: v1.18
milestone_name: milestone
current_phase: 01-foundation-auth
current_plan: 01-05 (next)
status: in_progress
last_updated: "2026-03-12T11:01:48.905Z"
progress:
  total_phases: 8
  completed_phases: 0
  total_plans: 6
  completed_plans: 4
---

# Project State — CATCH

**Initialized:** 2026-03-12
**Current Phase:** 01-foundation-auth
**Current Plan:** 01-05 (next)
**Last session:** 2026-03-12 — Completed 01-04-PLAN.md

---

## Project Reference

See: `.planning/PROJECT.md` (updated 2026-03-12)

**Core value:** Rybár zaznamená úlovok, dostane AI predikciu kedy ísť ďalší raz, a pochváli sa v komunite — celý loop na jednom mieste, v slovenčine.

**Current focus:** Phase 1 in progress — 01-01, 01-02, 01-03, 01-04 complete, proceed to 01-05

---

## Phase Status

| # | Phase | Status | Started | Completed |
|---|-------|--------|---------|-----------|
| 1 | Foundation & Auth | ◑ In Progress | 2026-03-12 | — |
| 2 | Core Value: Catch Diary | ○ Pending | — | — |
| 3 | Revír Map | ○ Pending | — | — |
| 4 | AI Predictions + Premium | ○ Pending | — | — |
| 5 | Community Forum | ○ Pending | — | — |
| 6 | Marketplace (Bazár) | ○ Pending | — | — |
| 7 | In-App Chat | ○ Pending | — | — |
| 8 | Notifications, Gamification & Polish | ○ Pending | — | — |

---

## Requirements Coverage

| Phase | REQ-IDs | Count | Status |
|-------|---------|-------|--------|
| Phase 1 | INFRA-01–07, AUTH-01–06 | 13 | In Progress (6/13 done) |
| Phase 2 | PHOTO-01–04, DIARY-01–07, PROF-01–05 | 16 | Pending |
| Phase 3 | MAP-01–07 | 7 | Pending |
| Phase 4 | AI-01–06, PREM-01–05 | 11 | Pending |
| Phase 5 | FORUM-01–08 | 8 | Pending |
| Phase 6 | MARKET-01–10 | 10 | Pending |
| Phase 7 | CHAT-01–06 | 6 | Pending |
| Phase 8 | NOTIF-01–05, GAMIF-01–03 | 8 + INFRA-07 | Pending |
| **Total** | | **70 / 70** ✓ | 3 done |

**Completed requirements:** INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06

---

## Next Action

Run: `execute-phase 01` — plan 01-05

---

## Decision Log

| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-03-12 | Open-Meteo namiesto OpenWeatherMap ako primárny | DWD ICON-D2 model — najvyššia presnosť pre SK/CZ oblasť, free, no key |
| 2026-03-12 | `react-native-maps v1.18` namiesto `expo-maps` | expo-maps je alpha, iOS 17+ only, bez custom markerov |
| 2026-03-12 | `geofire-common` namiesto `geofirestore` | geofirestore unmaintained, geofire-common je oficiálny Google package |
| 2026-03-12 | EAS dev build od dňa 1 | Firebase native + RevenueCat nefungujú v Expo Go |
| 2026-03-12 | `react-native-purchases ^8.9.2` pinned | Starší verzie majú fontFamily crash bug |
| 2026-03-12 | Expo SDK 55 namiesto plánovaného 53 | create-expo-app nainštaloval najnovší, výhodnejšie (RN 0.83.2, Reanimated 4.x) |
| 2026-03-12 | react-native-firebase 23.x (nie 21.x z plánu) | Najnovšia verzia, kompatibilná s Expo 55 |
| 2026-03-12 | jest-expo preset namiesto getDefaultConfig | jest-expo 55.x neexportuje getDefaultConfig funkciu, použiť `preset: 'jest-expo'` |
| 2026-03-12 | expo-localization try/catch v i18n.ts | Jest testEnvironment: 'node' nemá Expo runtime — graceful fallback na SK default |
| 2026-03-12 | StyleSheet.create spread cez (theme.X as object) cast | TypeScript strict const inference zabraňuje priamemu spreadu theme objektu v StyleSheet |
| 2026-03-12 | expo-router nainštalovaný ako Rule 3 auto-fix | Plan 01-04 predpokladal app/ štruktúru a Stack.Protected, ale expo-router nebol v package.json |
| 2026-03-12 | index.ts zmenený na expo-router/entry | Povinné pre file-based routing — registerRootComponent nie je kompatibilný s expo-router |
| 2026-03-12 | auth/user-not-found treated as success v ForgotPassword | Security best practice — neodhaľovať existenciu accountu |

---

## Performance Metrics

| Phase | Plan | Duration | Tasks | Files |
|-------|------|----------|-------|-------|
| 01-foundation-auth | 01 | 5 min | 2 | 13 |
| 01-foundation-auth | 02 | 3 min | 2 | 8 |
| 01-foundation-auth | 03 | 8 min | 2 | 11 |
| 01-foundation-auth | 04 | 6 min | 2 | 12 |

---

*State updated: 2026-03-12*

