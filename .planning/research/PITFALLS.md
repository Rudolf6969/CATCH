# CATCH App — Technical Pitfalls & Anti-Patterns

**Stack:** Expo SDK 51+ / Expo Router / Firebase (Firestore, Auth, Storage, FCM) / RevenueCat / React Native Maps / Zustand / React Query / OpenAI GPT-4o mini

**Last updated:** 2026-03-12

---

## How to Read This Document

Each pitfall contains:
- **Severity** — Critical / High / Medium
- **Phase** — Which build phase must address it (1 = Auth+Core, 2 = Catch Log+Maps, 3 = Community+Forum, 4 = Bazár+Chat, 5 = Premium+Polish)
- **Warning signs** — Observable symptoms before the bug bites hard
- **Prevention** — Concrete code-level or architectural fix

---

## AREA 1 — Expo / React Native Performance Traps

---

### P-01 — FlatList Used for Any List Longer Than 20 Items

**Severity:** High
**Phase:** Address in every phase that renders lists (phases 2, 3, 4)

**Warning signs:**
- Frame rate drops below 60 FPS when scrolling the Forum feed or Bazár listings
- Profiler shows `renderItem` executing on every parent re-render
- RAM climbs steadily as user scrolls; Flipper shows component mount/unmount storm

**Prevention:**

Use `@shopify/flash-list` everywhere, not FlatList. FlashList uses cell recycling instead of virtualization: it keeps a fixed pool of component instances and rebinds data to them, avoiding the destroy-recreate cycle that kills FlatList on long feeds.

```ts
// BAD — FlatList default
<FlatList data={listings} renderItem={renderCard} />

// GOOD — FlashList with explicit estimatedItemSize
<FlashList
  data={listings}
  renderItem={renderCard}
  estimatedItemSize={120}      // measure one real item height
  keyExtractor={(item) => item.id}
  onEndReachedThreshold={0.3}
/>
```

Set `estimatedItemSize` to the real measured height or FlashList degrades to FlatList behavior. Run `@shopify/flash-list`'s built-in performance check in dev mode — it logs warnings when the estimate is wrong.

Additional rules:
- `renderItem` must be `useCallback`-memoized and defined outside JSX
- List item components must be `React.memo()`-wrapped with prop equality
- Never put a FlatList/FlashList inside a ScrollView — virtualization breaks entirely

---

### P-02 — Image Memory Explosion in Catch Log and Bazár

**Severity:** Critical
**Phase:** Phase 2 (Catch Log), Phase 4 (Bazár listings)

