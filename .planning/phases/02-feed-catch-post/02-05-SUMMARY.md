---
phase: 02-feed-catch-post
plan: "05"
subsystem: catch-wizard
tags: [wizard, photo-picker, fish-species, weather, firestore]
dependency_graph:
  requires: [02-03, 02-04]
  provides: [catch-wizard-flow, weather-badge]
  affects: [feed, catch-list]
tech_stack:
  added: []
  patterns: [wizard-stack-navigation, fire-and-forget-write, search-flatlist]
key_files:
  created:
    - app/catch/new/_layout.tsx
    - app/catch/new/step-1.tsx
    - app/catch/new/step-2.tsx
    - app/catch/new/step-3.tsx
    - src/components/catch/WeatherBadge.tsx
  modified:
    - app/(tabs)/pridat.tsx
decisions:
  - "pridat.tsx → Redirect namiesto inline formu — čistejšia separácia, wizard má vlastný Stack"
  - "allowsEditing: false pri multi-select — iOS conflict s allowsMultipleSelection"
  - "Bratislava fallback coords (48.1, 17.1) keď location permission denied"
  - "Weather je nice-to-have — chyba pri fetch neblokuje wizard pokračovanie"
metrics:
  duration: "6 min"
  completed: "2026-03-12"
  tasks: 2
  files: 6
requirements: [PHOTO-01, PHOTO-02, PHOTO-03, PHOTO-04, DIARY-01, DIARY-02, DIARY-06, DIARY-07]
---

# Phase 02 Plan 05: Catch Wizard Summary

**One-liner:** 3-krokový modal wizard (foto picker → ryba+počasie → lokalita+submit) s fire-and-forget Firestore zápisom cez Stack navigátor.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Wizard layout + Step 1 photo picker | 1dbc208 | _layout.tsx, step-1.tsx, pridat.tsx |
| 2 | Step 2 + Step 3 + WeatherBadge | 4663577 | step-2.tsx, step-3.tsx, WeatherBadge.tsx |

## What Was Built

### app/catch/new/_layout.tsx
Stack navigátor pre wizard — `headerShown: false`, `animation: slide_from_right`.

### app/catch/new/step-1.tsx
Photo picker s 3-segmentovým progress barom (amber #E9A84C). Multi-select galéria max 5 fotiek + camera. Preview thumbnails 72x72. Validácia: min 1 fotka pred postupom.

### app/catch/new/step-2.tsx
Fish species picker — search TextInput + FlatList (max 20 bez query, filtrovane searchFishSpecies). Auto-fetch počasia pri otvorení cez expo-location + fetchWeatherForCatch. Fallback na Bratislava (48.1, 17.1) ak permission denied. Váha (g) + dĺžka (cm) numerické inputy s JetBrainsMono fontom.

### app/catch/new/step-3.tsx
Lokalita (optional) + caption (multiline) + visibility toggle + submit. Upload fotiek parallel cez uploadCatchPhoto s progress percentom. Fire-and-forget `createCatch(docRef, catchData)` — žiadne await. Router.replace na feed po úspešnom submit.

### src/components/catch/WeatherBadge.tsx
4-stĺpcový badge: teplota (1 decimal °C) | tlak (hPa) | vietor (km/h) | fáza mesiaca. Loading state s "Načítavam počasie..." textom.

### app/(tabs)/pridat.tsx
Zjednodušený na `<Redirect href="/catch/new/step-1" />` — starý inline formulár nahradený wizard flowom.

## Deviations from Plan

### Auto-fixed Issues

None — plan executed exactly as written.

### Import Path Adjustment
Step-2 imports z `../../../src/...` (nie `../../src/...`) — súbor je v `app/catch/new/` čo je 3 úrovne hlboko, nie 2.

## Pre-existing TS Errors (Out of Scope)
- `app/(tabs)/_layout.tsx` — `contentStyle` prop TS chyba (existovala pred plánom)
- `src/lib/posthog.ts` — `PostHogEventProperties` type mismatch (existovala pred plánom)
- `src/services/imageUpload.ts` — `string | null` typ chyba (existovala pred plánom)

## Self-Check: PASSED
- app/catch/new/_layout.tsx: FOUND
- app/catch/new/step-1.tsx: FOUND
- app/catch/new/step-2.tsx: FOUND
- app/catch/new/step-3.tsx: FOUND
- src/components/catch/WeatherBadge.tsx: FOUND
- commit 1dbc208: FOUND
- commit 4663577: FOUND
