# CATCH App — Technology Stack Research
**Status:** Complete
**Date:** 2026-03-12
**Scope:** React Native + Expo + Firebase stack for SK/CZ fishing companion app

---

## Executive Summary

The CATCH app should be built on **Expo SDK 53** with **Expo Router v5**, using **react-native-firebase v21/v22** (not the JS SDK) as the primary Firebase integration layer due to native module performance requirements (FCM push, Firestore real-time, Storage uploads). Zustand v5 is the correct state management choice for 2025. Open-Meteo is strictly superior to OpenWeatherMap for this use case — free, no key needed, excellent Central European model coverage. RevenueCat works with Expo 52/53 but requires a development build and has a known fontFamily crash fixed in v8.9.2+. Use FlashList everywhere for lists, expo-image for images, and stick with react-native-maps (not the new expo-maps alpha) for production.

---

## 1. Expo SDK Version

### Recommendation: Expo SDK 53 (stable as of April 2025)
**Confidence: High**

| Component | Version |
|-----------|---------|
| Expo SDK | 53 |
| React Native | 0.79 |
| React | 19.0.0 |
| React Native Web | 0.20.0 |
| Expo Router | v5 |
| Node.js minimum | 20 (Node 18 is EOL) |
| TypeScript | ~5.8.3 |

### Key changes SDK 51 → 53 (cumulative)

**SDK 52 (intermediate):**
- `expo-av` Video component deprecated → replaced by `expo-video`
- New Architecture available but opt-in
- Push notifications deprecated in Expo Go for Android
- React Native 0.76

**SDK 53 (current stable):**
- **New Architecture enabled by default** — JSI/TurboModules/Fabric. All libraries used must be New Architecture compatible. This is the single biggest change.
- `expo-av` Audio API deprecated → replaced by `expo-audio`
- `expo-background-fetch` → replaced by `expo-background-task`
- Edge-to-edge Android layout enabled by default
- Package.json `exports` field supported by default in Metro
- JavaScriptCore (JSC) deprecated — Hermes is now the only engine
- React 19 (includes breaking changes — no more `forwardRef` needed, Actions, `use()` hook)
- Push notifications completely removed from Expo Go on Android — **development builds mandatory from day one**

### Gotcha: New Architecture + third-party libs
Before using any library, verify New Architecture (Fabric/TurboModules) compatibility. The main offenders for CATCH:
- RevenueCat `react-native-purchases-ui` had issues → fixed in v8.9.2
- Some older community libs for map clustering are not compatible
- Firebase via react-native-firebase: v21+ supports New Architecture

### Windows-specific gotchas
- You cannot run iOS simulator on Windows — all iOS testing requires EAS Build (cloud) or a physical device via Expo Go / dev build
- `watchman` does not support Windows — Metro uses a polling file watcher instead, which is slower. Set `EXPO_USE_FAST_RESOLVER=1` in `.env.local`
- Symlinks can cause issues on Windows — run terminal as Administrator or enable Developer Mode (Settings → For Developers)
- Line endings: configure `.gitattributes` with `* text=auto eol=lf` to prevent CRLF issues in bash scripts
- `eas build` works perfectly from Windows — all iOS/Android builds run in cloud on Expo's Linux machines
- Android emulator works natively on Windows with Android Studio

---

## 2. Expo Router v5 — File-Based Routing

### Recommendation: Expo Router v5 with typed routes
**Confidence: High**

Expo Router v5 ships with SDK 53. It builds on React Navigation 7 under the hood.

### Recommended directory structure for CATCH

```
src/app/
  _layout.tsx                    # Root layout — providers, auth guard
  +not-found.tsx                 # 404 handler

  (auth)/                        # Auth group — no tab bar
    _layout.tsx                  # Stack navigator
    login.tsx
    register.tsx

  (tabs)/                        # Main app — tab bar visible
    _layout.tsx                  # Tabs navigator definition
    index.tsx                    # Tab 1: Denník (catch log)
    mapa.tsx                     # Tab 2: Mapa revírov
    komunita.tsx                 # Tab 3: Fórum
    bazar.tsx                    # Tab 4: Bazár
    profil.tsx                   # Tab 5: Profil

  catch/
    new.tsx                      # New catch form (modal)
    [id].tsx                     # Catch detail

  spot/
    [id].tsx                     # Revír detail

  post/
    [id].tsx                     # Forum post detail
    new.tsx

  listing/
    [id].tsx                     # Bazár inzerát detail
    new.tsx

  chat/
    [conversationId].tsx         # In-app chat
```

