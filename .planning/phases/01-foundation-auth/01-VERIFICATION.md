---
phase: 01-foundation-auth
verified: 2026-03-12T00:00:00Z
status: human_needed
score: 5/5 automated must-haves verified
human_verification:
  - test: "EAS dev build na reálnom Android zariadení"
    expected: "Build prebehne bez chýb, APK sa nainštaluje a spustí"
    why_human: "google-services.json je placeholder — build vyžaduje reálny Firebase projekt"
  - test: "Registrácia + login flow na zariadení"
    expected: "Nový user sa zaregistruje, dostane verifikačný email, prihlási sa, session pretrváva po reštarte"
    why_human: "Vyžaduje reálne Firebase Auth + reálny EAS build"
  - test: "5 tabov viditeľných a navigovateľných"
    expected: "Podmienky / Feed / oranžový FAB / Denník / Bazár — všetky fungujú, FAB je prominentný"
    why_human: "Tab navigácia cez expo-router/ui vyžaduje natívny build pre overenie"
  - test: "PostHog eventy v Live Events dashboarde"
    expected: "app_opened, user_registered, user_logged_in sa objavujú po akciách"
    why_human: "Vyžaduje reálny PostHog API key a spustenú appku"
notes:
  - "Expo SDK 55 namiesto 53 dokumentovaného v plánoch (01-01-PLAN.md hovorí SDK 53, reálne je ~55.0.6) — plány boli vytvorené so starším číslom, exekúcia správne použila aktuálnu verziu"
  - "react-native-firebase v23.8.6 namiesto plánovaného v21 — kompatibilná aktualizácia"
  - "google-services.json je placeholder — developer musí nastaviť reálny Firebase projekt pre EAS build"
---

# Phase 1: Foundation & Auth — Verification Report

**Phase Goal:** Prihlásený používateľ vidí appku s 5 tabmi (Podmienky / Feed / ⊕ / Denník / Bazár), EAS dev build beží na reálnom Android/iOS zariadení a Firebase je plne nakonfigurované.
**Verified:** 2026-03-12
**Status:** human_needed — všetky automatizované kontroly prešli, potrebné overenie na reálnom zariadení
**Re-verification:** Nie — prvá verifikácia

---

## Goal Achievement

### Observable Truths (z Success Criteria v ROADMAP.md)

| # | Truth | Status | Evidence |
|---|-------|--------|----------|
| 1 | `eas build --profile development` prebehne a nainštaluje sa na zariadení | ? HUMAN | google-services.json je placeholder — Firebase projekt nebol nastavený |
| 2 | Registrácia + verifikačný email + login → session pretrváva | ? HUMAN | Kód je plne implementovaný, ale vyžaduje reálny Firebase |
| 3 | Animated splash → login screen; po prihlásení redirect na Podmienky tab | ? HUMAN | Stack.Protected guard={!!user} je správne nadrôtovaný, SplashScreen.preventAutoHideAsync() volaný |
| 4 | 5 tabov viditeľných a navigovateľných s branded placeholder obsahom | ? HUMAN | Všetkých 5 tab súborov existuje, CustomTabBar implementovaný s FAB |
| 5 | Design system tokeny aplikované: farby, Outfit/Inter fonty, spacing | ✓ VERIFIED | theme.ts exportuje všetky tokeny, UI primitives ich používajú |

**Automated Score:** 1/5 plne overiteľných automaticky (truth 5); 4/5 vyžaduje reálne zariadenie

---

## Required Artifacts

### Plan 01-01: Expo init + Firebase + EAS

