# Phase 1: Foundation & Auth - Research

**Researched:** 2026-03-12
**Domain:** Expo SDK 53 + Expo Router v5 + react-native-firebase v21 + EAS Build
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- Expo SDK 53 + Expo Router v5 + `@react-native-firebase` v21 (natívny SDK, nie Firebase JS SDK)
- Tab štruktúra: Podmienky / Feed / ⊕ FAB / Denník / Bazár (5 tabov)
- Animated splash → login screen; return user → priamo Podmienky tab (žiadny login screen)
- Auth: oddelené screeny Login + Register, inline chyby (nie toast), reset hesla → vlastný screen
- Dark only — žiadny light mode
- Design system tokeny v `theme.ts` — všetky komponenty používajú tokeny, nie hardcoded hodnoty
- `Stack.Protected` pre auth guard — žiadne manuálne redirecty
- EAS dev build od dňa 1 — Expo Go nestačí pre Firebase native
- Windows development environment — longpaths, Metro package.json exports gotchas
- Zustand (global state: auth, UI, unread) + React Query (server state)
- PostHog analytics inicializovaný v Phase 1
- Farby: Primary `#1B4332`, Mid `#40916C`, Accent `#F4A261`, BG `#0A1628`, Surface `#112240`, SurfaceHigh `#1A2F52`
- Fonty: Outfit (headings), Inter (body), JetBrains Mono (čísla/štatistiky)

### Claude's Discretion
- Animácia splash screenu (typ, trvanie, easing)
- Presné ikonky pre každý tab (výber z knižnice)
- Skeleton loader dizajn pre placeholder screens
- Error screen dizajn (network error, app crash)
- Keyboard avoiding behavior na auth formoch

### Deferred Ideas (OUT OF SCOPE)
- Krátke videá (Reels-štýl) — post-launch feature
- Privlač (spinning) sekcia — v2 milestone
- 6. tab: Komunita — MVP = kategória vo Feede
- Guest mode — zvážiť ak bude nízka konverzia pri registrácii
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| INFRA-01 | Expo SDK 53 + Expo Router v5 projekt beží na Android a iOS (EAS dev build) | SDK 53 setup, eas.json konfigurácia, prebuild proces |
| INFRA-02 | react-native-firebase v21 konfigurovaný pre Firestore, Auth, Storage, FCM | rnfirebase.io inštalačný postup, app.json plugins, google-services.json |
| INFRA-03 | i18n systém (expo-localization + i18n-js) s SK ako default jazykom | expo-localization docs, i18n-js setup pattern |
| INFRA-04 | Design system: theme.ts s farbami, typografiou, spacing, shadow tokenmi | StyleSheet.create pattern, design token architektúra |
| INFRA-05 | Základné UI primitives: Button, Card, Badge, Avatar, BottomSheet, TextInput, skeleton loaders | React Native primitives, Reanimated pre skeleton |
| INFRA-06 | EAS Build konfigurácia (development, preview, production profiles) | eas.json štruktúra, developmentClient: true, distribution: internal |
| INFRA-07 | PostHog analytics inicializovaný s event tracking pre core actions | posthog-react-native inštalácia, PostHogProvider setup |
| AUTH-01 | Používateľ sa vie zaregistrovať cez email a heslo | createUserWithEmailAndPassword, Firestore users dokument |
| AUTH-02 | Používateľ dostane email verifikáciu po registrácii | sendEmailVerification, unverified state handling |
| AUTH-03 | Používateľ vie resetovať heslo cez email link | sendPasswordResetEmail, vlastný reset screen |
| AUTH-04 | Session pretrváva po reštarte appky | react-native-firebase natívna persistence (automatická, bez AsyncStorage) |
| AUTH-05 | Auth guard presmeruje neprihláseného používateľa na login | Stack.Protected guard={!!user}, Zustand auth store |
| AUTH-06 | Používateľ vie sa odhlásiť z ľubovoľnej obrazovky | signOut(), dostupné cez settings/profil |
</phase_requirements>

---

## Summary

Phase 1 stavia greenfield Expo SDK 53 projekt s react-native-firebase (natívny SDK) ako auth + data backend. Kľúčová voľba — natívny Firebase SDK namiesto JS SDK — zjednodušuje perzistenciu (automatická cez iOS Keychain / Android Credential Manager, bez AsyncStorage konfigurácie) a výrazne zlepšuje performance, ale **vyžaduje EAS dev build od prvého dňa** — Expo Go nepodporuje natívne moduly.

