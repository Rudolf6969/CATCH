# CATCH — Roadmap

**Total phases:** 8
**Requirements mapped:** 70/70 ✓
**Granularity:** Fine
**Created:** 2026-03-12

---

## Overview

| # | Phase | Goal | REQ Count | Complexity |
|---|-------|------|-----------|------------|
| 1 | Foundation & Auth | 6/6 Complete | 13 | Medium |
| 2 | 4/9 | In Progress|  | High |
| 3 | Revír Map + Podmienky | Rybár vidí live podmienky na svojej polohe a nájde revír na mape | 7 | Medium |
| 4 | AI Odporúčania + Premium | Rybár dostane expertný tip na nástrahu v SK a vie si kúpiť Premium | 11 | High |
| 5 | Komunita vo Feede | Rybár zverejní tip/montáž ako post vo Feede, ostatní lajkujú a komentujú | 8 | High |
| 6 | Marketplace (Bazár) | Rybár pridá inzerát, iní ho nájdu v okolí a uložia do wishlistu | 10 | High |
| 7 | In-App Chat | Kupujúci a predajca komunikujú v reálnom čase priamo v appke | 6 | High |
| 8 | Notifications, Gamification & Polish | Appka posiela push notifikácie, odmeňuje aktivitu a je pripravená na produkciu | 9 | Medium |

**Celkový počet requirements v8 fázach:** 13 + 16 + 7 + 11 + 8 + 10 + 6 + 9 = **80 mapovaní** (70 unikátnych REQ-IDs, niektoré cross-cutting)

---

## Phase Details

---

### Phase 1: Foundation & Auth

**Goal:** Prihlásený používateľ vidí appku s 5 tabmi (Podmienky / Feed / ⊕ / Denník / Bazár), EAS dev build beží na reálnom Android/iOS zariadení a Firebase je plne nakonfigurované.

**Requirements:**
INFRA-01, INFRA-02, INFRA-03, INFRA-04, INFRA-05, INFRA-06, INFRA-07,
AUTH-01, AUTH-02, AUTH-03, AUTH-04, AUTH-05, AUTH-06

