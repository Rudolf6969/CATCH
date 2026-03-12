---
phase: 01-foundation-auth
plan: "04"
subsystem: auth-flow
tags: [expo-router, zustand, firebase-auth, firestore, auth-screens, stack-protected, tdd]
dependency_graph:
  requires: [01-01, 01-02, 01-03]
  provides:
    - Zustand auth store (useAuthStore) s user/initialized state
    - Zustand UI store (useUIStore) s unreadMessages/addModal state
    - app/_layout.tsx s Firebase onAuthStateChanged, SplashScreen control, Stack.Protected guard
    - app/(auth)/login.tsx s inline validation a Firebase error handling
    - app/(auth)/register.tsx s createUserWithEmailAndPassword + sendEmailVerification + Firestore users doc
    - app/(auth)/forgot-password.tsx s sendPasswordResetEmail a confirmation screen
    - app/(tabs)/ placeholder pre Stack.Protected redirect
  affects: [všetky fázy 2-8 závisia od auth stavu, 01-05 (tabs navigation)]
tech_stack:
  added:
    - expo-router ~55.0.18 (file-based routing, Stack.Protected guard)
    - react-native-screens (peer dep expo-router)
    - expo-linking (peer dep expo-router)
    - expo-constants (peer dep expo-router)
  patterns:
    - "Zustand store pattern: create<Interface>(set => ({...})) — minimálna boilerplate"
    - "Stack.Protected: guard={!!user} pre authenticated routes, guard={!user} pre auth routes"
    - "Firebase onAuthStateChanged v useEffect s cleanup unsubscribe — subscription lifecycle"
    - "SplashScreen.preventAutoHideAsync() + hideAsync() po initialized — bez flicker"
    - "Inline errors pattern: LoginErrors/RegisterErrors type s polí chybami, nie toasty"
    - "auth/user-not-found treated as success v forgot-password — security best practice"
key_files:
  created:
    - src/stores/auth.store.ts
    - src/stores/ui.store.ts
    - app/_layout.tsx
    - app/(auth)/_layout.tsx
    - app/(auth)/login.tsx
    - app/(auth)/register.tsx
    - app/(auth)/forgot-password.tsx
    - app/(tabs)/_layout.tsx
    - app/(tabs)/index.tsx
  modified:
    - index.ts (expo-router/entry namiesto registerRootComponent)
    - package.json (expo-router + deps nainštalované)
    - app.json (expo-router plugin automaticky pridaný)
decisions:
  - "expo-router nainštalovaný ako Rule 3 auto-fix — nebol v package.json napriek tomu že plan predpokladal app/ štruktúru a Stack.Protected"
  - "app/(tabs)/index.tsx placeholder pridaný — Stack.Protected potrebuje existujúcu route kam presmerovať"
  - "index.ts zmenený na expo-router/entry — povinné pre file-based routing"
  - "StyleSheet spread cez (theme.X as object) cast — konzistentné s rozhodnutím z Plan 03"
  - "auth/user-not-found v forgot-password treated as success — neodhaľujeme existenciu accountu"
metrics:
  duration: "6 min"
  completed_date: "2026-03-12"
  tasks_completed: 2
  files_created: 9
  files_modified: 3
  tests_passed: 18
---

# Phase 01 Plan 04: Auth Flow (Zustand Stores + Root Layout + Auth Screens) Summary

**One-liner:** Zustand auth/UI stores, expo-router root layout so Stack.Protected guard (Firebase onAuthStateChanged + SplashScreen control) a tri auth screeny (Login/Register/ForgotPassword) s inline validáciou, Firebase error handling a Firestore users doc creation.

---

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Zustand stores + root layout + Stack.Protected | 4e02db2 | auth.store.ts, ui.store.ts, app/_layout.tsx, index.ts, package.json, app.json |
| 2 | Auth screeny — Login, Register, Forgot Password | 02fd499 | (auth)/_layout.tsx, login.tsx, register.tsx, forgot-password.tsx, (tabs)/_layout.tsx, (tabs)/index.tsx |

---

## What Was Built

### Zustand Stores

**useAuthStore** (`src/stores/auth.store.ts`):
- `user: FirebaseAuthTypes.User | null` — Firebase user objekt, null = neprihlásený
- `initialized: boolean` — false kým onAuthStateChanged neprebehne prvýkrát
- `setUser(user)` — aktualizuje user stav (volaný z onAuthStateChanged)
- `setInitialized(v)` — nastavuje initialized flag

**useUIStore** (`src/stores/ui.store.ts`):
- `totalUnreadMessages: number` — počet neprečítaných správ (pre badge v tab bare)
- `isAddModalOpen: boolean` — stav "Pridať úlovok" modalu

### Root Layout (`app/_layout.tsx`)

