# Phase 2: Feed + Catch Post - Research

**Researched:** 2026-03-12
**Domain:** React Native image upload pipeline, Firestore offline writes, FlashList v2, Open-Meteo, blurhash
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Catch Form Flow**
- Step wizard — 3 kroky (nie single scroll):
  - Krok 1: Photo-first — hneď po stlačení FAB sa otvorí camera/galéria picker. Fotka je povinná — bez fotky wizard nepokračuje.
  - Krok 2: Ryba + váha/dĺžka + auto-počasie — výber druhu ryby z 100+ SK/CZ druhov (search field), váha (g), dĺžka (cm). Počasie sa auto-doplní z Open-Meteo hneď na tomto kroku (visible badge: teplota, tlak, vietor, fáza mesiaca).
  - Krok 3: Lokalita + poznámka + submit — lokalita voliteľná (rybári tajia miesta) — textové pole pre názov revíru + optional GPS. Krátka poznámka/caption. Progress bar navrchu (1→2→3).
- Celý flow targete <90 sekúnd

**Post Card v Feede**
- Instagram minimal layout — nie fishing-data rich overlay:
  - Avatar + meno + lokalita (header)
  - Full-width foto / swipeable carousel
  - Like / komentár / bookmark action bar
  - Caption + fish badge pod fotkou (nie overlay): `🐟 Kapor · 8.2kg · 72cm`
  - Hashtags/tagy v oranžovej accent farbe
- Počasie v čase úlovku — len v detail screene, nie v Feed karte
- Stories row zostáva — horizontálny scroll ostatných rybárov (Phase 2: mock → real avatary aktívnych používateľov)

**Multi-foto**
- Max 5 fotiek na úlovok (PHOTO-01)
- Výber: multi-select galéria — otvori sa galéria s možnosťou označiť až 5 naraz + camera option
- Zobrazenie vo Feede: swipeable carousel — Instagram-style, dot indikátor (● ○ ○)
- Fotka je povinná — form nepokračuje bez aspoň 1 fotky

**Profil — Navigácia**
- Vlastný profil: tap na avatar v ľavo v headeri Feed screenu → push vlastný profil
- Cudzí profil: tap na meno alebo avatar v post karte Feedu → push profil screen toho používateľa
- Jeden profil screen, 2 módy: `isOwnProfile = currentUserId === profileId`
- Header layout — Twitter-style: landscape banner image navrchu (default: solid forest gradient), avatar overlaid na spodnom okraji bannera (64px kruh, biele orámovanie), meno + username + bio pod
- Stats riadok: Úlovky `N` · Celková váha `Xkg` · Najväčší `Xkg`
- Grid: 3 stĺpce, posledných 12 úlovkov (PROF-03), tap → detail úlovku

**Implementation notes (locked):**
- `expo-image-manipulator` pre kompresiu (resize 1200px, JPEG 0.8)
- `expo-image v2` pre zobrazenie s blurhash + crossfade
- `@shopify/flash-list` pre zoznamy (v2 — estimatedItemSize deprecated)
- Fire-and-forget write pre offline: `docRef.set(data)` bez `await`
- React Query `onMutate` pre optimistický UI
- Fish species: statický JSON `constants/fishSpecies.ts` (100+ SK/CZ druhov)
- Open-Meteo API: `https://api.open-meteo.com/v1/forecast`
- Storage path: `catches/{userId}/{catchId}/{filename}.jpg`

### Claude's Discretion
- Skeleton loaders pri načítavaní feedu a profilu
- Offline indicator design (DIARY-06 — fire-and-forget write)
- Presný pull-to-refresh indikátor
- Error state handling pri upload failure
- Empty state ilustrácia (Feed bez príspevkov)

