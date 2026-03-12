# Requirements: CATCH

**Defined:** 2026-03-12
**Core Value:** Rybár zaznamená úlovok, dostane AI predikciu kedy ísť ďalší raz, a pochváli sa v komunite — celý loop na jednom mieste, v slovenčine.

---

## v1 Requirements

### Infrastructure & Setup

- [x] **INFRA-01**: Expo SDK 53 + Expo Router v5 projekt beží na Android a iOS (EAS dev build)
- [ ] **INFRA-02**: react-native-firebase v21 (natívny SDK) konfigurovaný pre Firestore, Auth, Storage, FCM
- [x] **INFRA-03**: i18n systém (expo-localization + i18n-js) s SK ako default jazykom
- [x] **INFRA-04**: Design system: theme.ts s farbami, typografiou, spacing, shadow tokenmi
- [x] **INFRA-05**: Základné UI primitives: Button, Card, Badge, Avatar, BottomSheet, TextInput, skeleton loaders
- [ ] **INFRA-06**: EAS Build konfigurácia (development, preview, production profiles)
- [ ] **INFRA-07**: PostHog analytics inicializovaný s event tracking pre core actions

### Authentication

- [x] **AUTH-01**: Používateľ sa vie zaregistrovať cez email a heslo
- [x] **AUTH-02**: Používateľ dostane email verifikáciu po registrácii
- [x] **AUTH-03**: Používateľ vie resetovať heslo cez email link
- [x] **AUTH-04**: Session pretrváva po reštarte appky (AsyncStorage persistence)
- [x] **AUTH-05**: Auth guard presmeruje neprihláseného používateľa na login
- [x] **AUTH-06**: Používateľ vie sa odhlásiť z ľubovoľnej obrazovky

### User Profiles

- [x] **PROF-01**: Používateľ má profil s display name, avatárom a bio (max 300 znakov)
- [x] **PROF-02**: Profil zobrazuje celkové štatistiky (počet úlovkov, celková hmotnosť, najväčšia ryba)
- [ ] **PROF-03**: Profil zobrazuje posledných 12 úlovkov v gridu
- [x] **PROF-04**: Používateľ vie zobraziť profil iného používateľa
- [x] **PROF-05**: Profil zobrazuje karma body a odznaky (badges)

### Photo Upload Pipeline

- [x] **PHOTO-01**: Používateľ vie vyfotiť priamo z appky alebo vybrať z galérie (max 5 fotiek)
- [x] **PHOTO-02**: Fotky sa skomprimujú na strane klienta na <500KB pred uploadom
- [x] **PHOTO-03**: Upload progress je viditeľný, retry pri zlyhaní
- [x] **PHOTO-04**: Blurhash placeholder sa zobrazí kým sa načíta fotka

### Catch Diary (Denník)

- [x] **DIARY-01**: Používateľ vie zaznamenať úlovok (ryba, váha g, dĺžka cm, metóda, nástraha, hĺbka, revír, fotky, poznámka) za menej ako 90 sekúnd
- [x] **DIARY-02**: Počasie (teplota, tlak, vietor, vlhkosť, fáza mesiaca) sa automaticky doplní z Open-Meteo pri zaznamenaní
- [ ] **DIARY-03**: Zoznam úlovkov je filtrovaný podľa druhu ryby, revíru, dátumu, metódy
- [ ] **DIARY-04**: Detail úlovku zobrazuje všetky parametre, fotogalériu, mapu lokácie, počasie
- [ ] **DIARY-05**: Používateľ vie upraviť alebo zmazať vlastný úlovok
- [x] **DIARY-06**: Pridanie úlovku funguje aj offline (queue, sync po pripojení)
- [x] **DIARY-07**: Výber ryby z SK/CZ zoznamu (100+ druhov) s vyhľadávacím poľom

### Fishing Spot Map (Mapa revírov)

- [ ] **MAP-01**: Fullscreen mapa SK+CZ s 330+ SRZ/ČRS revírmi ako markery
- [ ] **MAP-02**: Markery sa clusterujú pri oddialení mapy
- [ ] **MAP-03**: Detail revíru: názov, číslo SRZ, povolené druhy, lovné miery, hájenie, fotky, GPS
- [ ] **MAP-04**: Mapa sa filtruje podľa druhu ryby a regiónu
- [ ] **MAP-05**: Revíre sú cachované offline (základné dáta)
- [ ] **MAP-06**: Používateľ vie pridať tip/komentár k revíru
- [ ] **MAP-07**: Úlovky na mape — používateľ vidí kde kto chytal (public catches)