**Warning signs:**
- App crash after user browses 30+ listings with photos
- RAM in Flipper memory profiler exceeds 500 MB on mid-range Android
- `expo/expo` GitHub issue #26781: RAM over 2000 MB and crash when rendering many images
- Blob upload to Firebase Storage crashes mid-upload 60–80% of the time (firebase-js-sdk issue #5848)

**Prevention:**

Step 1 — Compress before upload. Never upload raw camera output:
```ts
import * as ImageManipulator from 'expo-image-manipulator';

const compressed = await ImageManipulator.manipulateAsync(
  uri,
  [{ resize: { width: 1200 } }],  // max 1200px wide
  { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG }
);
// compressed.uri is now safe to upload
```

Step 2 — Use `expo-image` component (not `<Image>` from React Native) which has native caching and avoids the base64 decode layer:
```ts
import { Image } from 'expo-image';

<Image
  source={{ uri: url }}
  recyclingKey={item.id}     // critical for FlashList recycling
  contentFit="cover"
  transition={200}
/>
```

Step 3 — Validate `recyclingKey` is set when using FlashList. Without it, the Image component holds the previous image in memory while loading the next one.

Step 4 — Upload as `Blob` via `fetch(uri).then(r => r.blob())`, not via base64 string. Base64 encodes the same data 33% larger and occupies the JS heap during upload.

---

### P-03 — JS Thread Blocking on Screen Transitions

**Severity:** High
**Phase:** All phases, most critical in phase 3 (Forum feed renders complex cards)

**Warning signs:**
- Navigation animation stutters or freezes when pushing to a detail screen
- Hermes CPU profiler shows JS thread at 100% during transition
- Users report "laggy" app feel on any Android below Snapdragon 800 series

**Prevention:**

Defer all heavy work until after the navigation animation completes:
```ts
import { InteractionManager } from 'react-native';

useEffect(() => {
  const task = InteractionManager.runAfterInteractions(() => {
    // heavy data fetching, initial Firestore query, AI call — all here
    loadFeedData();
  });
  return () => task.cancel();
}, []);
```

Never fire Firestore `onSnapshot` or OpenAI calls directly in `useEffect` without this wrapper on screens that are navigated to with an animation.

For the AI prediction screen: offload the OpenWeatherMap + Open-Meteo combination fetch to a Cloud Function instead of doing it client-side. This moves the network fan-out off the JS thread entirely.

---

### P-04 — Unsubscribed Firestore `onSnapshot` Listeners

**Severity:** Critical
**Phase:** Phase 1 (auth), Phase 3 (forum), Phase 4 (chat) — whenever real-time listeners are set up

**Warning signs:**
- "Warning: Can't perform a React state update on an unmounted component" in the console (react-native-firebase issue #3038)
- Memory leak in Flipper that grows with navigation depth
- Firestore read counts in Firebase console are 3–5x higher than expected
- Chat messages arrive on screens that are no longer visible

**Prevention:**

Every `onSnapshot` call returns an unsubscribe function. Always capture it and call it in the `useEffect` cleanup:

```ts
useEffect(() => {
  const unsubscribe = firestore()
    .collection('messages')
    .where('conversationId', '==', convId)
    .orderBy('createdAt', 'asc')
    .onSnapshot(snapshot => {
      setMessages(snapshot.docs.map(d => ({ id: d.id, ...d.data() })));
    });

  return () => unsubscribe();   // THIS IS THE CRITICAL LINE
}, [convId]);
```

For React Query integration: put the `onSnapshot` inside the `queryFn` and use the `useEffect`-based unsubscribe pattern alongside it, or use a dedicated hook per collection. Do not combine React Query's polling with Firestore real-time listeners on the same data — they fight each other.

---

## AREA 2 — Firebase Firestore Quota and Performance

---

### P-05 — Hot-Path Reads that Burn the Daily Free Quota

**Severity:** Critical
**Phase:** Phase 1 — design data model before writing any queries

**Warning signs:**
- Firebase console shows 40,000+ reads per day during development with only 5 test users
- `RESOURCE_EXHAUSTED: Quota exceeded` errors (Firestore Spark plan: 50k reads/day, 20k writes/day)
- Forum feed re-fetches the entire collection on every app resume

**Prevention:**

The three biggest read traps for CATCH specifically:

1. **Forum feed without pagination** — Loading all posts in the `posts` collection as a real-time listener. Always paginate with `limit(20)` and cursor-based `startAfter()`. Use React Query's `useInfiniteQuery` so pages are cached client-side.

2. **`spots` collection on every map pan** — The map revírov will trigger reads every time the region changes. Cache the `spots` collection in React Query with a 10-minute stale time. Only re-fetch when the user explicitly refreshes. For geo-queries, use the Firestore native range query approach (available since March 2024) instead of geohash-based libraries — it reads 4x fewer documents.

3. **Profile fetches in every list item** — Bazár listings showing seller name/avatar must denormalize user display data into the listing document. Never do a subcollection read per card in a list.

Structural rule for CATCH:
```
listings/{id}: {
  sellerId, title, price, photos[],
  // DENORMALIZED — avoids N+1 reads
  sellerDisplayName,
  sellerAvatarUrl,
  sellerRating
}
```

Update these fields via a Cloud Function triggered on `users/{uid}` updates, not client-side.

---

### P-06 — Missing Composite Indexes Causing Silent Query Failures

**Severity:** High
**Phase:** Phase 2, 3, 4 — whenever multi-field queries are added

**Warning signs:**
- Query returns empty results with no error in development
- Firebase console shows a link to create an index in the emulator logs (easy to miss in RN)
- App works on dev machine but breaks after first real deployment

**Prevention:**

Firestore requires a composite index for any query that filters on one field and sorts on another. Common CATCH queries that will need manual index creation:

```
// Forum posts: filter by category, sort by votes
posts: category (==) + voteCount (desc)

// Bazár: filter by status + sort by createdAt
listings: status (==) + createdAt (desc)

// Catches per user sorted by date
catches: userId (==) + caughtAt (desc)

// Messages in conversation ordered by time
messages: conversationId (==) + createdAt (asc)
```

Use the Firebase Emulator Suite during development — it logs index-required errors to the console with a direct link. Clicking the link creates the index in the Firebase console. Never deploy without running through every screen in the emulator first.

Add all indexes to `firestore.indexes.json` and deploy them with `firebase deploy --only firestore:indexes` as part of CI before any app release.

---

### P-07 — Firestore Cold Start on First App Open

**Severity:** Medium
**Phase:** Phase 1 — architecture decision, Phase 5 — optimization

**Warning signs:**
- First query after app cold start takes 3–8 seconds on a fresh install
- `invertase/react-native-firebase` issue #2398: "Firestore in too slow" — first response fast, subsequent same query extremely slow
- Offline mode queries on react-native-firebase take 8–12 seconds even for small documents (issue #3491)

**Prevention:**

1. Enable Firestore offline persistence (it is ON by default in react-native-firebase but verify):
```ts
firestore().settings({ persistence: true, cacheSizeBytes: firestore.CACHE_SIZE_UNLIMITED });
```

2. Show skeleton loaders from the first render — never block UI waiting for Firestore. Use React Query's `placeholderData` or `initialData` from the local cache.

3. For the Mapa revírov: pre-load the nearest 50 spots on app launch into Zustand store. This prevents the cold-start stall when the user navigates to the map.

4. Cloud Functions called from the app have a separate cold start problem (can add 1–5 seconds on first call). The AI prediction function must use `minInstances: 1` in production to keep it warm. This costs roughly €5/month — worth it for a feature that is the core Premium differentiator.

---

### P-08 — GeoQuery Performance with Spots Collection

**Severity:** High
**Phase:** Phase 2 — map feature

**Warning signs:**
- Map shows spots far outside the visible viewport
- Geo query reads 5x more documents than are actually displayed
- Filtering spots by distance is done client-side after loading all spots

**Prevention:**

Since March 2024, Firestore supports range conditions on multiple fields, making geo-queries significantly more efficient. Use the official Firebase geo-query solution (geohash + bounding box) rather than `geofirex` or `geofirestore` (both unmaintained):

```ts
// Store each spot with a geohash field
spots/{id}: {
  location: GeoPoint,
  geohash: "u2mf1b",    // computed on write via geofire-common npm package
  ...
}

// Query by bounding box (4x cheaper than pure geohash approach)
const bounds = geohashQueryBounds(center, radiusM);
const queries = bounds.map(b =>
  firestore()
    .collection('spots')
    .orderBy('geohash')
    .startAt(b[0])
    .endAt(b[1])
    .get()
);
```

Filter the results client-side by actual GeoPoint distance to remove false positives from the bounding-box query. With React Query cache, this filter runs on cached data after the first load.

---

## AREA 3 — Firebase Auth in Expo

---

### P-09 — `currentUser` Returns `null` on App Relaunch

**Severity:** Critical
**Phase:** Phase 1 — auth setup

**Warning signs:**
- User is logged in, kills app, reopens — lands on login screen
- `firebase.auth().currentUser` is null at app startup even though the user logged in yesterday
- The issue happens ~80% of the time on iOS (react-native-firebase issue #7785)
- Auth works fine in development but breaks on physical device TestFlight build

**Prevention:**

The Firebase JS SDK defaults to memory persistence in React Native, losing auth state on app restart. You must explicitly configure AsyncStorage persistence:

```ts
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
```

Do this initialization in the app entry point (`app/_layout.tsx` for Expo Router), not in a separate module that lazy-loads. Initialization order matters — `currentUser` is only available after the auth module resolves from AsyncStorage.

Never read `auth.currentUser` synchronously at startup. Always wait for `onAuthStateChanged` to fire:

```ts
// WRONG — race condition, returns null
const user = auth.currentUser;

// CORRECT — waits for persistence to resolve
useEffect(() => {
  const unsub = onAuthStateChanged(auth, (user) => {
    setUser(user);
    setLoading(false);
  });
  return unsub;
}, []);
```

---

### P-10 — Firebase Auth Token Not Refreshing After Background Stint

**Severity:** High
**Phase:** Phase 1

**Warning signs:**
- Backend Cloud Functions return 401 after the app has been in the background for 1+ hours
- Firestore rules reject writes with `permission-denied` when user's token expired
- `getIdToken(true)` (force refresh) hangs or returns a stale token on some Android devices

**Prevention:**

Firebase ID tokens expire after 1 hour. Always force-refresh before sensitive operations:

```ts
const getAuthHeader = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) throw new Error('Not authenticated');
  const token = await user.getIdToken(/* forceRefresh */ true);
  return `Bearer ${token}`;
};
```

For Cloud Function calls: use the Firebase SDK's callable functions (`httpsCallable`) instead of raw `fetch` — they handle token refresh internally.

For Firestore rules: rely on `request.auth` in rules, not a custom token field. Firestore automatically validates the Firebase ID token on every request and rejects expired tokens before your code runs.

If using `react-native-firebase` (the native SDK) rather than the JS SDK: the native SDK handles token refresh automatically — but only when the app is in the foreground. Background token expiry is a known issue (issue #962). Mitigate by calling `getIdToken(true)` in the `AppState` `change` listener when transitioning from `background` to `active`.

---

### P-11 — Biometric Auth Unlocking the Wrong Session

**Severity:** Medium
**Phase:** Phase 5 (optional premium feature)

**Warning signs:**
- User A logs out, User B logs in on same device, biometric unlock skips login and restores User A's session
- Biometric prompt appears even when no user is logged in (cold launch)
- Face ID on iOS fails silently and the app hangs on a blank screen

**Prevention:**

Biometric auth in CATCH context must be a local gate, not an auth mechanism. The flow is:

1. User logs in with email/password — Firebase token stored in AsyncStorage
2. On subsequent app opens, `onAuthStateChanged` confirms there IS a persisted session
3. Only then show the biometric prompt to confirm it is the same person
4. Never store the password or re-issue tokens based on biometric success alone

```ts
import * as LocalAuthentication from 'expo-local-authentication';

const authenticateWithBiometrics = async (): Promise<boolean> => {
  const hasHardware = await LocalAuthentication.hasHardwareAsync();
  const isEnrolled = await LocalAuthentication.isEnrolledAsync();
  if (!hasHardware || !isEnrolled) return true; // fallback: no biometrics

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: 'Potvrď svoju identitu',
    fallbackLabel: 'Použiť heslo',
    cancelLabel: 'Zrušiť',
  });
  return result.success;
};
```

Always tie biometric state to `auth.currentUser.uid` — store which UID enabled biometrics. On app launch, if `onAuthStateChanged` returns a different UID than the stored biometric-enabled UID, bypass biometrics entirely and require full login.

---

## AREA 4 — Marketplace In-App Chat (Bazár)

---

### P-12 — Message Ordering Breaks with Client-Side Timestamps

**Severity:** Critical
**Phase:** Phase 4 — Bazár chat

**Warning signs:**
- Messages appear out of order when two users send simultaneously
- Sender's own message appears before previous messages it was sent after (latency compensation)
- Clock skew: device clocks differ by minutes, causing message 2 to sort before message 1

**Prevention:**

Never use `new Date()` or `Date.now()` as the sort key for messages. Always use `serverTimestamp()`:

```ts
import { serverTimestamp } from 'firebase/firestore';

await addDoc(collection(db, 'messages'), {
  conversationId,
  senderId: auth.currentUser.uid,
  text: messageText,
  createdAt: serverTimestamp(),  // NOT new Date()
  status: 'sending',
});
```

Important caveat: immediately after writing, Firestore fires the local `onSnapshot` event before the server timestamp resolves. The `createdAt` field will be `null` momentarily. Handle this in the UI:

```ts
const sortedMessages = messages
  .filter(m => m.createdAt !== null)   // hide pending-timestamp messages
  .sort((a, b) => a.createdAt.toMillis() - b.createdAt.toMillis());
```

Or keep a local "pending" state for messages you just sent and merge them at the bottom of the list until the server timestamp arrives.

---

### P-13 — Duplicate Messages from Double-Tap and Network Retry

**Severity:** High
**Phase:** Phase 4

**Warning signs:**
- Message appears twice in the chat when the send button is tapped rapidly
- Network error causes retry, server receives the message twice
- On slow connections, optimistic update + server write both succeed, creating a duplicate

**Prevention:**

Use a client-generated idempotency key (UUID) as the document ID, not an auto-generated Firestore ID:

```ts
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

const messageId = uuidv4();  // generated once at compose time, not at send time

await setDoc(doc(db, 'messages', messageId), {
  conversationId,
  senderId: auth.currentUser.uid,
  text: messageText,
  createdAt: serverTimestamp(),
});
```

Since Firestore `setDoc` with an explicit ID is idempotent (running it twice with the same ID = one document), rapid taps and network retries are safe. Disable the send button immediately on tap and re-enable only on error.

---

### P-14 — Push Notification Not Delivered for Chat Messages

**Severity:** High
**Phase:** Phase 4

**Warning signs:**
- Recipient does not see a notification when they receive a chat message
- Notification arrives 30–60 seconds late or not at all on Android
- Notifications work in Expo Go but not in a production build

**Prevention:**

FCM notification delivery for chat messages must be server-side only, via a Cloud Function triggered on `messages/{id}` creation. Client-side notification dispatch (calling FCM from the device) fails when the sender's app is killed.

```ts
// Cloud Function (Node.js)
export const onMessageCreated = onDocumentCreated('messages/{messageId}', async (event) => {
  const message = event.data?.data();
  if (!message) return;

  const recipientDoc = await db.doc(`users/${message.recipientId}`).get();
  const fcmToken = recipientDoc.data()?.fcmToken;
  if (!fcmToken) return;

  await admin.messaging().send({
    token: fcmToken,
    notification: { title: message.senderName, body: message.text },
    data: { conversationId: message.conversationId, type: 'chat' },
    android: { priority: 'high' },
    apns: { payload: { aps: { badge: 1, sound: 'default' } } },
  });
});
```

Android-specific: set `android: { priority: 'high' }`. Without this, Android battery optimization kills the notification on many Chinese OEM devices (Xiaomi, OPPO, Realme — popular in SK/CZ market).

Always save the FCM token to Firestore on every app open, not just on first install. Tokens rotate, and a stale token causes silent delivery failure with no error.

---

### P-15 — Offline Message Queue Not Persisted

**Severity:** Medium
**Phase:** Phase 4

**Warning signs:**
- User types a message, loses Wi-Fi, hits send — message disappears when app reopens
- Firestore offline persistence queues writes but the queue is cleared on app restart
- User has no visual indication that their message is pending

**Prevention:**

Firestore's offline persistence automatically queues writes and replays them when connectivity returns — but only within the same app session. Across restarts, the write is lost.

For CATCH's bazár chat, implement a simple local pending queue in MMKV (faster than AsyncStorage for this use case):

```ts
// On send: save to local queue first
await MMKV.set(`pending_msg_${messageId}`, JSON.stringify(pendingMessage));

// On Firestore write success: remove from queue
await MMKV.delete(`pending_msg_${messageId}`);

// On app start: drain the queue
const pendingKeys = MMKV.getAllKeys().filter(k => k.startsWith('pending_msg_'));
for (const key of pendingKeys) {
  const msg = JSON.parse(MMKV.getString(key)!);
  await sendMessage(msg);  // retries the Firestore write
}
```

Show pending messages with a "čaká..." indicator in the chat UI — never silently drop them.

---

## AREA 5 — Community / Forum (Reddit-Style)

---

### P-16 — Vote Count Race Condition (Double-Vote and Phantom Votes)

**Severity:** Critical
**Phase:** Phase 3 — Forum

**Warning signs:**
- voteCount in Firestore goes negative (impossible legitimately)
- User can upvote, close app, reopen, and upvote again — count incremented twice
- Rapid double-tap on upvote adds 2 to the count

**Prevention:**

Never store vote counts as a simple incrementable integer without tracking who voted. Use a subcollection or a map field to record each voter's state:

```
posts/{postId}: {
  voteCount: 42,
  // map of uid -> vote direction prevents double-voting
  voters: { "uid_123": 1, "uid_456": -1 }
}
```

But `voters` map grows unbounded for popular posts. Better approach: dedicated `votes` subcollection + Firestore transaction:

```ts
// votes/{postId}/userVotes/{uid}: { value: 1 | -1 }

const castVote = async (postId: string, value: 1 | -1) => {
  const uid = auth.currentUser!.uid;
  const voteRef = doc(db, `votes/${postId}/userVotes/${uid}`);
  const postRef = doc(db, 'posts', postId);

  await runTransaction(db, async (tx) => {
    const existing = await tx.get(voteRef);
    const previousValue = existing.exists() ? existing.data().value : 0;
    const delta = value - previousValue;

    tx.set(voteRef, { value });
    tx.update(postRef, { voteCount: increment(delta) });
  });
};
```

Firestore `increment()` is atomic — safe against concurrent updates. The transaction ensures the vote is idempotent.

Security rule to enforce server-side:
```
match /votes/{postId}/userVotes/{uid} {
  allow write: if request.auth.uid == uid;
}
```

---

### P-17 — Spam and Bot Content at Launch

**Severity:** High
**Phase:** Phase 3 — before opening community to public

**Warning signs:**
- Forum contains identical posts from newly registered accounts
- Bazár has duplicate listings from the same seller pointing to fake email addresses
- Offensive content appears within hours of opening registration

**Prevention:**

Minimum viable moderation stack for a solo developer at launch:

1. **Rate limiting via Cloud Functions** — Firestore Security Rules alone cannot rate-limit. Create a `userActivity` counter in Firestore and check it in a Cloud Function before allowing post/listing creation:
   - Max 5 posts per 24h per user
   - Max 3 Bazár listings per user on free tier (already in the PRD)
   - 10-minute cooldown between posts for accounts less than 7 days old

2. **New account restrictions** — Accounts less than 24 hours old cannot post in the forum or create listings. Only catch log and spot ratings allowed. This eliminates 90% of bots.

3. **Report system first, moderation dashboard second** — Build the report button into every post, comment, and listing on day 1. It takes 30 minutes to implement. Build the admin moderation dashboard only when you have 100+ reports. Until then, check flagged documents in the Firebase console directly.

4. **No anonymous posting** — Require email verification before first post. Use `user.emailVerified` check in Firestore Security Rules:
   ```
   allow create: if request.auth.token.email_verified == true;
   ```

---

### P-18 — Infinite Scroll Cursor Breaks After Document Update

**Severity:** Medium
**Phase:** Phase 3

**Warning signs:**
- Forum user is on page 3, scrolls down, sees posts they already saw on page 1
- A post that was on page 2 disappears entirely from the feed
- Posts jump position while the user is reading

**Prevention:**

Cursor-based pagination with `startAfter(lastDoc)` fails when documents in the collection are updated (e.g., voteCount changes) and the `orderBy` field changes — the document moves position in the query result set.

For the Forum feed, sort by `createdAt` (immutable), not `voteCount` (mutable). Reserve vote-sorted feeds for a dedicated "Top" tab that always loads fresh without pagination. This is identical to how Reddit separates "New" (chronological, paginatable) from "Hot" (score-ranked, no cursor pagination).

```ts
// "New" tab — safe for cursor pagination
query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20), startAfter(cursor))

// "Top" tab — always fresh, no cursor
query(collection(db, 'posts'), orderBy('voteCount', 'desc'), limit(50))
```

---

## AREA 6 — RevenueCat + Expo

---

### P-19 — IAP Not Working in Expo Go or Development Builds

**Severity:** Critical
**Phase:** Phase 5 — Premium

**Warning signs:**
- `react-native-purchases` crashes on import in Expo Go
- Product list loads but `purchasePackage()` throws an error with no user-facing message
- iOS simulator shows products but purchase flow fails silently

**Prevention:**

In-app purchases require a native development build — Expo Go will never support them. RevenueCat provides a Preview API Mode for Expo Go that mocks purchase calls at the JS level, useful for testing UI flow only:

```ts
import Purchases, { LOG_LEVEL } from 'react-native-purchases';

const initRevenueCat = () => {
  Purchases.setLogLevel(LOG_LEVEL.DEBUG);  // always in dev

  if (__DEV__) {
    // mock mode for Expo Go
    // real build will use native SDK
  }

  Purchases.configure({
    apiKey: Platform.select({
      ios: process.env.EXPO_PUBLIC_RC_IOS_KEY!,
      android: process.env.EXPO_PUBLIC_RC_ANDROID_KEY!,
    })!,
  });
};
```

For actual testing: always use a physical device with a development build (`eas build --profile development`). iOS simulator does not support StoreKit purchases at all.

---

### P-20 — Sandbox Purchase Visible in App but Invisible in RevenueCat Dashboard

**Severity:** High
**Phase:** Phase 5

**Warning signs:**
- Sandbox purchase completes on iOS, receipt appears in App Store Connect, but RevenueCat shows no transaction
- `customerInfo.activeSubscriptions` is empty after a confirmed sandbox purchase
- Entitlement name configured in RevenueCat does not match exactly what the app checks

**Prevention:**

1. **Entitlement name must match exactly** — "Premium" and "premium" are different strings. Check RevenueCat dashboard entitlement identifiers character by character.

2. **Sandbox transactions are slow** — App Store sandbox servers can take 5–15 minutes to validate a receipt and report it to RevenueCat. Do not assume immediate failure.

3. **Sign out of production Apple ID before testing** — A device signed into a production Apple ID cannot make sandbox purchases. Settings → App Store → scroll down → tap Apple ID → sign out → sign back in with Sandbox Tester account.

4. **After purchase, always call `syncPurchases()`** on first app open to catch any purchases made while offline:
   ```ts
   useEffect(() => {
     Purchases.syncPurchases().catch(() => {}); // non-fatal
   }, []);
   ```

---

### P-21 — Entitlement Not Unlocked Despite Active Subscription

**Severity:** High
**Phase:** Phase 5

**Warning signs:**
- RevenueCat dashboard shows subscription active
- `customerInfo.entitlements.active` is empty in the app
- Calling `invalidateCustomerInfoCache()` hangs and never resolves (documented React Native SDK bug)

**Prevention:**

RevenueCat caches `customerInfo` for up to 5 minutes. After a purchase, always refetch immediately:

```ts
const purchase = await Purchases.purchasePackage(selectedPackage);
// DO NOT rely on cache after purchase
const freshInfo = await Purchases.getCustomerInfo();  // forces network fetch
setIsPremium(Object.keys(freshInfo.entitlements.active).length > 0);
```

For the restore purchases flow — common SK/CZ scenario: user reinstalls app or switches phone:
```ts
const handleRestorePurchases = async () => {
  try {
    const info = await Purchases.restorePurchases();
    if (Object.keys(info.entitlements.active).length > 0) {
      setIsPremium(true);
    } else {
      Alert.alert('Žiadne aktívne predplatné', 'Nenašlo sa žiadne predplatné na obnovenie.');
    }
  } catch (e) {
    Alert.alert('Chyba', 'Nepodarilo sa obnoviť predplatné. Skúste znova.');
  }
};
```

Returning users who delete and reinstall the app MUST have access to restore purchases without a paywall. Apple Review will reject apps that require re-purchasing a previously bought subscription.

---

## AREA 7 — Google Maps in Expo

---

### P-22 — API Key Exposed in Android Bundle

**Severity:** Critical
**Phase:** Phase 2 — before first public TestFlight/Play Store build

**Warning signs:**
- Google Maps API key appears in plaintext when the APK is decompiled with `apktool`
- The key is checked into git (very common with `app.json` configs)
- Google sends a billing alert: unexpected charges from an unknown source using your key

**Prevention:**

Never put the Maps API key directly in `app.json`. Use the Gradle Secrets plugin for Android and environment variables for iOS:

For Expo managed workflow, use `expo-build-properties` and `EXPO_PUBLIC_` environment variables with `app.config.js`:

```ts
// app.config.js (NOT app.json — .js allows env var interpolation)
export default {
  plugins: [
    [
      'react-native-maps',
      {
        androidGoogleMapsApiKey: process.env.GOOGLE_MAPS_ANDROID_KEY,
        iosGoogleMapsApiKey: process.env.GOOGLE_MAPS_IOS_KEY,
      },
    ],
  ],
};
```

Store keys in EAS Secrets (not `.env` files committed to git):
```bash
eas secret:create --scope project --name GOOGLE_MAPS_ANDROID_KEY --value "AIza..."
eas secret:create --scope project --name GOOGLE_MAPS_IOS_KEY --value "AIza..."
```

Even with this, the key is still in the compiled binary. Apply API key restrictions in Google Cloud Console:
- Android: restrict to your app's SHA-1 fingerprint + package name
- iOS: restrict to your app's bundle identifier
- Both: restrict to "Maps SDK for Android" and "Maps SDK for iOS" only — do NOT enable Geocoding API or Places API on the same key

**2025 note:** Google Maps API keys that accidentally have Gemini API scope enabled are now a critical security risk — they can be used to run LLM queries charged to your account. The Maps-only restriction prevents this.

---

### P-23 — Android vs iOS Maps Configuration Divergence

**Severity:** High
**Phase:** Phase 2

**Warning signs:**
- Map renders on iOS but shows "Google Maps API key missing" on Android
- Marker clustering works on iOS but crashes on Android
- User location permission works in Expo Go but not in production build

**Prevention:**

Android and iOS require separate API keys and separate initialization paths. In the Expo managed workflow with `react-native-maps`, the plugin handles AndroidManifest injection — but only if you run `expo prebuild` after adding the plugin.

After any change to `app.config.js` Maps configuration:
```bash
npx expo prebuild --clean  # regenerate native directories
```

Location permission differences:
- iOS: declare both `NSLocationWhenInUseUsageDescription` AND `NSLocationAlwaysAndWhenInUseUsageDescription` in `app.json` — even if you only need "when in use", Apple Review will ask about it
- Android: for showing spots near the user, `ACCESS_FINE_LOCATION` is required; `ACCESS_COARSE_LOCATION` causes inaccurate positioning

Always test maps on a physical Android device (Samsung Galaxy A-series = typical SK/CZ user device) — Android emulator has no GPS and Maps rendering differs from physical hardware.

---

## AREA 8 — Firestore Security Rules

---

### P-24 — Rules Left Open During Development

**Severity:** Critical
**Phase:** Phase 1 — set rules before any real data enters Firestore

**Warning signs:**
- Firebase console shows a security rules warning banner
- Rules were set to `allow read, write: if true;` to "fix things quickly" and never changed back
- In 2024, 916 Firebase websites exposed 125M user records including 19M plaintext passwords using this exact pattern

**Prevention:**

Start with deny-all and open up only what is needed:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Default: deny everything
    match /{document=**} {
      allow read, write: if false;
    }

    // Users: read own profile, write own profile
    match /users/{uid} {
      allow read: if request.auth != null;
      allow write: if request.auth.uid == uid
        && !('role' in request.resource.data)  // prevent self-promoting to admin
        && !('karma' in request.resource.data); // karma is server-only
    }

    // Catches: only owner can CRUD
    match /catches/{catchId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == request.resource.data.userId;
      allow update, delete: if request.auth.uid == resource.data.userId;
    }

    // Listings: owner can write, authenticated users can read active listings
    match /listings/{listingId} {
      allow read: if request.auth != null && resource.data.status == 'active';
      allow create: if request.auth.uid == request.resource.data.sellerId
        && request.resource.data.status == 'active';
      allow update: if request.auth.uid == resource.data.sellerId
        && request.resource.data.sellerId == resource.data.sellerId; // immutable
      allow delete: if request.auth.uid == resource.data.sellerId;
    }

    // Messages: only conversation participants
    match /messages/{messageId} {
      allow read, write: if request.auth.uid == resource.data.senderId
        || request.auth.uid == resource.data.recipientId;
    }

    // Posts (forum): authenticated create, owner update/delete
    match /posts/{postId} {
      allow read: if request.auth != null;
      allow create: if request.auth.uid == request.resource.data.authorId
        && request.auth.token.email_verified == true;
      allow update: if request.auth.uid == resource.data.authorId
        && !('voteCount' in request.resource.data); // voteCount is server-only
      allow delete: if request.auth.uid == resource.data.authorId;
    }
  }
}
```

---

### P-25 — Users Can Write Server-Only Fields

**Severity:** Critical
**Phase:** Phase 1, Phase 3

**Warning signs:**
- A user sets their own `karma: 999999` via Firestore SDK from the browser console
- A seller changes their own `rating: 5.0` directly
- A user sets `role: "admin"` on their own document

**Prevention:**

Firestore rules must explicitly block writes to computed/privileged fields. Use `request.resource.data` to inspect what the client is trying to write:

```
// Prevent writing computed fields that only Cloud Functions should touch
allow update: if request.auth.uid == resource.data.userId
  && !('karma' in request.resource.data.diff(resource.data).affectedKeys())
  && !('role' in request.resource.data.diff(resource.data).affectedKeys())
  && !('sellerRating' in request.resource.data.diff(resource.data).affectedKeys());
```

Fields that must be server-only for CATCH:
- `users/{uid}.karma` — updated by Cloud Function when posts/catches get votes
- `users/{uid}.role` — "admin" flag
- `listings/{id}.sellerRating` — aggregated from `sellerReviews`
- `posts/{id}.voteCount` — updated by the vote transaction function
- `users/{uid}.listingCount` — enforced by free tier limit

---

### P-26 — Subcollection Access Not Explicitly Denied

**Severity:** High
**Phase:** Phase 1

**Warning signs:**
- Rules protect `users/{uid}` but `users/{uid}/privateData/{doc}` is readable by anyone
- `votes/{postId}/userVotes/{uid}` is readable, exposing who voted on what

**Prevention:**

In Firestore Security Rules, rules do NOT cascade to subcollections. You must explicitly match them:

```
// This does NOT protect subcollections:
match /users/{uid} {
  allow read: if request.auth.uid == uid;
}

// This is required separately:
match /users/{uid}/privateData/{doc} {
  allow read: if request.auth.uid == uid;
}
```

Use `match /{document=**}` as your catch-all deny rule at the top, then selectively open paths. This is the only safe default.

---

## AREA 9 — App Store / Play Store Submission

---

### P-27 — Photo Permission Rejection on Google Play (2025 Policy)

**Severity:** Critical
**Phase:** Phase 5 — before first Play Store submission

**Warning signs:**
- App declares `READ_MEDIA_IMAGES` and `READ_MEDIA_VIDEO` in AndroidManifest
- No "broad access" declaration submitted to Google Play Console
- As of May 28, 2025, non-compliant apps can be removed from Play Store

**Prevention:**

Google's 2025 Photo and Video Permissions policy requires apps to either:
a) Use the Android system photo picker (no broad permission needed), or
b) Declare and justify the need for broad media access

For CATCH (catch photo upload, bazár listing photos): use `expo-image-picker` with `mediaTypes: ImagePicker.MediaTypeOptions.Images`. This library uses the Android system photo picker on Android 13+ by default — no `READ_MEDIA_IMAGES` permission needed.

```ts
const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images,
  allowsMultipleSelection: true,
  quality: 0.8,
  // DO NOT set allowsEditing: true with multiple selection — crashes on Android
});
```

Verify the generated `AndroidManifest.xml` after `expo prebuild` does not include `READ_MEDIA_IMAGES` unless you explicitly added it. If it is present, file a declaration form in Play Console explaining why.

---

### P-28 — IAP Payment Flow Compliance Rejection

**Severity:** Critical
**Phase:** Phase 5

**Warning signs:**
- App submitted with a "Subscribe via website" link or external payment reference
- Subscription page lacks required legal text
- The app references "€1/mes" without showing it via the App Store/Play Store product price

**Prevention:**

Both Apple and Google require that all digital content purchases go through their payment systems with no external links or references.

CATCH-specific checklist:
- [ ] Premium subscription screen shows ONLY the RevenueCat paywall — no "buy on website" links
- [ ] Price displayed comes from RevenueCat `package.product.priceString` (localized by the store), not hardcoded "€1"
- [ ] Terms of Service and Privacy Policy links are present on the subscription screen (Apple Review requires this)
- [ ] "Restore Purchases" button is visible on the paywall screen — required by Apple, rejection without it
- [ ] Subscription description accurately states what is included — "AI predikcie, unlimited inzeráty"
- [ ] No mention of Stripe, PayPal, or any payment system other than the respective store

Apple Guideline 3.1.2 rejections (subscription info) are the most common IAP rejection reason. The subscription page must clearly describe the billing period, price, and what happens at renewal.

---

### P-29 — Push Notification Permission Prompt Timing

**Severity:** Medium
**Phase:** Phase 1 (architecture), Phase 5 (UX polish)

**Warning signs:**
- App requests notification permission on first launch before the user sees any value
- iOS permission rejection rate above 60% (industry average is 40–50%)
- App rejected because notification permission request has no context shown to the user

**Prevention:**

Never request notification permission on app launch. Show it contextually:

- After user creates their first catch log entry: "Chceš dostávať predikcie kedy je najlepší čas na rybolov?"
- After user posts in the forum: "Chceš vedieť keď ti niekto odpovie?"
- After user creates a bazár inzerát: "Chceš dostávať správy od záujemcov?"

Apple guidelines require that the system notification prompt is preceded by your own explanation screen (a "pre-permission" screen). Showing context increases acceptance rates from ~40% to ~70%.

```ts
const requestPushPermission = async () => {
  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing === 'granted') return true;

  // Show your own explanation modal first
  const userAgreed = await showPermissionExplanationModal();
  if (!userAgreed) return false;

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};
```

---

### P-30 — Content Moderation Policy for App Review (CSAE Rules Jan 2026)

**Severity:** High
**Phase:** Phase 3 — before community launch

**Warning signs:**
- App has user-generated content (forum posts, messages) but no in-app reporting mechanism
- New CSAE requirements effective January 2026 require explicit content policies
- App Store Review asks for content moderation documentation

**Prevention:**

Both stores now require apps with UGC to have:
1. An in-app mechanism to report offensive content
2. A written content policy accessible from within the app
3. A process to review reports and remove content

Minimum implementation:
- Report button on every post, comment, and listing (3-dot menu → "Nahlásiť")
- Reported items stored in `reports/{id}` collection (reviewer reviews in Firebase console initially)
- Community guidelines page in the app's settings screen with link to full terms
- Privacy policy hosted at a URL (not just in-app) — required for App Store Connect

---

## AREA 10 — Solo Developer Traps

---

### P-31 — In-App Chat is 3x More Complex Than It Looks

**Severity:** High
**Phase:** Phase 4 — estimate time accordingly

**Warning signs:**
- Initial estimate: "3 days"
- Actual time including: message ordering, offline queue, double-send prevention, FCM integration, conversation list with last-message preview, unread badge count, typing indicators
- Actual time: 3–4 weeks for a production-quality implementation

**Prevention:**

The "simple chat" in CATCH (buyer ↔ seller for Bazár) must handle:
- Creating conversations without duplicates (two users can only have one conversation per listing)
- Last message preview in conversation list (denormalized field on conversation document)
- Unread count per user (atomic increment, reset on read)
- Message pagination (last 50 messages first, older ones on demand)
- Soft-delete (seller or buyer can "archive" conversation)
- FCM push on new message (Cloud Function)

Realistic estimate breakdown:
- Firestore data model + rules: 1 day
- Message list screen (FlashList + real-time listener + pagination): 2 days
- Send message with idempotency + offline queue: 1 day
- Conversation list with unread count: 2 days
- FCM notification Cloud Function: 1 day
- Testing on slow network + edge cases: 2 days

**Total: 9 working days minimum**. Do not schedule this in the same sprint as Bazár listing creation.

---

### P-32 — Expo Router Deep Link to Notification Not Working

**Severity:** High
**Phase:** Phase 4, Phase 5

**Warning signs:**
- Tapping a push notification opens the app but lands on the home screen, not the conversation
- Deep link works when app is in foreground but not from killed state
- Expo Router's `useURL()` returns null when app launches from a notification

**Prevention:**

Expo Router handles deep links via URLs, but FCM notifications carry data payloads, not URLs. You must bridge the two explicitly:

```ts
// In app/_layout.tsx
useEffect(() => {
  // Handle notification that launched the app from killed state
  Notifications.getLastNotificationResponseAsync().then((response) => {
    if (response) {
      const data = response.notification.request.content.data;
      handleNotificationNavigation(data);
    }
  });

  // Handle notification tap while app is in background
  const sub = Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data;
    handleNotificationNavigation(data);
  });

  return () => sub.remove();
}, []);

