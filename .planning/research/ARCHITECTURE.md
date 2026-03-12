# CATCH App — Architecture Research

> Generated: 2026-03-12 | Based on Expo Router v3, React Native Firebase v21, React Query v5, Zustand v5

---

## Executive Summary

CATCH je aplikácia strednej-vysokej komplexity. Má 6 hlavných tabov, každý s vlastným navigačným stackom, plus cross-cutting features (auth, notifikácie, realtime chat, offline). Najkritickejšia architektonická rozhodnutia sú: (1) ako organizovať Expo Router file tree pre 6-tabovú app s nested routes, (2) ako rozdeliť Firestore listenery od one-time fetchov, a (3) ako navrhnúť chat model, ktorý neprekročí Firestore read limity.

**Odporúčané rozhodnutia pred začatím kódenia:**
- `@react-native-firebase` (native SDK) namiesto Firebase JS SDK — offline persistence funguje out-of-the-box, lepší výkon
- React Query pre všetky Firestore fetches, Zustand iba pre skutočne globálny stav (auth session, UI state)
- Geohash ukladať ako samostatné string pole vedľa GeoPoint, nie ako GeoPoint samotný
- Chat conversations ako top-level kolekcia, nie subcollection — umožňuje cross-user queries

**Riziká:**
- Geofirestore v3 nie je aktívne udržiavaný — zvážiť vlastnú implementáciu geohash logiky (geofire-common package)
- Firestore má limit 1 write/sekunda na dokument — unread counters musia byť denormalizované, nie incrementálne
- Expo Router `Stack.Protected` je client-side only — security musí byť vždy aj na Firestore rules úrovni

---

## 1. Odporúčaná Projektová Štruktúra