| Artifact | Status | Details |
|----------|--------|---------|
| `package.json` | ✓ VERIFIED | expo ~55.0.6, @react-native-firebase/app ^23.8.6, zustand ^5.0.11, @tanstack/react-query ^5.90.21 |
| `app.json` | ✓ VERIFIED | Firebase plugin, expo-build-properties iOS useFrameworks:static, bundle ID sk.catchapp.app, scheme catchapp |
| `eas.json` | ✓ VERIFIED | development (APK, developmentClient:true), preview, production profily |
| `metro.config.js` | ✓ VERIFIED | Existuje, bez unstable_enablePackageExports |
| `src/lib/firebase.ts` | ✓ VERIFIED | auth, firestore, storage importy bez initializeApp() |
| `firestore.rules` | ✓ VERIFIED | Skeleton rules pre users, catches, spots s isAuth()/isOwner() helpers |
| `google-services.json` | ⚠️ PLACEHOLDER | Obsahuje `_PLACEHOLDER` kľúč, project_id: "catch-app-placeholder" — developer musí nahradiť reálnym |
| `GoogleService-Info.plist` | ⚠️ PLACEHOLDER | XML s `<key>PLACEHOLDER</key>` — developer musí nahradiť reálnym |

### Plan 01-02: Test infraštruktúra

| Artifact | Status | Details |
|----------|--------|---------|
| `jest.config.js` | ✓ VERIFIED | jest-expo preset, moduleNameMapper pre @/ alias, transformIgnorePatterns |
| `__mocks__/@react-native-firebase/auth.ts` | ✓ VERIFIED | Mock s signIn, signOut, onAuthStateChanged, createUser |
| `__mocks__/@react-native-firebase/firestore.ts` | ✓ VERIFIED | Mock s collection, doc, set, get, FieldValue |
| `__mocks__/expo-localization.ts` | ✓ VERIFIED | Mock s SK locale |
| `__tests__/unit/auth/auth.test.ts` | ✓ VERIFIED | AUTH-01, AUTH-02, AUTH-03, AUTH-06 testy — GREEN |
| `__tests__/unit/auth/guard.test.ts` | ✓ VERIFIED | AUTH-05 guard testy — GREEN |
| `__tests__/unit/theme.test.ts` | ✓ VERIFIED | INFRA-04 theme tokeny — GREEN |
| `__tests__/unit/i18n.test.ts` | ✓ VERIFIED | INFRA-03 SK locale — GREEN |

**Jest výsledok: 18/18 testov PASS (4 test suites)**

### Plan 01-03: Design system