const handleNotificationNavigation = (data: NotificationData) => {
  if (data.type === 'chat') {
    router.push(`/bazaar/conversation/${data.conversationId}`);
  } else if (data.type === 'forum_reply') {
    router.push(`/forum/post/${data.postId}`);
  }
};
```

The navigation must be deferred until the router is mounted. Use a ref to store pending navigation and execute it after the root layout's `useEffect` fires.

---

### P-33 — Expo OTA Updates Breaking Production

**Severity:** High
**Phase:** All phases — policy decision needed in Phase 1

**Warning signs:**
- An OTA update (EAS Update) changes the Firestore data model expected by the app
- Old users on the previous JS bundle crash because the schema changed
- You push a fix OTA but 20% of users are still on the broken version hours later

**Prevention:**

OTA updates (EAS Update) push new JS bundles without going through app store review. This is powerful but dangerous for schema changes.

Rules for CATCH:
1. OTA updates are safe for: UI fixes, copy changes, color tweaks, adding new screens that use existing data
2. Always require a store submission for: Firestore schema changes, new required fields, new native module dependencies, security rule changes

Use `expo-updates` channel management — ship critical schema changes to a `staging` channel first:
```bash
eas update --branch staging --message "schema v2: listings add expiresAt field"
# test with internal testers
eas update --branch production --message "schema v2: listings add expiresAt field"
```

Implement a minimum app version check using Remote Config or a Firestore document:
```ts
const minVersion = await firestore().doc('config/app').get();
if (compareVersions(Constants.expoConfig.version, minVersion.data().minimumVersion) < 0) {
  Alert.alert('Potrebná aktualizácia', 'Prosím aktualizuj appku v obchode.');
}
```

---

### P-34 — AI Prediction Cost Spiral

**Severity:** Medium
**Phase:** Phase 5 — Premium feature

**Warning signs:**
- GPT-4o mini called on every weather data refresh (every 10 minutes)
- No caching: 100 premium users × 144 calls/day = 14,400 API calls/day
- OpenAI bill at end of month is 10x the €1/month subscription revenue

**Prevention:**

AI predictions are valid for a full day given the input data (weather forecast + moon phase + barometric pressure). Never call the AI more than once per 24 hours per user per location.

```ts
// Cloud Function: generate prediction once, cache in Firestore
const predictionRef = doc(db, `predictions/${uid}_${spotId}_${dateKey}`);
const existing = await predictionRef.get();