- `SplashScreen.preventAutoHideAsync()` — splash zostáva kým nie je auth initialized
- Firebase `onAuthStateChanged` → `setUser` + `setInitialized(true)`
- `SplashScreen.hideAsync()` keď `initialized === true`
- `if (!initialized) return null` — žiadny flicker, splash ostáva viditeľný
- `Stack.Protected guard={!!user}` — tabs route dostupná len pre prihlásených
- `Stack.Protected guard={!user}` — auth route dostupná len pre neprihlásených
- `QueryClientProvider` s 5-minútovým staleTime

### Auth Screeny

**Login** (`app/(auth)/login.tsx`):
- Email + password polia s `AppTextInput` komponentom
- Inline validácia: emailRequired, passwordRequired pod príslušnými políčkami
- Firebase error kódy: `auth/invalid-credential`, `auth/user-not-found`, `auth/wrong-password` → "Nesprávny email alebo heslo"
- `auth/too-many-requests` → "Príliš veľa pokusov. Skúste neskôr."
- `auth/network-request-failed` → "Chyba siete. Skontroluj pripojenie."
- Links na Register a Forgot Password

**Register** (`app/(auth)/register.tsx`):
- Email + password + confirmPassword polia
- Validácia: emailRequired, passwordRequired, passwordTooShort (< 8 znakov), passwordMismatch
- `createUserWithEmailAndPassword` → `sendEmailVerification` → Firestore `users.doc(uid).set()`
- Firestore doc obsahuje: uid, email, displayName(''), avatarUrl(null), bio(''), createdAt(serverTimestamp), catchCount(0), totalWeightGrams(0), biggestCatchGrams(0), karma(0), isPremium(false), badges([])
- Error: `auth/email-already-in-use` → "Tento email je už registrovaný" (na email poli)

**Forgot Password** (`app/(auth)/forgot-password.tsx`):
- Jeden email input, validácia emailRequired
- `sendPasswordResetEmail` → confirmation screen
- Security: `auth/user-not-found` treated as success (neodhaľujeme existenciu accountu)
- Confirmation screen zobrazí email adresu a "Späť" button

---

## Verification

```
PASS __tests__/unit/auth/auth.test.ts — 6/6 tests (AUTH-01, AUTH-02, AUTH-03, AUTH-06)
PASS __tests__/unit/auth/guard.test.ts — 3/3 tests (AUTH-05)
PASS __tests__/unit/theme.test.ts — 5/5 tests
PASS __tests__/unit/i18n.test.ts — 4/4 tests

Total: 18/18 GREEN
```

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] expo-router nebol nainštalovaný**
- **Found during:** Task 1 (vytvorenie app/_layout.tsx)
- **Issue:** Plán predpokladal `app/` štruktúru, `Stack.Protected`, `expo-router` importy, ale `expo-router` nebol v `package.json` ani v `app.json` plugins
- **Fix:** `npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar` — SDK-compatible verzie
- **Files modified:** package.json, package-lock.json, app.json (expo-router plugin auto-pridaný)
- **Commit:** 4e02db2

**2. [Rule 3 - Blocking] index.ts používal registerRootComponent namiesto expo-router/entry**
- **Found during:** Task 1 (expo-router setup)
- **Issue:** `index.ts` importoval `App.tsx` cez `registerRootComponent` — expo-router vyžaduje `import 'expo-router/entry'` ako entry point
- **Fix:** Zmenený `index.ts` na `import 'expo-router/entry'`
- **Files modified:** index.ts
- **Commit:** 4e02db2

**3. [Rule 2 - Missing functionality] app/(tabs)/ placeholder**
- **Found during:** Task 2 (auth screens)
- **Issue:** Stack.Protected guard={!!user} presmeruje na `(tabs)` route — táto route musí existovať inak expo-router hodí warning/error
- **Fix:** Vytvorené `app/(tabs)/_layout.tsx` (Tabs layout) a `app/(tabs)/index.tsx` (Podmienky placeholder)
- **Files modified:** app/(tabs)/_layout.tsx, app/(tabs)/index.tsx
- **Commit:** 02fd499

---

## Firebase Error Codes Handled

| Code | Screen | Message |
|------|--------|---------|
| `auth/invalid-credential` | Login | invalidCredential (SK) |
| `auth/user-not-found` | Login | invalidCredential (SK) |
| `auth/wrong-password` | Login | invalidCredential (SK) |
| `auth/too-many-requests` | Login | tooManyRequests (SK) |
| `auth/network-request-failed` | Login, Register | networkError (SK) |
| `auth/email-already-in-use` | Register | "Tento email je už registrovaný" |
| `auth/invalid-email` | Register | invalidEmail (SK) |
| `auth/user-not-found` | ForgotPassword | treated as success (security) |

---

## Notes pre ďalší plan (01-05: Tabs navigation)

- `app/(tabs)/` placeholder priečinok existuje — Plan 05 ho nahradí skutočnými tabmi
- `useUIStore.totalUnreadMessages` bude použitý pre badge v tab bare v Phase 7
- `useUIStore.isAddModalOpen` bude použitý pre FAB v center tabe
- Stack.Protected je nastavený — po prihlásení sa automaticky zobrazí (tabs) route

## Self-Check: PASSED