### Root layout pattern (auth guard)

```tsx
// app/_layout.tsx
import { useAuth } from '@/stores/authStore'
import { Stack } from 'expo-router'
import { Stack.Protected } from 'expo-router'  // v5 new feature

export default function RootLayout() {
  const { user, loading } = useAuth()

  return (
    <Stack>
      <Stack.Protected guard={!!user}>
        {/* Only accessible when logged in */}
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack.Protected>
      <Stack.Screen name="(auth)" options={{ headerShown: false }} />
    </Stack>
  )
}
```

### v5 new features relevant to CATCH
- **`Stack.Protected`** — built-in auth protection without manual redirects
- **`anchor` prop** — replaces deprecated `initialRouteName`
- **React 19 `use()` hook** — use for context-based auth state
- **Human-readable stack traces** — significantly better debugging DX

### What NOT to use
- Do NOT use React Navigation directly alongside Expo Router — they conflict
- Do NOT use `react-navigation/native-stack` — Expo Router wraps it; use `<Stack>` from `expo-router`
- Do NOT put business logic in `_layout.tsx` files — keep them as pure navigation shells

---

## 3. Firebase SDK Strategy

### Recommendation: react-native-firebase (NOT the JS SDK)
**Confidence: High**

| Package | Version |
|---------|---------|
| `@react-native-firebase/app` | v21.x (latest stable) |
| `@react-native-firebase/auth` | same |
| `@react-native-firebase/firestore` | same |
| `@react-native-firebase/storage` | same |
| `@react-native-firebase/messaging` | same |
| `@react-native-firebase/functions` | same |

**Current stable: v21.x.** v22 is in development and removes the namespaced API entirely — use modular API from day one.

### Why react-native-firebase over Firebase JS SDK

| Factor | react-native-firebase | Firebase JS SDK |
|--------|----------------------|-----------------|
| Performance | Native (C++) Firestore SDK | JS implementation |
| Real-time listeners | Rock solid on mobile | Reconnect issues in background |
| FCM push | Full native support | Requires separate setup |
| Offline persistence | Native, reliable | JS-based, less reliable |
| New Architecture | v21+ supported | Always works (pure JS) |
| Bundle size | Native code, no JS overhead | Adds ~300KB+ to JS bundle |
| Auth persistence | Native Keychain/Keystore | AsyncStorage needed |
| Expo Managed | YES — config plugins available | YES |

### Expo managed workflow setup

```bash
npx expo install @react-native-firebase/app @react-native-firebase/auth \
  @react-native-firebase/firestore @react-native-firebase/storage \
  @react-native-firebase/messaging @react-native-firebase/functions
```

Config plugins exist for: `app`, `auth`, `crashlytics`, `messaging`. Add to `app.json`:

```json
{
  "plugins": [
    "@react-native-firebase/app",
    "@react-native-firebase/messaging"
  ]
}
```

### Modular API — use from day one (v22-ready)

```typescript
// CORRECT — modular import (v22 compatible)
import { getFirestore, collection, query, where, onSnapshot } from
  '@react-native-firebase/firestore'

// WRONG — namespaced API (deprecated, removed in v22)
import firestore from '@react-native-firebase/firestore'
firestore().collection('catches').where(...)
```

### Firestore data access pattern for CATCH

```typescript
// lib/firebase.ts
import { getApp } from '@react-native-firebase/app'
import { getFirestore } from '@react-native-firebase/firestore'
import { getAuth } from '@react-native-firebase/auth'
import { getStorage } from '@react-native-firebase/storage'

export const db = getFirestore(getApp())
export const auth = getAuth(getApp())
export const storage = getStorage(getApp())
```