if (existing.exists()) {
  return existing.data(); // serve from cache
}

const prediction = await callOpenAI(weatherData, moonPhase, pressure);
await setDoc(predictionRef, { prediction, generatedAt: serverTimestamp() });
return prediction;
```

Cache key: `{uid}_{spotId}_{YYYY-MM-DD}`. The prediction is generated server-side (Cloud Function), never client-side. This also prevents API key exposure.

Cost math: 100 premium users × 1 call/day × 500 tokens average = 50,000 tokens/day = ~€0.015/day = ~€0.45/month. Revenue: €100/month. Sustainable ratio even at 10x growth.

---

### P-35 — Zustand Store Not Persisted Across App Restarts

**Severity:** Medium
**Phase:** Phase 1 — architecture

**Warning signs:**
- User's selected filters, preferred fish types, or unit preferences reset on every app open
- The spot that the user was viewing disappears from history after relaunch
- Zustand store is initialized with empty defaults on every cold start

**Prevention:**

Use `zustand/middleware` `persist` with MMKV for fast, synchronous storage:

```ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

const zustandStorage = {
  setItem: (key, value) => storage.set(key, value),
  getItem: (key) => storage.getString(key) ?? null,
  removeItem: (key) => storage.delete(key),
};

export const useSettingsStore = create(
  persist(
    (set) => ({
      weightUnit: 'kg',
      lengthUnit: 'cm',
      setWeightUnit: (unit) => set({ weightUnit: unit }),
    }),
    {
      name: 'catch-settings',
      storage: createJSONStorage(() => zustandStorage),
    }
  )
);
```

MMKV is 30x faster than AsyncStorage for synchronous reads — critical for stores that gate initial render (e.g., theme, units).

Do NOT persist auth state in Zustand — that belongs in Firebase Auth's own persistence layer (AsyncStorage via `initializeAuth`). Mixing them causes stale auth states.

---

## Severity Summary

| # | Pitfall | Severity | Phase |
|---|---------|----------|-------|
| P-01 | FlatList instead of FlashList | High | 2, 3, 4 |
| P-02 | Image memory explosion | Critical | 2, 4 |
| P-03 | JS thread blocking on navigation | High | All |
| P-04 | Unsubscribed onSnapshot listeners | Critical | 1, 3, 4 |
| P-05 | Hot-path reads burning quota | Critical | 1 |
| P-06 | Missing composite indexes | High | 2, 3, 4 |
| P-07 | Firestore cold start | Medium | 1, 5 |
| P-08 | Geo-query reading excess documents | High | 2 |
| P-09 | currentUser null on relaunch | Critical | 1 |
| P-10 | Token not refreshing after background | High | 1 |
| P-11 | Biometric auth session mismatch | Medium | 5 |
| P-12 | Message ordering with client timestamps | Critical | 4 |
| P-13 | Duplicate messages from double-tap | High | 4 |
| P-14 | Push notification not delivered for chat | High | 4 |
| P-15 | Offline message queue not persisted | Medium | 4 |
| P-16 | Vote count race condition | Critical | 3 |
| P-17 | Spam and bots at launch | High | 3 |
| P-18 | Infinite scroll cursor breaks on update | Medium | 3 |
| P-19 | IAP not working in Expo Go / dev | Critical | 5 |
| P-20 | Sandbox purchase invisible in RevenueCat | High | 5 |
| P-21 | Entitlement not unlocked after purchase | High | 5 |
| P-22 | API key exposed in Android bundle | Critical | 2 |
| P-23 | Android vs iOS Maps config divergence | High | 2 |
| P-24 | Security rules left open | Critical | 1 |
| P-25 | Users write server-only fields | Critical | 1, 3 |
| P-26 | Subcollection access not denied | High | 1 |
| P-27 | Photo permission Play Store rejection | Critical | 5 |
| P-28 | IAP payment flow compliance rejection | Critical | 5 |
| P-29 | Push permission prompt timing | Medium | 1, 5 |
| P-30 | No UGC content moderation for review | High | 3 |
| P-31 | Chat complexity underestimated | High | 4 |
| P-32 | Deep link from notification not working | High | 4, 5 |
| P-33 | OTA updates breaking production | High | All |
| P-34 | AI prediction cost spiral | Medium | 5 |
| P-35 | Zustand not persisted across restarts | Medium | 1 |

---

## Phase-Ordered Action Items

### Phase 1 — Do Before Writing Any Feature Code
- P-09: Configure Firebase Auth with AsyncStorage persistence
- P-24: Set Firestore deny-all rules immediately
- P-25: Block server-only fields in rules
- P-26: Explicitly match all subcollections in rules
- P-04: Establish the onSnapshot cleanup pattern (code template in shared utils)
- P-05: Design denormalized data model — no N+1 reads
- P-35: Set up Zustand with MMKV persistence

### Phase 2 — Catch Log + Maps
- P-22: Move API keys to EAS Secrets before first build
- P-23: Test maps on physical Android device
- P-08: Use geohash + Firestore native range query for spot geo-queries
- P-02: Add image compression pipeline before any Storage upload
- P-01: Replace any FlatList with FlashList

### Phase 3 — Community / Forum
- P-16: Implement vote with Firestore transaction from day 1
- P-17: Add new account posting restrictions before opening to public
- P-06: Create composite indexes for all forum queries in Firebase console
- P-30: Add report button to every UGC element

### Phase 4 — Bazár + Chat
- P-12: Use serverTimestamp() for ALL message timestamps
- P-13: Use UUID document IDs for idempotent message writes
- P-14: Send FCM notifications from Cloud Function, not client
- P-31: Allocate 9+ days for chat feature, not 3
- P-32: Wire notification tap → Expo Router navigation

### Phase 5 — Premium + Submission
- P-19: Build development build for RevenueCat testing early
- P-20: Test full sandbox purchase flow on physical device
- P-21: Always call getCustomerInfo() after purchase, not cache
- P-27: Verify photo picker usage, no READ_MEDIA_IMAGES in manifest
- P-28: Audit paywall screen for Apple/Google compliance checklist
- P-10: Add token refresh on AppState foreground transition
- P-34: Cache AI predictions per user/day in Firestore