```
catch-app/
├── app.json
├── eas.json
├── package.json
├── tsconfig.json
├── babel.config.js
├── assets/
│   ├── fonts/
│   │   ├── Outfit-*.ttf
│   │   └── JetBrainsMono-*.ttf
│   └── images/
├── src/
│   ├── app/                          # Expo Router — iba routing, žiadna business logika
│   │   ├── _layout.tsx               # Root layout: providers, splash, auth guard
│   │   ├── sign-in.tsx               # Auth screen (vždy dostupná)
│   │   ├── sign-up.tsx
│   │   ├── forgot-password.tsx
│   │   └── (app)/                    # Protected group (vyžaduje auth)
│   │       ├── _layout.tsx           # Stack s Stack.Protected guard
│   │       └── (tabs)/               # 6-tabová navigácia
│   │           ├── _layout.tsx       # Tabs component, custom tab bar
│   │           │
│   │           ├── diary/            # Tab 1: Denník
│   │           │   ├── _layout.tsx   # Stack navigator
│   │           │   ├── index.tsx     # Zoznam úlovkov
│   │           │   ├── new.tsx       # Nový záznam (modal presentation)
│   │           │   └── [catchId].tsx # Detail úlovku
│   │           │
│   │           ├── map/              # Tab 2: Mapa
│   │           │   ├── _layout.tsx
│   │           │   ├── index.tsx     # Mapa revírov
│   │           │   └── [spotId].tsx  # Detail revíru
│   │           │
│   │           ├── index.tsx         # Tab 3: Feed/Dashboard (center tab)
│   │           │
│   │           ├── community/        # Tab 4: Komunita
│   │           │   ├── _layout.tsx
│   │           │   ├── index.tsx     # Zoznam postov
│   │           │   ├── new.tsx       # Nový post
│   │           │   └── [postId]/
│   │           │       ├── index.tsx # Post detail + komentáre
│   │           │       └── edit.tsx
│   │           │
│   │           └── marketplace/      # Tab 5: Bazár
│   │               ├── _layout.tsx
│   │               ├── index.tsx     # Zoznam inzerátov
│   │               ├── new.tsx       # Nový inzerát
│   │               ├── [listingId]/
│   │               │   ├── index.tsx # Detail inzerátу
│   │               │   └── edit.tsx
│   │               └── chat/         # In-app chat
│   │                   ├── index.tsx # Zoznam konverzácií
│   │                   └── [conversationId].tsx
│   │
│   ├── components/                   # Zdieľané UI komponenty
│   │   ├── ui/                       # Primitívy (Button, Card, Badge, Avatar...)
│   │   ├── catch/                    # Domain komponenty
│   │   │   ├── CatchCard.tsx
│   │   │   ├── CatchForm.tsx
│   │   │   └── WeatherWidget.tsx
│   │   ├── community/
│   │   │   ├── PostCard.tsx
│   │   │   ├── CommentThread.tsx     # Rekurzívne nested komentáre
│   │   │   └── VoteButtons.tsx
│   │   ├── marketplace/
│   │   │   ├── ListingCard.tsx
│   │   │   └── SellerBadge.tsx
│   │   ├── map/
│   │   │   ├── SpotMarker.tsx
│   │   │   └── SpotCluster.tsx
│   │   ├── chat/
│   │   │   ├── MessageBubble.tsx
│   │   │   ├── ConversationRow.tsx
│   │   │   └── ChatInput.tsx
│   │   └── shared/
│   │       ├── ImageUploader.tsx     # Reusable upload component
│   │       ├── EmptyState.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── PremiumGate.tsx       # RevenueCat paywall trigger
│   │
│   ├── screens/                      # Screen-level komponenty (volané z app/ routes)
│   │   ├── DiaryScreen.tsx
│   │   ├── CatchDetailScreen.tsx
│   │   ├── NewCatchScreen.tsx
│   │   ├── MapScreen.tsx
│   │   ├── SpotDetailScreen.tsx
│   │   ├── FeedScreen.tsx
│   │   ├── CommunityScreen.tsx
│   │   ├── PostDetailScreen.tsx
│   │   ├── MarketplaceScreen.tsx
│   │   ├── ListingDetailScreen.tsx
│   │   ├── ChatListScreen.tsx
│   │   └── ChatDetailScreen.tsx
│   │
│   ├── hooks/                        # Custom hooks
│   │   ├── auth/
│   │   │   ├── useAuth.ts
│   │   │   └── useCurrentUser.ts
│   │   ├── catches/
│   │   │   ├── useCatches.ts         # React Query hook
│   │   │   └── useCatchMutations.ts
│   │   ├── community/
│   │   │   ├── usePosts.ts
│   │   │   └── useComments.ts
│   │   ├── marketplace/
│   │   │   ├── useListings.ts
│   │   │   └── useNearbyListings.ts  # Geo query hook
│   │   ├── chat/
│   │   │   ├── useConversations.ts   # onSnapshot listener hook
│   │   │   └── useMessages.ts
│   │   ├── map/
│   │   │   └── useNearbySpots.ts
│   │   └── useImageUpload.ts         # Upload s progress + retry
│   │
│   ├── services/                     # Firebase + external API wrappers
│   │   ├── firebase/
│   │   │   ├── config.ts             # Firebase init
│   │   │   ├── auth.ts               # Auth functions
│   │   │   ├── catches.ts            # Firestore CRUD pre catches
│   │   │   ├── spots.ts
│   │   │   ├── posts.ts
│   │   │   ├── comments.ts
│   │   │   ├── listings.ts
│   │   │   ├── chat.ts               # Chat service
│   │   │   ├── storage.ts            # Storage upload service
│   │   │   └── geo.ts                # Geohash utilities
│   │   ├── weather.ts                # OpenWeatherMap + Open-Meteo
│   │   ├── ai.ts                     # OpenAI GPT-4o mini
│   │   └── revenuecat.ts
│   │
│   ├── stores/                       # Zustand stores (global state only)
│   │   ├── authStore.ts              # Session, user profile
│   │   ├── uiStore.ts                # Tab badges, map viewport, modals
│   │   └── chatStore.ts              # Unread counts (realtime updated)
│   │
│   ├── lib/                          # Query client, constants
│   │   ├── queryClient.ts            # React Query config
│   │   ├── queryKeys.ts              # Všetky query key factories
│   │   └── firestore.ts              # Typed collection refs
│   │
│   ├── types/                        # TypeScript typy
│   │   ├── models.ts                 # Firestore document interfaces
│   │   ├── navigation.ts             # Route param types
│   │   └── api.ts
│   │
│   ├── utils/
│   │   ├── geohash.ts                # Geohash encode/decode/neighbors
│   │   ├── formatters.ts             # Dátumy, váhy, vzdialenosti
│   │   └── validators.ts
│   │
│   └── constants/
│       ├── theme.ts                  # Farby, spacing, typography
│       ├── fishSpecies.ts            # Zoznam rýb SK/CZ
│       └── regions.ts                # SK/CZ revíry regióny
```

