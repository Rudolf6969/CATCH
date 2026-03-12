# Phase 2: Feed + Catch Post - Context

**Gathered:** 2026-03-12
**Status:** Ready for planning

<domain>
## Phase Boundary

Rybár odfotí úlovok → 3-krokový wizard → post sa objaví vo Feede komunity + auto-uloží do Denníka. Scrollovateľný Feed zobrazuje úlovky iných používateľov s like/komentár/bookmark. Základný profil (vlastný + cudzí) s grid úlovkov a štatistikami.

Komentáre, follow systém, search — mimo scope Phase 2.

</domain>

<decisions>
## Implementation Decisions

### Catch Form Flow
- **Step wizard — 3 kroky** (nie single scroll):
  - Krok 1: **Photo-first** — hneď po stlačení + FAB sa otvorí camera/galéria picker. Fotka je povinná — bez fotky wizard nepokračuje.
  - Krok 2: **Ryba + váha/dĺžka + auto-počasie** — výber druhu ryby z 100+ SK/CZ druhov (search field), váha (g), dĺžka (cm). Počasie sa auto-doplní z Open-Meteo hneď na tomto kroku (visible badge: teplota, tlak, vietor, fáza mesiaca).
  - Krok 3: **Lokalita + poznámka + submit** — lokalita voliteľná (rybári tajia miesta) — textové pole pre názov revíru + optional GPS. Krátka poznámka/caption. Progress bar navrchu (1→2→3).
- Celý flow targete <90 sekúnd

### Post Card v Feede
- **Instagram minimal layout** — nie fishing-data rich overlay:
  - Avatar + meno + lokalita (header)
  - Full-width foto / swipeable carousel
  - Like / komentár / bookmark action bar
  - Caption + fish badge **pod fotkou** (nie overlay): `🐟 Kapor · 8.2kg · 72cm`
  - Hashtags/tagy v oranžovej accent farbe
- Počasie v čase úlovku — **len v detail screene**, nie v Feed karte
- **Stories row zostáva** — horizontálny scroll ostatných rybárov (Phase 2: mock → real avatary aktívnych používateľov)

### Multi-foto
- **Max 5 fotiek** na úlovok (PHOTO-01)
- Výber: **multi-select galéria** — otvori sa galéria s možnosťou označiť až 5 naraz + camera option
- Zobrazenie vo Feede: **swipeable carousel** — Instagram-style, dot indikátor (●○○)
- Fotka je **povinná** — form nepokračuje bez aspoň 1 fotky

### Profil — Navigácia
- **Vlastný profil**: tap na avatar v ľavo v headeri Feed screenu → push vlastný profil. Rovnaký avatar aj v Denník headeri.
- **Cudzí profil**: tap na meno alebo avatar v post karte Feedu → push profil screen toho používateľa
- **Jeden profil screen**, 2 módy: `isOwnProfile = currentUserId === profileId` (Twitter pattern z flutter_twitter_clone)
- **Header layout — Twitter-style**: landscape banner image navrchu (default: solid forest gradient, user môže nahrať vlastný), avatar overlaid na spodnom okraji bannera (64px kruh, biele orámovanie), meno + username + bio pod
- **Stats riadok**: Úlovky `N` · Celková váha `Xkg` · Najväčší `Xkg`
- **Grid**: **3 stĺpce** (industry standard, oba referenčné clony), posledných 12 úlovkov (PROF-03), tap → detail úlovku

### Claude's Discretion
- Skeleton loaders pri načítavaní feedu a profilu
- Offline indicator design (DIARY-06 — fire-and-forget write)
- Presný pull-to-refresh indikátor
- Error state handling pri upload failure
- Empty state ilustrácia (Feed bez príspevkov)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `Card` component (`src/components/ui/Card.tsx`): `elevated` + `glowing` variants — reuse pre post karty s `glowing` pri nových postoch
- `Button`, `Badge`, `Avatar`, `TextInput`, `Skeleton` — všetky dostupné v `src/components/ui/`
- Fish type chips pattern z `pridat.tsx` (`fishChip` / `fishChipActive` styles) — reuse pre species selector v kroku 2
- `auth.store.ts` Zustand store — pattern pre `catches.store.ts` a `feed.store.ts`
- `theme.ts`: `accent` (#E9A84C) pre hashtags, `primaryMid` (#52B788) pre active states, `mono/monoLg` pre váhu/štatistiky

### Established Patterns
- StyleSheet.create s `(theme.X as object)` cast — TypeScript strict workaround, zachovaj pattern
- `useSafeAreaInsets` pre padding top — každý screen ho používa
- `Syne-Bold` pre headings, `DMSans-Regular/Medium` pre body, `JetBrainsMono-Regular` pre čísla (váhy, štatistiky)
- Feed screen (`feed.tsx`): existujúca vizuálna kostra (stories row, post cards) — Phase 2 nahradí mock dáta reálnymi + pridá FlashList

### Integration Points
- `app/(tabs)/feed.tsx` — nahradiť ScrollView → FlashList, mock data → Firestore real-time query
- `app/(tabs)/pridat.tsx` — nahradiť placeholder form → 3-krokový wizard (nové súbory: `app/(tabs)/pridat/step-1.tsx`, `step-2.tsx`, `step-3.tsx` alebo modal stack)
- `app/(tabs)/dennik.tsx` — načítať reálne catches z Firestore
- Profil: nová route `app/profile/[userId].tsx` — Stack screen pushovaný z Feedu
- Firebase Storage path (z Instagram clone): `catches/{userId}/{catchId}/{filename}.jpg`

### Reference Patterns (z clone-ov)
- **Instagram**: multi-krok upload (permissions → picker → next → share), 3-column grid, Storage path pattern
- **Twitter**: FeedModel schema (likeList[], tags[], createdAt reversed), `isMyProfile` boolean, pull-to-refresh + real-time `onValue` subscription, ProfileState (`profileId` vs `userId`)

</code_context>

<specifics>
## Specific Ideas

- Feed karta fish badge formát: `🐟 Kapor · 8.2kg · 72cm` — pod fotkou, DM Sans Medium, textSecondary farba
- Twitter-style banner na profile: default = forest gradient z theme (`primary` → `bg`), user môže nahrať vlastnú bannerovú fotku (Phase 2 = default only, upload = can be added later)
- Carousel dot indikátor: `● ○ ○` — accent farba pre active dot
- Progress bar v catch wizard: 3 segmenty, accent farba, thin (2px)

</specifics>

<deferred>
## Deferred Ideas

- Follow systém (sledovanie používateľov) — Phase 5 Community
- Search screen (vyhľadávanie používateľov/revírov) — Phase 3+
- Komentáre pod postami — Phase 5
- Stories ako samostatná feature (nie len avatary) — backlog
- Banner image upload na profil — možno Phase 2 implementuje ale nie je priorita

</deferred>

---

*Phase: 02-feed-catch-post*
*Context gathered: 2026-03-12 — informed by Instagram Clone (Android/Java) + Flutter Twitter Clone patterns*
