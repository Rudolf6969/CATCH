---
phase: 02-feed-catch-post
plan: 03
subsystem: data-services
tags: [fish-species, weather, open-meteo, suncalc, tdd]
requirements: [DIARY-02, DIARY-07]

dependency_graph:
  requires: [02-02]
  provides: [fishSpecies constant, weather service]
  affects: [catch wizard step 2 — species picker + auto-weather]

tech_stack:
  added: [suncalc]
  patterns: [TDD red-green, static data constants, service wrapper]

key_files:
  created:
    - src/constants/fishSpecies.ts
    - src/services/weather.ts
  modified:
    - src/__tests__/unit/fishSpecies.test.ts
    - src/__tests__/unit/weather.test.ts

decisions:
  - "Import paths v testoch: ../../constants/X (nie ../../src/constants/X) — testy sú vnorené v src/"
  - "wind_speed_10m parameter potvrdený ako správny Open-Meteo názov (nie windspeed_10m)"

metrics:
  duration: "5 min"
  completed_date: "2026-03-12"
  tasks_completed: 2
  files_created: 4
---

# Phase 02 Plan 03: Fish Species + Weather Service Summary

**One-liner:** 100 SK/CZ rybárskych druhov ako statický zoznam + Open-Meteo weather wrapper so suncalc moon phase kalkuláciou v slovenčine.

---

## Completed Tasks

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Fish species zoznam — 100+ SK/CZ druhov | 796eb1c | src/constants/fishSpecies.ts, src/__tests__/unit/fishSpecies.test.ts |
| 2 | Weather service — Open-Meteo + suncalc | ade3e2b | src/services/weather.ts, src/__tests__/unit/weather.test.ts |

---

## What Was Built

### Task 1: fishSpecies.ts

- 100 SK/CZ rybárskych druhov ako typovaný statický array
- Interface `FishSpecies { id, name, latinName }`
- `searchFishSpecies(query)` — case-insensitive filter podľa name aj latinName
- Pokrýva bežné druhy: Kapor, Šťuka, Zubáč, Lieň, Sumec, Pstruh, Lipáň, Jeseter, Tajmeň...

### Task 2: weather.ts

- `fetchWeatherForCatch(lat, lon)` — volá Open-Meteo API s parametrom `wind_speed_10m`
- Vracia `WeatherSnapshot` (temperature, pressure, windSpeed, precipitation, moonPhase, moonIllumination)
- `getMoonPhaseName(phase)` — 8 slovenských fáz mesiaca (Novoluní, Dorastajúci srp, Prvá štvrtina, Pribúdajúci mesiac, Spln, Ubúdajúci mesiac, Posledná štvrtina, Dorábajúci srp)
- `moonIllumination` je 0-100% (Math.round(fraction * 100))

---

## Test Results

| Suite | Tests | Status |
|-------|-------|--------|
| fishSpecies.test.ts | 6 | PASS |
| weather.test.ts | 7 | PASS |
| **Total** | **13** | **ALL GREEN** |

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Import path v fishSpecies.test.ts oprávený**
- **Found during:** Task 1 GREEN phase
- **Issue:** Plan mal `../../src/constants/fishSpecies` ale test je v `src/__tests__/unit/` — cesta by bola `src/src/constants/fishSpecies`
- **Fix:** Zmenené na `../../constants/fishSpecies` (správna relatívna cesta z pozície testu)
- **Files modified:** src/__tests__/unit/fishSpecies.test.ts
- **Commit:** 796eb1c

---

## Pre-existing TS Errors (Out of Scope)

Nasledovné chyby existovali pred týmto plánom a nie sú z mojich zmien:
- `app/(tabs)/_layout.tsx` — contentStyle TS error
- `src/lib/posthog.ts` — PostHogEventProperties type mismatch
- `src/services/imageUpload.ts` — string | null assignability

Tieto sú zaznamenané v deferred-items.md.

---

## Self-Check: PASSED

- [x] src/constants/fishSpecies.ts existuje (100 druhov)
- [x] src/services/weather.ts existuje (fetchWeatherForCatch + getMoonPhaseName)
- [x] Commit 796eb1c existuje
- [x] Commit ade3e2b existuje
- [x] 13/13 testov zelených