### Deferred Ideas (OUT OF SCOPE)
- Follow systém (sledovanie používateľov) — Phase 5 Community
- Search screen (vyhľadávanie používateľov/revírov) — Phase 3+
- Komentáre pod postami — Phase 5
- Stories ako samostatná feature (nie len avatary) — backlog
- Banner image upload na profil — možno Phase 2 implementuje ale nie je priorita
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| PHOTO-01 | Max 5 fotiek — camera alebo galéria multi-select | expo-image-picker `allowsMultipleSelection: true, selectionLimit: 5` |
| PHOTO-02 | Kompressia na <500KB klientsky pred uploadom | expo-image-manipulator `manipulateAsync` resize 1200px + JPEG 0.8 |
| PHOTO-03 | Upload progress viditeľný, retry pri zlyhaní | Firebase Storage `task.on('state_changed')` pre progress |
| PHOTO-04 | Blurhash placeholder počas načítavania | `Image.generateBlurhashAsync()` + `expo-image` placeholder prop |
| DIARY-01 | Úlovok (ryba, váha, dĺžka, metóda, nástraha, hĺbka, revír, fotky, poznámka) za <90 sekúnd | 3-krokový wizard pattern |
| DIARY-02 | Počasie auto-doplní z Open-Meteo | `https://api.open-meteo.com/v1/forecast` + suncalc pre mesačnú fázu |
| DIARY-03 | Filter podľa druhu ryby, revíru, dátumu, metódy | Firestore `where` query + React Query cache |
| DIARY-04 | Detail úlovku — všetky parametre, fotogaléria, mapa, počasie | Detail screen s uloženými weather dátami zo záznamu |
| DIARY-05 | Upraviť alebo zmazať vlastný úlovok | Firestore `update`/`delete` + optimistický UI |
| DIARY-06 | Pridanie funguje offline (queue, sync po pripojení) | Fire-and-forget `docRef.set(data)` bez await — RNFirebase offline persistence |
| DIARY-07 | Výber ryby zo SK/CZ zoznamu (100+ druhov) s vyhľadávacím poľom | Statický `constants/fishSpecies.ts` + search filter |
| PROF-01 | Profil s display name, avatárom, bio (max 300 znakov) | Firestore `users/{uid}` dokument, Storage pre avatar |
| PROF-02 | Profil — štatistiky (počet, celková hmotnosť, najväčšia ryba) | Aggregácia z `catches` collection na klientovi |
| PROF-03 | Profil — posledných 12 úlovkov v gridu | Firestore query `limit(12)` + orderBy createdAt desc |
| PROF-04 | Zobraziť profil iného používateľa | `app/profile/[userId].tsx` stack screen — `isOwnProfile` boolean |
| PROF-05 | Karma body a odznaky (badges) | `users.karma` field + `users.badges` array v Firestore |
</phase_requirements>

---

## Summary

Phase 2 stavia na stabilnom Phase 1 foundation (Firebase 23.x, Expo SDK 55, Zustand, React Query v5, design system). Kľúčové je správne nastaviť **image upload pipeline** — táto infraštruktúra sa reuse v každej nasledujúcej fáze (posty, inzeráty, avatatre). Pipeline: picker → kompressia → blurhash generácia → Firebase Storage upload → Firestore write.

**FlashList situácia:** Projekt používa Expo SDK 55, ktorý beží výhradne na New Architecture. FlashList v2 je tiež New Architecture-only. Teda `estimatedItemSize` je v v2 deprecated a nepoužívať — FlashList v2 meria veľkosti automaticky. Roadmap a CONTEXT.md spomínajú `estimatedItemSize` ako "povinný" — to platilo pre v1. Planner musí install v2 a odstrániť `estimatedItemSize` zo všetkých komponentov.

**Moon phase:** Open-Meteo API neposkytuje mesačnú fázu. Riešenie: `suncalc` npm package (no API key, pure JS, 0 dependencies, maintained) — `SunCalc.getMoonIllumination(date)` vracia `{ fraction, phase, angle }`. Phase 0=nový mesiac, 0.5=spln.

**Primary recommendation:** Začni s image pipeline (PHOTO-01–04) ako Wave 0/1 — to odblokuje všetko ostatné. Catch wizard, Feed, Denník a Profil sú nezávislé features ktoré môžu ísť paralelne po dokončení pipeline.

---

## Standard Stack

### Core (všetko uz nainštalované v Phase 1)
| Library | Version | Purpose | Status |
|---------|---------|---------|--------|
| `@react-native-firebase/firestore` | ^23.8.6 | Catch CRUD, Feed queries, offline persistence | Installed |
| `@react-native-firebase/storage` | ^23.8.6 | Photo upload (putFile) | Installed |
| `@tanstack/react-query` | ^5.90.21 | Data fetching, optimistic updates, caching | Installed |
| `zustand` | ^5.0.11 | catches.store.ts, feed.store.ts (podľa auth.store.ts vzoru) | Installed |
| `react-native-reanimated` | 4.2.1 | Carousel swipe animácie | Installed |

### Treba nainštalovať
| Library | Version | Purpose | Why |
|---------|---------|---------|-----|
| `expo-image` | ~55.0.x | Zobrazenie fotiek s blurhash + crossfade | Locked decision |
| `expo-image-manipulator` | ~55.0.x | Kompressia na <500KB klientsky | Locked decision |
| `expo-image-picker` | ~55.0.x | Camera + galéria multi-select | PHOTO-01 |
| `@shopify/flash-list` | ^2.0.0 | Feed + Denník zoznamy (New Arch only) | Locked decision |
| `expo-location` | ~55.0.x | GPS pre voliteľnú lokáciu v catch wizarde | DIARY-01 |
| `suncalc` | ^1.9.0 | Moon phase kalkulácia (offline, no key) | DIARY-02 — Open-Meteo nemá lunar data |