Expo SDK 53 prináša New Architecture enabled by default (React Native 0.79 + React 19) a `package.json exports` support v Metro, čo **môže spôsobiť break s niektorými Firebase-related balíčkami**. Kritická mitigation: `unstable_enablePackageExports: false` v metro.config.js alebo prechod na `@react-native-firebase` (nie `@firebase/*` JS SDK). Keďže projekt používa natívny SDK, toto riziko je eliminované.

Tab navigácia s center FAB vyžaduje custom tab layout cez `expo-router/ui` headless komponenty — natívny `Tabs` nepodporuje non-navigating FAB button priamo. FAB sa implementuje ako `Pressable` absolútne pozicionovaný v custom `TabList` komponente.

**Primary recommendation:** Použiť `expo-router/ui` custom tabs pre plnú kontrolu nad FAB dizajnom, `Stack.Protected` pre auth guard bez manuálnych redirectov, a `@react-native-firebase` natívny SDK pre automatickú perzistenciu session bez AsyncStorage boilerplate.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| expo | 53.x | SDK platform | New Architecture default, RN 0.79, React 19 |
| expo-router | 5.x | File-based routing + Stack.Protected | Auth guard, tabs, stack — v jednom |
| @react-native-firebase/app | 21.x | Firebase native init | Natívny SDK, auto persistence, FCM |
| @react-native-firebase/auth | 21.x | Email/password auth | Automatická session persistencia |
| @react-native-firebase/firestore | 21.x | NoSQL databáza | Offline persistence, real-time |
| @react-native-firebase/storage | 21.x | File upload | Fotky, videá |
| @react-native-firebase/messaging | 21.x | Push notifikácie FCM | Natívny, pozadie + foreground |
| zustand | ^5.0 | Global UI state (auth, unread) | Minimálny boilerplate, React 19 compat |
| @tanstack/react-query | ^5.x | Server state + caching | Pozadie refetch, error states |
| expo-dev-client | latest | Dev build runtime | Natívne moduly v development |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| expo-localization | latest | Locale detection | i18n systém, SK default |
| i18n-js | ^4.x | String translations | SK/CZ jazykové mutácie |
| expo-font | latest | Font loading via config plugin | Outfit, Inter, JetBrains Mono |
| expo-splash-screen | latest | Kontrola splash screen | Skrytie po Firebase init |
| expo-build-properties | latest | iOS `useFrameworks: static` | Povinné pre react-native-firebase iOS |
| posthog-react-native | latest | Analytics | Event tracking pre core actions |
| expo-file-system | latest | PostHog peer dep | Povinné |
| expo-application | latest | PostHog peer dep | Povinné |
| expo-device | latest | PostHog peer dep | Povinné |
| react-native-reanimated | ^3.x | Splash animácia, skeleton loaders | Expo SDK 53 includovaný |
| @expo/vector-icons | latest | Tab ikony | SF Symbols (iOS) + Material (Android) |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| @react-native-firebase | Firebase JS SDK v12 | JS SDK má dual package hazard issues v SDK 53 Metro; natívny SDK je rýchlejší a má auto persistenciu |
| i18n-js | i18next + react-i18next | i18next je mocnejší ale heavy; i18n-js stačí pre SK/CZ dvojjazyčnosť |
| expo-router/ui custom tabs | @react-navigation/bottom-tabs | @react-navigation/bottom-tabs neumožňuje FAB bez hackov; expo-router/ui dáva plnú kontrolu |
| expo-router/ui custom tabs | react-native-bottom-tabs (natívny) | Native tabs nedovoľujú custom center FAB button bez iOS/Android native kódu |
| Zustand | Redux Toolkit | Redux je overkill pre auth + UI state; Zustand má 1KB size |

**Installation:**
```bash
# Inicializácia projektu
npx create-expo-app@latest catch-app --template blank-typescript

# Firebase natívny SDK
npx expo install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage @react-native-firebase/messaging

# Expo utilities
npx expo install expo-dev-client expo-build-properties expo-font expo-splash-screen expo-localization expo-file-system expo-application expo-device

# State management
npm install zustand @tanstack/react-query i18n-js

# Analytics
npx expo install posthog-react-native

# EAS CLI (globálne)
npm install -g eas-cli
```

---

## Architecture Patterns