### Gotchas
- Never use Expo Go for testing Firebase — always use development builds
- `@react-native-firebase/messaging` requires `google-services.json` (Android) and `GoogleService-Info.plist` (iOS) — EAS Secrets handles these securely
- FCM on Android in Expo Go was removed in SDK 52/53 — dev build required

---

## 4. Zustand v5 — Global State

### Recommendation: Zustand v5 (latest)
**Confidence: High**

| Package | Version |
|---------|---------|
| `zustand` | v5.x (^5.0.0) |
| `@react-native-async-storage/async-storage` | ^2.x (for persist) |

### Why v5 over v4
- Zustand v5 is stable and the current major version as of 2024/2025
- React 19 compatibility built-in (uses `useSyncExternalStore`)
- No additional config for React Native New Architecture
- Cleaner TypeScript types

### v4 → v5 breaking changes (gotchas)

1. **Persist middleware — initial state no longer auto-written.** If you relied on initial state being saved to AsyncStorage on store creation, you must now call the persist API explicitly.

2. **Selector stability — `useShallow` required for object selectors:**
```typescript
// v4 — worked but was inconsistent
const { user, setUser } = useAuthStore(state => ({ user: state.user, setUser: state.setUser }))

// v5 CORRECT — use useShallow to prevent infinite re-renders
import { useShallow } from 'zustand/react/shallow'
const { user, setUser } = useAuthStore(useShallow(state => ({ user: state.user, setUser: state.setUser })))
```

3. **Min React 18** — not a concern since Expo SDK 53 uses React 19.

### Store architecture for CATCH

```
stores/
  authStore.ts       # user, session, loading
  catchStore.ts      # local draft catch (form state)
  filterStore.ts     # map filters, community filters
  uiStore.ts         # modals, toasts, bottomSheet state
```

### Persist store example (v5)

```typescript
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import AsyncStorage from '@react-native-async-storage/async-storage'

interface AuthStore {
  userId: string | null
  isPremium: boolean
  setUser: (id: string) => void
  clearUser: () => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      userId: null,
      isPremium: false,
      setUser: (id) => set({ userId: id }),
      clearUser: () => set({ userId: null, isPremium: false }),
    }),
    {
      name: 'catch-auth',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
)
```

### Alternative: MMKV for persist (performance upgrade)
For stores that are read very frequently (e.g., theme, filters), `react-native-mmkv` is 10x faster than AsyncStorage. Install `zustand-mmkv-storage` for the bridge. Trade-off: requires native build (no Expo Go).

### What NOT to use
- Redux / Redux Toolkit — too verbose for this app's needs
- Jotai — great but less suited for complex auth + nested state
- Context API for global state — causes unnecessary re-renders at scale

---

## 5. TanStack Query v5 + Firestore

### Recommendation: TanStack Query v5 + invertase/tanstack-query-firebase
**Confidence: High**

| Package | Version |
|---------|---------|
| `@tanstack/react-query` | v5.x |
| `@tanstack/react-query-devtools` | v5.x (dev only) |
| `@invertase/tanstack-query-firebase` | latest |

### Architecture: Zustand vs React Query — what goes where

| State Type | Tool | Example |
|------------|------|---------|
| Server data (cached) | React Query | catches list, spots, posts |
| Real-time subscriptions | React Query (manual) | chat messages, new catches |
| Auth user | Zustand (persist) | userId, isPremium |
| UI state | Zustand | modals, filters, draft forms |
| Form state | React Hook Form | catch form, listing form |

### Real-time Firestore pattern with React Query v5

```typescript
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { collection, onSnapshot, query, where, orderBy } from
  '@react-native-firebase/firestore'
import { db } from '@/lib/firebase'

// Real-time subscription via useQuery
export function useCatches(userId: string) {
  const queryClient = useQueryClient()

  return useQuery({
    queryKey: ['catches', userId],
    queryFn: () =>
      new Promise<Catch[]>((resolve, reject) => {
        const q = query(
          collection(db, 'catches'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc')
        )
        // Fire once for initial data
        const unsubscribe = onSnapshot(q,
          (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }) as Catch)
            // Update cache on every snapshot
            queryClient.setQueryData(['catches', userId], data)
            resolve(data)
          },
          reject
        )
        // Return cleanup — React Query doesn't support this natively,
        // manage via useEffect separately for long-lived subscriptions
      }),
    staleTime: Infinity,  // Data is always fresh (managed by Firestore listener)
    gcTime: 1000 * 60 * 10, // Keep in cache 10 minutes
  })
}
```

