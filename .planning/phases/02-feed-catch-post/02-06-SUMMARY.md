---
phase: 02-feed-catch-post
plan: "06"
subsystem: feed-ui
tags: [feed, flashlist, catch-card, instagram-layout, expo-image, blurhash]
dependency_graph:
  requires: [02-04, 02-05]
  provides: [feed-screen, catch-card, catch-carousel, fish-badge, stories-row]
  affects: [app/(tabs)/feed.tsx]
tech_stack:
  added: []
  patterns: [FlashList v2 no-estimatedItemSize, expo-image blurhash placeholder, Instagram minimal layout]
key_files:
  created:
    - src/components/catch/CatchCard.tsx
    - src/components/catch/CatchCarousel.tsx
    - src/components/catch/FishBadge.tsx
    - src/components/feed/StoriesRow.tsx
  modified:
    - app/(tabs)/feed.tsx
decisions:
  - FlashList v2 bez estimatedItemSize — deprecated v NA (New Architecture)
  - StoriesRow Phase 2 mock data — Phase 5 Community nahradí reálnymi sledovanými
metrics:
  duration: "5 min"
  completed: "2026-03-12"
  tasks: 2
  files: 5
---

# Phase 02 Plan 06: Feed Screen + CatchCard Summary

**One-liner:** Instagram-style Feed s FlashList v2, CatchCard s expo-image blurhash, FishBadge "🐟 Kapor · 8.2kg · 72cm" a StoriesRow horizontálnym scrollom.

## What Was Built

### Task 1: CatchCard + FishBadge + CatchCarousel
- `FishBadge` — kompaktný text badge formát: "🐟 Kapor · 8.2kg · 72cm"
- `CatchCarousel` — single foto = priamo expo-image; multi-foto = horizontal ScrollView s pagingEnabled + dot indikátor (aktívny dot #E9A84C)
- `CatchCard` — Instagram minimal layout: avatar header (tap → profil), full-width carousel (tap → detail), action bar (like/comment/bookmark), fish badge + caption pod fotkou

### Task 2: Feed screen + StoriesRow
- `feed.tsx` — nahradený mock ScrollView za FlashList v2 bez estimatedItemSize; pull-to-refresh cez RefreshControl; infinite scroll cez onEndReached + fetchNextPage; loading state s ActivityIndicator
- `StoriesRow` — horizontálny ScrollView s avatarmi, zelený border ring (#40916C), blurhash placeholder; Phase 2 mock data, Phase 5 nahradí reálnymi

## Deviations from Plan

None — plan executed exactly as written.

## Self-Check: PASSED

- src/components/catch/CatchCard.tsx — FOUND
- src/components/catch/CatchCarousel.tsx — FOUND
- src/components/catch/FishBadge.tsx — FOUND
- src/components/feed/StoriesRow.tsx — FOUND
- app/(tabs)/feed.tsx — FOUND (modified)
- Commits 797c3fe, b4fb7da — FOUND
- estimatedItemSize NOT present in feed.tsx — CONFIRMED