### Kľúčové princípy štruktúry

**Route súbory sú tenké.** Každý `app/` súbor iba importuje Screen komponent:
```tsx
// src/app/(app)/(tabs)/diary/index.tsx
import { DiaryScreen } from '@/screens/DiaryScreen';
export default DiaryScreen;
```

**Route groups** `(app)` a `(tabs)` nevytvárajú URL segmenty — iba zoskupujú. Takto `/diary` nie je `/app/tabs/diary`.

**Shared screens cez route groups:** Profil používateľa sa dá otvoriť z Community aj Marketplace — riešenie je `(community,marketplace)/profile/[userId].tsx`.

---

## 2. Auth Guard Pattern

```tsx
// src/app/_layout.tsx
export default function RootLayout() {
  return (
    <Providers>           // QueryClient, ThemeProvider, RevenueCat
      <AuthGuard />
    </Providers>
  );
}

// src/app/(app)/_layout.tsx
export default function AppLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) return <SplashScreen />;

  return (
    <Stack>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}
```

`Stack.Protected` je client-side only. Firestore security rules sú posledná línia obrany.

---

## 3. Firestore Security Rules Architektúra

### Princípy

1. **User-owned documents** — write iba ak `request.auth.uid == resource.data.userId`
2. **Public read** — `allow read: if true` pre spots, posts (bez súkromných dát)
3. **Private chat** — read iba ak `request.auth.uid in resource.data.participantIds`
4. **Marketplace listings** — public read, write = owner only, delete = owner + admin