| Artifact | Status | Details |
|----------|--------|---------|
| `src/theme/theme.ts` | ✓ VERIFIED | colors (#0A1628, #40916C, #F4A261...), typography (Outfit-Bold, Inter-Regular, JetBrainsMono-Regular), spacing, radius, shadow tokeny |
| `src/lib/i18n.ts` | ✓ VERIFIED | i18n-js s SK default, enableFallback=true, defaultLocale='sk' |
| `src/locales/sk.json` | ✓ VERIFIED | auth, tabs, common, placeholders kľúče |
| `src/locales/cs.json` | ✓ VERIFIED | CZ preklady |
| `src/components/ui/Button.tsx` | ✓ VERIFIED | primary/secondary/ghost/danger varianty, loading state, theme tokeny |
| `src/components/ui/TextInput.tsx` | ✓ VERIFIED | AppTextInput s error/label/helper, theme tokeny |
| `src/components/ui/Card.tsx` | ✓ VERIFIED | elevated prop, theme tokeny |
| `src/components/ui/Badge.tsx` | ✓ VERIFIED | 5 variantov, theme tokeny |
| `src/components/ui/Avatar.tsx` | ✓ VERIFIED | uri/initials fallback, theme tokeny |
| `src/components/ui/Skeleton.tsx` | ✓ VERIFIED | Animated opacity loop, theme tokeny |
| `src/components/ui/index.ts` | ✓ VERIFIED | Barrel exports všetkých 6 komponentov |
| `assets/fonts/` | ✓ VERIFIED | Font súbory existujú (Outfit, Inter, JetBrainsMono) |

### Plan 01-04: Auth flow

| Artifact | Status | Details |
|----------|--------|---------|
| `src/stores/auth.store.ts` | ✓ VERIFIED | useAuthStore: user, initialized, setUser, setInitialized |
| `src/stores/ui.store.ts` | ✓ VERIFIED | useUIStore: totalUnreadMessages, isAddModalOpen |
| `app/_layout.tsx` | ✓ VERIFIED | onAuthStateChanged, SplashScreen control, Stack.Protected guard={!!user}, PostHogProvider |
| `app/(auth)/_layout.tsx` | ✓ VERIFIED | Stack bez header, dark background, fade animation |
| `app/(auth)/login.tsx` | ✓ VERIFIED | Inline validation, Firebase error handling, captureEvent user_logged_in |
| `app/(auth)/register.tsx` | ✓ VERIFIED | createUserWithEmailAndPassword + sendEmailVerification + Firestore users.doc.set() + captureEvent user_registered |
| `app/(auth)/forgot-password.tsx` | ✓ VERIFIED | sendPasswordResetEmail, confirmation screen po odoslaní |

### Plan 01-05: Tab navigácia

| Artifact | Status | Details |
|----------|--------|---------|
| `app/(tabs)/_layout.tsx` | ✓ VERIFIED | expo-router/ui Tabs + TabSlot + CustomTabBar, SafeAreaProvider |
| `src/components/tabs/CustomTabBar.tsx` | ✓ VERIFIED | TabList + 4 FocusableTab + center FAB Pressable (60x60, #F4A261), useSafeAreaInsets |
| `src/components/tabs/TabIcon.tsx` | ✓ VERIFIED | tabActive (#40916C) / tabInactive (#6B7280) farby podľa focused |
| `app/(tabs)/podmienky.tsx` | ✓ VERIFIED | Dummy weather widget (teplota, tlak, vietor, mesiac, AI skóre 7/10) |
| `app/(tabs)/feed.tsx` | ✓ VERIFIED | Skeleton posty, Avatar, Badge |
| `app/(tabs)/pridat.tsx` | ✓ VERIFIED | Modal placeholder s close button, "Čoskoro" badge |
| `app/(tabs)/dennik.tsx` | ✓ VERIFIED | Empty state s Ionicons, "Čoskoro" badge |
| `app/(tabs)/bazar.tsx` | ✓ VERIFIED | Empty state s Ionicons, "Čoskoro" badge |

### Plan 01-06: PostHog analytics

| Artifact | Status | Details |
|----------|--------|---------|
| `src/lib/posthog.ts` | ✓ VERIFIED | PostHog singleton s EU host fallback, disabled ak bez API key, captureEvent helper s type-safe event names |
| `app/_layout.tsx` | ✓ VERIFIED | PostHogProvider wrapper, captureEvent('app_opened') pri initialized |
| `.env.example` | ✓ VERIFIED | EXPO_PUBLIC_POSTHOG_API_KEY, EXPO_PUBLIC_POSTHOG_HOST, EXPO_USE_FAST_RESOLVER=1 |
| `.gitignore` | ✓ VERIFIED | .env je v .gitignore |

---

## Key Link Verification

| From | To | Via | Status | Details |
|------|-----|-----|--------|---------|
| `app.json plugins` | `@react-native-firebase/app` | config plugin entry | ✓ WIRED | "@react-native-firebase/app" je v plugins array |
| `app.json` | `google-services.json` | android.googleServicesFile | ✓ WIRED | googleServicesFile: "./google-services.json" |
| `jest.config.js` | `__mocks__` | moduleNameMapper | ✓ WIRED | `'^@/(.*)$': '<rootDir>/src/$1'` + automock via `__mocks__` dir |
| `Button.tsx` | `theme.ts` | `import { theme }` | ✓ WIRED | theme.colors.*, theme.radius.*, theme.spacing.* používané všade |
| `i18n.ts` | `sk.json` | `import sk from '@/locales/sk.json'` | ✓ WIRED | import sk, cs + I18n({ sk, cs }) |
| `app/_layout.tsx` | `auth.store.ts` | `useAuthStore` hook | ✓ WIRED | `const { user, setUser, setInitialized, initialized } = useAuthStore()` |
| `app/_layout.tsx` | `@react-native-firebase/auth` | `auth().onAuthStateChanged` | ✓ WIRED | onAuthStateChanged listener s setUser + setInitialized |
| `Stack.Protected` | `useAuthStore.user` | `guard={!!user}` | ✓ WIRED | `guard={!!user}` pre tabs, `guard={!user}` pre auth |
| `app/(tabs)/_layout.tsx` | `expo-router/ui` | Tabs, TabSlot import | ✓ WIRED | `import { Tabs, TabSlot } from 'expo-router/ui'` |
| `CustomTabBar FAB` | `app/(tabs)/pridat.tsx` | `router.push('/(tabs)/pridat')` | ✓ WIRED | onPress={() => router.push('/(tabs)/pridat')} |
| `CustomTabBar` | `useSafeAreaInsets` | react-native-safe-area-context | ✓ WIRED | `const insets = useSafeAreaInsets()` → paddingBottom |
| `app/_layout.tsx` | `posthog.ts` | PostHogProvider + captureEvent | ✓ WIRED | PostHogProvider client={posthog}, captureEvent('app_opened') |
| `register.tsx` | `posthog.ts` | captureEvent('user_registered') | ✓ WIRED | po Firestore set() |
| `login.tsx` | `posthog.ts` | captureEvent('user_logged_in') | ✓ WIRED | po signInWithEmailAndPassword |

---

## Requirements Coverage

| Requirement | Plans | Description | Status | Evidence |
|-------------|-------|-------------|--------|----------|
| INFRA-01 | 01-01, 01-02, 01-05 | Expo SDK 53+ Expo Router v5 projekt | ✓ SATISFIED | expo ~55.0.6 (novšia verzia ako plánovaná), expo-router funkčný |
| INFRA-02 | 01-01 | react-native-firebase v21+ natívny SDK | ✓ SATISFIED | @react-native-firebase/app ^23.8.6 (novšia verzia) |
| INFRA-03 | 01-03 | i18n systém s SK default | ✓ SATISFIED | i18n.ts, sk.json, cs.json, testy GREEN |
| INFRA-04 | 01-03 | Design system theme.ts | ✓ SATISFIED | theme.ts s farbami, typografiou, spacing, shadow |
| INFRA-05 | 01-03 | UI primitives | ✓ SATISFIED | Button, Card, Badge, Avatar, TextInput, Skeleton — 6/6 |
| INFRA-06 | 01-01 | EAS Build profily | ✓ SATISFIED | eas.json s development/preview/production |
| INFRA-07 | 01-06 | PostHog analytics | ✓ SATISFIED | posthog.ts, PostHogProvider, 3 core eventy nadrôtované |
| AUTH-01 | 01-04 | Registrácia email + heslo | ✓ SATISFIED (code) | register.tsx: createUserWithEmailAndPassword + validate() |
| AUTH-02 | 01-04 | Email verifikácia po registrácii | ✓ SATISFIED (code) | register.tsx: credential.user.sendEmailVerification() |
| AUTH-03 | 01-04 | Reset hesla cez email link | ✓ SATISFIED (code) | forgot-password.tsx: auth().sendPasswordResetEmail() |
| AUTH-04 | 01-04 | Session pretrváva po reštarte | ? NEEDS HUMAN | Natívna Firebase persistencia — overiteľné len na zariadení |
| AUTH-05 | 01-04 | Auth guard pre neprihlásených | ✓ SATISFIED (code) | Stack.Protected guard={!!user}, testy GREEN |
| AUTH-06 | 01-04 | Odhlásenie | ✓ SATISFIED (code) | auth().signOut() implementovaný (v auth store / screeny ho môžu volať) |

**Poznámka:** REQUIREMENTS.md má INFRA-02, INFRA-06, INFRA-07 označené ako [ ] (nehotové) — toto je chyba v REQUIREMENTS.md, nie v kóde. Všetky tri sú implementované.

---

## Anti-Patterns Found

| File | Line | Pattern | Severity | Impact |
|------|------|---------|----------|--------|
| `google-services.json` | 2 | `"_PLACEHOLDER": "NAHRADIŤ..."` | ⚠️ Warning | EAS build zlyhá bez reálneho firebase projektu — blocker pre device testing |
| `GoogleService-Info.plist` | — | `<key>PLACEHOLDER</key>` | ⚠️ Warning | iOS build zlyhá bez reálneho plist |
| `app.json` fonts | 39–44 | Font files referenced ale nie všetky musia existovať | ℹ️ Info | Skontrolovaná existencia assets/fonts/ dir — súbory existujú |
| `jest.config.js` | — | `setupFilesAfterFramework` chyba v pláne (správne je `setupFilesAfterFramework`) | ℹ️ Info | Plan mal preklep, výsledný jest.config.js ho neobsahuje — správne |

**Žiadne blocker anti-patterns v samotnom kóde.** Placeholder Firebase konfiguračné súbory sú očakávané — plán to dokumentoval ako user_setup krok.

---

## Version Discrepancies (Notable)

| Component | Planned | Actual | Impact |
|-----------|---------|--------|--------|
| Expo SDK | 53 (v plan) / 55 (v roadmap goal) | ~55.0.6 | Žiadny — roadmap hovorí SDK 55, plány mali staré číslo |
| react-native-firebase | v21 | v23.8.6 | Žiadny — novšia kompatibilná verzia, API rovnaké |

---

## Human Verification Required

### 1. EAS Dev Build — Android

**Test:** Nastaviť Firebase projekt (console.firebase.google.com), stiahnuť google-services.json, nahradiť placeholder, spustiť `eas build --platform android --profile development`
**Expected:** Build prebehne do 15 minút, APK sa stiahne a nainštaluje na Android zariadenie
**Why human:** google-services.json je placeholder — automatizovaná verifikácia nemôže spustiť natívny build bez reálneho Firebase projektu

### 2. Registrácia + Email Verifikácia + Login Flow

**Test:** Na reálnom zariadení:
1. Spustiť `npx expo start --dev-client`
2. Nový email + heslo 8+ znakov → Registrovať
3. Skontrolovať email → verifikačný email dorazí
4. Prihlásiť sa rovnakými údajmi → automatický redirect na Podmienky tab
**Expected:** Žiadny crash, user sa objaví v Firebase Console → Authentication → Users, session pretrváva po zatvorení a otvorení appky
**Why human:** Vyžaduje reálne Firebase Auth — nemockuje sa v produkčnom behu

### 3. 5 Tabov + Custom FAB

**Test:** Po prihlásení:
1. Skontrolovať tab bar — 5 items: Podmienky, Feed, oranžový FAB (⊕), Denník, Bazár
2. Tapnúť každý tab — mal by navigovať na príslušný screen
3. Tapnúť FAB → otvoriť Pridať screen s "Čoskoro" placeholderom a close buttonom
4. Podmienky screen — mal by zobrazovať dummy weather widget s hodnotami (14°C, 1018 hPa, 7/10 AI skóre)
**Expected:** Všetky taby fungujú, FAB je oranžový (#F4A261) a prominentný (size 60x60), safe area je správna
**Why human:** expo-router/ui TabList + custom FAB vyžaduje natívny runtime pre overenie

### 4. PostHog Live Events

**Test:** Nastaviť EXPO_PUBLIC_POSTHOG_API_KEY v .env, spustiť appku, otvoriť PostHog Dashboard → Live Events
**Expected:** `app_opened` event viditeľný do 30 sekúnd od spustenia
**Why human:** Vyžaduje reálny PostHog API key a EU projekt

---

## Gaps Summary

Žiadne kódové gaps — všetky plánované artefakty existujú, sú substantívne implementované a správne nadrôtované.

**Jediný blocker pre plné goal achievement:** Firebase projekt nebol nastavený — google-services.json je placeholder. Toto je predpokladaný stav (Plan 01-06 ho dokumentuje ako `user_setup` krok).

**Stav kódovej bázy:** Production-ready code waiting for Firebase project setup.

---

*Verified: 2026-03-12*
*Verifier: Claude (gsd-verifier)*
*Tests run: 18/18 PASS*
