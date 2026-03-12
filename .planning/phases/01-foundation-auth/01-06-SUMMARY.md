---
phase: 01-foundation-auth
plan: 06
subsystem: analytics
tags: [posthog, analytics, react-native, expo, gdpr]

requires:
  - phase: 01-04
    provides: app/_layout.tsx s Firebase auth + Stack.Protected guard
  - phase: 01-05
    provides: auth screens (login, register, forgot-password)
provides:
  - PostHog analytics singleton s type-safe captureEvent helper
  - PostHogProvider wrapper v root layout
  - 3 core eventy: app_opened, user_registered, user_logged_in
  - EU GDPR-compliant PostHog host konfigurácia
affects:
  - phase 2 (catch diary — pridávať catch_created event)
  - phase 5 (community — pridávať post_published event)
  - phase 6 (marketplace — pridávať listing_created event)
  - phase 4 (premium — pridávať premium_purchased event)

tech-stack:
  added: [posthog-react-native ^4.37.2]
  patterns:
    - PostHog singleton v src/lib/posthog.ts, importovaný priamo (nie cez hook)
    - PostHogProvider ako najvonkajší wrapper pred QueryClientProvider
    - captureEvent helper s CoreEvent union type pre type-safety
    - EXPO_PUBLIC_ prefix pre client-side env vars
    - disabled: !POSTHOG_KEY pre graceful degradation bez API key

key-files:
  created:
    - src/lib/posthog.ts
    - .env.example
  modified:
    - app/_layout.tsx
    - app/(auth)/register.tsx
    - app/(auth)/login.tsx
    - .gitignore

key-decisions:
  - "PostHog EU host (eu.posthog.com) pre GDPR compliance — SK/CZ market"
  - "disabled: !POSTHOG_KEY — appka funguje bez PostHog kľúča v development"
  - "CoreEvent union type — type-safe event names, zabraňuje typo errors"
  - "app_opened event sa trackuje po Firebase auth init (nie na mount) — presnejší timing"

patterns-established:
  - "Analytics events sa volajú priamo cez captureEvent(), nie cez usePostHog hook"
  - "Všetky env vars s EXPO_PUBLIC_ prefix pre Expo klient"
  - ".env v .gitignore, .env.example commitnutý do repo"

requirements-completed: [INFRA-07]

duration: 4min
completed: 2026-03-12
---

# Phase 1 Plan 6: PostHog Analytics Summary

**PostHog analytics s EU GDPR host, type-safe CoreEvent helper, a 3 core eventy (app_opened, user_registered, user_logged_in) integrované do Expo root layoutu a auth screens**

## Performance

- **Duration:** 4 min
- **Started:** 2026-03-12T11:10:00Z
- **Completed:** 2026-03-12T11:14:00Z
- **Tasks:** 1 auto + 1 checkpoint (auto-approved)
- **Files modified:** 6

## Accomplishments

- PostHog singleton v `src/lib/posthog.ts` s type-safe `captureEvent` helper funkciou a 8 CoreEvent typmi pre celú appku
- `PostHogProvider` wrapper pridaný ako najvonkajší provider v `app/_layout.tsx`, `app_opened` event trackovaný po Firebase auth init
- `user_registered` a `user_logged_in` eventy pridané do auth screens po úspešnej akcii
- `.env.example` commitnutý do repo, `.env` exkludovaný z gitu, EU GDPR host prednastavený

## Task Commits

1. **Task 1: PostHog analytics + app/_layout.tsx aktualizácia** - `3f95e43` (feat)

## Checkpoint

**checkpoint:human-verify** — auto-approved (auto_advance: true)

Checkpoint overuje celý Phase 1 flow na reálnom zariadení cez EAS dev build. Developer musí:
1. Nastaviť Firebase projekt (console.firebase.google.com) — Android + iOS app, Email/Password auth, Firestore europe-west1
2. Stiahniť `google-services.json` do root projektu
3. Spustiť `eas build --platform android --profile development`
4. Overiť celý auth flow na zariadení

## Files Created/Modified

- `src/lib/posthog.ts` — PostHog singleton (disabled ak chýba API key), captureEvent helper s CoreEvent union type
- `app/_layout.tsx` — PostHogProvider wrapper + app_opened event po Firebase auth init
- `app/(auth)/register.tsx` — captureEvent('user_registered') po Firestore doc vytvorení
- `app/(auth)/login.tsx` — captureEvent('user_logged_in') po úspešnom signIn
- `.env.example` — template s PostHog placeholders a EU host
- `.gitignore` — pridané `.env` a `.env.local`

## Decisions Made

- EU host `https://eu.posthog.com` — GDPR compliance pre SK/CZ market, dáta zostávajú v EU
- `disabled: !POSTHOG_KEY` — graceful degradation, appka funguje počas development bez PostHog kľúča
- `CoreEvent` union type — compile-time ochrana pred typo errors v event names
- PostHog singleton miesto hook — jednoduchšie volanie z async handleroch

## Deviations from Plan

None — plán vykonaný presne ako napísaný.

## User Setup Required

**Externé služby vyžadujú manuálnu konfiguráciu:**

### Firebase (povinné pre fungovanie appky)
1. Vytvor projekt: https://console.firebase.google.com → Add Project → "catch-app-sk"
2. Pridaj Android app: Package name `sk.catchapp.app` → stiahni `google-services.json` → umiestni do root projektu
3. Pridaj iOS app: Bundle ID `sk.catchapp.app` → stiahni `GoogleService-Info.plist` → umiestni do root projektu
4. Zapni Email/Password: Authentication → Sign-in method → Email/Password → Enable
5. Vytvor Firestore: Firestore Database → Create Database → Production mode → `europe-west1`
6. Nasaď security rules: Firestore → Rules → paste `firestore.rules` obsah → Publish

### PostHog (voliteľné, analytics)
1. Vytvor projekt: https://eu.posthog.com → New Project → "CATCH"
2. Skopíruj API key: Project Settings → API Keys → Project API Key (phc_...)
3. Nastav v `.env`:
   ```
   EXPO_PUBLIC_POSTHOG_API_KEY=phc_YOUR_KEY
   EXPO_PUBLIC_POSTHOG_HOST=https://eu.posthog.com
   ```

### EAS Dev Build
```bash
cd "C:/Users/Počítač/Documents/catch-app"
eas build --platform android --profile development
```

## Phase 1 Status

**COMPLETE** — všetkých 6 plánov (01-01 až 01-06) hotových.

Dodané:
- Expo SDK 55 + React Native 0.83.2
- react-native-firebase 23.x (Auth + Firestore + Storage)
- EAS Build profily (development, preview, production)
- Design system (theme.ts, Barlow Condensed font, 5 color tokens)
- i18n SK/CZ lokalizácia
- UI primitives (Button, TextInput, Avatar)
- Auth flow (login, register, forgot-password, Stack.Protected)
- 5-tabová navigácia s custom FAB center button
- PostHog analytics (app_opened, user_registered, user_logged_in)

## Next Phase Readiness

Phase 1 kompletná. Další krok: `gsd:plan-phase 2` — Core Value: Catch Diary.

Prerekvizity pre Phase 2:
- Firebase projekt musí byť nastavený (google-services.json)
- EAS dev build musí fungovať na zariadení

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-12*
