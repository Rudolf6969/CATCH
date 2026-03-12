# Research Summary — CATCH

> Syntetizovaný prehľad zo 4 research súborov pre tvorcu roadmapy.
> Dátum: 2026-03-12

---

## Recommended Stack

- **Expo SDK 53** + React Native 0.79 + React 19 — current stable, New Architecture by default, Hermes only
- **Expo Router v5** — file-based routing, `Stack.Protected` pre auth guard bez manual redirectov
- **@react-native-firebase v21** (nie JS SDK) — native C++ Firestore, offline persistence out-of-the-box, native FCM
- **Zustand v5** — globálny stav (auth, UI badges, chat unread counts); použiť `useShallow` pre object selektory
- **TanStack Query v5** + `@invertase/tanstack-query-firebase` — server state, caching, pagination; všetko okrem real-time chatu
- **react-hook-form v7** + **Zod v3** — formuláre (catch log, listing form)
- **@shopify/flash-list v1.7** — náhrada FlatList všade, 10x rýchlejšia na Androide
- **expo-image v2** — blurhash placeholders, crossfade transitions, New Architecture compatible
- **react-native-maps v1.18** (NIE expo-maps — stále alpha) — Google Maps Android, Apple Maps iOS
- **@mapbox/supercluster v8** — clustering revírov na mape (react-native-map-clustering je dead)
- **Open-Meteo** (primárny, free, no key) + OpenWeatherMap (fallback) — DWD ICON-D2 model pre SK/CZ, najvyššia presnosť
- **react-native-purchases v8.9.2+** (RevenueCat) — IAP subscriptions, dev build required, v8.9.2 fixuje fontFamily crash
- **geofire-common** (nie geofirestore) — geohash utilities, aktívne udržiavaný Google package
- **TypeScript ~5.8.3**, **Node.js 20+**, EAS Build pre iOS (Windows = no local iOS build)

---

## Table Stakes Features

Bez týchto featúr = okamžitý uninstall. Každý competitor ich má.

- **Catch diary** — foto + druh + váha + dĺžka + metóda + revír v pod 90 sekúnd, offline queue
- **Revír mapa** — 330+ SK SRZ revírov, tap = name/číslo/lovné miery/hájenie/druhy, offline cache
- **User profil + auth** — email/password, session persistence, catch štatistiky na profile
- **Community feed** — paginated catch feed, filter, like/komentár, pull-to-refresh, 60fps FlashList
- **Foto pipeline** — camera + multi-pick (5 fotos), klientska kompresia na <500KB, Firebase Storage CDN

---

## Differentiators

Prečo by mal rybár zmazať Facebook skupinu a prejsť na CATCH.

- **AI predikcie v slovenčine** — GPT-4o mini + Open-Meteo barometer + solunar → "Podmienky pre kapra sú dnes DOBRÉ. Tlak stúpa..." Žiadny SK/CZ competitor toto nemá. Premium gate: 7-dňový výhľad (free = dnes).
- **Bazár ako 1st-class feature** — nie afterthought ako Fishsurfing. In-app chat, seller ratings, auto-expiry 60 dní, free 3 inzeráty. Facebook skupiny = chaos bez histórie a bez bezpečnosti.
- **Reddit-style komunita** (upvote, Hot/Nové/Top sort) — nie chronologický dump ako Fishsurfing forum. Dobrý obsah zostáva viditeľný.
- **Gamifikácia** — karma, badges (Prvý kapor, Rybár mesiaca...), streak, leaderboard. Fishsurfing nič nemá.
- **Slovenčina ako natívny jazyk** — nie preklady. Slovenské názvy rýb, SRZ regulácie vo formáte SRZ, AI output in SK.
- **Cenová dostupnosť** — €1/mes vs Fishbrain $12.99/mes. Pre SK trh je to 12x lacnejšie.
- **Kompletná SK mapa** — Fishsurfing je Czech-centric, SK data sparse. CATCH musí spustiť s viac SK pokrytím.
- **Personalizácia predikcií** — po 10+ úlovkoch AI používa tvoje vlastné dáta: "Ty chytáš najlepšie pri 1010–1015 hPa." Globálne unikátne.

---

## Build Order

Odporúčaná sekvencia fáz podľa dependency grafu z ARCHITECTURE.md:

| Fáza | Obsah | Prečo takto |
|------|-------|-------------|
| 1 | Firebase config, Auth, Expo Router skeleton, Design system (theme + UI primitives), i18n | Každý feature potrebuje uid a design system. i18n je lacné teraz, drahé retroaktívne. |
| 2 | Image upload pipeline, Catch diary (CRUD + form + list + detail), auto-weather fetch | Core value prop. Pipeline sa reuse v každom ďalšom feature. |
| 3 | Revír mapa (react-native-maps + geohash + SRZ data), offline cache spots | Statický obsah, jednoduchší než live data features. |
| 4 | AI predikcie (Open-Meteo + solunar + GPT-4o mini), RevenueCat Premium gate | Závisí od denníka (historické úlovky ako kontext pre budúcu personalizáciu). |
| 5 | Komunita forum (posts + comments + votes + Hot score Cloud Function) | Závisí od image pipeline (posty s fotkami) a auth (votes). |
| 6 | Bazár (listings CRUD + geo-search + auto-expiry CF + seller ratings) | Závisí od geo (nearby), image pipeline, user profiles. |
| 7 | In-app chat (real-time messages + unread counts + tab badge) | Najkomplexnejší real-time feature, závisí od všetkého ostatného. |
| 8 | FCM push notifikácie, karma/badges, personal stats dashboard, PostHog analytics, EAS OTA | Polish vrstva, nie blocker pre launch. |