### AI Predictions (Predikcie)

- [ ] **AI-01**: Denná predikcia (skóre 1–10) s odôvodnením v slovenčine na základe tlaku, trendu tlaku, teploty, vetra, fázy mesiaca
- [ ] **AI-02**: Predikcia uvádza najlepší čas v daný deň (ranné/poludňajšie/večerné okno)
- [ ] **AI-03**: Free tier: predikcia na dnes. Premium: 7-dňový výhľad
- [ ] **AI-04**: Po 10+ úlovkoch: personalizovaná predikcia ("Ty chytáš najlepšie pri 1010–1015 hPa")
- [ ] **AI-05**: Open-Meteo dáta (barometrický tlak, trend, teplota, vietor, zrážky) ako vstup
- [ ] **AI-06**: Predikcia je zrozumiteľná laikovi — nie technické čísla ale plain Slovak text

### Community Forum (Komunita)

- [ ] **FORUM-01**: Feed postov s tabmi Hot / Nové / Top (denný/týždenný/all-time)
- [ ] **FORUM-02**: Filter feedu podľa kategórie (Úlovky / Techniky / Vybavenie / Miesta / Otázky / Humor)
- [ ] **FORUM-03**: Používateľ vie vytvoriť post (title + body + kategória + fotky max 8 + tagy)
- [ ] **FORUM-04**: Post detail zobrazuje markdown body, fotogalériu, threaded komentáre (max 3 úrovne)
- [ ] **FORUM-05**: Upvote/downvote na postoch aj komentároch (1 vote per user, anti-spam transaction)
- [ ] **FORUM-06**: Používateľ vie upraviť alebo zmazať vlastný post/komentár
- [ ] **FORUM-07**: Post môže odkazovať na konkrétny úlovok alebo revír (clickable link)
- [ ] **FORUM-08**: Hot score výpočet cez Cloud Function (Wilson score ranking)

### Marketplace (Bazár)

- [ ] **MARKET-01**: Feed inzerátov v 2-stĺpcovom gride (foto, title, cena, lokalita, stav)
- [ ] **MARKET-02**: Filter podľa kategórie, ceny, stavu, vzdialenosti (5/20/50/100 km), regiónu, značky
- [ ] **MARKET-03**: Používateľ (free) vie pridať max 3 aktívne inzeráty; Premium = neobmedzené
- [ ] **MARKET-04**: Nový inzerát: fotky (min 1, max 10), title, kategória, stav, cena, popis, lokalita
- [ ] **MARKET-05**: Detail inzerátu: swipeable foto galéria, popis, mapa predajcu, kontakt
- [ ] **MARKET-06**: Inzerát sa zobrazuje pri používateľoch v okolí (geohash geo-query)
- [ ] **MARKET-07**: Inzerát automaticky expiruje po 60 dňoch (Cloud Function)
- [ ] **MARKET-08**: Používateľ vie uložiť inzerát do wishlistu
- [ ] **MARKET-09**: Seller profil zobrazuje hodnotenie (1–5 ⭐), počet predajov a recenzií
- [ ] **MARKET-10**: Po predaji môže kupujúci ohodnotiť predajcu (1–5 ⭐ + komentár)

### In-App Chat

- [ ] **CHAT-01**: Kupujúci vie napísať predajcovi správu z detailu inzerátu
- [ ] **CHAT-02**: Chat zobrazuje sticky preview inzerátu (foto + title + cena) navrchu
- [ ] **CHAT-03**: Správy sú real-time (Firestore onSnapshot), zoradené podľa serverTimestamp
- [ ] **CHAT-04**: Kupujúci vie poslať cenovú ponuku (Offer správa) so stavom: pending/accepted/declined
- [ ] **CHAT-05**: Zoznam konverzácií s unread badge a poslednou správou
- [ ] **CHAT-06**: Tab badge zobrazuje celkový počet neprečítaných správ

### Push Notifications