### Recommended Project Structure
```
catch-app/
├── app/
│   ├── _layout.tsx          # Root layout, Firebase init, Stack.Protected, PostHog
│   ├── (auth)/
│   │   ├── _layout.tsx      # Auth stack layout (Stack bez header)
│   │   ├── login.tsx        # Login screen
│   │   ├── register.tsx     # Register screen
│   │   └── forgot-password.tsx
│   └── (tabs)/
│       ├── _layout.tsx      # Custom tab bar s FAB
│       ├── podmienky.tsx    # Tab 1 placeholder
│       ├── feed.tsx         # Tab 2 placeholder
│       ├── pridat.tsx       # Tab 3 — FAB action screen (modal)
│       ├── dennik.tsx       # Tab 4 placeholder
│       └── bazar.tsx        # Tab 5 placeholder
├── src/
│   ├── theme/
│   │   └── theme.ts         # Farby, typografia, spacing tokeny
│   ├── stores/
│   │   ├── auth.store.ts    # Zustand auth state (user, loading, initialized)
│   │   └── ui.store.ts      # Zustand UI state (unread counts, modals)
│   ├── lib/
│   │   ├── firebase.ts      # Firebase app init (singleton)
│   │   └── i18n.ts          # i18n-js konfigurácia
│   ├── components/
│   │   ├── ui/              # Button, Card, Badge, Avatar, TextInput, Skeleton
│   │   └── tabs/            # CustomTabBar, FABButton
│   └── locales/
│       ├── sk.json          # Slovenské stringy
│       └── cs.json          # České stringy
├── assets/
│   └── fonts/               # Outfit, Inter, JetBrains Mono .ttf súbory
├── app.json                 # Expo config + Firebase plugins + font plugin
├── eas.json                 # EAS Build profiles
└── metro.config.js          # Metro config (withNativeWind ak treba)
```

### Pattern 1: Root Layout s Stack.Protected auth guard

`app/_layout.tsx` je centrálny bod — inicializuje Firebase, Zustand auth store, PostHog, a renderuje `Stack.Protected` na základe auth stavu.

```typescript
// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import auth from '@react-native-firebase/auth';
import * as SplashScreen from 'expo-splash-screen';
import { PostHogProvider } from 'posthog-react-native';
import { useAuthStore } from '@/stores/auth.store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { user, setUser, setInitialized, initialized } = useAuthStore();

  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setInitialized(true);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    if (initialized) {
      SplashScreen.hideAsync();
    }
  }, [initialized]);

  if (!initialized) return null; // Splash screen viditeľný

  return (
    <PostHogProvider apiKey="phc_..." options={{ host: 'https://eu.posthog.com' }}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(tabs)" />
        </Stack.Protected>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>
      </Stack>
    </PostHogProvider>
  );
}
```

### Pattern 2: Zustand Auth Store

```typescript
// src/stores/auth.store.ts
import { create } from 'zustand';
import type { FirebaseAuthTypes } from '@react-native-firebase/auth';

interface AuthState {
  user: FirebaseAuthTypes.User | null;
  initialized: boolean;
  setUser: (user: FirebaseAuthTypes.User | null) => void;
  setInitialized: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setUser: (user) => set({ user }),
  setInitialized: (initialized) => set({ initialized }),
}));
```

### Pattern 3: Custom Tab Bar s FAB

Center tab (index 2) nie je navigačný tab — je to FAB button. Používa `expo-router/ui` headless komponenty.

```typescript
// app/(tabs)/_layout.tsx
import { Tabs, TabList, TabTrigger, TabSlot } from 'expo-router/ui';
import { View, Pressable, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '@/theme/theme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const router = useRouter();

  return (
    <Tabs>
      <TabSlot />
      <TabList style={styles.tabList}>
        <TabTrigger name="podmienky" href="/(tabs)/podmienky" style={styles.tab}>
          {({ focused }) => (
            <TabIcon name="cloud-outline" label="Podmienky" focused={focused} />
          )}
        </TabTrigger>
        <TabTrigger name="feed" href="/(tabs)/feed" style={styles.tab}>
          {({ focused }) => (
            <TabIcon name="home-outline" label="Feed" focused={focused} />
          )}
        </TabTrigger>

        {/* Center FAB — nie TabTrigger, nie naviguje */}
        <View style={styles.fabContainer}>
          <Pressable
            style={styles.fab}
            onPress={() => router.push('/(tabs)/pridat')}
          >
            <Ionicons name="add" size={32} color="#0A1628" />
          </Pressable>
        </View>

        <TabTrigger name="dennik" href="/(tabs)/dennik" style={styles.tab}>
          {({ focused }) => (
            <TabIcon name="book-outline" label="Denník" focused={focused} />
          )}
        </TabTrigger>
        <TabTrigger name="bazar" href="/(tabs)/bazar" style={styles.tab}>
          {({ focused }) => (
            <TabIcon name="storefront-outline" label="Bazár" focused={focused} />
          )}
        </TabTrigger>
      </TabList>
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabList: {
    flexDirection: 'row',
    backgroundColor: '#0A1628',
    paddingBottom: 20, // safe area — dopočítať cez useSafeAreaInsets
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#1A2F52',
  },
  tab: { flex: 1, alignItems: 'center' },
  fabContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    marginTop: -20,
  },
  fab: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#F4A261',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(244, 162, 97, 0.4)',
  },
});
```

