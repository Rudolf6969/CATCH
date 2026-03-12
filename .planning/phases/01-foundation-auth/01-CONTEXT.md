# Phase 1: Foundation & Auth - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Nastaviť Expo projekt, Firebase, auth flow, 5-tab navigáciu a design system. Obsah tabov je placeholder — reálny obsah príde v Phase 2–8. Toto je foundation, od ktorej závisia všetky ostatné fázy.

</domain>

<decisions>
## Implementation Decisions

### App vízia (pre downstream agents)
- Appka je **sociálna sieť pre rybárov** — Instagram pre kaprárov
- MVP sa zameriava výhradne na **kaprarinu** (carp fishing) — privlač príde neskôr
- Core loop: Podmienky dnes → ísť na ryby → zaznamenať úlovok → zdieľať do Feedu

### Tab štruktúra (5 tabov)
- **Tab 1: Podmienky** — Live počasie + AI tip na dnešný rybolov (hlavný dôvod spustiť appku)
- **Tab 2: Feed** — Instagram/TikTok FYP štýl, fotky a krátke videá úlovkov komunity
- **Tab 3: ⊕ (center FAB)** — Veľký floating action button, tap = pridať úlovok/post
- **Tab 4: Denník** — Moje úlovky, filter podľa revíru (názov vodnej plochy + SRZ číslo)
- **Tab 5: Bazár** — Secondhand rybárske vybavenie
- Komunita (tipy, montáže, techniky) = kategória postov vo Feede, nie samostatný tab v MVP

### Onboarding
- Animated splash (logo + tagline) → login screen
- Splash trvá len kým sa Firebase inicializuje (~0.5–1s), žiadne umelé predlžovanie
- Návrat prihláseneho usera: priamo na Podmienky tab (žiadny login screen)
- Guest mode: žiadny — login je povinný, zero-content bez účtu

### Auth UI
- Login a Register = oddelené screeny, prepojené linkom ("Nemáš účet? Registruj sa")
- Registration form: Email + heslo + potvrdiť heslo (display name nastaví user neskôr v profiloch)
- Chybové stavy: inline pod príslušným políčkom (nie toast)
- Reset hesla: "Zabudol si heslo?" link → samostatný screen → email input → potvrdzovacia obrazovka
- Logout: dostupný z ľubovoľnej obrazovky (settings / profil)

### Tab bar design
- Ikony + text label pod každou ikonou (čitateľné pre 18–55 ročných, nie len tech-savvy)
- Center tab = veľký FAB (Floating Action Button) so "+" ikonou — prominentný, oranžový (#F4A261)
- Active state: ikona v #40916C (zelená) + label, neaktívne = #6B7280 šedá
- Dark background tab bar: #0A1628 navy

### "+" (Pridať úlovok) flow
- Tap na center FAB → výber: Odfotiť priamo / Vybrať z galérie
- Foto/video sa pridá → form: caption, revír (názov + SRZ číslo), druh ryby, váha
- Submit → post sa objaví vo Feede (verejný) + automaticky sa uloží do Denníka (súkromný záznam)
- Toto prepojenie Feed ↔ Denník je architektonicky kritické — jeden zápis, dve miesta

### Profil
- Tap na meno/avatar kdekoľvek vo Feede → profil toho používateľa
- Profil = Instagram-štýl grid postov + štatistiky (počet úlovkov, celková váha, biggest catch)
- Vlastný profil dostupný z tab bar (ikona osoby) alebo z nastavení

### Placeholder screens (Phase 1)
- Každý tab má branded placeholder: logo sekcie + popis čo tu bude + "Čoskoro" v SK
- Design system farby a typografia sú aplikované aj na placeholderoch — žiadne biele prázdne screeny
- Podmienky placeholder: wireframe widgetu s dummy dátami (teplota, tlak, vietor) — naznačuje finálny UI

### Design system (theme.ts)
- Dark only — žiadny light mode (brand decision, ušetrí implementation cost)
- Primárna zelená: #1B4332, stredná zelená: #40916C, accent oranžová: #F4A261
- Background: #0A1628 navy, Surface: #112240, SurfaceHigh: #1A2F52
- Fonty: Outfit (headings), Inter (body), JetBrains Mono (čísla/štatistiky)
- Spacing, shadow a border-radius tokeny v theme.ts — všetky komponenty používajú tokeny, nie hardcoded hodnoty

### Claude's Discretion
- Animácia splash screenu (typ, trvanie, easing)
- Presné ikonky pre každý tab (výber z knižnice)
- Skeleton loader dizajn pre placeholder screens
- Error screen dizajn (network error, app crash)
- Keyboard avoiding behavior na auth formoch

</decisions>

<specifics>
## Specific Ideas

- "Instagram pre rybárov" — Feed má byť scrollovateľný, visually-driven, nie text-heavy
- Center FAB = oranžová (#F4A261) aby jasne vynikal — najdôležitejší button v appke
- Podmienky tab = prvý tab (default pri otvorení) — to je dôvod prečo user spustí appku ráno pred odchodom na ryby
- Revír sa vždy zapisuje ako: názov vodnej plochy + SRZ/ČRS číslo (napr. "Váh — Šaľa, 3-0480-1-1")
- AI odporúčania = profesionálny rybársky jazyk, nie generic text. Príklady:
  - "Teplota vody 18°C, rastúci tlak — ideálne pre kapra. Voľte ovocné boilies 20mm, aktívne zakŕmite."
  - "Voda 8°C, klesajúci tlak — kapor pasívny. Micro boilies 10–12mm, minimum krmiva, trpezlivosť."
  - (Toto vyžaduje deep research v Phase 4 — všetky kombinácie podmienok × nástrahy pre kaprarinu)

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- Žiadny existujúci kód — greenfield projekt

### Established Patterns
- Expo Router v5 file-based routing — všetky screeny ako súbory v app/ adresári
- `@react-native-firebase` (natívny SDK) — nie Firebase JS SDK
- Stack.Protected pre auth guard — žiadne manuálne redirecty

### Integration Points
- Firebase Auth → uid → každý Firestore dokument má `userId` pole
- Tab navigácia = `app/(tabs)/` štruktúra v Expo Router
- Theme tokeny z `theme.ts` importované do každého komponentu

</code_context>

<deferred>
## Deferred Ideas

- **Krátke videá (Reels-štýl)** — user chce, ale databázová záťaž (Firebase Storage costs) treba zvážiť. Zaradiť po launchu keď bude jasná monetizácia. → Post-launch feature
- **Privlač (spinning) sekcia** — ďalší fishing type po karpárení. Vlastné podmienky, nástrahy, techniky. → v2 milestone
- **6. tab: Komunita** — Reddit-štýl diskusie, montáže, techniky. V MVP = kategória vo Feede, neskôr možno samostatný tab.
- **Guest mode** (mapa a bazár bez loginu) — zvážiť ak bude nízka konverzia pri registrácii

</deferred>

---

*Phase: 01-foundation-auth*
*Context gathered: 2026-03-12*