### invertase/tanstack-query-firebase
The official integration library from the RNFirebase team provides pre-built hooks:
```typescript
import { useFirestoreQuery } from '@invertase/tanstack-query-firebase/firestore'
```
Handles subscription lifecycle automatically. Use this for standard CRUD collections.

### Pagination (catches feed, forum)

```typescript
// Cursor-based pagination with Firestore + React Query
import { useInfiniteQuery } from '@tanstack/react-query'
import { getDocs, startAfter, limit } from '@react-native-firebase/firestore'

export function useInfinitePosts() {
  return useInfiniteQuery({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      // pageParam is the last document snapshot
      const q = pageParam
        ? query(collection(db, 'posts'), orderBy('createdAt', 'desc'), startAfter(pageParam), limit(20))
        : query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20))
      const snap = await getDocs(q)
      return snap
    },
    getNextPageParam: (lastPage) =>
      lastPage.docs.length === 20 ? lastPage.docs[lastPage.docs.length - 1] : undefined,
    initialPageParam: null,
  })
}
```

### QueryClient setup (React Native optimized)

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,  // 5 min stale
      gcTime: 1000 * 60 * 30,    // 30 min cache
      refetchOnWindowFocus: false,  // Mobile — no "window focus" concept
      refetchOnReconnect: true,
    },
  },
})
```

---

## 6. RevenueCat — In-App Subscriptions

### Recommendation: react-native-purchases v8.9.2+
**Confidence: High (with known caveats)**

| Package | Version |
|---------|---------|
| `react-native-purchases` | ^8.9.2 |
| `react-native-purchases-ui` | ^8.9.2 |

### Installation (Expo managed)

```bash
npx expo install react-native-purchases react-native-purchases-ui
```

Then add to `app.json`:
```json
{
  "plugins": ["react-native-purchases"]
}
```

**Mandatory: Requires development build. Cannot run in Expo Go.**

### Known gotchas

1. **New Architecture crash (fontFamily)** — Expo 52 + React Native 0.76.x + `react-native-purchases-ui` crashed when passing `fontFamily` options on Android. **Fixed in v8.9.2.** Always use v8.9.2+.

2. **`react-native-purchases-ui` is not yet a full TurboModule** — New Architecture support is partial. Workaround if issues arise: disable New Architecture for the paywall screen via conditional rendering, or use a custom paywall UI instead of the pre-built one.

3. **Always rebuild after install** — Hot reload does not pick up native code changes. After adding RevenueCat, you must run a full EAS build or local Android build.

4. **Purchases.configure() must be called before any other RC call** — call it in the root `_layout.tsx` or app entry point, outside of any component tree.

5. **Sandbox testing on iOS** — requires physical device with sandbox Apple ID, not simulator. For Android, use Google Play test accounts.

### Initialization pattern

```typescript
// app/_layout.tsx
import Purchases from 'react-native-purchases'
import { Platform } from 'react-native'

const RC_API_KEY = Platform.OS === 'ios'
  ? process.env.EXPO_PUBLIC_RC_IOS_KEY!
  : process.env.EXPO_PUBLIC_RC_ANDROID_KEY!

