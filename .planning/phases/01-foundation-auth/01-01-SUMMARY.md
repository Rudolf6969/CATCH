---
phase: 01-foundation-auth
plan: 01
subsystem: infra
tags: [expo, react-native, firebase, react-native-firebase, eas, zustand, react-query, firestore]

# Dependency graph
requires: []
provides:
  - Expo SDK 55 projekt s natívnym Firebase SDK (react-native-firebase 23.x)
  - EAS Build profily: development (APK), preview, production
  - Centralizovane Firebase importy v src/lib/firebase.ts
  - Skeleton Firestore security rules pre users/catches/spots
  - Placeholder Firebase config súbory s inštrukciami pre developera
  - metro.config.js, package.json overrides, .env pre Metro performance
affects:
  - 01-02 (auth screens potrebuje src/lib/firebase.ts)
  - 01-03 (navigation setup závisí od Expo projektu)
  - všetky ďalšie plány (dependency na funkčnom Expo projekte)

# Tech tracking
tech-stack:
  added:
    - expo ~55.0.6 (SDK 55, nie plánovaný 53 — auto-upgrade)
    - react-native 0.83.2
    - "@react-native-firebase/app ^23.8.6"
    - "@react-native-firebase/auth ^23.8.6"
    - "@react-native-firebase/firestore ^23.8.6"
    - "@react-native-firebase/storage ^23.8.6"
    - "@react-native-firebase/messaging ^23.8.6"
    - zustand ^5.0.11
    - "@tanstack/react-query ^5.90.21"
    - expo-dev-client ~55.0.16
    - expo-build-properties ~55.0.9
    - expo-font ~55.0.4
    - expo-splash-screen ~55.0.10
    - expo-localization ~55.0.8
    - expo-file-system ~55.0.10
    - expo-application ~55.0.9
    - expo-device ~55.0.9
    - react-native-reanimated 4.2.1
    - react-native-safe-area-context ~5.6.2
    - "@expo/vector-icons ^15.0.2"
    - i18n-js ^4.5.3
    - posthog-react-native ^4.37.2
  patterns:
    - "react-native-firebase auto-init: žiadny initializeApp(), natívny SDK inicializuje z google-services.json/GoogleService-Info.plist"
    - "EAS dev build od dňa 1: Firebase native + expo-dev-client nefungujú v Expo Go"
    - "metro.config.js default config bez unstable_enablePackageExports (nepotrebné pre native SDK)"
    - "package.json overrides pre React 19.2.0 peer deps"
    - "EXPO_USE_FAST_RESOLVER=1 v .env pre Metro performance"

key-files:
  created:
    - package.json
    - app.json
    - eas.json
    - metro.config.js
    - .env
    - src/lib/firebase.ts
    - google-services.json (placeholder)
    - GoogleService-Info.plist (placeholder)
    - firestore.rules
    - App.tsx (z template)
    - index.ts (z template)
    - tsconfig.json (z template)
  modified: []

key-decisions:
  - "Expo SDK 55 namiesto plánovaného 53 — create-expo-app nainštaloval najnovší 55, čo je výhodnejšie (novší React Native 0.83.2, Reanimated 4.x)"
  - "react-native-firebase 23.x (nie 21.x z plánu) — nainštalovaná najnovšia verzia, kompatibilná s Expo 55"
  - "Template assets použité priamo (assets/icon.png atd) — plán referencoval assets/images/ štruktúru ktorá neexistovala v template"
  - "Firestore skeleton rules: catches kolekcia namiesto pôvodného catches+posts split — posts/catches split je na Plan 03"

patterns-established:
  - "Firebase init pattern: export { auth, firestore, storage } z src/lib/firebase.ts — všetky ostatné súbory importujú odtiaľto"
  - "EAS build: development=APK+developmentClient, preview=APK internal, production=autoIncrement"
  - "iOS useFrameworks:static cez expo-build-properties plugin — povinné pre react-native-firebase na iOS"

requirements-completed:
  - INFRA-01
  - INFRA-02
  - INFRA-06

# Metrics
duration: 5min
completed: 2026-03-12
---

# Phase 01 Plan 01: Expo + Firebase Foundation Summary

**Expo SDK 55 greenfield projekt s react-native-firebase 23.x natívnym SDK, EAS build profilmi a skeleton Firestore rules pre users/catches/spots**

## Performance

- **Duration:** ~5 min
- **Started:** 2026-03-12T11:09:23Z
- **Completed:** 2026-03-12T11:14:27Z
- **Tasks:** 2
- **Files modified:** 13

## Accomplishments