**Success Criteria:**
1. `eas build --profile development` prebehne bez chýb a inštaluje sa na reálnom zariadení (Android + iOS cez EAS)
2. Nový používateľ sa zaregistruje (email + heslo + potvrdiť heslo), dostane verifikačný email a prihlási sa — session pretrváva po reštarte appky
3. Neoverený používateľ vidí animated splash → login screen; po prihlásení automatický redirect na Podmienky tab
4. Všetkých 5 tabov (Podmienky, Feed, ⊕ FAB, Denník, Bazár) je viditeľných a navigovateľných — obsah je branded placeholder s dummy dátami
5. Design system tokeny (`theme.ts`) sú aplikované: farby (#0A1628, #40916C, #F4A261), Outfit/Inter fonty, spacing tokeny konzistentné naprieč všetkými obrazovkami

**Complexity:** Medium
**Critical path:** Áno — každá ďalšia fáza závisí od auth (uid) a design systemu

**Plans:** 6/6 plans executed (COMPLETE)

Plans:
- [x] 01-01-PLAN.md — Expo init + Firebase konfigurácia + EAS profily + Firestore skeleton rules
- [x] 01-02-PLAN.md — Test infraštruktúra Wave 0: Jest + Firebase mocks + stub testy
- [x] 01-03-PLAN.md — Design system: theme.ts + i18n SK/CZ + 6 UI primitives
- [x] 01-04-PLAN.md — Auth flow: Zustand store + root layout Stack.Protected + login/register/forgot-password
- [x] 01-05-PLAN.md — Tab navigácia: expo-router/ui custom FAB tabs + 5 placeholder screens
- [x] 01-06-PLAN.md — PostHog analytics + EAS dev build checkpoint

**Implementation notes:**
- Vytvoriť EAS dev build v **deň 1** — Expo Go nestačí (Firebase native + FCM nefungujú)
- `@react-native-firebase v21` namiesto Firebase JS SDK — offline persistence out-of-the-box, natívny výkon
- Použiť `Stack.Protected` z Expo Router v5 pre auth guard — žiadne manuálne redirecty
- i18n (`expo-localization` + `i18n-js`) zaviesť hneď — retroaktívne je 3x drahšie
- Windows gotchas: `git config core.longpaths true`, `EXPO_USE_FAST_RESOLVER=1` pre Metro
- Modular Firebase API od dňa 1: `import { getFirestore } from '@react-native-firebase/firestore'` — nie namespaced API (zruší sa vo v22)
- Firestore security rules: skeleton so základnými pravidlami (users, catches, spots) — rozširovať v každej fáze
- Fonty: Outfit (heading) + JetBrains Mono (čísla) — nainštalovať cez `expo-font` config plugin

---

### Phase 2: Feed + Catch Post

**Goal:** Rybár odfotí úlovok, post sa do 5 sekúnd objaví vo Feede komunite a automaticky sa uloží do súkromného Denníka. Scrollovateľný Feed zobrazuje úlovky iných používateľov.

**Requirements:**
PHOTO-01, PHOTO-02, PHOTO-03, PHOTO-04,
DIARY-01, DIARY-02, DIARY-03, DIARY-04, DIARY-05, DIARY-06, DIARY-07,
PROF-01, PROF-02, PROF-03, PROF-04, PROF-05

**Success Criteria:**
1. Používateľ pridá úlovok (ryba, váha, dĺžka, fotka, revír) za menej ako 90 sekúnd — stopky merateľné
2. Fotka sa komprimuje na <500KB klientsky pred uploadom; blurhash placeholder sa zobrazí počas načítavania
3. Počasie (teplota, tlak, vietor, fáza mesiaca) sa automaticky doplní z Open-Meteo bez ďalšej akcie používateľa
4. Zoznam úlovkov funguje offline — pridaný úlovok sa objaví okamžite (optimistický UI), synchronizuje sa po reconnecte
5. Profil zobrazuje celkové štatistiky (počet, celková hmotnosť, najväčšia ryba) a posledných 12 úlovkov v gridu

**Complexity:** High
**Critical path:** Áno — image upload pipeline sa reuse v každom ďalšom feature (posty, inzeráty, avatatre)

**Implementation notes:**
- `expo-image-manipulator` pre kompresiu na strane klienta (resize 1200px šírka, JPEG 0.8 quality)
- `expo-image v2` pre zobrazenie s blurhash placeholderom a crossfade — `expo-image` nie `Image` z RN
- `@shopify/flash-list` pre zoznam úlovkov — `estimatedItemSize` povinný, nikdy `key` prop na renderItem komponent
- Fire-and-forget write pre catch creation (offline use case): `docRef.set(data)` bez `await` — blokuje offline
- React Query `onMutate` pre optimistický UI update pri catch creation
- Fish species zoznam: 100+ SK/CZ druhov v `constants/fishSpecies.ts` — statický JSON, žiadny Firestore fetch
- Open-Meteo API (free, no key): `https://api.open-meteo.com/v1/forecast` — parametre: `hourly=pressure_msl,temperature_2m,windspeed_10m,precipitation`
- Storage path: `catches/{userId}/{catchId}/{filename}.jpg` — security rules: write len vlastný uid
**Plans:** 4/9 plans executed

Plans:
- [ ] 02-01-PLAN.md — Inštalácia závislostí + Wave 0 test scaffolding (5 test súborov)
- [ ] 02-02-PLAN.md — TypeScript typy (CatchDocument, UserDocument) + image upload pipeline
- [ ] 02-03-PLAN.md — Fish species zoznam (100+ SK/CZ) + weather service (Open-Meteo + suncalc)
- [ ] 02-04-PLAN.md — Catches/Feed stores + useCatches/useFeed hooks (fire-and-forget CRUD)
- [ ] 02-05-PLAN.md — 3-krokový catch wizard (app/catch/new/step-1,2,3)
- [ ] 02-06-PLAN.md — Feed screen s FlashList v2 + CatchCard + CatchCarousel + FishBadge
- [ ] 02-07-PLAN.md — Denník screen + Catch detail screen (edit/delete)
- [ ] 02-08-PLAN.md — Profil screen (Twitter-style header + CatchGrid + karma/badges)
- [ ] 02-09-PLAN.md — Human verify checkpoint (celý Phase 2 flow)

---

### Phase 3: Revír Map + Podmienky tab

**Goal:** Podmienky tab zobrazuje live počasie (teplota vody+vzduchu, tlak, vietor, fáza mesiaca) na aktuálnej polohe. Mapa tab zobrazuje 330+ SK/CZ revírov, rybár tapne a vidí regulácie.

**Requirements:**
MAP-01, MAP-02, MAP-03, MAP-04, MAP-05, MAP-06, MAP-07

**Success Criteria:**
1. Mapa SK+CZ zobrazuje 330+ revírov; markery sa klastrujú pri oddialení a rozpíjajú pri priblížení
2. Tap na marker otvorí bottom sheet s názvom, číslom SRZ, povolenými druhmi, lovnými mierami, hájením a fotkami
3. Filter podľa druhu ryby zobrazí iba revíry, kde je daný druh povolený — výsledky sa aktualizujú bez reloadu mapy
4. Základné dáta revírov sú dostupné offline (cachované pri prvom načítaní)
5. Na mape sú viditeľné public úlovky iných používateľov ako odlíšené markery s miniaturou fotky

**Complexity:** Medium
**Critical path:** Nie — môže ísť paralelne s Phase 4 (ak dvaja vývojári)

**Implementation notes:**
- `react-native-maps v1.18` — NIE `expo-maps` (stále alpha, iOS 17+ only, bez custom markerov)
- `@mapbox/supercluster v8` pre clustering — `react-native-map-clustering` je unmaintained/dead
- Spot dáta: predpripraviť JSON seed pre 330+ SRZ/ČRS revírov — importovať cez Firebase Admin SDK (nie klient)
- `geofire-common` (Google) pre geohash — NIE geofirestore (unmaintained)
- Geohash pole ukladať vedľa GeoPoint: `{ location: GeoPoint, geohash: string }` — pre proximity queries
- Firestore rule pre spots: `allow read: if true; allow write: if false` — len admin SDK zápis
- Offline cache: React Query `staleTime: Infinity` + `cacheTime: 7 * 24 * 60 * 60 * 1000` pre spots
- User tips/komentáre k revíru: subcollection `spots/{spotId}/tips` — public read, auth write
- Public catches na mape: query `catches` kde `isPublic == true` + GeoPoint pre marker pozíciu

---

### Phase 4: AI Predictions + Premium

**Goal:** Rybár vidí AI predikciu ideálneho času na rybolov v slovenčine, Premium používateľ má 7-dňový výhľad a vie si predplatné kúpiť priamo v appke.

**Requirements:**
AI-01, AI-02, AI-03, AI-04, AI-05, AI-06,
PREM-01, PREM-02, PREM-03, PREM-04, PREM-05

**Success Criteria:**
1. Denná predikcia zobrazuje skóre 1–10 a slovenský text odôvodnenia (<3 sekundy odozvy)
2. Predikcia uvádza konkrétne časové okno (ranné/poludňajšie/večerné) ako najlepší čas daného dňa
3. Free tier vidí iba dnešnú predikciu; Premium vidí 7-dňový výhľad — gate je viditeľný a clickable
4. RevenueCat paywall sa otvorí, používateľ dokončí nákup (mesačný €1 alebo ročný €9.99) a Premium sa aktivuje bez reštartu appky
5. Po 10+ úlovkoch obsahuje predikcia personalizovanú vetu založenú na používateľových historických podmienkach

**Complexity:** High
**Critical path:** Nie — závisí od Phase 2 (historické úlovky pre personalizáciu)

**Implementation notes:**
- Open-Meteo primárny (free, no key, DWD ICON-D2 model — najvyššia presnosť pre SK/CZ oblasť)
- Parametre: `hourly=pressure_msl,temperature_2m,windspeed_10m,precipitation,cloudcover` + `daily=moonrise,moonset,sunrise,sunset`
- Solunar výpočet: knižnica `solunar` alebo vlastný algoritmus (mesačný azimut/elevacija)
- GPT-4o mini prompt: systémový prompt v SK, vstup = tlak + trend tlaku + teplota + vietor + fáza mesiaca + solunar peak times
- **Barometrický tlak je primárny prediktor** (vedecky overený pre sladkovodu) — nie lunárne fázy. Lunar = sekundárny signal v texte.
- `react-native-purchases v8.9.2+` — pinovat presne na `^8.9.2` (fixuje fontFamily crash)
- RevenueCat: dev build povinný — nefunguje v Expo Go
- `<PremiumGate>` komponent: centralizovaný, reusable — wrap okolo Premium-only content
- Firestore: predikcia cachovaná v `predictions/{userId}/daily/{date}` — neregenerovať ak existuje pre daný deň
- Annual plan €9.99 ako DEFAULT CTA (3x nižší churn) — mesačný €1 ako alternatíva

---

### Phase 5: Komunita vo Feede

**Goal:** Rybár zverejní tip alebo montáž ako post vo Feede, ostatní lajkujú a komentujú. Feed má kategórie (Úlovok / Tip / Montáž / Miesto / Humor) a Hot/Nové/Top radenie.

**Requirements:**
FORUM-01, FORUM-02, FORUM-03, FORUM-04, FORUM-05, FORUM-06, FORUM-07, FORUM-08

**Success Criteria:**
1. Feed prepína medzi Hot/Nové/Top bez reloadu; Hot zoraďuje podľa Wilson score (nie raw like count)
2. Nový post (foto/video, caption, kategória, revír tag, ryba tag) sa publikuje a objaví vo Feede do 5 sekúnd
3. Like funguje optimisticky (okamžitá UI reakcia) + atomicky (Firestore transakcia anti-spam)
4. Komentáre sa zobrazujú pod postom (threaded max 2 úrovne) — tap na post = detail s komentármi
5. Tap na meno/avatar kdekoľvek vo Feede → profil toho používateľa s gridом jeho postov

**Complexity:** High
**Critical path:** Nie — závisí od Phase 1 (auth) a Phase 2 (post/catch flow)

**Implementation notes:**
- Feed = Instagram-štýl, nie Reddit. Primárne vizuálne (fotky), nie text-heavy
- `FlashList` pre feed — `estimatedItemSize={320}` (väčšie karty ako Reddit) — nikdy `FlatList`
- `getDocs` + React Query + pull-to-refresh (nie onSnapshot pre feed — battery optimization)
- Cursor-based pagination: `startAfter(lastDoc)` — nie offset
- Hot score: Cloud Function (`onDocumentWritten`) — Wilson score + age decay
- Like transakcia: Firestore `runTransaction` — anti-race-condition
- Post typy: `type: 'catch' | 'tip' | 'rig' | 'spot' | 'humor'` — filter cez `where('type', '==', ...)`
- Komentáre: `parentId` pole — max 2 úrovne (Instagram štýl, nie Reddit 8 úrovní)
- `onSnapshot` NIE pre feed — iba `getDocs` + pull-to-refresh

---

### Phase 6: Marketplace (Bazár)

**Goal:** Rybár pridá inzerát s fotkami a lokalitou, iní ho nájdu v 2-stĺpcovom gride filtrovanom podľa vzdialenosti a kategórie, môžu ho uložiť do wishlistu.

**Requirements:**
MARKET-01, MARKET-02, MARKET-03, MARKET-04, MARKET-05, MARKET-06, MARKET-07, MARKET-08, MARKET-09, MARKET-10

**Success Criteria:**
1. Nový inzerát (fotky, title, kategória, stav, cena, popis, lokalita) sa pridá a objaví v gride do 10 sekúnd
2. Filter podľa vzdialenosti (5/20/50/100 km) zobrazuje iba inzeráty v danom okruhu — geo-query funguje správne
3. Free tier (max 3 aktívne inzeráty) zobrazí gate pri 4. pokuse; Premium vidí neobmedzený počet
4. Inzerát automaticky expiruje po 60 dňoch — predajca dostane varovanie 3 dni vopred (Cloud Function)
5. Kupujúci ohodnotí predajcu (1–5 hviezdičiek) po predaji — hodnotenie sa zobrazí na seller profile

**Complexity:** High
**Critical path:** Nie — závisí od Phase 2 (image upload), Phase 3 (geohash pattern)

**Implementation notes:**
- 2-stĺpcový grid: `FlashList` s `numColumns={2}` a `estimatedItemSize={220}`
- Geo-query: `geofire-common` — `geohashQueryBounds(center, radius)` → 9 paralelných Firestore queries → klientsky filter
- Geohash precision: ukladať precision 9 (`~5m`), queries robiť s precision 5–6 pre radius 10–50km
- Auto-expiry Cloud Function: `onSchedule` (každý deň o 02:00) — query `listings` kde `expiresAt < now()`, status → `expired`
- 3-dňové varovanie: rovnaká CF — query `listings` kde `expiresAt == now() + 3 days`, trigger FCM notifikáciu
- Swipeable foto galéria v detaile: `react-native-reanimated-carousel` alebo `@gorhom/bottom-sheet` + FlatList horizontal
- Wishlist: pole `savedListingIds` v users dokumente — `arrayUnion`/`arrayRemove` operácie
- Seller rating: subcollection `sellerReviews/{reviewId}` — `allow create: if isAuth()`, validácia purchase cez Cloud Function
- `MARKET-03` limit enforcement: CF pri `listings` create — count aktívnych inzerátov, throw ak free a count >= 3

---

### Phase 7: In-App Chat

**Goal:** Kupujúci napíše predajcovi z detailu inzerátu, správy sa doručia v reálnom čase, zoznam konverzácií zobrazuje unread badge a tab zobrazuje celkový počet neprečítaných.

**Requirements:**
CHAT-01, CHAT-02, CHAT-03, CHAT-04, CHAT-05, CHAT-06

**Success Criteria:**
1. Správa odoslaná kupujúcim sa objaví u predajcu do 2 sekúnd bez manuálneho refreshu (real-time onSnapshot)
2. Cenovú ponuku (Offer správa) predajca môže prijať alebo odmietnuť — stav sa synchronizuje pre obe strany
3. Zoznam konverzácií zobrazuje preview poslednej správy a unread badge s počtom neprečítaných
4. Tab badge v navigácii zobrazuje celkový počet neprečítaných správ naprieč všetkými konverzáciami
5. Otvorenie konverzácie resetuje unread count pre daného používateľa v jednom atomickom write

**Complexity:** High
**Critical path:** Nie — závisí od Phase 6 (listings) — najkomplexnejší real-time feature

**Implementation notes:**
- `onSnapshot` POVINNÝ pre chat (obe: správy aj zoznam konverzácií) — hybridný pattern s React Query cache
- Deterministické conversation ID: `[uid1, uid2].sort().join('_')` — predchádza duplikátom
- Unread count: `unreadCounts: { uid1: 3, uid2: 0 }` mapa v conversations dokumente — **nie increment v správe** (Firestore 1 write/s limit)
- Batch write pri odoslaní: správa + conversation update (lastMessage, lastMessageAt, unreadCounts.receiverId += 1) — atomický
- Reset unread: pri otvorení chatu: `update(convRef, { ['unreadCounts.' + myUid]: 0 })` — jeden write
- Tab badge: Zustand `chatStore.totalUnread` — kŕmi ho `useConversations` onSnapshot listener (reduce all unreadCounts.myUid)
- Sticky listing preview header: denormalizovaný snapshot v conversations dokumente (`listingSnapshot: { title, price, photoUrl }`)
- Offer správa: špeciálny `type: 'offer'` s `offerAmount`, `offerStatus: 'pending'|'accepted'|'declined'` — UI komponent `OfferBubble`
- Firestore security rule: `isParticipant(resource.data.participantIds)` — nie public read
- Správy sú immutable: `allow update, delete: if false` v rules

---

### Phase 8: Notifications, Gamification & Polish

**Goal:** Appka posiela relevantné push notifikácie, odmeňuje aktivitu karma systémom s odznakmi, má analytics a je pripravená na produkčný launch.

**Requirements:**
NOTIF-01, NOTIF-02, NOTIF-03, NOTIF-04, NOTIF-05,
GAMIF-01, GAMIF-02, GAMIF-03,
INFRA-07 (PostHog — ak nebolo dokončené v Phase 1)

**Success Criteria:**
1. Push notifikácia dorazí na zariadenie do 10 sekúnd po triggeri (odpoveď na post, nová správa, expiry inzerátu)
2. Používateľ vie vypnúť každý typ notifikácie zvlášť — preferencia sa uloží a rešpektuje okamžite
3. Karma body sa aktualizujú po aktivite (post, komentár, úlovok, predaj) — viditeľné na profile
4. Po splnení míľnika sa zobrazí in-app toast s odznakom (badge) — badge je viditeľný na profile
5. PostHog zaznamenáva core akcie (catch_created, post_published, listing_created, premium_purchased) — overiteľné v PostHog dashboarde

**Complexity:** Medium
**Critical path:** Nie — polish vrstva, ale potrebná pred launch

**Implementation notes:**
- FCM: `@react-native-firebase/messaging` — `onMessage` (foreground) + `setBackgroundMessageHandler` (background)
- Cloud Functions triggery pre notifikácie: `onDocumentCreated('comments/{id}')`, `onDocumentCreated('messages/{id}')`, `onSchedule` (expiry)
- Premium predikcia notif (NOTIF-04): iba 1x/deň, nie v čase 22:00–07:00 — CF cron check + user timezone
- Karma pravidlá (príklady): post +5, komentár +2, úlovok +3, upvote na post +1, predaj +10 — uložené v `users.karma`
- Karma update: Cloud Function `onDocumentCreated` — nie klient (anti-cheat)
- Badges: 10+ predefinovaných míľnikov v `constants/badges.ts` — CF kontroluje podmienky po každej akcii
- Personal stats dashboard: aggregáty z `catches` collection — `useQuery` s `getDocs` + `reduce` na klientovi (nie server-side agg)
- EAS OTA update: `expo-updates` + `eas update` workflow — nastaviť `channel: production` v `eas.json`
- Performance audit pred launch: FlashList `estimatedItemSize` na všetkých listoch, `expo-image` všade, JS thread monitoring cez Flipper
- PostHog: `posthog-react-native` — init v Phase 1 root layout, eventy volať z mutácií (React Query `onSuccess`)

---

## Dependency Graph

```
Phase 1: Foundation & Auth
    │
    ▼
Phase 2: Core Value: Catch Diary ◄─── image upload pipeline (reused in P5, P6)
    │
    ├─────────────────────┐
    ▼                     ▼
Phase 3: Revír Map    Phase 4: AI Predictions + Premium
    │                     │
    └──────────┬──────────┘
               ▼
         Phase 5: Community Forum ◄─── auth (votes), image pipeline (post photos)
               │
               ▼
         Phase 6: Marketplace ◄─── geo pattern (P3), image pipeline (P2), profiles (P2)
               │
               ▼
         Phase 7: In-App Chat ◄─── listings (P6), user profiles (P2)
               │
               ▼
         Phase 8: Notifications, Gamification & Polish
```

**Kritická cesta:** Auth → Design System → ImageUpload → Denník → Mapa → AI → Komunita → Bazár → Chat → FCM/Polish

**Paralelizácia:** Phase 3 (Mapa) a Phase 4 (AI) môžu ísť paralelne (ak 2 vývojári). Ostatné fázy sú sekvenčné.

---

## Technical Decisions Summary

| Rozhodnutie | Voľba | Dôvod |
|-------------|-------|-------|
| Firebase SDK | `@react-native-firebase` (native) | Offline persistence, FCM, natívny výkon |
| Routing | Expo Router v5 + `Stack.Protected` | Auth guard bez manuálnych redirectov |
| Lists | `@shopify/flash-list` všade | 10x rýchlejší na Androide, 60fps scrolling |
| Maps | `react-native-maps v1.18` | expo-maps je alpha/nepoužiteľná v produkcii |
| Clustering | `@mapbox/supercluster v8` | react-native-map-clustering je dead |
| Geo queries | `geofire-common` (Google) | geofirestore unmaintained |
| Real-time | `onSnapshot` IBA pre chat + unread badge | Battery + Firestore reads optimalizácia |
| State | Zustand (auth, UI, unread) + React Query (všetko ostatné) | Jasné hranice, žiadna duplikácia |
| Images | `expo-image v2` + `expo-image-manipulator` | Blurhash, crossfade, <500KB kompressia |
| IAP | `react-native-purchases ^8.9.2` | Pinovat — ^8.9.2 fixuje fontFamily crash |
| Weather | Open-Meteo (primárny) + OpenWeatherMap (fallback) | DWD ICON-D2 = najvyššia presnosť pre SK/CZ |
| AI | GPT-4o mini | 10x lacnejší ako GPT-4o, dostatočná kvalita |

---

*Roadmap created: 2026-03-12*
*Based on: PROJECT.md, REQUIREMENTS.md, research/SUMMARY.md, research/ARCHITECTURE.md*
*Phase 1 plans created: 2026-03-12*