Purchases.configure({ apiKey: RC_API_KEY })
```

### CATCH monetization setup
- Free tier: 3 active listings, no AI predictions
- Premium (€1/month): unlimited listings + AI predictions
- Single product: `catch_premium_monthly` — Monthly Subscription, €0.99/month (Apple rounds to €0.99)
- Entitlement: `premium`

---

## 7. Weather API — Open-Meteo vs OpenWeatherMap

### Recommendation: Open-Meteo (primary) + OpenWeatherMap (fallback/legacy)
**Confidence: High**

### Comparison for CATCH use case

| Factor | Open-Meteo | OpenWeatherMap |
|--------|-----------|----------------|
| Cost | Free, no key required | Free tier: 1000 calls/day, key required |
| Barometric pressure | YES (surface_pressure in hPa) | YES |
| Central Europe models | DWD ICON-D2 + Météo-France AROME (1-2km resolution) | Proprietary ML model |
| Precipitation probability | YES | YES (paid plan for hourly) |
| Forecast range | 16 days | 5 days free |
| Historical data | YES (ERA5 archive) | Paid |
| Rate limits | Generous, no hard limits for non-commercial | 60 calls/min free |
| API key required | NO | YES |
| Open source | YES (AGPLv3) | NO |
| Central Europe accuracy | EXCELLENT — uses national meteorological models (CHMI for CZ/SK data) | Good but less specialized |

### Why Open-Meteo wins for CATCH

1. **No API key** — zero configuration, no account needed, no key rotation
2. **DWD ICON-D2 + AROME models** — these are the exact models used by Czech and Slovak meteorological services (CHMI, SHMÚ). Highest accuracy for the target region.
3. **15-minute resolution data** — available for Central Europe (ideal for fishing "golden hour" predictions)
4. **Barometric pressure trend** — the critical variable for fish activity prediction. Available as `surface_pressure` and `pressure_msl`
5. **Historical API** — enables AI model training on past weather/catch correlations
6. **Free for apps** — commercial use allowed with API key (cheap, starts at €10/month)

### API request for fishing prediction

```typescript
// lib/weather.ts
const OPEN_METEO_URL = 'https://api.open-meteo.com/v1/forecast'

interface WeatherParams {
  lat: number
  lon: number
}

export async function getFishingWeather({ lat, lon }: WeatherParams) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    hourly: [
      'surface_pressure',       // hPa — key fishing metric
      'pressure_msl',           // Mean sea level pressure
      'precipitation_probability',
      'wind_speed_10m',
      'temperature_2m',
      'cloud_cover',
      'visibility',
    ].join(','),
    daily: [
      'sunrise',
      'sunset',
      'precipitation_probability_max',
    ].join(','),
    forecast_days: '3',
    timezone: 'Europe/Bratislava',  // Automatic local time
  })

  const response = await fetch(`${OPEN_METEO_URL}?${params}`)
  return response.json()
}
```

### Barometric pressure interpretation for fishing

| Pressure Trend | Fish Activity | Prediction |
|----------------|---------------|------------|
| Rising (>0.3 hPa/hr) | HIGH | Excellent — fish feed actively |
| Stable | MEDIUM | Normal activity |
| Falling (<-0.3 hPa/hr) | LOW | Poor — fish go deep |
| Below 1000 hPa | LOW | Storm approaching |

This logic feeds directly into the AI prediction engine.

### OpenWeatherMap role
Keep as documented secondary API — useful for current conditions widget and when OpenWeatherMap's station data is more accurate for specific locations. Rate limit concern is not an issue for CATCH's expected traffic.

---

## 8. Maps

### Recommendation: react-native-maps (NOT expo-maps alpha)
**Confidence: High**

| Package | Version |
|---------|---------|
| `react-native-maps` | ^1.18.x (latest stable) |
| `@mapbox/supercluster` | ^8.x (for clustering) |
| `@react-native-community/geolocation` OR `expo-location` | prefer `expo-location` |

### expo-maps vs react-native-maps (March 2026)

| Factor | expo-maps | react-native-maps |
|--------|-----------|-------------------|
| Status | **Alpha — DO NOT use in production** | Production-ready |
| Custom marker components | NOT SUPPORTED | Full support |
| iOS support | Requires iOS 17+ | iOS 13+ |
| Clustering built-in | NO | Via supercluster |
| Expo managed | YES | YES (config plugin) |
| Google Maps (Android) | YES | YES |
| Apple Maps (iOS) | SwiftUI native | UIKit native |
| Community support | Limited (alpha) | Mature ecosystem |

**expo-maps is alpha and explicitly states it will have breaking changes. Do not use for CATCH production.**

### Google Maps vs Apple Maps

Use **Google Maps on Android, Apple Maps on iOS** (the default behavior of react-native-maps). This provides:
- Native feel on each platform
- No Google Maps API billing for iOS (Apple Maps is free)
- Apple Maps accuracy is excellent for SK/CZ region
- Google Maps required for Android (no alternative)

For the CATCH map feature (revír spots), require a **Google Maps API key** for Android only.

### Marker clustering for revír map

The recommended approach in 2026 for clustering with react-native-maps:

```bash
npm install @mapbox/supercluster
npm install react-native-maps
```

Use supercluster directly — react-native-map-clustering is **outdated and broken** with modern Expo/RN versions.

```typescript
import SuperCluster from '@mapbox/supercluster'
import MapView, { Marker, Region } from 'react-native-maps'