### Pattern 4: app.json Firebase + Font konfigurácia

```json
{
  "expo": {
    "plugins": [
      "@react-native-firebase/app",
      [
        "expo-build-properties",
        {
          "ios": { "useFrameworks": "static" }
        }
      ],
      [
        "expo-font",
        {
          "fonts": [
            "./assets/fonts/Outfit-Regular.ttf",
            "./assets/fonts/Outfit-SemiBold.ttf",
            "./assets/fonts/Outfit-Bold.ttf",
            "./assets/fonts/Inter-Regular.ttf",
            "./assets/fonts/Inter-Medium.ttf",
            "./assets/fonts/JetBrainsMono-Regular.ttf"
          ]
        }
      ]
    ],
    "android": {
      "googleServicesFile": "./google-services.json",
      "package": "sk.catchapp.app"
    },
    "ios": {
      "googleServicesFile": "./GoogleService-Info.plist",
      "bundleIdentifier": "sk.catchapp.app"
    }
  }
}
```

### Pattern 5: EAS Build konfigurácia

```json
// eas.json
{
  "cli": { "version": ">= 16.0.0" },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "android": { "buildType": "apk" },
      "ios": { "simulator": false }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### Pattern 6: i18n setup (SK default)

```typescript
// src/lib/i18n.ts
import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';
import sk from '@/locales/sk.json';
import cs from '@/locales/cs.json';

export const i18n = new I18n({ sk, cs });

