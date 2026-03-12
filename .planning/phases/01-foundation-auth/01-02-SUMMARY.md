---
phase: 01-foundation-auth
plan: 02
subsystem: testing
tags: [jest, jest-expo, firebase-mock, tdd, unit-tests, react-native-testing-library]

# Dependency graph
requires:
  - phase: 01-foundation-auth plan 01
    provides: Expo project scaffold, package.json, Firebase dependencies nainštalované

provides:
  - jest.config.js s jest-expo preset a @/ moduleNameMapper
  - __mocks__/@react-native-firebase/auth.ts — plná mock implementácia
  - __mocks__/@react-native-firebase/firestore.ts — mock kolekcie a dokumenty
  - __mocks__/expo-localization.ts — SK locale mock
  - 4 stub test súbory pre AUTH-01, AUTH-02, AUTH-03, AUTH-05, AUTH-06, INFRA-03, INFRA-04

affects:
  - všetky ďalšie plans vo fáze 01 (potrebujú jest na verify)
  - plans pre implementáciu auth, theme, i18n (stub testy čakajú na ich implementáciu)

# Tech tracking
tech-stack:
  added:
    - jest-expo ~55.0.9 (jest preset pre Expo projekty)
    - "@testing-library/react-native ^13.3.3"
    - "@types/jest ^30.0.0"
  patterns:
    - TDD Red phase — stub testy písané pred implementáciou
    - Firebase modules mockované cez __mocks__ adresár (automock pattern)
    - jest-expo preset s @/ alias cez moduleNameMapper

key-files:
  created:
    - jest.config.js
    - __mocks__/@react-native-firebase/auth.ts
    - __mocks__/@react-native-firebase/firestore.ts
    - __mocks__/expo-localization.ts
    - __tests__/unit/auth/auth.test.ts
    - __tests__/unit/auth/guard.test.ts
    - __tests__/unit/theme.test.ts
    - __tests__/unit/i18n.test.ts
  modified:
    - package.json (test scripts + devDependencies)

key-decisions:
  - "jest-expo preset namiesto getDefaultConfig API — 55.x neexportuje getDefaultConfig funkciu"
  - "transformIgnorePatterns rozšírené o @react-native-firebase — potrebné pre transform native modulov"
  - "theme.test.ts a i18n.test.ts zámerné RED — try/catch pattern pre graceful fail pred implementáciou"

patterns-established:
  - "Stub test pattern: try/catch import + if (!module) return — testy nejdú crashnúť ak modul neexistuje"
  - "Mock pattern: module.exports = fn + export default fn — dual CJS/ESM kompatibilita"

requirements-completed:
  - INFRA-01

# Metrics
duration: 3min
completed: 2026-03-12
---

# Phase 1 Plan 02: Jest Test Infrastructure Summary

**Jest test infraštruktúra s Firebase automocks a TDD stub testmi pre 7 requirements (AUTH-01-03, AUTH-05-06, INFRA-03-04)**

## Performance

- **Duration:** 3 min
- **Started:** 2026-03-12T10:43:37Z
- **Completed:** 2026-03-12T10:46:50Z
- **Tasks:** 2
- **Files modified:** 8

## Accomplishments
- jest-expo preset funkčný, `npx jest --passWithNoTests` beží bez chýb
- Firebase auth a firestore plne mockované — testy nepotrebujú reálne Firebase pripojenie
- 9 testov PASS (auth + guard) + 9 RED stub testov (theme + i18n, čakajú na implementáciu)
- `@/` alias funguje v jest cez moduleNameMapper

## Task Commits

Každý task bol commitnutý atomicky:

1. **Task 1: Jest konfigurácia + Firebase mocks** - `3d41dcf` (chore)
2. **Task 2: Stub testy pre auth + theme + i18n** - `e9ee4b5` (test)

## Files Created/Modified
- `jest.config.js` — jest-expo preset, @/ alias, transformIgnorePatterns pre firebase
- `__mocks__/@react-native-firebase/auth.ts` — mockUser, mockAuth s jest.fn() implementáciami
- `__mocks__/@react-native-firebase/firestore.ts` — mockDocRef, mockCollectionRef, FieldValue
- `__mocks__/expo-localization.ts` — getLocales mock vracajúci sk-SK
- `__tests__/unit/auth/auth.test.ts` — 6 testov: AUTH-01, AUTH-02, AUTH-03, AUTH-06 (PASS)
- `__tests__/unit/auth/guard.test.ts` — 3 testy: AUTH-05 guard logika (PASS)
- `__tests__/unit/theme.test.ts` — 5 testov: INFRA-04 design tokeny (RED — theme.ts neexistuje)
- `__tests__/unit/i18n.test.ts` — 4 testy: INFRA-03 SK locale (RED — i18n.ts neexistuje)
- `package.json` — test, test:watch, test:unit scripts + jest-expo/testing-library devDeps

## Decisions Made
- `jest-expo` preset cez `preset: 'jest-expo'` namiesto `getDefaultConfig` — jest-expo 55.x neexportuje `getDefaultConfig` funkciu, preset sa aplikuje priamo cez jest `preset` field
- `transformIgnorePatterns` rozšírené o `@react-native-firebase` — bez toho jest nevie transformovať native firebase moduly
- theme.test.ts a i18n.test.ts používajú try/catch import — zámerné RED stub testy, implementácia ich spraví GREEN v ďalších plans

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] jest.config.js — preklep v pláne `setupFilesAfterFramework`**
- **Found during:** Task 1 (Jest konfigurácia)
- **Issue:** Plán obsahoval nevalidný jest option `setupFilesAfterFramework` (nie je jest config key). Jest by hlásil unknown option warning.
- **Fix:** Option vynechaný z jest.config.js — nie je potrebný pre fungovanie jest-expo preset
- **Files modified:** jest.config.js
- **Verification:** `npx jest --passWithNoTests` beží bez chýb
- **Committed in:** 3d41dcf (Task 1 commit)

**2. [Rule 3 - Blocking] jest.config.js — `getDefaultConfig` neexistuje v jest-expo 55.x**
- **Found during:** Task 1 (Jest konfigurácia)
- **Issue:** Plán používal `require('jest-expo/jest-preset').getDefaultConfig()` — funkcia neexistuje. jest-expo 55 exportuje preset objekt priamo, nie factory funkciu.
- **Fix:** Zmenené na `preset: 'jest-expo'` — správny spôsob pre jest-expo
- **Files modified:** jest.config.js
- **Verification:** `npx jest --passWithNoTests` vráti `No tests found, exiting with code 0`
- **Committed in:** 3d41dcf (Task 1 commit)

---

**Total deviations:** 2 auto-fixed (oba Rule 3 — blocking issues z nepresností v pláne)
**Impact on plan:** Oba auto-fixy nevyhnutné pre fungovanie jest. Žiadny scope creep.

## Issues Encountered
- `jest-expo/jest-preset` modul nie je na ceste `jest-preset.js` (Windows path resolution) — riešené použitím `preset: 'jest-expo'` ktorý jest resolvuje automaticky cez package.json `jest-preset` field

## User Setup Required
None — žiadna externá konfigurácia nie je potrebná.

## Next Phase Readiness
- Jest infraštruktúra hotová, všetky ďalšie plans môžu písať unit testy
- Firebase mocky pripravené — auth a firestore testy nevyžadujú reálne pripojenie
- 9 stub testov čaká na implementáciu (theme, i18n) — stanú sa GREEN v plans 03 a 04
- Spustiť: `npx jest --passWithNoTests` pre overenie stavu

---
*Phase: 01-foundation-auth*
*Completed: 2026-03-12*