**Installation:**
```bash
npx expo install expo-image expo-image-manipulator expo-image-picker expo-location @shopify/flash-list
npm install suncalc
```

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| `suncalc` | Moon-API.com / ipgeolocation.io | Vyžadujú API key, platené. suncalc je free, offline, presný. |
| `@shopify/flash-list` | `FlatList` | FlatList je 3-5x pomalší na Androide, skipne frames |
| `expo-image-picker` | `react-native-image-picker` | expo-image-picker je oficiálny pre Expo, žiadna extra config |
| Firebase Storage | Supabase Storage, Cloudinary | Firebase je already configured, konzistentný stack |

---

## Architecture Patterns

### Recommended Project Structure (nové súbory pre Phase 2)
```
app/
├── (tabs)/
│   ├── feed.tsx              # Nahradiť ScrollView → FlashList, mock → Firestore
│   ├── pridat/               # Wizard stack (alebo modal)
│   │   ├── _layout.tsx       # Stack navigátor pre wizard kroky
│   │   ├── step-1.tsx        # Photo picker
│   │   ├── step-2.tsx        # Fish + váha/dĺžka + počasie
│   │   └── step-3.tsx        # Lokalita + caption + submit
│   └── dennik.tsx            # Nahradiť mock → Firestore real catches
├── profile/
│   └── [userId].tsx          # Stack screen — vlastný aj cudzí profil
└── catch/
    └── [catchId].tsx         # Catch detail screen

src/
├── components/
│   ├── catch/
│   │   ├── CatchCard.tsx     # Feed post karta
│   │   ├── CatchCarousel.tsx # Swipeable multi-foto
│   │   ├── FishBadge.tsx     # "🐟 Kapor · 8.2kg · 72cm"
│   │   └── WeatherBadge.tsx  # Teplota, tlak, vietor, fáza mesiaca
│   ├── feed/
│   │   └── StoriesRow.tsx    # Horizontálny scroll avatarov
│   └── profile/
│       ├── ProfileHeader.tsx # Twitter-style banner + avatar + stats
│       └── CatchGrid.tsx     # 3-stĺpcový grid 12 úlovkov
├── stores/
│   ├── catches.store.ts      # Podľa auth.store.ts vzoru
│   └── feed.store.ts         # Podľa auth.store.ts vzoru
├── hooks/
│   ├── useCatches.ts         # React Query hooks pre catches CRUD
│   ├── useFeed.ts            # React Query hook pre feed pagination
│   └── useWeather.ts         # Open-Meteo + suncalc
├── services/
│   ├── imageUpload.ts        # Pipeline: compress → generateBlurhash → putFile
│   └── weather.ts            # Open-Meteo API wrapper
└── constants/
    └── fishSpecies.ts        # 100+ SK/CZ druhov (statický JSON)
```

### Pattern 1: Image Upload Pipeline
**What:** Compress → generate blurhash → upload → store metadata
**When to use:** Vždy pri upload fotky (catches, avatatre, posty neskôr)

```typescript
// Source: docs.expo.dev/sdk/imagemanipulator + rnfirebase.io/storage/usage
import * as ImageManipulator from 'expo-image-manipulator';
import { Image } from 'expo-image';
import storage from '@react-native-firebase/storage';

export async function uploadCatchPhoto(
  uri: string,
  userId: string,
  catchId: string,
  filename: string,
  onProgress?: (pct: number) => void
): Promise<{ downloadURL: string; blurhash: string }> {
  // 1. Kompressia: resize na max 1200px šírka, JPEG 0.8
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1200 } }],
    { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
  );

  // 2. Generovanie blurhash (pred uploadom — URI je ešte local)
  const blurhash = await Image.generateBlurhashAsync(compressed.uri, [4, 3]);

  // 3. Firebase Storage upload s progress tracking
  const storagePath = `catches/${userId}/${catchId}/${filename}.jpg`;
  const ref = storage().ref(storagePath);
  const task = ref.putFile(compressed.uri);

  if (onProgress) {
    task.on('state_changed', (snap) => {
      onProgress(snap.bytesTransferred / snap.totalBytes);
    });
  }

  await task;
  const downloadURL = await ref.getDownloadURL();

  return { downloadURL, blurhash };
}
```

### Pattern 2: Fire-and-Forget Offline Write
**What:** Firestore write bez await — okamžité lokálne uloženie, async server sync
**When to use:** Všetky catch create/update operácie pre offline support