// SK ako default, fallback na SK pre neznáme lokalizácie
i18n.locale = Localization.getLocales()[0]?.languageCode ?? 'sk';
i18n.enableFallback = true;
i18n.defaultLocale = 'sk';
```

### Pattern 7: theme.ts design system

```typescript
// src/theme/theme.ts
export const theme = {
  colors: {
    primary: '#1B4332',
    primaryMid: '#40916C',
    accent: '#F4A261',
    accentBlue: '#1E6091',
    bg: '#0A1628',
    surface: '#112240',
    surfaceHigh: '#1A2F52',
    textPrimary: '#F8F9FA',
    textSecondary: '#9CA3AF',
    textMuted: '#6B7280',
    error: '#EF4444',
    success: '#22C55E',
    tabActive: '#40916C',
    tabInactive: '#6B7280',
  },
  typography: {
    heading: { fontFamily: 'Outfit-Bold' },
    headingSemi: { fontFamily: 'Outfit-SemiBold' },
    body: { fontFamily: 'Inter-Regular' },
    bodyMedium: { fontFamily: 'Inter-Medium' },
    mono: { fontFamily: 'JetBrainsMono-Regular' },
  },
  spacing: {
    xs: 4, sm: 8, md: 16, lg: 24, xl: 32, xxl: 48,
  },
  radius: {
    sm: 8, md: 12, lg: 16, xl: 24, full: 999,
  },
  shadow: {
    sm: '0 1px 3px rgba(0,0,0,0.3)',
    md: '0 4px 12px rgba(0,0,0,0.4)',
    accent: '0 4px 12px rgba(244,162,97,0.4)',
  },
} as const;
```

### Anti-Patterns to Avoid

- **`useFonts` async loading:** Spôsobí FOUC (flash of unstyled content) a vyžaduje loading state. Použiť `expo-font` config plugin — fonty sú embedded pri build time.
- **Firebase JS SDK (`@firebase/*`) namiesto natívneho SDK:** Na SDK 53 spôsobí "dual package hazard" v Metro keď je `package.json exports` enabled. Natívny SDK tento problém nemá.
- **`Tabs` z expo-router pre FAB:** Štandardný `<Tabs>` z expo-router nepodporuje non-navigating center button natívne. Použiť `expo-router/ui` headless Tabs.
- **Manuálne `router.push('/login')` v useEffect:** Stack.Protected eliminuje potrebu manuálnych redirectov. Keď sa `guard` zmení, router automaticky presmeruje.
- **`@react-navigation/stack` (JS stack):** Použiť natívny stack (default v expo-router). JS stack beží na JS threade — animácie jerky.
- **Hardcoded farby v komponentoch:** Všetky komponenty importujú z `theme.ts`. Nikdy `color: '#40916C'` priamo v StyleSheet.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Auth session persistencia | Custom AsyncStorage + token refresh logic | `@react-native-firebase/auth` native persistence | iOS Keychain / Android Credential Manager — automatické, šifrované, app restart safe |
| Firebase init singleton | Vlastný singleton pattern s lazy init | `@react-native-firebase/app` — auto-init z google-services.json | RNFirebase sa inicializuje automaticky pri startup z native config, žiadny `initializeApp()` call |
| Tab bar safe area padding | Manuálny výpočet `paddingBottom` | `useSafeAreaInsets()` z `react-native-safe-area-context` | Rôzne zariadenia (notch, punch-hole, home bar) — manuálny výpočet nikdy nie je správny |
| Font loading state | `if (!fontsLoaded) return null` + loading screen | `expo-font` config plugin (build-time embed) | Fonty dostupné pri launch, žiadny async loading state |
| Route protection | `useEffect` s `router.replace('/login')` | `Stack.Protected guard={!!user}` | Deklaratívne, race-condition free, žiadny flickering |
| i18n plural forms | Vlastná pluralizácia `(count === 1 ? 'ryba' : 'ryby')` | `i18n.t('fish', { count })` s plural rules | Slovenčina má 3 plural formy (1/2-4/5+) — i18n-js to rieši automaticky |

**Key insight:** react-native-firebase natívny SDK robí Firebase init + persistenciu automaticky na native strane — žiadny JS boilerplate. EAS Build vygeneneruje app s google-services.json zabudovaným v APK/IPA.

---

## Common Pitfalls

### Pitfall 1: Expo Go vs Dev Build confusion
**What goes wrong:** Developer spustí `npx expo start` a otvorí Expo Go na telefóne — Firebase moduly sa nenačítajú, app crashuje alebo Firebase nefunguje.
**Why it happens:** Expo Go je precompilovaný runtime bez natívnych Firebase modulov.
**How to avoid:** `eas build --platform android --profile development` a nainštalovať APK na zariadenie. Potom `npx expo start` — dev build sa pripojí na Metro bundler.
**Warning signs:** "NativeModule: RNFirebaseApp is null" error v konzolioli.

### Pitfall 2: Metro package.json exports + Firebase JS SDK conflict
**What goes wrong:** Import z `@firebase/*` hodí "dual package hazard" warning alebo module not found error.
**Why it happens:** SDK 53 Metro má `package.json exports` enabled by default — niektoré Firebase packages majú nekompatibilné `exports` field.
**How to avoid:** Projekt používa `@react-native-firebase` (natívny SDK) — tento problém sa netýka. Ak by sa niekto pokúsil pridať `firebase` JS SDK, je potrebné `unstable_enablePackageExports: false` v metro.config.js.
**Warning signs:** "The package firebase attempted to import the Node standard library module 'stream'" alebo similar.

### Pitfall 3: iOS useFrameworks static chýba
**What goes wrong:** iOS build failuje s "Undefined symbols" alebo Firebase modules sa nenačítajú.
**Why it happens:** firebase-ios-sdk vyžaduje `use_frameworks! :linkage => :static` v Podfile. Bez `expo-build-properties` plugin s `useFrameworks: static` toto nie je nastavené.
**How to avoid:** Vždy pridať do `app.json`:
```json
["expo-build-properties", { "ios": { "useFrameworks": "static" } }]
```
**Warning signs:** Build error obsahujúci "FirebaseCoreInternal" alebo "use_frameworks".

### Pitfall 4: Windows path length limit (260 chars)
**What goes wrong:** `npm install` alebo gradle build failuje s ENOTSUP alebo path too long error.
**Why it happens:** React Native node_modules majú hlboké vnorenie — Windows 260-char limit sa prekročí.
**How to avoid:** Pred začatím projektu spustiť v admin PowerShell:
```powershell
New-ItemProperty -Path "HKLM:\SYSTEM\CurrentControlSet\Control\FileSystem" -Name "LongPathsEnabled" -Value 1 -PropertyType DWORD -Force
```
Aj git longpaths: `git config --global core.longpaths true`. Reštart po zmene registra.
**Warning signs:** ENOTSUP, ENAMETOOLONG, alebo "path too long" error počas install.

### Pitfall 5: onAuthStateChanged race condition na splash
**What goes wrong:** Splash screen sa schová skôr ako Firebase dokončí auth check — user vidí login screen na zlomok sekundy aj keď je prihlásený.
**Why it happens:** `initialized` state nie je nastavený predtým ako sa splash schová.
**How to avoid:** `SplashScreen.preventAutoHideAsync()` na top-level. `SplashScreen.hideAsync()` volať až keď `initialized === true` (po prvom `onAuthStateChanged` callback). Kým `initialized === false`, root layout renderuje `null` — splash ostáva viditeľný.
**Warning signs:** Blikanie login screenu pri spustení pre prihláseného usera.

### Pitfall 6: Stack.Protected guard blikanie (flickering)
**What goes wrong:** Auth state sa inicializuje neskoro — user vidí protected content na zlomok sekundy.
**Why it happens:** React render prebehne pred `onAuthStateChanged` callback.
**How to avoid:** Kombinácia `initialized` flag + `if (!initialized) return null` v root layout zabráni akémukoľvek renderovaniu pred dokončením Firebase auth check.
**Warning signs:** Flash of wrong screen pri app startup.

### Pitfall 7: React 19 peer dependency conflicts
**What goes wrong:** `npm install` vypíše peer dependency warnings pre niektoré knižnice.
**Why it happens:** SDK 53 používa React 19 — staršie knižnice deklarujú `peerDependencies: { "react": "^18" }`.
**How to avoid:** Použiť `overrides` v package.json:
```json
{
  "overrides": {
    "react": "19.0.0",
    "react-dom": "19.0.0"
  }
}
```
**Warning signs:** Multiple React instances warnings, hook errors.

---

## Code Examples

### Auth: Login s email/heslo a inline error handling

```typescript
// app/(auth)/login.tsx
import auth from '@react-native-firebase/auth';
import { useState } from 'react';
import { View, TextInput, Pressable, Text, StyleSheet } from 'react-native';
import { theme } from '@/theme/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({});
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    setErrors({});
    if (!email) { setErrors(e => ({ ...e, email: 'Email je povinný' })); return; }
    if (!password) { setErrors(e => ({ ...e, password: 'Heslo je povinné' })); return; }

    setLoading(true);
    try {
      await auth().signInWithEmailAndPassword(email, password);
      // Stack.Protected automaticky presmeruje na (tabs)
    } catch (e: any) {
      const code = e.code;
      if (code === 'auth/invalid-credential' || code === 'auth/user-not-found') {
        setErrors({ general: 'Nesprávny email alebo heslo' });
      } else if (code === 'auth/too-many-requests') {
        setErrors({ general: 'Príliš veľa pokusov. Skúste neskôr.' });
      } else {
        setErrors({ general: 'Prihlásenie zlyhalo. Skúste znova.' });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      {errors.general && <Text style={styles.errorGeneral}>{errors.general}</Text>}
      <TextInput
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={[styles.input, errors.email && styles.inputError]}
        placeholderTextColor={theme.colors.textMuted}
        placeholder="Email"
      />
      {errors.email && <Text style={styles.errorInline}>{errors.email}</Text>}
      <TextInput
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={[styles.input, errors.password && styles.inputError]}
        placeholderTextColor={theme.colors.textMuted}
        placeholder="Heslo"
      />
      {errors.password && <Text style={styles.errorInline}>{errors.password}</Text>}
      <Pressable onPress={handleLogin} disabled={loading} style={styles.button}>
        <Text style={styles.buttonText}>{loading ? 'Prihlasovanie…' : 'Prihlásiť sa'}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg, padding: theme.spacing.lg, gap: theme.spacing.sm },
  input: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    padding: theme.spacing.md,
    color: theme.colors.textPrimary,
    borderWidth: 1,
    borderColor: theme.colors.surfaceHigh,
    ...theme.typography.body,
  },
  inputError: { borderColor: theme.colors.error },
  errorInline: { color: theme.colors.error, fontSize: 13, ...theme.typography.body },
  errorGeneral: {
    color: theme.colors.error,
    backgroundColor: 'rgba(239,68,68,0.1)',
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    borderCurve: 'continuous',
    ...theme.typography.body,
  },
  button: {
    backgroundColor: theme.colors.accent,
    borderRadius: theme.radius.md,
    borderCurve: 'continuous',
    padding: theme.spacing.md,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonText: { color: theme.colors.bg, fontWeight: '700', ...theme.typography.bodyMedium },
});
```

### Auth: Register s email verifikáciou

```typescript
// app/(auth)/register.tsx — kľúčové časti
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

async function handleRegister() {
  const cred = await auth().createUserWithEmailAndPassword(email, password);

  // Email verifikácia
  await cred.user.sendEmailVerification();

  // Vytvoriť users dokument v Firestore
  await firestore().collection('users').doc(cred.user.uid).set({
    uid: cred.user.uid,
    email: cred.user.email,
    displayName: '',
    avatarUrl: null,
    createdAt: firestore.FieldValue.serverTimestamp(),
    catchCount: 0,
    totalWeight: 0,
    karma: 0,
    isPremium: false,
  });
  // Stack.Protected presmeruje automaticky
}
```

### Firebase init pre react-native-firebase

```typescript
// src/lib/firebase.ts
// react-native-firebase sa auto-inicializuje z google-services.json / GoogleService-Info.plist
// ŽIADNY initializeApp() call nie je potrebný
// Importy priamo z modulov:
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';

export { auth, firestore, storage };
// Tento súbor existuje len kvôli centralizovaným importom
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Firebase JS SDK v9+ v RN | `@react-native-firebase` natívny SDK | SDK 53 + Metro exports | Eliminuje dual package hazard, lepší výkon |
| `useFonts` async loading | `expo-font` config plugin (build-time) | Expo SDK 50+ | Žiadny FOUC, žiadny loading state |
| Manual auth redirects v `useEffect` | `Stack.Protected guard` | Expo Router v3+ | Deklaratívne, race-condition free |
| `@react-navigation/stack` (JS) | `@react-navigation/native-stack` (natívny, default v expo-router) | React Navigation v6 | Native performance, UI thread animácie |
| `LinearGradient` knižnica | `experimental_backgroundImage: 'linear-gradient(...)'` | RN 0.76+ | Native CSS gradient, bez externej knižnice |
| `elevation` / `shadowColor` objekt | `boxShadow: '0 2px 8px rgba(...)'` | RN 0.76+ | CSS syntax, konzistentné iOS+Android |
| `TouchableOpacity` | `Pressable` | RN 0.64+ | Lepší ripple, iOS press animation |
| `@react-navigation/bottom-tabs` (JS) | `expo-router/ui` headless Tabs | Expo Router v4+ | Custom FAB button bez hackov |

**Deprecated/outdated:**
- `expo-background-fetch`: Nahradené `expo-background-task` od SDK 53
- `Tabs` z expo-router pre custom tab bar: Stále funguje, ale `expo-router/ui` dáva plnú kontrolu
- `getReactNativePersistence` + AsyncStorage: Nie je potrebné s `@react-native-firebase` — natívna persistencia automatická

---

## Open Questions

1. **react-native-firebase v21 vs aktuálna verzia**
   - What we know: Projekt deklaruje v21. Dokumentácia rnfirebase.io odkazuje na migračné guides do v22, v23, v24 — čo naznačuje že aktuálna verzia môže byť vyššia.
   - What's unclear: Presná kompatibilita v21 s Expo SDK 53 + New Architecture. GitHub issues #8487 zmieňuje SDK 53 auth problémy.
   - Recommendation: Overiť `npm info @react-native-firebase/app version` pred inštaláciou. Ak je v21 outdated, použiť latest a poznamenať do STATE.md.

2. **Android edge-to-edge padding pre tab bar**
   - What we know: SDK 53 má Android edge-to-edge enabled by default. `paddingBottom` pre tab bar musí byť dynamický cez `useSafeAreaInsets().bottom`.
   - What's unclear: Presné správanie na rôznych Android zariadeniach (gesture nav vs 3-button nav).
   - Recommendation: Implementovať `const insets = useSafeAreaInsets(); paddingBottom: insets.bottom + 8` v tab bar styles.

3. **PostHog EU vs US instance**
   - What we know: GDPR compliance pre SK/CZ užívateľov. PostHog EU instance = `https://eu.posthog.com`.
   - What's unclear: Nie je jasné či projekt má EU region.
   - Recommendation: Použiť EU instance (`host: 'https://eu.posthog.com'`) pre GDPR compliance. Vytvoriť PostHog projekt na eu.posthog.com.

---

## Validation Architecture

> nyquist_validation nie je explicitne false — sekcia je zahrnutá.

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Žiadny detekovaný — greenfield projekt |
| Config file | none — Wave 0 task |
| Quick run command | `npx jest --testPathPattern="auth" --passWithNoTests` |
| Full suite command | `npx jest --passWithNoTests` |

**Note:** Pre React Native + Expo je odporúčané `jest-expo` preset. E2E testy cez Maestro (cross-platform, YAML DSL, funguje s EAS dev buildom).

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| AUTH-01 | createUserWithEmailAndPassword vytvorí usera | unit (mock Firebase) | `npx jest tests/auth.test.ts -t "register"` | ❌ Wave 0 |
| AUTH-02 | sendEmailVerification sa zavolá po registrácii | unit (mock Firebase) | `npx jest tests/auth.test.ts -t "email verification"` | ❌ Wave 0 |
| AUTH-03 | sendPasswordResetEmail sa zavolá | unit (mock Firebase) | `npx jest tests/auth.test.ts -t "reset password"` | ❌ Wave 0 |
| AUTH-04 | Session pretrvá (natívna persistencia) | manual-only | N/A — vyžaduje reálny device restart | manual |
| AUTH-05 | Stack.Protected presmeruje neprihlásených | integration (render test) | `npx jest tests/auth-guard.test.tsx` | ❌ Wave 0 |
| AUTH-06 | signOut() odhlási usera | unit (mock Firebase) | `npx jest tests/auth.test.ts -t "sign out"` | ❌ Wave 0 |
| INFRA-01 | App sa spustí bez crashu | manual (EAS dev build) | N/A — vyžaduje device | manual |
| INFRA-04 | theme.ts exportuje správne tokeny | unit | `npx jest tests/theme.test.ts` | ❌ Wave 0 |
| INFRA-07 | PostHog capture je callable | unit (mock PostHog) | `npx jest tests/analytics.test.ts` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npx jest --passWithNoTests --testPathPattern="auth|theme|analytics"`
- **Per wave merge:** `npx jest --passWithNoTests`
- **Phase gate:** Full suite green + manuálne overenie EAS dev buildu na Android zariadení

### Wave 0 Gaps
- [ ] `jest.config.js` — `jest-expo` preset konfigurácia
- [ ] `tests/auth.test.ts` — Auth unit testy s Firebase mock
- [ ] `tests/auth-guard.test.tsx` — Stack.Protected render test
- [ ] `tests/theme.test.ts` — theme.ts token validácia
- [ ] `tests/analytics.test.ts` — PostHog mock test
- [ ] `__mocks__/@react-native-firebase/` — Firebase mock pre jest
- [ ] Framework install: `npx expo install jest-expo @types/jest` + `npm install --save-dev @testing-library/react-native`

---

## Sources

### Primary (HIGH confidence)
- https://expo.dev/changelog/sdk-53 — SDK 53 release notes, New Architecture, breaking changes
- https://docs.expo.dev/router/advanced/protected/ — Stack.Protected auth guard pattern
- https://rnfirebase.io/auth/usage — react-native-firebase auth, auto persistence, onAuthStateChanged
- https://docs.expo.dev/develop/development-builds/create-a-build/ — EAS dev build setup
- https://expo.dev/blog/how-to-build-custom-tabs-with-expo-router-ui — Custom tabs s FAB pattern

### Secondary (MEDIUM confidence)
- https://posthog.com/docs/libraries/react-native — PostHog RN setup
- https://oss.callstack.com/react-native-bottom-tabs/ — Native tabs vs custom tabs
- https://medium.com/@lawrencenorman7hills/upgrading-from-expo-sdk-52-to-sdk-53 — Firebase JS SDK migration, dual package hazard

### Tertiary (LOW confidence)
- GitHub issues #8487 react-native-firebase SDK 53 auth — neoverená kompatibilita v21 vs latest
- Medium: Native Firebase SDK Integration in 2026 — inštalačné kroky (čiastočne overené)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — overené cez expo.dev changelog, rnfirebase.io official docs
- Architecture: HIGH — Stack.Protected pattern z officiálnej Expo dokumentácie, FAB pattern z Expo blog
- Pitfalls: HIGH — overené cez GitHub issues (dual package hazard, iOS useFrameworks, Windows longpaths)
- i18n: MEDIUM — i18n-js pattern overený cez expo-localization docs, presný API v i18n-js v4 neoverený cez Context7

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (Expo SDK stable, react-native-firebase stable — 30 dní)