### Štruktúra rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Helper funkcie
    function isAuth() { return request.auth != null; }
    function isOwner(userId) { return request.auth.uid == userId; }
    function isParticipant(participantIds) {
      return request.auth.uid in participantIds;
    }
    function notBanned() {
      return !exists(/databases/$(database)/documents/bannedUsers/$(request.auth.uid));
    }

    // USERS — vlastný profil write, public read základných polí
    match /users/{userId} {
      allow read: if isAuth();
      allow create: if isOwner(userId);
      allow update: if isOwner(userId);
      allow delete: if false; // soft delete cez Cloud Function
    }

    // CATCHES — súkromné, iba vlastník
    match /catches/{catchId} {
      allow read: if isAuth() && isOwner(resource.data.userId);
      allow create: if isAuth() && isOwner(request.resource.data.userId);
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }

    // SPOTS — public read, iba admin write (predplnené dáta)
    match /spots/{spotId} {
      allow read: if true;
      allow write: if false; // len cez Cloud Functions / admin SDK
    }

    // POSTS — public read, auth write, owner delete/edit
    match /posts/{postId} {
      allow read: if true;
      allow create: if isAuth() && notBanned();
      allow update: if isAuth() && isOwner(resource.data.userId);
      allow delete: if isAuth() && isOwner(resource.data.userId);
    }

    // COMMENTS — public read, auth create, owner edit/delete
    match /comments/{commentId} {
      allow read: if true;
      allow create: if isAuth() && notBanned();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }

    // LISTINGS — public read, owner write, auto-expire cez CF
    match /listings/{listingId} {
      allow read: if true;
      allow create: if isAuth();
      allow update, delete: if isAuth() && isOwner(resource.data.userId);
    }

    // CONVERSATIONS — private, iba účastníci
    match /conversations/{conversationId} {
      allow read, write: if isAuth() && isParticipant(resource.data.participantIds);
      allow create: if isAuth() && isParticipant(request.resource.data.participantIds);

      // Messages subcollection — rovnaký access ako parent
      match /messages/{messageId} {
        allow read: if isAuth() &&
          isParticipant(get(/databases/$(database)/documents/conversations/$(conversationId)).data.participantIds);
        allow create: if isAuth() &&
          isParticipant(get(/databases/$(database)/documents/conversations/$(conversationId)).data.participantIds) &&
          request.resource.data.senderId == request.auth.uid;
        allow update, delete: if false; // správy sú immutable
      }
    }

    // SELLER REVIEWS — public read, iba verified buyer write
    match /sellerReviews/{reviewId} {
      allow read: if true;
      allow create: if isAuth(); // validácia purchase cez Cloud Function
      allow update, delete: if false;
    }
  }
}
```

### Dôležité: denormalizácia pre rules

`participantIds` pole v conversations document umožňuje priamu kontrolu bez extra get(). Každý chat dokument musí toto pole obsahovať ako array stringov.

---

## 4. onSnapshot vs getDocs — Pravidlo

| Situácia | Metóda | Dôvod |
|----------|--------|-------|
| Zoznam konverzácií | `onSnapshot` | Real-time, unread badge update |
| Správy v chate | `onSnapshot` | Real-time delivery |
| Feed komunity | `getDocs` + React Query | Stale-while-revalidate, pull-to-refresh |
| Zoznam úlovkov | `getDocs` + React Query | User-owned, mení sa len cez akcie |
| Detail postu + komentáre | `getDocs` | Nested comments = expensive listener |
| Inzeráty na mape | `getDocs` | Geo query, jednorazový fetch |
| Unread count (tab badge) | `onSnapshot` | Musí byť real-time viditeľný |

**Pravidlo:** `onSnapshot` iba pre dáta kde user OČAKÁVA real-time update bez akcie (chat, notif badge). Pre všetko ostatné `getDocs` s React Query cache.

**Dôležité:** Každý `onSnapshot` musí mať cleanup funkciu. V React Native nemá GC — listener bežiaci na pozadí stojí reads + battery.

```ts
// Vzor pre hook s listenerom
export function useConversations(userId: string) {
  const queryClient = useQueryClient();

  useEffect(() => {
    const unsub = firestore()
      .collection('conversations')
      .where('participantIds', 'array-contains', userId)
      .orderBy('lastMessageAt', 'desc')
      .onSnapshot(snapshot => {
        const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
        queryClient.setQueryData(['conversations', userId], data);
      });

    return unsub; // cleanup
  }, [userId]);

  return useQuery({
    queryKey: ['conversations', userId],
    queryFn: () => null, // data prichádzajú cez setQueryData
    staleTime: Infinity,
  });
}
```

Toto je hybridný pattern: `onSnapshot` pushuje dáta do React Query cache, komponenty čítajú iba z React Query. Žiadna duplikácia state.

---

## 5. Firestore Pagination s React Query

### Cursor-based pattern (nie offset)

```ts
// src/hooks/community/usePosts.ts
export function usePosts(category?: string) {
  return useInfiniteQuery({
    queryKey: ['posts', category],
    queryFn: async ({ pageParam }) => {
      let q = firestore()
        .collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(20);

      if (category) q = q.where('category', '==', category);
      if (pageParam) q = q.startAfter(pageParam); // pageParam = last DocumentSnapshot

      const snap = await q.get();
      return {
        items: snap.docs.map(d => ({ id: d.id, ...d.data() })),
        lastDoc: snap.docs[snap.docs.length - 1] ?? null,
      };
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.lastDoc ?? undefined,
    staleTime: 60_000, // 1 minúta
  });
}
```

FlatList integration:
```tsx
<FlashList
  data={flattenedPosts}
  onEndReached={() => hasNextPage && fetchNextPage()}
  onEndReachedThreshold={0.3}
  estimatedItemSize={120}
/>
```

**Dôležité:** Vždy `FlashList` (od Shopify) namiesto `FlatList` — 10x rýchlejší recyklovanie pre dlhé listy.

---

## 6. Firestore Geo Queries — GeoHash Pattern

### Ukladanie dát

Každý dokument s lokáciou musí mať oba polia:
```ts
interface SpotDocument {
  location: FirebaseFirestore.GeoPoint; // lat/lng pre display
  geohash: string;                      // pre proximity queries
  // ... ostatné polia
}
```

Geohash sa vypočíta pri zápise pomocou `geofire-common` package:
```ts
import { geohashForLocation } from 'geofire-common';

const geohash = geohashForLocation([lat, lng], 9); // precision 9 = ~5m
```

### Proximity Query

Geohash queries vyžadujú **N paralelných queries** (typicky 9 = centrum + 8 susedov):

```ts
import { geohashQueryBounds, distanceBetween } from 'geofire-common';

async function getNearbySpots(center: [number, number], radiusKm: number) {
  const bounds = geohashQueryBounds(center, radiusKm * 1000); // v metroch

  // Paralelné queries pre každý geohash range
  const queries = bounds.map(([start, end]) =>
    firestore()
      .collection('spots')
      .orderBy('geohash')
      .startAt(start)
      .endAt(end)
      .get()
  );

  const snapshots = await Promise.all(queries);

  // Klient-side filtrovanie — geohash nie je perfektný (false positives)
  const spots: Spot[] = [];
  for (const snap of snapshots) {
    for (const doc of snap.docs) {
      const data = doc.data();
      const dist = distanceBetween(
        [data.location.latitude, data.location.longitude],
        center
      );
      if (dist <= radiusKm) {
        spots.push({ id: doc.id, distance: dist, ...data });
      }
    }
  }

  return spots.sort((a, b) => a.distance - b.distance);
}
```

### Geohash precision guide

| Precision | Veľkosť bunky | Použitie |
|-----------|---------------|----------|
| 5 | ~5km x 5km | Hrubá oblasť, región |
| 7 | ~150m x 150m | Mestská štvrť |
| 9 | ~5m x 5m | Presná poloha revíru |

**Pre CATCH:** Ukladaj precision 9, queries rob s precision 5-6 pre radius 10-50km.

**Upozornenie:** Geofirestore library nie je aktívne udržiavaná. Odporúčam `geofire-common` (oficiálny Google balík) + vlastné queries namiesto wrappera.

---

## 7. Chat Architektúra

### Dátový model

```
collections:
  conversations/{conversationId}
    - participantIds: string[]     // [uid1, uid2] — pre security rules
    - participantDetails: map      // { uid: { name, avatar } } denormalizácia
    - lastMessage: string          // text preview
    - lastMessageAt: Timestamp
    - lastSenderId: string
    - unreadCounts: map            // { uid1: 3, uid2: 0 }
    - listingId?: string           // odkaz na inzerát (ak ide o bazár chat)
    - listingSnapshot?: map        // denormalizovaný title + foto

  conversations/{conversationId}/messages/{messageId}
    - senderId: string
    - text: string
    - imageUrl?: string
    - createdAt: Timestamp
    - readBy: string[]             // nie je potrebné real-time, batch update
```

### Conversation ID generovanie

Pre 1:1 chat treba deterministické ID — vždy rovnaké pre rovnakú dvojicu:
```ts
function getConversationId(uid1: string, uid2: string): string {
  return [uid1, uid2].sort().join('_');
}
```

### Unread Count — kritický detail

Unread count sa nesmie incrementovať on-read (limit 1 write/s na dokument). Vzor:
- Pri odoslaní správy: Cloud Function (alebo klient) nastaví `unreadCounts.receiverId += 1`
- Pri otvorení chatu: reset `unreadCounts.myUid = 0` v jednom write
- Tab badge: `useConversations` hook sčíta všetky `unreadCounts.myUid` cez reduce

### Chat Service

```ts
// src/services/firebase/chat.ts
export async function sendMessage(
  conversationId: string,
  senderId: string,
  receiverId: string,
  text: string
) {
  const batch = firestore().batch();

  const msgRef = firestore()
    .collection('conversations')
    .doc(conversationId)
    .collection('messages')
    .doc();

  batch.set(msgRef, {
    senderId,
    text,
    createdAt: firestore.FieldValue.serverTimestamp(),
  });

  const convRef = firestore().collection('conversations').doc(conversationId);
  batch.update(convRef, {
    lastMessage: text,
    lastMessageAt: firestore.FieldValue.serverTimestamp(),
    lastSenderId: senderId,
    [`unreadCounts.${receiverId}`]: firestore.FieldValue.increment(1),
  });

  await batch.commit();
}
```

Batch write = atomická operácia, správa + conversation update v jednom round-trippe.

---

## 8. Image Upload Flow

### Kompresný pipeline

```ts
// src/hooks/useImageUpload.ts
import * as ImagePicker from 'expo-image-picker';
import * as ImageManipulator from 'expo-image-manipulator';
import storage from '@react-native-firebase/storage';

export function useImageUpload() {
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);

  async function pickAndUpload(path: string): Promise<string> {
    // 1. Pick
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 1, // nekompresujem tu, kompresujem dole
    });

    if (result.canceled) throw new Error('cancelled');

    // 2. Compress + resize
    const compressed = await ImageManipulator.manipulateAsync(
      result.assets[0].uri,
      [{ resize: { width: 1200 } }], // max šírka
      { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
    );

    // 3. Upload s progress
    setIsUploading(true);
    const ref = storage().ref(path);
    const task = ref.putFile(compressed.uri);

    task.on('state_changed', snapshot => {
      setProgress(snapshot.bytesTransferred / snapshot.totalBytes);
    });

    // 4. Await + retry logic
    let attempts = 0;
    while (attempts < 3) {
      try {
        await task;
        break;
      } catch (e) {
        attempts++;
        if (attempts === 3) throw e;
      }
    }

    setIsUploading(false);
    return await ref.getDownloadURL();
  }

  return { pickAndUpload, progress, isUploading };
}
```

### Storage path konvencie

```
catches/{userId}/{catchId}/{filename}.jpg
listings/{userId}/{listingId}/{filename}.jpg
posts/{postId}/{filename}.jpg
avatars/{userId}/profile.jpg
```

**Security rules pre Storage:**
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /catches/{userId}/{allPaths=**} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == userId
                   && request.resource.size < 5 * 1024 * 1024  // 5MB max
                   && request.resource.contentType.matches('image/.*');
    }
  }
}
```