// Generate clusters from spot data using supercluster
// Render cluster markers with count badges
// On cluster tap: zoom to cluster bounds (getClusterExpansionZoom)
```

### Gotchas
- `react-native-map-clustering` — do not use, unmaintained, breaks with New Architecture
- Custom marker components (React components as markers) — can cause jank on Android with many markers. For 100+ spots, use native `Marker` with `image` prop instead of JSX children
- Google Maps API key must be restricted (Android app restriction + bundle ID) — never commit to git, use EAS Secrets

---

## 9. Image Loading

### Recommendation: expo-image (not react-native-fast-image)
**Confidence: High**

| Package | Version |
|---------|---------|
| `expo-image` | ^2.x (ships with SDK 53) |

### expo-image vs react-native-fast-image

| Factor | expo-image | react-native-fast-image |
|--------|-----------|------------------------|
| Expo SDK integration | First-party, maintained by Expo | Third-party |
| New Architecture | Full support | Partial/community |
| Underlying library | Glide (Android), SDWebImage (iOS) | Same |
| Blurhash placeholders | YES — built-in | NO |
| Transition animations | YES (crossfade, etc.) | NO |
| Priority hints | YES | YES |
| Preloading API | YES | YES |
| WebP, AVIF support | YES | Limited |
| Maintenance 2025 | Active, Expo team | Slowing down |
| New Architecture support | Full | Intermittent issues |

### Why expo-image wins for CATCH
1. First-party Expo support = guaranteed New Architecture compatibility
2. **Blurhash placeholders** — critical for catch photos and spot thumbnails. Show blurred preview while loading.
3. **Transition animations** — smooth crossfade when image loads (perceived performance)
4. react-native-fast-image development has slowed and New Architecture support is inconsistent

### Usage pattern for catch photos

```typescript
import { Image } from 'expo-image'

// Catch thumbnail with blurhash placeholder
<Image
  source={{ uri: catch.photoUrl }}
  placeholder={{ blurhash: catch.blurhash }}
  contentFit="cover"
  transition={200}
  style={{ width: 80, height: 80, borderRadius: 8 }}
/>
```

Generate blurhash on upload (Firebase Cloud Function or on-device before upload).

### What NOT to use
- `<Image>` from react-native — no caching, no placeholder, no transition
- react-native-fast-image — technically equivalent performance but worse DX with New Architecture

---

## 10. List Rendering

### Recommendation: FlashList everywhere (except simple, small lists)
**Confidence: High**

| Package | Version |
|---------|---------|
| `@shopify/flash-list` | ^1.7.x |

### FlashList vs FlatList decision matrix

| List | Length | Item Complexity | Use |
|------|--------|----------------|-----|
| Catch log (denník) | 10–500 items | Medium (photo + text) | FlashList |
| Forum posts | 20–1000 items | Medium | FlashList |
| Bazár listings | 10–500 items | Medium (photo + price) | FlashList |
| Chat messages | 50–5000 items | Simple | FlashList |
| Spot search results | 5–50 items | Simple | FlatList OK, FlashList better |
| Dropdown options | <20 items | Very simple | FlatList or ScrollView |
| Settings menu | <20 items | Static | ScrollView |

### Performance data (real-world)
- FlashList: JS thread CPU < 10% during scroll
- FlatList: JS thread CPU > 90% during scroll with complex items
- On Android specifically (target: SK/CZ users on mid-range devices), FlatList causes visible jank. FlashList does not.

### FlashList setup

```typescript
import { FlashList } from '@shopify/flash-list'