```typescript
// Source: rnfirebase.io/firestore offline + dev.to/blarzhernandez gotchas
import firestore from '@react-native-firebase/firestore';

// SPRÁVNE — neblokuje, funguje offline
function createCatchDoc(catchData: CatchData) {
  const ref = firestore().collection('catches').doc(catchData.id);
  // Bez await — okamžite sa uloží do lokálneho cache
  // Firebase automaticky synchuje so serverom po reconnecte
  ref.set(catchData);
}

// NESPRÁVNE — blokuje UI kým nie je server response
async function createCatchDocWrong(catchData: CatchData) {
  const ref = firestore().collection('catches').doc(catchData.id);
  await ref.set(catchData); // Čaká na server — timeout offline!
}
```

### Pattern 3: React Query Optimistic Update (onMutate)
**What:** UI sa aktualizuje okamžite, rollback pri chybe
**When to use:** Catch creation, like/bookmark akcie

```typescript
// Source: tanstack.com/query/v5/docs/react/guides/optimistic-updates
const mutation = useMutation({
  mutationFn: (newCatch: CatchData) => createCatch(newCatch),
  onMutate: async (newCatch) => {
    // Zruš outgoing refetch aby neprepísal optimistický update
    await queryClient.cancelQueries({ queryKey: ['catches', userId] });

    // Snapshot pre rollback
    const previousCatches = queryClient.getQueryData(['catches', userId]);

    // Optimisticky pridaj do cache
    queryClient.setQueryData(['catches', userId], (old: CatchData[]) => [
      { ...newCatch, id: 'temp-' + Date.now(), createdAt: new Date() },
      ...(old ?? []),
    ]);

    return { previousCatches };
  },
  onError: (_err, _vars, context) => {
    // Rollback pri chybe
    queryClient.setQueryData(['catches', userId], context?.previousCatches);
  },
  onSettled: () => {
    // Vždy invalidovaj po mutácii
    queryClient.invalidateQueries({ queryKey: ['catches', userId] });
  },
});
```

### Pattern 4: FlashList v2 (bez estimatedItemSize)
**What:** Feed zoznam — New Architecture, automatické meranie veľkosti
**When to use:** Feed, Denník list — všetky zoznamy

```typescript
// Source: shopify.github.io/flash-list/docs/v2-migration/
import { FlashList } from '@shopify/flash-list';

// v2 — estimatedItemSize ZRUŠIŤ (deprecated)
<FlashList
  data={catches}
  renderItem={({ item }) => <CatchCard catch={item} />}
  keyExtractor={(item) => item.id}
  onEndReached={loadMore}
  onEndReachedThreshold={0.5}
  refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refetch} />}
/>

// POZOR: Nepoužívať key prop na renderItem komponente (FlashList ho manages interne)
```

### Pattern 5: expo-image s blurhash
**What:** Zobrazenie fotky s blur placeholder počas načítavania
**When to use:** Každá catch fotka v Feed aj Denník

```typescript
// Source: docs.expo.dev/sdk/image/
import { Image } from 'expo-image';

<Image
  source={{ uri: catch.photos[0].downloadURL }}
  placeholder={{ blurhash: catch.photos[0].blurhash }}
  contentFit="cover"
  transition={300}
  style={{ width: SCREEN_WIDTH, height: 280 }}
/>
```

### Pattern 6: expo-image-picker Multi-select
**What:** Výber až 5 fotiek z galérie alebo camera
**When to use:** Krok 1 catch wizarda

```typescript
// Source: docs.expo.dev/sdk/imagepicker/
import * as ImagePicker from 'expo-image-picker';

const pickImages = async () => {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ['images'],
    allowsMultipleSelection: true,
    selectionLimit: 5,
    quality: 1, // Nekomprimpuj tu — použijeme ImageManipulator
    allowsEditing: false, // Multi-select nefunguje s allowsEditing
  });

  if (!result.canceled) {
    return result.assets; // Array max 5 assets
  }
};
```

### Pattern 7: Open-Meteo + suncalc počasie
**What:** Auto-fetch počasia pre aktuálnu polohu + moon phase
**When to use:** Krok 2 catch wizarda