---

## 9. Offline Support

### Čo funguje (react-native-firebase)

`@react-native-firebase` používa natívne Firebase SDK — offline persistence je **enabled by default** na iOS aj Android. Nevyžaduje žiadnu konfiguráciu.

Čo funguje offline:
- Čítanie dát, ktoré boli predtým fetchnuté (z lokálnej cache)
- Writes sa ukladajú do pending queue a syncujú pri reconnecte
- `onSnapshot` vracia cached dáta okamžite, update príde po reconnecte

### Čo nefunguje

- Dáta, ktoré neboli nikdy fetchnuté — cache je prázdna
- Geoqueries (viacero queries) — ťažko cachovateľné
- Transakcie — vyžadujú online

### Vzor pre offline-aware write

```ts
// SPRÁVNE — nečakaj na server potvrdenie
const docRef = firestore().collection('catches').doc();
docRef.set(catchData); // fire-and-forget, offline queue sa postará

// ZLE — toto blokuje UI kým nie je server potvrdenie
await docRef.set(catchData); // zamrzne ak offline
```

### Odporúčanie pre CATCH

Pre denník úlovkov (offline use case): fire-and-forget writes, optimistické UI update cez React Query `onMutate`. Pre chat a komunitu: vyžaduj online (zobraziť banner "Nie si online" pre tieto features).