<FlashList
  data={catches}
  renderItem={({ item }) => <CatchCard catch={item} />}
  estimatedItemSize={120}  // REQUIRED — measure your item height
  keyExtractor={(item) => item.id}
  // DO NOT add key prop to CatchCard — breaks cell recycling
/>
```

### FlashList gotchas

1. **`estimatedItemSize` is mandatory** and affects performance significantly. Measure actual item heights and provide accurate value.

2. **Do NOT add `key` prop to the rendered item component** — this prevents cell recycling and negates all FlashList benefits.

3. **Variable height items** — FlashList handles them, but for highly variable heights (e.g., forum posts with 1 line vs 20 lines), provide a custom `overrideItemLayout` function.

4. **FlashList with images** — combine with `expo-image` + `recyclingKey` prop to properly recycle image cells:
```typescript
<Image recyclingKey={item.id} source={{ uri: item.photoUrl }} ... />
```

5. **Inverted lists (chat)** — use `inverted` prop, works correctly unlike FlatList which has scroll position issues.

---

## Complete Version Manifest

All packages with recommended versions for CATCH initial setup:

```json
{
  "dependencies": {
    "expo": "~53.0.0",
    "expo-router": "~5.0.0",
    "react": "19.0.0",
    "react-native": "0.79.x",

    "@react-native-firebase/app": "^21.0.0",
    "@react-native-firebase/auth": "^21.0.0",
    "@react-native-firebase/firestore": "^21.0.0",
    "@react-native-firebase/storage": "^21.0.0",
    "@react-native-firebase/messaging": "^21.0.0",
    "@react-native-firebase/functions": "^21.0.0",

    "zustand": "^5.0.0",
    "@react-native-async-storage/async-storage": "^2.0.0",

    "@tanstack/react-query": "^5.0.0",
    "@invertase/tanstack-query-firebase": "latest",

    "react-native-purchases": "^8.9.2",
    "react-native-purchases-ui": "^8.9.2",

    "expo-image": "^2.0.0",
    "@shopify/flash-list": "^1.7.0",
    "react-native-maps": "^1.18.0",
    "@mapbox/supercluster": "^8.0.0",

    "expo-location": "^18.0.0",
    "expo-camera": "^16.0.0",
    "expo-image-picker": "^16.0.0",
    "expo-notifications": "^0.29.0",
    "expo-secure-store": "^14.0.0",

    "react-hook-form": "^7.54.0",
    "zod": "^3.24.0",

    "@shopify/restyle": "^2.4.0"
  },
  "devDependencies": {
    "@tanstack/react-query-devtools": "^5.0.0",
    "typescript": "~5.8.3"
  }
}
```

*Note: Pin exact versions after first successful build. Use `npx expo install` for all packages — it resolves compatible versions automatically.*

---

## What NOT to Use (and Why)

| Library | Avoid Because |
|---------|--------------|
| Firebase JS SDK (for RN) | JS-based, slower, weaker offline, no native FCM |
| Redux / Redux Toolkit | Too much boilerplate for this app size |
| React Navigation directly | Conflicts with Expo Router |
| expo-maps | Alpha, breaking changes, no custom markers, iOS 17+ only |
| react-native-map-clustering | Unmaintained, broken with New Architecture |
| react-native-fast-image | Maintenance slowing, New Architecture issues |
| FlatList (for main lists) | 10x slower on Android vs FlashList |
| JavaScriptCore (JSC) engine | Deprecated in RN 0.79, use Hermes |
| expo-av (Video/Audio) | Deprecated, use expo-video / expo-audio |
| expo-background-fetch | Deprecated, use expo-background-task |
| Axios | fetch() is sufficient; Axios adds bundle weight |
| Moment.js | Use date-fns or Temporal API (tree-shakeable) |
| React Native CLI (bare workflow) | Expo managed + config plugins covers all needs |

---

## Windows Development Environment Notes

1. **iOS builds** — only possible via EAS Build (cloud). Cannot run locally. Set up EAS CLI early: `npm install -g eas-cli && eas login`

2. **Android builds** — work locally with Android Studio + emulator. Also available via `eas build --platform android --profile development`

3. **Metro bundler file watching** — set in `package.json` scripts: `EXPO_USE_FAST_RESOLVER=1 expo start` or configure in `metro.config.js`:
```js
config.resolver.unstable_enableSymlinks = false
```

4. **Git line endings** — critical. Add to repo root:
```
# .gitattributes
* text=auto eol=lf
*.sh text eol=lf
```

5. **EAS Secrets for sensitive files** — `google-services.json`, `GoogleService-Info.plist`, API keys. Never commit these:
```bash
eas secret:create --scope project --name GOOGLE_SERVICES_JSON \
  --value "$(cat google-services.json)"