```typescript
// Source: api.open-meteo.com/en/docs + npmjs.com/package/suncalc
import * as SunCalc from 'suncalc';

async function fetchWeatherForCatch(lat: number, lon: number) {
  const url = `https://api.open-meteo.com/v1/forecast?` +
    `latitude=${lat}&longitude=${lon}` +
    `&hourly=pressure_msl,temperature_2m,wind_speed_10m,precipitation` +
    `&forecast_days=1&timezone=auto`;

  const res = await fetch(url);
  const data = await res.json();

  // Aktuálna hodina
  const now = new Date();
  const hourIndex = now.getHours();

  // Moon phase z suncalc (0=nový mesiac, 0.25=prvá štvrtina, 0.5=spln, 0.75=posledná štvrtina)
  const moonData = SunCalc.getMoonIllumination(now);
  const moonPhase = getMoonPhaseName(moonData.phase); // "Spln", "Novoluní", atď.

  return {
    temperature: data.hourly.temperature_2m[hourIndex],    // °C
    pressure: data.hourly.pressure_msl[hourIndex],         // hPa
    windSpeed: data.hourly.wind_speed_10m[hourIndex],      // km/h
    precipitation: data.hourly.precipitation[hourIndex],   // mm
    moonPhase,
    moonIllumination: Math.round(moonData.fraction * 100), // %
  };
}

function getMoonPhaseName(phase: number): string {
  if (phase < 0.0625) return 'Novoluní';
  if (phase < 0.1875) return 'Dorastajúci';
  if (phase < 0.3125) return 'Prvá štvrtina';
  if (phase < 0.4375) return 'Pribúdajúci';
  if (phase < 0.5625) return 'Spln';
  if (phase < 0.6875) return 'Ubúdajúci';
  if (phase < 0.8125) return 'Posledná štvrtina';
  if (phase < 0.9375) return 'Dorábajúci';
  return 'Novoluní';
}
```

### Anti-Patterns to Avoid
- **await pri Firestore write v catch creation:** Blokuje UI offline — vždy fire-and-forget
- **onSnapshot pre Feed:** Battery drain + nadmerné Firestore reads — používať getDocs + pull-to-refresh
- **FlatList namiesto FlashList:** 3-5x pomalší na Androide, skip frames pri scrolle
- **key prop na renderItem komponentoch:** FlashList v2 to zakazuje — spôsobuje performance problémy
- **estimatedItemSize v FlashList v2:** Deprecated, automaticky ignorované, generuje warning
- **allowsEditing: true s allowsMultipleSelection:** Navzájom sa vylučujú — iOS ignoruje allowsEditing keď je multiple enabled
- **Image.generateBlurhashAsync z remote URL po uploade:** Vygeneruj blurhash z LOCAL uri PRED uploadom — nie z downloadURL po uploade (extra network request)

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Image kompressia | Vlastný canvas/resize kód | `expo-image-manipulator` | Handles EXIF rotation, memory management |
| Blurhash generácia | Vlastný DCT algoritmus | `Image.generateBlurhashAsync()` (expo-image) | Native thread, WASM-level performance |
| Moon phase kalkulácia | Vlastný astronomický algoritmus | `suncalc` | Vedecky overený, Julian dates, 0 deps |
| Upload progress | Custom XHR | Firebase Storage Task `.on('state_changed')` | Retry, pause/resume built-in |
| Offline queue | Custom AsyncStorage queue | RNFirebase offline persistence (enabled by default iOS/Android) | Automatic sync, conflict resolution |
| Virtualizácia listu | Vlastná FlatList optimalizácia | FlashList v2 | New Arch synchronous layout, zero native code |
| Image display s placeholder | React Native Image + ActivityIndicator | `expo-image` s `placeholder` prop | Blurhash, crossfade, memory cache built-in |

**Key insight:** Image pipeline je komplexná (EXIF, kompressia, memory, upload retry, progress, placeholder) — každá vrstva má gotchas. Použi hotové riešenia.

---

## Common Pitfalls

### Pitfall 1: FlashList v1 vs v2 API mismatch
**What goes wrong:** Roadmap/CONTEXT spomína `estimatedItemSize povinný` — to platilo pre v1. Expo SDK 55 = New Architecture = FlashList v2 je kompatibilný. v2 `estimatedItemSize` je deprecated.
**Why it happens:** Dokumentácia Phase 2 bola písaná s v1 v hlave.
**How to avoid:** Nainštaluj `@shopify/flash-list@^2.0.0`, nepoužívaj `estimatedItemSize`.
**Warning signs:** Console warning "estimatedItemSize is deprecated" pri renderi.

### Pitfall 2: allowsEditing nekompatibilný s allowsMultipleSelection
**What goes wrong:** iOS ticho ignoruje `allowsEditing: true` keď je `allowsMultipleSelection: true`. Android môže crashnúť.
**Why it happens:** Natívne iOS media picker nepodporuje edit UI v multi-select móde.
**How to avoid:** Nikdy nekombinuj oba. Pre multi-foto: `allowsEditing: false`.
**Warning signs:** Crop UI sa neobjaví po výbere, žiaden error.

### Pitfall 3: Blurhash z remote URL namiesto local URI
**What goes wrong:** Generovanie blurhash z Firebase downloadURL po uploade = extra network request, pomalé, môže zlyhať.
**Why it happens:** Logická ale nesprávna postupnosť: upload → get URL → generate blurhash.
**How to avoid:** Správna postupnosť: compress → generateBlurhashAsync(localUri) → upload. Blurhash sa uloží spolu s downloadURL do Firestore.
**Warning signs:** Blurhash generácia trvá dlho alebo zlyháva.

### Pitfall 4: Open-Meteo windspeed parameter name
**What goes wrong:** CONTEXT.md a ROADMAP.md uvádzajú `windspeed_10m` ale Open-Meteo API v aktuálnej verzii používa `wind_speed_10m` (s podtržítkom, iná forma).
**Why it happens:** API naming zmena medzi verziami.
**How to avoid:** Použiť `wind_speed_10m` — overené v aktuálnej dokumentácii.
**Warning signs:** API vracia prázdne pole alebo error pri `windspeed_10m`.

### Pitfall 5: expo-location permissions na Androide
**What goes wrong:** Android vyžaduje `ACCESS_FINE_LOCATION` permission explicitne v `app.json` a runtime request. Bez toho `getCurrentPositionAsync` zlyháva ticho.
**Why it happens:** Android strict permission model.
**How to avoid:** Pridať do `app.json` plugins config + runtime `requestForegroundPermissionsAsync()` pred volaním location API.
**Warning signs:** `Location.getCurrentPositionAsync()` nikdy neresolves.

### Pitfall 6: Firestore onSnapshot pre Feed
**What goes wrong:** Ak použiješ `onSnapshot` pre Feed (nie len pre chat), máš listener otvorený počas celého life-time appky → battery drain, nadmerné reads → Firestore bill.
**Why it happens:** `onSnapshot` je real-time, každá zmena v collection triggeruje refetch.
**How to avoid:** Feed: `getDocs` + React Query `useQuery` + pull-to-refresh. `onSnapshot` IBA pre chat a unread badge (Phase 7).

### Pitfall 7: React Native Image namiesto expo-image
**What goes wrong:** Existujúci `feed.tsx` a `dennik.tsx` používajú `Image` z `react-native`. Bez nahradenia za `expo-image` nemáš blurhash, crossfade, ani memory cache.
**Why it happens:** RN Image je default, expo-image treba nainštalovať extra.
**How to avoid:** Nahradiť všetky `import { Image } from 'react-native'` za `import { Image } from 'expo-image'` v Phase 2 súboroch. Pozor na iné prop API (napr. `resizeMode` → `contentFit`).

---

## Code Examples

### Firestore Catch Schema
```typescript
// Cesta: catches/{catchId}
interface CatchDocument {
  id: string;
  userId: string;
  userDisplayName: string;
  userAvatar: string;