---

## 10. State Management Rozdelenie

### Zustand — iba 3 stores

**authStore** — session, ktorá trvá cez navigáciu:
```ts
interface AuthStore {
  user: FirebaseUser | null;
  userProfile: UserProfile | null;
  isLoading: boolean;
  setUser: (user: FirebaseUser | null) => void;
  setUserProfile: (profile: UserProfile) => void;
}
```

**uiStore** — UI state, ktorý ovplyvňuje viac tabov:
```ts
interface UIStore {
  activeMapRegion: Region;           // mapa viewport medzi navigáciami
  tabBadges: { chat: number; notifications: number };
  setTabBadge: (tab: string, count: number) => void;
}
```

**chatStore** — real-time unread counts (kŕmi ho onSnapshot listener):
```ts
interface ChatStore {
  totalUnread: number;
  conversationUnreads: Record<string, number>;
  updateUnread: (conversationId: string, count: number) => void;
}
```

### React Query — všetko ostatné

```ts
// src/lib/queryKeys.ts
export const queryKeys = {
  catches: {
    all: (userId: string) => ['catches', userId] as const,
    detail: (catchId: string) => ['catches', 'detail', catchId] as const,
  },
  posts: {
    all: (category?: string) => ['posts', category] as const,
    detail: (postId: string) => ['posts', 'detail', postId] as const,
    comments: (postId: string) => ['posts', postId, 'comments'] as const,
  },
  listings: {
    all: (filters?: object) => ['listings', filters] as const,
    nearby: (lat: number, lng: number, radius: number) =>
      ['listings', 'nearby', lat, lng, radius] as const,
    detail: (listingId: string) => ['listings', 'detail', listingId] as const,
  },
  spots: {
    nearby: (lat: number, lng: number) => ['spots', 'nearby', lat, lng] as const,
    detail: (spotId: string) => ['spots', 'detail', spotId] as const,
  },
  user: {
    profile: (userId: string) => ['user', userId] as const,
  },
} as const;
```

