---
phase: 02-feed-catch-post
plan: "08"
subsystem: profile
tags: [profile, react-query, firestore, expo-image, tdd]
dependency_graph:
  requires: [02-06, 02-07]
  provides: [profile-screen, profile-hooks, catch-grid]
  affects: [feed-avatar-tap, catch-detail]
tech_stack:
  added: []
  patterns: [twitter-style-profile, isOwnProfile-pattern, react-query-hooks]
key_files:
  created:
    - app/profile/[userId].tsx
    - src/components/profile/ProfileHeader.tsx
    - src/components/profile/CatchGrid.tsx
    - src/hooks/useProfile.ts
  modified:
    - src/__tests__/unit/profile.test.ts
decisions:
  - isOwnProfileCheck ako exportovaná pure funkcia (testovateľná bez React)
  - getUserStats číta z Firestore priamo (nie z user.stats cache) pre aktuálnosť
  - CatchGrid CELL_SIZE vypočítaný z SCREEN_WIDTH - bez hardkódu
metrics:
  duration: "6 min"
  completed_date: "2026-03-12"
  tasks: 2
  files: 5
---

# Phase 02 Plan 08: Profile Screen Summary

Twitter-style profil screen s banner/avatar/stats/grid, isOwnProfile logika a React Query hooks pre Firestore user document + posledných 12 úlovkov.

## Tasks Completed

| Task | Description | Commit |
|------|-------------|--------|
| 1 | useProfile hook + TDD testy (PROF-01..05) | b0b8fb1 |
| 2 | ProfileHeader + CatchGrid + profile screen | 919150b |

## What Was Built

**`src/hooks/useProfile.ts`**
- `isOwnProfileCheck(currentUserId, profileId)` — pure helper, testovateľný
- `getUserStats(userId)` — async funkcia, catchCount + totalWeightG + biggestCatchG
- `useUserProfile`, `useUserStats`, `useUserCatches` — React Query hooks
- `useUserCatches`: orderBy createdAt desc, limit(12)

**`src/components/profile/ProfileHeader.tsx`**
- Twitter-style layout: landscape banner (120px, forest green #1B4332) + avatar overlay (72px, biele orámovanie)
- isOwnProfile=true → "Upraviť profil" button (top-right, rounded border)
- Karma badge (amber) + badges array (green)
- Stats riadok: Úlovky · kg celkom · kg rekord

**`src/components/profile/CatchGrid.tsx`**
- 3-stĺpcový grid, CELL_SIZE = (SCREEN_WIDTH - 2*2) / 3
- expo-image s blurhash placeholder, transition 200ms
- tap → router.push('/catch/[id]')

**`app/profile/[userId].tsx`**
- useLocalSearchParams pre profileId
- isOwnProfile = currentUser.uid === profileId
- Loading state (ActivityIndicator) + "Profil sa nenašiel" fallback
- ScrollView s ProfileHeader + CatchGrid

## Test Results

- 12/12 testov zelených (PROF-01 až PROF-05)
- Pre-existujúce TS chyby v nesúvisiacich súboroch (contentStyle, posthog, imageUpload)

## Deviations from Plan

None — plán vykonaný presne.

## Self-Check: PASSED

- app/profile/[userId].tsx: FOUND
- src/components/profile/ProfileHeader.tsx: FOUND
- src/components/profile/CatchGrid.tsx: FOUND
- src/hooks/useProfile.ts: FOUND
- Commit b0b8fb1: FOUND
- Commit 919150b: FOUND