```

6. **Development build** — create once, use for all testing. Expo Go is not sufficient for CATCH (Firebase native + RevenueCat native):
```bash
eas build --profile development --platform android
eas build --profile development --platform ios
```

7. **Path lengths** — Windows has 260 char path limit. Enable long paths: `git config core.longpaths true` and enable in Windows Registry or Group Policy.

8. **Shell** — use Git Bash or WSL2 for running Expo scripts. PowerShell works but some scripts assume bash.

---

## Confidence Summary

| Topic | Confidence | Notes |
|-------|-----------|-------|
| Expo SDK 53 | High | Stable release, well documented |
| Expo Router v5 | High | Ships with SDK 53, Stack.Protected is useful |
| react-native-firebase v21 | High | Clear winner over JS SDK for RN |
| Zustand v5 | High | Current stable, few gotchas |
| TanStack Query v5 | High | Standard choice, invertase integration available |
| RevenueCat v8.9.2+ | High | Known issue fixed, works with SDK 52/53 |
| Open-Meteo | High | Superior for SK/CZ region, free, no key |
| react-native-maps | High | expo-maps alpha is not production-ready |
| expo-image | High | Clear winner for Expo projects |
| FlashList | High | Drop-in FlatList replacement, 10x better Android perf |

---

## References

- [Expo SDK 53 Changelog](https://expo.dev/changelog/sdk-53)
- [Expo Router v5 Introduction](https://expo.dev/blog/expo-router-v5)
- [React Native Firebase — rnfirebase.io](https://rnfirebase.io/)
- [React Native Firebase — Migrating to v22](https://rnfirebase.io/migrating-to-v22)
- [Expo Firebase Guide](https://docs.expo.dev/guides/using-firebase/)
- [Zustand v5 Announcement](https://pmnd.rs/blog/announcing-zustand-v5)
- [Zustand v5 Migration Guide](https://github.com/pmndrs/zustand/blob/main/docs/migrations/migrating-to-v5.md)
- [TanStack Query Firebase (invertase)](https://react-query-firebase.invertase.dev/)
- [TanStack Query v5 React Native](https://tanstack.com/query/v5/docs/framework/react/react-native)
- [RevenueCat Expo Installation](https://www.revenuecat.com/docs/getting-started/installation/expo)
- [RevenueCat React Native Purchases GitHub](https://github.com/RevenueCat/react-native-purchases)
- [Open-Meteo API Documentation](https://open-meteo.com/en/docs)
- [Open-Meteo GitHub](https://github.com/open-meteo/open-meteo)
- [Expo Maps — Introducing expo-maps](https://expo.dev/blog/introducing-expo-maps-a-modern-maps-api-for-expo-developers)
- [react-native-maps Expo Docs](https://docs.expo.dev/versions/latest/sdk/map-view/)
- [Expo Image Documentation](https://docs.expo.dev/versions/latest/sdk/image/)
- [FlashList — Shopify Engineering](https://shopify.engineering/instant-performance-upgrade-flatlist-flashlist)
- [FlashList Documentation](https://shopify.github.io/flash-list/)
- [What is the best React Native list component? — Expo Blog](https://expo.dev/blog/what-is-the-best-react-native-list-component)
- [New Architecture in Expo — Expo Blog](https://expo.dev/blog/out-with-the-old-in-with-the-new-architecture)

*Research completed: 2026-03-12*