**Pravidlo:** Ak stav potrebuje zdieľanie medzi komponentmi ≠ screens, ide do React Query. Ak ovplyvňuje globálne UI (tab badge, auth), ide do Zustand.

### Lokálny state

- Form fields (react-hook-form)
- Modal open/close (useState)
- Scroll position
- Input focus

---

## 11. Komponent Boundaries a Dátový Tok

```
Firebase/Firestore
       │
       ├── onSnapshot ─── chatStore (Zustand) ─── Tab badge, ConversationList
       │
       └── getDocs/setDoc ─── React Query ─── Screens ─── Components
                                   │
                             queryClient.invalidateQueries()
                             (po mutácii)
```

### Screen → Component data flow

Screen je zodpovedný za fetching. Komponenty sú pure — dostanú dáta cez props:

```tsx
// SPRÁVNE — screen fetchuje, komponent zobrazuje
function PostDetailScreen({ postId }: { postId: string }) {
  const { data: post } = usePost(postId);
  const { data: comments } = useComments(postId);

  return <CommentThread post={post} comments={comments} />;
}

// ZLE — komponent sám fetchuje (ťažké testovanie, waterfall)
function CommentThread({ postId }: { postId: string }) {
  const { data } = useComments(postId); // komponent-level fetch = waterfall
}
```

---

## 12. Odporúčaný Build Order

### Dependency graph

```
[Fáza 1] Foundation
    Firebase config + auth
    Navigation skeleton (tabs, auth guard)
    Design system (theme, UI primitives)
    ↓
[Fáza 2] Core Feature — Denník
    Image upload pipeline
    Catch CRUD (forms, list, detail)
    Weather auto-fetch
    ↓
[Fáza 3] Mapa
    React Native Maps
    Spots display + geoqueries
    ↓
[Fáza 4] AI Predikcie
    OpenWeatherMap + Open-Meteo integrácia
    GPT-4o mini prompt engineering
    RevenueCat Premium gate
    ↓
[Fáza 5] Komunita
    Posts feed + infinite scroll
    Nested comments (rekurzívny CommentThread)
    Voting system
    ↓
[Fáza 6] Bazár
    Listings CRUD
    Geo-search (nearby listings)
    Auto-expiry Cloud Function
    ↓
[Fáza 7] Chat
    Conversation model
    Real-time messages
    Unread counts + tab badge
    ↓
[Fáza 8] Polish & Infra
    Push notifikácie (FCM)
    Seller reviews
    Karma/badges system
    PostHog analytics
    EAS Build + OTA updates
```