- [ ] **NOTIF-01**: Notifikácia na odpoveď na vlastný post alebo komentár
- [ ] **NOTIF-02**: Notifikácia na novú správu v chate
- [ ] **NOTIF-03**: Notifikácia 3 dni pred expiry vlastného inzerátu
- [ ] **NOTIF-04**: Notifikácia na ideálne podmienky (Premium, iba 1x/deň, nie v noci 22–07h)
- [ ] **NOTIF-05**: Používateľ vie vypnúť každý typ notifikácie zvlášť v nastaveniach

### Premium Subscription

- [ ] **PREM-01**: RevenueCat integrácia pre iOS (App Store IAP) a Android (Google Play Billing)
- [ ] **PREM-02**: Mesačný plán €1/mes a ročný plán €9.99/rok (v-app default CTA = ročný)
- [ ] **PREM-03**: Premium odomkne: 7-dňové AI predikcie, neobmedzené inzeráty, 1x featured/mes
- [ ] **PREM-04**: Restore purchases funkcia (povinná pre App Store approval)
- [ ] **PREM-05**: Premium badge na profil (viditeľné ostatným)

### Gamification

- [ ] **GAMIF-01**: Karma systém — používateľ získava body za aktivity (post, komentár, úlovok, predaj)
- [ ] **GAMIF-02**: Odznaky za míľniky (Prvý kapor, 10 úlovkov, 50 postov, Overený predajca...)
- [ ] **GAMIF-03**: Personal stats dashboard: best catch, total weight, catch count by species, activity streak

---

## v2 Requirements

### Pokročilé funkcie (po launch)

- **AI-V2-01**: Predikcie pre konkrétny revír (nie len lokalitu)
- **AI-V2-02**: Odporúčania návnad na základe počasia + histórie
- **FORUM-V2-01**: Flair systém (overený expert, SRZ člen...)
- **FORUM-V2-02**: Mod queue pre nahlásenený obsah
- **MARKET-V2-01**: Featured inzeráty (Premium benefit, zobrazené navrchu)
- **MAP-V2-01**: Používateľ vie pridať nový revír (Premium) — čaká na moderáciu
- **SOCIAL-V2-01**: Follow systém — aktivita sledovaných používateľov vo feede
- **AUTH-V2-01**: Sign in with Apple / Google (OAuth)
- **NOTIF-V2-01**: Týždenný digest emailom (top posty, nové úlovky v regióne)

---

## Out of Scope

| Feature | Reason |
|---------|--------|
| Web verzia | Mobile-first; double maintenance bez benefitu pre SK trh |
| Video obsah / live streaming | Storage + bandwidth cost prohibitívny pre MVP |
| Real-time fishing tournaments | Príliš komplexné, niche-within-niche |
| GPS sharing live (poloha) | Kultúrna tabu SK/CZ rybárov — tajné miesta |
| Vlastný platobný systém | RevenueCat rieši iOS + Android compliance |
| Dark/light theme toggle | Dark-only — brand identity, ušetrí implementation cost |
| Offline maps (tiles cache) | Sídlové mapy Google/Apple pokrývajú potrebu |
| Vlastný mapping (Mapbox) | react-native-maps + Google Maps stačí pre MVP |

---

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| INFRA-01–07 | Phase 1 | Pending |
| AUTH-01–06 | Phase 1 | Pending |
| INFRA-04–05 (Design System) | Phase 1 | Pending |
| PHOTO-01–04 | Phase 2 | Pending |
| DIARY-01–07 | Phase 2 | Pending |
| PROF-01–05 | Phase 2 | Pending |
| MAP-01–07 | Phase 3 | Pending |
| AI-01–06 | Phase 4 | Pending |
| PREM-01–05 | Phase 4 | Pending |
| FORUM-01–08 | Phase 5 | Pending |
| MARKET-01–10 | Phase 6 | Pending |
| CHAT-01–06 | Phase 7 | Pending |
| NOTIF-01–05 | Phase 8 | Pending |
| GAMIF-01–03 | Phase 8 | Pending |

**Coverage:**
- v1 requirements: 70 total
- Mapped to phases: 70
- Unmapped: 0 ✓

---
*Requirements defined: 2026-03-12*
*Last updated: 2026-03-12 after initial definition*