  // Ryba
  species: string;       // "Kapor"
  weightG: number;       // v gramoch (nie kg) — presnosť
  lengthCm: number;
  method?: string;       // "Feeder", "Lov na plávok"
  bait?: string;         // "Kukurica", "Červ"
  depthM?: number;

  // Foto
  photos: Array<{
    downloadURL: string;
    blurhash: string;    // Vždy uložiť blurhash pre placeholder
    filename: string;
  }>;

  // Lokalita (voliteľná)
  locationName?: string; // "VN Orava, sektor B"
  locationGPS?: {        // GeoPoint — pre Phase 3 mapu
    latitude: number;
    longitude: number;
  };

  // Počasie (uložiť snapshot pri zaznamenaní)
  weather: {
    temperature: number; // °C
    pressure: number;    // hPa
    windSpeed: number;   // km/h
    precipitation: number; // mm
    moonPhase: string;   // "Spln"
    moonIllumination: number; // 0-100 %
  };

  // Meta
  caption?: string;
  isPublic: boolean;     // true = viditeľné vo Feede
  likes: number;
  likedBy: string[];     // Array userIds (pre like toggle)
  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### Users Profile Schema (rozšírenie Phase 1)
```typescript
// Cesta: users/{uid}
interface UserDocument {
  uid: string;
  displayName: string;
  username: string;      // @handle — lowercase, unique
  bio?: string;          // max 300 znakov
  avatarURL?: string;
  avatarBlurhash?: string;

  // Štatistiky (denormalizované pre rýchle čítanie)
  stats: {
    catchCount: number;
    totalWeightG: number;
    biggestCatchG: number;
    biggestCatchSpecies: string;
  };

  // Gamification (Phase 8, ale schema teraz)
  karma: number;
  badges: string[];

  createdAt: FirebaseFirestore.Timestamp;
  updatedAt: FirebaseFirestore.Timestamp;
}
```

### Firestore Security Rules (rozšírenie pre Phase 2)
```
// firestore.rules — pridať k existujúcim rules
match /catches/{catchId} {
  allow read: if resource.data.isPublic == true || request.auth.uid == resource.data.userId;
  allow create: if request.auth != null && request.resource.data.userId == request.auth.uid;
  allow update: if request.auth.uid == resource.data.userId;
  allow delete: if request.auth.uid == resource.data.userId;
}

match /users/{uid} {
  allow read: if request.auth != null;
  allow write: if request.auth.uid == uid;
}
```

### Feed Query (getDocs pattern — nie onSnapshot)
```typescript
// Source: React Query v5 + RNFirebase Firestore
import firestore from '@react-native-firebase/firestore';

async function fetchFeed(lastDoc?: FirebaseFirestore.DocumentSnapshot) {
  let query = firestore()
    .collection('catches')
    .where('isPublic', '==', true)
    .orderBy('createdAt', 'desc')
    .limit(15);

  if (lastDoc) {
    query = query.startAfter(lastDoc);
  }

  const snapshot = await query.get();
  return {
    catches: snapshot.docs.map(d => ({ id: d.id, ...d.data() } as CatchDocument)),
    lastDoc: snapshot.docs[snapshot.docs.length - 1],
  };
}
```

### Profile Stats Aggregácia (klientska)
```typescript
// Aggregate na klientovi — nie server-side (Firestore nemá native SUM bez Extension)
async function getUserStats(userId: string) {
  const snapshot = await firestore()
    .collection('catches')
    .where('userId', '==', userId)
    .get();

  const catches = snapshot.docs.map(d => d.data() as CatchDocument);

  return {
    catchCount: catches.length,
    totalWeightG: catches.reduce((sum, c) => sum + c.weightG, 0),
    biggestCatchG: Math.max(...catches.map(c => c.weightG), 0),
    biggestCatchSpecies: catches.reduce(
      (max, c) => c.weightG > max.weightG ? c : max,
      catches[0]
    )?.species ?? '',
  };
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| FlashList v1 `estimatedItemSize` required | FlashList v2 auto-sizing, `estimatedItemSize` deprecated | 2025 (v2 release) | Jednoduchšie API, New Arch only |
| FlatList pre virtualizované zoznamy | FlashList v2 | 2022+ | 3-5x výkon na Androide |
| RN `Image` s `defaultSource` | `expo-image` s `placeholder` + blurhash | 2023+ | Natívny blurhash, crossfade, memory cache |
| `manipulateAsync` bez Save format | `ImageManipulator.SaveFormat.JPEG` enum | SDK 50+ | Type-safe format handling |
| Custom moon phase API call | `suncalc` npm package local calculation | — | Zero latency, offline, no API key |
| `resizeMode` prop (RN Image) | `contentFit` prop (expo-image) | expo-image v1+ | CSS object-fit semantika |

**Deprecated/outdated:**
- `ImageManipulator.manipulateAsync` (starý callback API): Stále funguje ale docs varujú — novšie verzie majú hook-based API. Pre Phase 2 použiť stále `manipulateAsync` (jednoduchšie pre planner).
- `allowsMultipleSelection: false` default: Všímaj si — treba explicitne `true`.

---

## Open Questions

1. **Catch wizard routing — modal stack vs tab stack**
   - What we know: `pridat.tsx` existuje ako tab. Wizard potrebuje 3 kroky (step-1, step-2, step-3).
   - What's unclear: Expo Router v5 — čistejšie ako modal group `app/(tabs)/pridat/` alebo ako full-screen modal `app/catch/new/`?
   - Recommendation: Modal stack `app/catch/new/` — FAB otvára modal, po submit zatvára. Separátnosť od tab navigácie je čistejšia UX.

2. **Stats denormalizácia — kedy aktualizovať**
   - What we know: `users.stats` treba aktualizovať po každom catch create/update/delete.
   - What's unclear: Klientsky update vs Cloud Function? Phase 2 nemá CF setup.
   - Recommendation: Phase 2 = klientsky update stats po catch write (jednoduché). Phase 8 (gamification CF) môže prevziať.

3. **selectionLimit iOS bug pri 5+ fotkách**
   - What we know: GitHub issue #33185 na expo/expo — cannot select more than 5 images na iOS.
   - What's unclear: Opravené v SDK 55? Issue z 2024.
   - Recommendation: Otestovať na reálnom iOS zariadení. Ak bug pretrváva, UI workaround: disable select button po 5 selected.

---

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | jest-expo 55.x (nainštalovaný z Phase 1) |
| Config file | `jest.config.js` (existuje z Phase 1) |
| Quick run command | `npm test -- --testPathPattern='__tests__/unit' --passWithNoTests` |
| Full suite command | `npm test -- --passWithNoTests` |

### Phase Requirements → Test Map
| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| PHOTO-01 | ImagePicker returns max 5 assets | unit | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 |
| PHOTO-02 | Kompressia výsledok < 500KB | unit | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 |
| PHOTO-03 | Upload progress callback volá sa | unit (mock) | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 |
| PHOTO-04 | generateBlurhashAsync vracia string | unit | `npm test -- --testPathPattern='imageUpload'` | ❌ Wave 0 |
| DIARY-01 | Catch schema má všetky required polia | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 |
| DIARY-02 | fetchWeatherForCatch vracia valid weather objekt | unit (mock fetch) | `npm test -- --testPathPattern='weather'` | ❌ Wave 0 |
| DIARY-03 | Filter query — kde clause sa správne stavia | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 |
| DIARY-04 | Catch detail má weather snapshot | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 |
| DIARY-05 | Delete catch — Firestore delete volá sa | unit (mock) | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 |
| DIARY-06 | Fire-and-forget — docRef.set volá sa bez await | unit | `npm test -- --testPathPattern='catches'` | ❌ Wave 0 |
| DIARY-07 | fishSpecies.ts obsahuje 100+ druhov | unit | `npm test -- --testPathPattern='fishSpecies'` | ❌ Wave 0 |
| PROF-01 | UserDocument schema validácia | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 |
| PROF-02 | getUserStats vracia correct aggregácie | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 |
| PROF-03 | Catches query má limit(12) orderBy createdAt desc | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 |
| PROF-04 | isOwnProfile boolean logika | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 |
| PROF-05 | UserDocument má karma + badges polia | unit | `npm test -- --testPathPattern='profile'` | ❌ Wave 0 |

### Sampling Rate
- **Per task commit:** `npm test -- --testPathPattern='__tests__/unit' --passWithNoTests`
- **Per wave merge:** `npm test -- --passWithNoTests`
- **Phase gate:** Full suite green pred `/gsd:verify-work`

### Wave 0 Gaps
- [ ] `src/__tests__/unit/imageUpload.test.ts` — PHOTO-01 až PHOTO-04
- [ ] `src/__tests__/unit/catches.test.ts` — DIARY-01 až DIARY-06
- [ ] `src/__tests__/unit/fishSpecies.test.ts` — DIARY-07
- [ ] `src/__tests__/unit/weather.test.ts` — DIARY-02
- [ ] `src/__tests__/unit/profile.test.ts` — PROF-01 až PROF-05

---

## Sources

### Primary (HIGH confidence)
- `docs.expo.dev/sdk/imagemanipulator/` — `manipulateAsync` API, SaveFormat.JPEG, resize action
- `docs.expo.dev/sdk/image/` — `Image.generateBlurhashAsync()` API, placeholder prop, transition, contentFit
- `docs.expo.dev/sdk/imagepicker/` — `launchImageLibraryAsync`, allowsMultipleSelection, selectionLimit, allowsEditing conflict
- `shopify.github.io/flash-list/docs/v2-migration/` — FlashList v2 changes, estimatedItemSize deprecated
- `rnfirebase.io/storage/usage` — putFile, task.on('state_changed'), bytesTransferred
- `open-meteo.com/en/docs` — pressure_msl, temperature_2m, wind_speed_10m (overené naming), moon phase NEEXISTUJE

### Secondary (MEDIUM confidence)
- `shopify.engineering/flashlist-v2` — FlashList v2 New Architecture only, Expo SDK 55 compatibility
- `tanstack.com/query/v5/docs/react/guides/optimistic-updates` — onMutate pattern (303 redirect, ale content bol overený cez WebSearch)
- `npmjs.com/package/suncalc` — getMoonIllumination API, phase 0-1 range
- `dev.to/blarzhernandez` — Fire-and-forget Firestore pattern gotchas

### Tertiary (LOW confidence)
- GitHub issue #33185 — iOS selectionLimit bug pri 5+ fotkách (neoverené v SDK 55, treba testovať)

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — všetky knižnice overené v official docs, verzie potvrdené
- Architecture: HIGH — patterns overené cez official docs, existujúci kód analyzovaný
- FlashList v2 API: HIGH — verifikovaný cez Shopify official migration guide
- Open-Meteo wind_speed_10m parameter name: HIGH — overené priamo v API docs
- Moon phase riešenie (suncalc): HIGH — overené cez npm, github, suncalc je štandard
- iOS selectionLimit bug: LOW — len GitHub issue, neoverené v SDK 55

**Research date:** 2026-03-12
**Valid until:** 2026-04-12 (stable libraries — 30 dní)