### Prečo tento order

1. **Auth first** — každý ďalší feature potrebuje uid
2. **Design system second** — raz navrhnúť, neprepisovať neskôr
3. **Denník third** — core value, validuje image upload pipeline (použije ho každý feature)
4. **Mapa fourth** — statický obsah (spots), jednoduchší ako live data
5. **AI fifth** — závisí od denníka (historické úlovky ako kontext)
6. **Komunita sixth** — závisí od image upload (posty s fotkami), auth (votes)
7. **Bazár seventh** — závisí od geo (nearby), image upload, user profiles
8. **Chat last** — najkomplexnejší real-time feature, závisí od všetkého ostatného

### Kritická cesta

```
Auth → Design System → ImageUpload → Denník → [Mapa || AI] → Komunita → [Bazár] → Chat → FCM
```

Mapa a AI môžu ísť paralelne (ak dvaja vývojári). Bazár musí čakať na Komunitu (zdieľajú user profile, voting pattern).

---

## 13. Kľúčové Architektonické Rozhodnutia — Urobiť Pred Fázou 1

| Rozhodnutie | Odporúčanie | Dôvod |
|-------------|------------|-------|
| Firebase SDK | `@react-native-firebase` (native) nie JS SDK | Offline persistence, lepší výkon, FCM native support |
| Firestore mode | Native mode (nie Datastore) | Real-time queries, security rules |
| Image handling | `expo-image-manipulator` pre compress, native Storage upload | Najlepší výkon, progress support |
| Geohash library | `geofire-common` (Google) nie geofirestore | Aktívne udržiavaná, bez zbytočného wrappera |
| FlashList | Áno, miesto FlatList | Kritické pre smooth scrolling dlhých listov (forum, chat) |
| Nested comments | Max 2 úrovne v UI (parent + replies) | Firestore neumožňuje deep nested queries efektívne |
| Conversation ID | Deterministické: `[uid1, uid2].sort().join('_')` | Vyhne sa duplicate conversations |
| Premium gate | RevenueCat `useOfferings()` + custom `<PremiumGate>` komponent | Ľahko reusable, centralizovaná logika |
| Timestamp | Vždy `firestore.FieldValue.serverTimestamp()` | Konzistentné bez client clock skew |
| Error handling | React Query `onError` + global Zustand `errorStore` pre toast | Centralizované, žiadne scattered try/catch |

---

## Referencie

- [Expo Router — Folder Structure Best Practices](https://expo.dev/blog/expo-app-folder-structure-best-practices)
- [Expo Router — Common Navigation Patterns](https://docs.expo.dev/router/basics/common-navigation-patterns/)
- [Expo Router — Protected Routes](https://docs.expo.dev/router/advanced/protected/)
- [Expo Router — Authentication](https://docs.expo.dev/router/advanced/authentication/)
- [Firebase — Firestore Security Rules Structure](https://firebase.google.com/docs/firestore/security/rules-structure)
- [Firebase — Firestore Geo Queries](https://firebase.google.com/docs/firestore/solutions/geoqueries)
- [Firebase — Paginate with Query Cursors](https://firebase.google.com/docs/firestore/query-data/query-cursors)
- [Firebase — Access Data Offline](https://firebase.google.com/docs/firestore/manage-data/enable-offline)
- [React Native Firebase — Firestore Usage](https://rnfirebase.io/firestore/usage)
- [React Native Firebase — Offline Support](https://rnfirebase.io/database/offline-support)
- [Firestore Offline Gotchas — DEV Community](https://dev.to/blarzhernandez/a-few-gotchas-to-consider-when-working-with-firestore-s-offline-mode-and-react-native-42al)
- [Firestore Pagination + Snapshot Listeners — DEV Community](https://dev.to/optimista/firestore-pagination-infinite-scrolling-snapshot-listeners-in-react-useeffect-3hgm)
- [GeoFirestore](https://geofirestore.com/)
- [React State Management in 2025](https://www.developerway.com/posts/react-state-management-2025)
