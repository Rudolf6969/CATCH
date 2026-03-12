---
phase: 02-feed-catch-post
plan: "02"
subsystem: types-and-image-pipeline
tags: [types, image-upload, firebase-storage, blurhash, compression, tdd]
dependency_graph:
  requires: [02-01]
  provides: [catch-types, user-types, image-upload-service]
  affects: [02-03, 02-04, 02-05, 02-06, 02-07, 02-08]
tech_stack:
  added: []
  patterns:
    - compress-before-upload (expo-image-manipulator 1200px JPEG 0.8)
    - blurhash-from-local-uri (expo-image generateBlurhashAsync pred uploadom)
    - firebase-storage-putFile-with-progress
key_files:
  created:
    - src/types/catch.types.ts
    - src/types/user.types.ts
    - src/types/index.ts
    - src/services/imageUpload.ts
  modified:
    - src/__tests__/unit/imageUpload.test.ts
decisions:
  - "firestore.rules zachovaný existujúci — má helper funkcie isAuth()/isOwner() a spots collection, lepší ako plánovaný minimalistický"
  - "import path v teste opravený z ../../src/ na ../../ — test file je vnorený v src/__tests__/unit/"
metrics:
  duration: "4 min"
  completed: "2026-03-12"
  tasks_completed: 2
  files_changed: 5
---

# Phase 02 Plan 02: TypeScript typy + Image Upload Pipeline Summary

CatchDocument/UserDocument/PhotoMeta TypeScript kontrakty a kompletný image upload pipeline: compress (1200px JPEG 0.8) → blurhash z local URI → Firebase Storage putFile s progress callbackom.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | TypeScript typy (catch.types.ts, user.types.ts, index.ts) | 3048c8a | 3 files |
| 2 | Image upload pipeline + zelené testy | e6caf57 | 2 files |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Opravený import path v imageUpload.test.ts**
- **Found during:** Task 2 — spustenie testov
- **Issue:** Test importoval z `../../src/services/imageUpload` — double `src/` prefix (test je v `src/__tests__/unit/`, teda správna cesta je `../../services/imageUpload`)
- **Fix:** Zmenené na `../../services/imageUpload` a `../../services/imageUpload` v require()
- **Files modified:** src/__tests__/unit/imageUpload.test.ts
- **Commit:** e6caf57

### Out of Scope (pre-existing)

- `app/(tabs)/_layout.tsx` TS error `contentStyle` — pre-existujúci, nie moje zmeny
- `src/lib/posthog.ts` TS error `PostHogEventProperties` — pre-existujúci, nie moje zmeny

## Self-Check: PASSED

- [x] src/types/catch.types.ts existuje
- [x] src/types/user.types.ts existuje
- [x] src/types/index.ts existuje
- [x] src/services/imageUpload.ts existuje
- [x] Commit 3048c8a existuje
- [x] Commit e6caf57 existuje
- [x] 8/8 testov zelených (PHOTO-01..04)