**Kritická cesta:** Auth → Design System → ImageUpload → Denník → Mapa → AI → Komunita → Bazár → Chat → FCM

Mapa a AI môžu ísť paralelne ak 2 devs. Bazár musí čakať na Komunitu (zdieľajú user profile pattern).

---

## Critical Pitfalls to Avoid

Top 7 — každý je buď production blocker alebo výrazná tech dlh.

1. **Expo Go namiesto dev build** — Firebase native + RevenueCat native nefungujú v Expo Go. Vytvoriť dev build v deň 1 cez EAS: `eas build --profile development`.

2. **FlatList namiesto FlashList** — na Androide (majority SK/CZ trhu) je FlatList na dlhých listoch nepoužiteľný (>90% JS thread CPU). Použiť `@shopify/flash-list` všade s `estimatedItemSize`.

3. **onSnapshot na všetko** — každý aktívny listener = Firestore reads + battery drain. Pravidlo: `onSnapshot` IBA pre chat a unread badge. Všetko ostatné = `getDocs` + React Query cache + pull-to-refresh.

4. **`await docRef.set()` pri offline write** — blokuje UI donekonečna ak offline. Pre denník (offline use case): fire-and-forget write, optimistický UI update cez React Query `onMutate`. Await len tam kde server potvrdenie je nevyhnutné.

5. **Namespaced Firebase API** — v22 ho úplne zruší. Používať modular API od dňa 1: `import { getFirestore, collection } from '@react-native-firebase/firestore'` — nie `firestore().collection()`.

6. **`key` prop na FlashList item komponente** — zakazuje cell recycling a neguje všetky výhody FlashList. Nikdy nedávať `key` na komponent vnútri `renderItem`.

7. **Geofirestore namiesto geofire-common** — geofirestore nie je aktívne udržiavaný. Použiť `geofire-common` (oficiálny Google package) + vlastné paralelné queries (9 geohash ranges pre radius query).

---

## Key Decisions Confirmed

Rozhodnutia z PROJECT.md ktoré research potvrdzuje:

- **Firebase** — potvrdené. Native SDK (`react-native-firebase`) je správna voľba, nie JS SDK.
- **Expo managed workflow** — potvrdené. Config plugins pokrývajú všetky potreby (Firebase, RevenueCat, Maps).
- **€1/mes Premium** — potvrdené. Správne umiestnenie pre SK trh. Annual €9.99 by mal byť default CTA (3x nižší churn).
- **Bazár free tier 3 inzeráty** — potvrdené. Silný konverzný trigger pre power sellers.
- **Bez web verzie** — potvrdené. 64% Android, 36% iOS. Desktop web = double maintenance bez benefitu.
- **Bez videa** — potvrdené. Storage + bandwidth cost je prohibitívny, YouTube toto pokrýva.
- **Bez GPS sharing** — potvrdené. Ochrana tajných miestení je kultúrna hodnota SK/CZ rybárov. Fishbrain toto porušuje = negatívne recenzie.
- **Open-Meteo namiesto OpenWeatherMap** — ZMENA/UPGRADE. Research jasne ukazuje Open-Meteo ako superior pre SK/CZ (DWD ICON-D2 = exaktné modely CHMI/SHMÚ), free, bez API key. OpenWeatherMap = fallback.

---

## Research Surprises

Veci ktoré menia alebo upresňujú pôvodný plán:

- **expo-maps je alpha a nepoužiteľná v produkcii** — iOS 17+ only, žiadne custom markery, explicitne varuje pred breaking changes. Zostať na `react-native-maps v1.18`.

- **Development build je mandatory od dňa 1** — nie je to "neskoršia vec". Expo Go nestačí ani pre základné testovanie (Firebase native + FCM + RevenueCat). EAS build workflow treba nastaviť v Phase 1.

- **RevenueCat fontFamily crash bol reálny bug** — v8.9.2 ho fixuje. Pinovat na ^8.9.2, nie len ^8.

- **Geofirestore je dead** — nebolo to v pôvodnom pláne, ale táto library sa bežne odporúča. Správna voľba je `geofire-common` + vlastné queries.

- **Firestore 1 write/s limit na dokument** — unread counter v chate sa nesmie naivne incrementovať. Batch write + reset pattern je povinný, inak throttling pri aktívnom chate.

- **Barometric pressure je vedecky najsilnejší prediktor rybolovu** — nie lunar phases (populárne ale slabé pre sladkovodu). AI predikcie by mali primárne komunikovať tlak + trend, nie mesačné fázy (tie prezentovať ako sekundárny signal).

- **Fishsurfing má 100K SK+CZ users** — väčší competitor než sa čakalo. Ale ich slabiny sú konzistentné a overené z viacerých zdrojov (SMARTmania, LovKapra, Slovenský Rybár). CATCH má reálnu príležitosť.

- **470K registrovaných rybárov SK+CZ** — adresovateľný trh je konkrétny a merateľný (SRZ + ČRS membership). Nie vague "fishing enthusiasts".

- **i18n musí byť od dňa 1** — retroaktívne pridávanie i18n do hotovej app je >3x drahšie. Zabudovať do Phase 1, nie P2.

- **Windows dev environment má špecifické gotchas** — watchman nefunguje (pomalší Metro polling), žiadny iOS simulator, path length limit 260 chars. Riešenia: `EXPO_USE_FAST_RESOLVER=1`, EAS pre iOS, `git config core.longpaths true`.