- Expo SDK 55 projekt s 24 production závislosťami vrátane celého react-native-firebase stacku
- app.json nakonfigurovaný pre produkciu: bundle ID sk.catchapp.app, dark UI, newArchEnabled, iOS useFrameworks:static
- EAS Build profily pre development/preview/production s APK pre Android development
- src/lib/firebase.ts centralizovaný import bod (bez initializeApp — natívny auto-init)
- Firestore skeleton security rules pre users/catches/spots s isAuth()/isOwner() helpermi
- Placeholder Firebase config súbory s jasnými inštrukciami pre developera

## Task Commits

1. **Task 1: Expo SDK 55 projekt init + Windows setup** - `2bac070` (chore)
2. **Task 2: Firebase konfigurácia + EAS profily** - `f3f555d` (feat)

## Files Created/Modified

- `package.json` - 24 production deps, overrides pre React 19.2.0
- `app.json` - CATCH config, Firebase plugins, bundle ID, dark UI
- `eas.json` - development/preview/production profily
- `metro.config.js` - default Metro config (bez package exports override)
- `.env` - EXPO_USE_FAST_RESOLVER=1
- `src/lib/firebase.ts` - centralizované Firebase importy
- `google-services.json` - placeholder pre Android Firebase config
- `GoogleService-Info.plist` - placeholder pre iOS Firebase config
- `firestore.rules` - skeleton security rules
- `App.tsx`, `index.ts`, `tsconfig.json` - z blank-typescript template
- `assets/` - template ikony a splash screen

## Decisions Made

- Expo SDK 55 namiesto 53 — create-expo-app nainštaloval najnovší, výhodnejšie
- react-native-firebase 23.x — najnovšia verzia, kompatibilná
- Template asset štruktúra zachovaná (assets/ root namiesto assets/images/)
- Firestore rules pokrývajú catches ako unified kolekciu (posts/catches split v Plan 03)

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Upgrade] Expo SDK 55 namiesto plánovaného SDK 53**
- **Found during:** Task 1 (projekt init)
- **Issue:** create-expo-app nainštaloval Expo 55 (najnovší) — plán špecifikoval 53
- **Fix:** Zachovaná verzia 55 (novší = lepší, React Native 0.83.2, Reanimated 4.x)
- **Files modified:** package.json
- **Verification:** `node -e "const p=require('./package.json'); console.log(p.dependencies.expo)"` → ~55.0.6
- **Committed in:** 2bac070 (Task 1 commit)

**2. [Rule 1 - Asset paths] Použité template asset cesty**
- **Found during:** Task 2 (app.json konfigurácia)
- **Issue:** Plán referencoval `./assets/images/icon.png` ale template má `./assets/icon.png`
- **Fix:** Použité existujúce template asset cesty, assets/images/ adresár vytvorený pre budúce custom assets
- **Files modified:** app.json
- **Verification:** app.json references existujúce súbory
- **Committed in:** f3f555d (Task 2 commit)

---

**Total deviations:** 2 auto-fixed (1 version upgrade, 1 asset path)
**Impact on plan:** Obe odchýlky zlepšujú projekt. SDK 55 je novší a lepší. Asset cesty sú funkčné.

## Issues Encountered

- create-expo-app odmietol inicializovať do adresára s existujúcimi súbormi (.planning/) — riešené vytvorením template do /tmp a manuálnym kopírovaním
- npm install nainštaloval @react-native-firebase/auth a @react-native-firebase/messaging config plugins automaticky do app.json, ktoré boli potom prepísané finálnym app.json konfiguráciou

## User Setup Required

**Developer musí pred EAS buildom urobiť:**

1. Vytvoriť Firebase projekt na console.firebase.google.com
2. Pridať Android app (package: `sk.catchapp.app`) → stiahnuť `google-services.json` → nahradiť placeholder
3. Pridať iOS app (bundle ID: `sk.catchapp.app`) → stiahnuť `GoogleService-Info.plist` → nahradiť placeholder
4. Nasadiť Firestore rules: `firebase deploy --only firestore:rules`
5. Pre EAS build: `npx eas build --profile development --platform android`

## Next Phase Readiness

- Expo projekt pripravený pre Plan 01-02 (Expo Router + auth screens)
- src/lib/firebase.ts export bod ready pre auth/firestore/storage importy
- EAS development profile ready pre prvý build po nahradení Firebase config súborov
- fonts/ adresár vytvorený — potrebuje skutočné .ttf súbory pred EAS buildom

## Self-Check: PASSED

All files verified present. All commits verified in git log.

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-12*
