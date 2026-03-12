---
phase: 02-feed-catch-post
plan: "04"
subsystem: catches-hooks
tags: [zustand, react-query, firestore, offline-first, cursor-pagination]
dependency_graph:
  requires: [02-02]
  provides: [catches-store, feed-store, catches-hooks, feed-hook]
  affects: [wizard-screen, feed-screen, diary-screen]
tech_stack:
  added: []
  patterns: [fire-and-forget-write, optimistic-update, cursor-pagination, zustand-store]
key_files:
  created:
    - src/stores/catches.store.ts
    - src/stores/feed.store.ts
    - src/hooks/useCatches.ts
    - src/hooks/useFeed.ts
  modified:
    - src/__tests__/unit/catches.test.ts
decisions:
  - "buildCatchQuery ako exportovaná standalone funkcia — testovateľná bez React/QueryClient"
  - "Import path fix: ../../hooks/useCatches namiesto ../../src/hooks/useCatches (test je uz v src/)"
  - "DIARY-03 testy refaktorované na priamy mock collRef namiesto firestore() inštancie — lepšia izolácia"
metrics:
  duration: "5 min"
  completed_date: "2026-03-12"
  tasks_completed: 2
  files_created: 4
  files_modified: 1
---

# Phase 02 Plan 04: Catches & Feed Hooks Summary

Zustand stores + React Query hooks pre catch CRUD a feed, s fire-and-forget offline write a getDocs cursor pagination.

## Tasks Completed

| # | Task | Commit | Status |
|---|------|--------|--------|
| 1 | Catches store + CRUD hooks (TDD) | fde3285 | Done |
| 2 | Feed store + useFeed hook | 9b1a469 | Done |

## What Was Built

**src/stores/catches.store.ts** — Zustand store pre CatchFilter state (setFilter, clearFilter).

**src/hooks/useCatches.ts** — Kompletná klient-vrstva pre catch CRUD:
- `createCatch(docRef, data)` — fire-and-forget, volá `docRef.set()` bez await
- `buildCatchQuery(collRef, filter)` — buduje where clauses pre species/method/location/date
- `deleteCatch(userId, catchId)` — async delete
- `useCatches(userId, filter)` — useQuery s filter support
- `useCatchDetail(catchId)` — useQuery pre single catch
- `useCreateCatch(userId)` — useMutation s optimistic update + rollback
- `useUpdateCatch(userId, catchId)` — useMutation pre partial update
- `useDeleteCatch(userId)` — useMutation pre delete

**src/stores/feed.store.ts** — Zustand store pre like/bookmark UI state (toggleLike, toggleBookmark).

**src/hooks/useFeed.ts** — `useFeed()` s useInfiniteQuery, getDocs (nie onSnapshot), startAfter cursor, PAGE_SIZE=15, staleTime=60s.

## Test Results

10/10 testov zelených:
- DIARY-01: Catch schema validation (3 testy)
- DIARY-03: Filter queries (2 testy)
- DIARY-04: Weather snapshot (1 test)
- DIARY-05: Edit and delete (2 testy)
- DIARY-06: Fire-and-forget write (2 testy)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Import path v catches.test.ts**
- **Found during:** Task 1 RED phase
- **Issue:** Plan mal `../../src/hooks/useCatches` ale test je uz v `src/__tests__/unit/` — double `src/` v path
- **Fix:** Zmenené na `../../hooks/useCatches`
- **Files modified:** src/__tests__/unit/catches.test.ts
- **Commit:** fde3285

**2. [Rule 1 - Bug] DIARY-03 mock isolation**
- **Found during:** Task 1 GREEN phase
- **Issue:** `firestore()` volá vytvárajú nové inštancie — `collRef.where` mock counts sa nezdieľajú medzi inštanciami
- **Fix:** Testy refaktorované na priamy mock collRef objekt namiesto `firestore().collection()`
- **Files modified:** src/__tests__/unit/catches.test.ts
- **Commit:** fde3285

## Self-Check: PASSED

All files exist. Both commits verified (fde3285, 9b1a469).
