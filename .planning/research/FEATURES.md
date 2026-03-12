# CATCH — Feature Research & Market Analysis

*Research conducted: 2026-03-12*
*Sources: App Store reviews, competitor analysis, industry reports, SK/CZ market data*

---

## Executive Summary

Fishing apps are a $1.28B global market growing at 9.1% CAGR. Europe holds 26% of global users. The SK/CZ market is served by exactly one serious local competitor — **Fishsurfing** (Czech-origin, 100K SK+CZ users) — plus utility-only apps (Rybárske Revíry SK, FISHAPP.CZ) that do regulations/maps but zero community.

Fishsurfing is the main threat and the benchmark. Its weaknesses are the opportunity: cluttered UI, incomplete SK map data, forum that launched late and feels bolted-on, bazár that exists but isn't the core loop. Every global app (Fishbrain, WeFish) has the same fatal flaw for SK/CZ users: English-first, wrong fishing regulations, no local revír data.

**The gap is real.** No app combines: Slovak-language-first interface + complete SRZ revír map + tight catch diary loop + active native-language community + secondhand gear bazár. CATCH's €1/month price is also dramatically cheaper than Fishbrain Pro ($12.99/month) and positioned correctly for the market.

---

## Competitive Landscape

### Global Competitors

| App | Users | Core Strength | Fatal Weakness for SK/CZ |
|-----|-------|--------------|--------------------------|
| **Fishbrain** | 20M global | Community scale, spot heatmaps, AI predictions | English-only, $12.99/mo paywall, most SK data missing, crashes frequently |
| **WeFish** | Unknown | Forecast + marketplace + community combo | No SK/CZ localization, English UI |
| **Anglr** | Niche | Data logging, hardware Bullseye button | Hardware-dependent, English, US-focused |
| **Fishsurfing** | 100K SK+CZ | Czech-origin, bazár exists, SK language | Cluttered UI, incomplete SK map, forum late/weak, no AI |
| **Fishinda** | "Europe largest" | Marketplace focus, social feed | Generic, $3.99/mo, no SK revír data |
| **FishAngler** | Mid-tier | Free, stats-heavy | English-only, US-focused |

### SK/CZ Local Apps (Utility Only — No Community)

| App | What It Does | What's Missing |
|-----|-------------|----------------|
| **Rybárske Revíry SK** | SRZ revír map, regulations, fish sizes, moon/weather | Zero community, no diary, no bazár |
| **FISHAPP.CZ** | Czech revíry map, fishing advisor | No community, no catch log, CZ-only |
| **Fisharea** | Fishing grounds map, basic info | Skeleton feature set |
| **Revírník** | CZ+SK offline maps, regulations, water conditions | In development, no community yet |

### Key Insight: Fishsurfing Gap Analysis

Fishsurfing (the real competitor) has 100K SK+CZ users and checks most boxes on paper, but fails in execution:
- Forum was "long awaited" — added late, feels secondary
- Map incomplete for SK specifically (Czech-origin bias)
- Bazár exists but is buried, not the core loop
- Interface "cluttered with many icons" (SMARTmania review)
- No AI predictions whatsoever
- Content is chronological, not ranked by quality/relevance

**CATCH differentiation**: structured Reddit-style voting (surfaces quality content vs. Fishsurfing's reverse-chronological dump), AI prediction layer, tighter SK-first revír data, bazár as a first-class tab not an afterthought.

---

## Table Stakes — Must Have or Users Leave Immediately

These features are expected by anyone who downloads a fishing app. Not having them = immediate uninstall. Competing apps all have these; they do not differentiate.

### 1. Catch Logging — Core Diary

**What "done" looks like:**
- Quick-add flow: photo(s) → fish species (dropdown with SK names) → weight + length → method (mucha, plávaná, feeder, prívlač, čerepák...) → revír (autocomplete or map tap) → save in under 90 seconds
- Auto-pulls weather at log time: temp, wind, barometric pressure, cloud cover (Open-Meteo API, free)
- Privacy toggle: public / community-only / private
- Offline queue — logs while offline, syncs on reconnect
- Multiple fish per session (trip logging)
- Edit/delete after saving

**Why it's table stakes:** Every competitor has this. Users come to an app with fish in hand and need to log in 60 seconds or they don't bother.

**Complexity:** Medium — 3–4 days for solid UX + Firestore schema. Main challenge is offline reliability and the photo upload pipeline (Firebase Storage + compression).

**Done criteria:** User can log a catch with photo from camera roll, full metadata filled, in under 90 seconds on a cold start. Data persists through app kill.

---

### 2. Revír Map — SK + CZ Fishing Grounds

**What "done" looks like:**
- All SRZ (Slovenský Rybársky Zväz) revíry visible on map — minimum 330 SK + equivalent CZ
- Tap a revír → name, SRZ number, permitted fish species, size limits, season dates, permit cost info
- Filter by: fish species, distance from current location, permit type
- "Am I allowed to fish here today?" — cross-references today's date against closed seasons
- User-submitted additional info (tips, access points) — moderated or community-rated
- Offline mode for core data (cached on first load)
- Personal saved spots — private map pins (secret spots never shared unless user chooses)

**Why it's table stakes:** Rybárske Revíry SK exists purely for this. Users already expect it. Without it, CATCH is not a fishing app.

**Complexity:** High — 5–7 days. Need to source/maintain SRZ revír data (potentially scrape or partnership). React Native Maps + GeoJSON polygons for boundaries. Data freshness strategy needed.

**Done criteria:** All major SK SRZ revíry visible. User can tap any revír and see current regulations. Filter works for at least fish species and distance.

---

### 3. User Profiles + Authentication

**What "done" looks like:**
- Email/password signup + login (Firebase Auth)
- Profile: avatar photo, name, location (region/kraj, not exact), bio, favorite species, fishing style
- Catch stats visible on profile: total catches, biggest fish, most caught species, this year vs last year
- Karma/reputation score visible — accumulated from community interactions
- Session persistence (stay logged in)

**Why it's table stakes:** Can't have a community or bazár without identity. Anonymous apps have no trust layer.

**Complexity:** Low-Medium — 2–3 days for auth + profile CRUD + stats aggregation query.

**Done criteria:** User registers, completes profile, sees their own catch stats on profile page. Reopening app keeps them logged in.

---

### 4. Feed / Home Screen

**What "done" looks like:**
- Chronological or relevance-ranked feed of recent catches from the community
- Filter by: nearby revíry, following only, species
- Each catch card: photo, fish name, weight, revír, user, time, like/comment count
- Tap to expand: full catch detail, weather at time of catch, gear used, comments
- Pull to refresh, infinite scroll (paginated Firestore queries)
- Empty state for new users (suggested catches from region)

**Why it's table stakes:** Without this, the app is just a private diary. The social loop is what brings people back daily.

**Complexity:** Medium — 3–4 days. FlashList for performance (not FlatList). Pagination query design in Firestore matters.

**Done criteria:** Feed loads in under 2 seconds, scrolls smoothly at 60fps with photos, new catches appear within 30 seconds of being posted.

---

### 5. Photo Handling

**What "done" looks like:**
- Camera launch from catch log screen
- Camera roll picker (multi-select, up to 5 photos per catch)
- Client-side compression before upload (target 800px max, < 500KB)
- Firebase Storage with CDN delivery
- Loading placeholders (skeleton) while images load in feed
- Pinch-to-zoom on full-screen photo view

**Why it's table stakes:** Fish photos are the entire point. Rybári want to show off their catch. A fishing app without good photo handling is dead on arrival.

**Complexity:** Medium — 2 days. expo-image-picker + expo-image-manipulator for compression. Firebase Storage upload progress indicator.

**Done criteria:** 5 photos upload in under 10 seconds on 4G. Feed images load with no jank. Compression keeps photos under 500KB without visible quality loss.

---

## Differentiators — Competitive Advantages & Reasons to Switch from Facebook

These features are what make CATCH worth switching to. No single SK/CZ app has all of them. This is the moat.

### 1. AI Fishing Predictions (Premium Core Differentiator)

**What the science actually supports:**
Based on research, the data inputs that genuinely correlate with fish activity (ranked by scientific confidence):

1. **Barometric pressure change** — Strongest predictor. Falling pressure before cold front = frenzied feeding. Rising stable pressure = good conditions. Rapid drop = fish go deep. This is scientifically well-supported (swim bladder directly affected).
2. **Water temperature** — Species-specific sweet spots (kapor: 18–22°C optimal). Outside range = low activity.
3. **Air temperature + trend** — Cold front arrival = activity spike before, crash after.
4. **Wind direction + speed** — Wind pushes food to windward banks. >30km/h = poor surface conditions.
5. **Solunar tables (moon phase + position)** — Contested scientifically but beloved by anglers. Include for psychological value and because peak/minor periods are real for tidal species. For freshwater SK/CZ — present as one signal among many, not primary.
6. **Time of day** — Dawn/dusk universally better for most species (low light feeding).
7. **Cloud cover** — Overcast often better than bright sun (surface glare, water temperature stability).
8. **Season/week of year** — Seasonal patterns are the strongest macro predictor.

**What "done" looks like:**
- User picks a revír or location → app fetches: current + 7-day forecast (Open-Meteo, free), barometric pressure trend, solunar table for that GPS point
- GPT-4o mini synthesizes: "Podmienky pre kapra sú dnes DOBRÉ. Tlak stúpa (1013 → 1018 hPa), teplota vody 19°C, vietor 12km/h zo SW. Najlepšie časy: 06:00–08:00 a 18:30–20:00. Odporúčaná návnada: boilies s ovoňou, feeder na tečúcej vode."
- 3-day outlook with day ratings: Vynikajúci / Dobrý / Priemerný / Zlý
- Species-specific: kapor, šťuka, zubáč, lieň, mrena — each has different optimal conditions
- Premium gate: see predictions for next 7 days (free = today only, 3-hour window)
- Personalization: after 10+ logged catches, AI starts using user's own catch data to refine predictions ("Ty chytáš kapra najlepšie pri tlaku 1010–1015 hPa — dnes je to 1013, ideálne")

**Why it differentiates:** No SK/CZ competitor has this. Fishbrain has forecast but it's English-only, US-focused, behind $12.99/month paywall. The personalization angle (learns from your own catches) is unique globally.

**Complexity:** High — 5–7 days. Weather API integration, solunar calculation library (npm), GPT-4o mini prompt engineering, Firestore caching to avoid repeated API calls. Cost control: cache predictions per revír per day (not per user call).

**Done criteria:** User selects any SK revír, receives Slovak-language 3-day prediction with conditions breakdown in under 5 seconds. GPT prompt produces actionable, species-specific text with no hallucinated fish names. Cost per prediction call < €0.003.

---

### 2. Bazár — Secondhand Gear Marketplace

**Why it differentiates:** Currently happening in Facebook groups with zero structure, no safety, no seller reputation. Fishsurfing has a bazár but it's buried and basic. No dedicated fishing gear marketplace exists for SK/CZ market. WeFish has one for global audience. This is the one feature Facebook cannot replicate cleanly.

**What "done" looks like:**
- Create listing: title, category (prúty / navijaky / vlasec / háčiky / nástrahy / iné), price, condition (nové / ako nové / použité / poškodené), photos (up to 5), description, location (kraj/region, not exact address), contact preference
- Browse: filter by category, price range, location radius, condition
- In-app chat per listing: buyer messages seller, conversation thread attached to listing
- Seller profile: rating (1–5 stars), total sales, response time indicator, "overený predajca" badge after 5+ completed deals
- Listing auto-expiry: 60 days (Cloud Function), owner notified at day 50 to renew
- Free tier: max 3 active listings. Premium: unlimited.
- Report listing (scam/wrong category) — community moderation
- Mark as sold (removes from search, keeps in seller history)

**What makes marketplaces work vs fail (Vinted/OLX model research):**
- **Trust layer is non-negotiable**: Seller ratings + profile history. Without it, nobody buys.
- **Photos are everything**: Bad photo = no sale. Prompt users to take good photos.
- **Zero or minimal fees beat competitors**: Fishsurfing charges nothing, Vinted charges buyer fees. Free listing = more supply = more buyers.
- **In-app messaging keeps users in app**: External phone numbers = app loses the relationship.
- **Niche = advantage**: Buyers trust that a fishing bazár has fishing gear. Facebook Marketplace has everything = harder to find, harder to trust.
- **Community integration drives supply**: If users are already in the app for the community, listing gear is low friction. Facebook sellers have to post in multiple groups.

**Complexity:** High — 7–10 days. Firestore listings collection + auto-expiry Cloud Function + in-app chat (Firestore real-time messages) + seller rating system + image uploads. Chat is the hardest part (real-time UX).

**Done criteria:** User creates listing with 3 photos in under 3 minutes. Listing appears in browse within 10 seconds. Buyer sends message, seller receives push notification within 30 seconds. Auto-expiry fires correctly at 60 days. Free user blocked from creating 4th listing with clear upgrade prompt.

---

### 3. Community Forum — Reddit-Style

**Why it differentiates:** Facebook Groups are chronological chaos — important posts disappear in hours. Reddit-style voting surfaces the best content permanently. Fishsurfing's forum is late and underdeveloped. This is where displaced Facebook users land.

**What "done" looks like:**
- Categories (hardcoded initially): Technika / Revíry / Výbava / Návnady / Začiatočníci / Záznamy úlovkov / Bazár diskusia / Správy
- Post types: text, photo, link
- Voting: upvote only (no downvote for friendlier atmosphere — Fishbrain/Reddit model differs; for a niche local community downvotes create drama)
- Sort: Horúce (score + recency) / Nové / Top týždeň / Top mesiac
- Comments: threaded (2 levels max on mobile — deep nesting is unreadable), upvoteable
- Cross-post catch to community: one-tap share from diary to forum
- Save post (bookmarks)
- Report + moderation queue for admins
- User flair: visible fishing style tags (kaprar / muškar / prívlačkár / feeder)

**Mobile-specific UX patterns that work (vs. web):**
- Bottom sheet comments (not full page navigation) — thumb-friendly
- Swipe gestures: swipe right = upvote (Alien Blue / Apollo pattern), swipe left = save
- Sticky "new reply" notification at top while reading thread
- Image posts expand inline, don't navigate away
- Compact mode toggle (card view vs. list view) for power users
- No infinite nested comments — flatten after level 2 with "load more replies"

**Complexity:** High — 8–10 days. Posts + comments + votes Firestore collections + sorting algorithm (hot score calculation as Cloud Function, not client-side) + category filtering + cross-post flow.

**Done criteria:** User posts in category, appears in Hot feed within 60 seconds. Upvote reflects immediately (optimistic UI). Sort by Hot correctly surfaces 3-day-old popular posts over 1-hour-old posts with 1 upvote. Comments load in under 1 second.

---

### 4. Personal Catch Statistics & Analytics

**Why it differentiates:** This is the "journal value" that makes users stay. Fishbrain does this behind Pro. Free personal stats = retention loop.

**What "done" looks like:**
- Dashboard: total catches this year vs last year, biggest catch ever, most common species, most productive revír, most productive month
- Heatmap calendar: fishing activity per day (GitHub contribution graph style)
- Species breakdown: pie chart, count + total weight per species
- Best conditions analysis (after 10+ catches): "Ty chytáš najlepšie pri: tlak 1008–1015 hPa, teplota 16–20°C, čas 06:00–09:00"
- Export: PDF catch report (annual summary — useful for self-reporting to fishing associations)

**Complexity:** Medium-High — 4–5 days. Aggregation queries in Firestore (or denormalized counters updated on each catch write). Chart library (Victory Native or Skia-based). PDF export = Cloud Function.

**Done criteria:** Stats screen loads in under 2 seconds. Calendar correctly shows all logged catch days. Best conditions analysis only appears after 10+ catches (not before — no data to analyze).

---

### 5. Slovak/Czech First — Native Language UX

**Why it differentiates:** Every global app is English-first, translated second. Fish species names in wrong language, regulations in different legal context, maps missing local revíry. CATCH is built in slovenčina from day zero.

**What "done" looks like:**
- All UI strings in Slovak (primary), Czech (secondary via i18n toggle or auto-detect by device locale)
- Fish species database with Slovak names: kapor, šťuka, zubáč, lieň, mrena, pstruh, pleskáč, úhor, sumec, candát... (minimum 40 SK species)
- SRZ-specific regulation format (lovná miera in cm, hájenie in dates matching Slovak law)
- Push notifications in Slovak
- AI predictions output in Slovak (GPT prompt instructs Slovak output)
- Error messages, onboarding, empty states — all Slovak

**Complexity:** Low — 1–2 days if built right from start (i18n library from day 1). Expensive to retrofit later. Fish species DB = 1 day of data entry.

**Done criteria:** Native Slovak speaker finds zero English strings in the app. Czech user switching to CZ locale sees correct Czech UI. Fish species names match what anglers actually call them colloquially, not just formal Latin.

---

### 6. Karma & Gamification System

**Why it differentiates:** Creates long-term retention and status hierarchy in the community. Duolingo-style streaks increase DAU by 40–60% per research. MyFitnessPal's multi-layer gamification is the model to follow for hobby apps.

**What "done" looks like:**
- Karma earned by: posting catch (+5), community upvote on catch (+1), post upvote (+2), comment upvote (+1), selling in bazár (+10 per deal), answering question marked as helpful (+5)
- Badges: "Prvý kapor" (first catch logged), "Rybár mesiaca" (most upvotes in month), "Predajca" (first bazár sale), "Veteran" (100 catches logged), "Nočný lovec" (5 night catches), species-specific badges
- Fishing streak: logged a catch N days in a row — visible on profile
- Leaderboard: top anglers by karma this month / this year (region-filtered)
- Karma = soft currency (no actual value, pure status). Never convertible to money or discounts (legal simplicity).

**Complexity:** Medium — 3–4 days. Karma calculation as Firestore Cloud Function triggers. Badge criteria evaluated on each relevant write. Leaderboard = Firestore query with index on karma field.

**Done criteria:** New user earns first badge within first session (low bar intentional for onboarding). Karma updates within 5 seconds of trigger action. Leaderboard shows correct top-10 for current month.

---

## Anti-Features — Deliberate Exclusions

These are things users might ask for that CATCH explicitly will NOT build in v1. Each exclusion is a product decision, not a gap.

### 1. Real-time Catch Location Sharing / Leaderboards with GPS

**Why excluded:** Fishing spot secrecy is a core cultural value among anglers. Fishbrain's biggest user complaint is that it forces location tagging too aggressively. A rybár's revír secrets are their competitive advantage. Violating this trust = immediate uninstall + negative word of mouth. CATCH's privacy default must be "location = region only, not exact GPS" unless user explicitly opts in.

---

### 2. Video Content / Live Streaming

**Already in PROJECT.md out of scope.** Reinforced by research: storage + bandwidth cost is prohibitive (Firebase Storage at scale). Instagram Reels / YouTube covers this. Fishing videos belong on YouTube, not in CATCH. Photo-only keeps the app fast and cheap.

---

### 3. Gear Shop / New Products for Sale (Affiliate Commerce)

**Why excluded:** Fishbrain tried this (in-app tackle shop) and it confused the product identity. Users come to fish, not to shop. The bazár covers secondhand — that's the community-value version. Selling new gear = competing with FISHOP, Mall.sk, Heureka. We lose that fight. Focus.

---

### 4. Tournament Management / Competition Platform

**Already out of scope in PROJECT.md.** Also: tournaments require admin overhead, real-time scoring, prize management — a full separate product. SRZ runs official tournaments; no need to compete with them.

---

### 5. Web Version

**Already out of scope in PROJECT.md.** Reinforced: 64% of app installs are Android, 36% iOS. The target user is fishing from a riverbank with a phone. A desktop web app serves nobody in this use case. Maintenance cost doubles, design compromises accumulate. Mobile only.

---

### 6. AI Species Identification from Photo

**Why excluded for v1:** Fishbrain offers this and it's genuinely useful but: (1) requires a trained ML model or expensive API (Google Vision ML Kit or similar), (2) SK freshwater species identification from photos is unreliable — lighting, angle, and similar-looking species (lieň vs. kapor at certain sizes) cause frustration, (3) the catch diary already has a species dropdown — faster than AI identification for experienced anglers. Add in v2 after core loop is validated.

---

### 7. Fishing License Management / SRZ Povolenie Digital Storage

**Why excluded for v1:** Technically complex (PDF upload + validation), legally sensitive (SRZ is the authority, not CATCH), and SRZ itself would need to cooperate. Nice-to-have but not core to the app's value loop. Could be a compelling v2 partnership feature with SRZ directly.

---

### 8. Forums with Anonymous Posting

**Why excluded:** Anonymous posting in a niche community = lowest common denominator content. Slovak fishing Facebook groups already have this problem (arguments, spam, duplicate questions). CATCH's community quality comes from identity-linked posts. All posts tied to profile. No exceptions.

---

## SK/CZ Market Specifics

### Regulatory Context

- **SRZ (Slovenský Rybársky Zväz)** is the governing body for SK fishing. All SK fishing grounds classified under SRZ revír system. Data is public but not in clean API form — requires manual data sourcing or scraping.
- **MRS (Moravský Rybářský Svaz)** and **ČRS (Český Rybářský Svaz)** cover CZ grounds.
- Catch size limits (lovné miery) and closed seasons (hájenie) are legally mandated — CATCH can display these but cannot be the legal authority. Disclaimer required.
- Fishing permits (povolenia): annual, day, water-specific. Users buy these from SRZ, not through CATCH. Don't try to integrate payment for permits in v1.

### Demographics

- SK has ~120,000+ registered anglers (SRZ membership data). CZ has ~350,000+ (ČRS). Combined addressable market: ~470,000 serious registered anglers.
- Age skew: 25–55 primary. Younger anglers (18–30) more likely to adopt mobile apps. Older anglers more likely to need simpler UX.
- Device: Android dominant in SK/CZ (vs iOS-heavy Western Europe). CATCH's Firebase + Expo stack serves both equally.
- Connectivity: Fishing spots are often in low-signal areas. Offline capability for core features (catch log queue, revír data cache) is not optional.

### Facebook Group Landscape (Current State)

Slovak fishing Facebook groups are active but fragmented:
- Multiple regional groups (Rybári BA, Rybári KE, Kapri SK, etc.) — no single home
- Key pain points observed in group behavior: gear selling mixed with fishing reports mixed with questions = chaos. Important tips disappear in 24 hours. No search within groups. Scam risk in gear sales (no seller history). Arguments in comments without moderation tools.
- **CATCH's value proposition to these users:** "Všetko čo robíš na Facebooku pre rybolov — ale organizovane, v slovenčine, s históriou, s bazárom kde ti nikto nepodvedie."

### Price Sensitivity

- €1/month Premium is correctly priced for this market. Research shows SK purchasing power is ~55% of EU average. Global median subscription is $12.99/month — CATCH at €1/month = 12.8x cheaper than Fishbrain Pro.
- Annual option (€9.99/year) recommended as primary CTA — lowers perceived monthly cost to €0.83, improves retention (annual subscribers churn 3x less than monthly).
- Critical: free tier must feel genuinely useful (not crippled). The Fishbrain mistake is aggressive paywalling of basics. CATCH should paywall: AI predictions beyond today, unlimited bazár listings, and extended stats history. Core diary, map, and community always free.

### Fishsurfing Specific Weaknesses (Primary Competitor)

Confirmed weaknesses from research to directly address:
1. **Incomplete SK revír map** — Czech-centric, SK data sparse. CATCH must launch with more complete SK coverage.
2. **Chronological feed** — no quality ranking. CATCH's upvote system surfaces good content.
3. **No AI predictions** — CATCH has them as core Premium feature.
4. **Cluttered interface** — CATCH's 5-tab navigation (Domov / Mapa / Denník / Komunita / Bazár) is cleaner.
5. **Forum came late** — Fishsurfing users complained. CATCH launches with community as Day 1 feature.
6. **No gamification** — Fishsurfing has no karma, no badges. CATCH has full system.
7. **Global focus dilutes local** — Fishsurfing tries to connect anglers from Spain and Lithuania. CATCH is unapologetically SK/CZ first.

---

## Freemium Model — What Converts Free to Paid

**Research-backed conversion mechanics:**

Industry median freemium-to-paid conversion: 2.18%. Niche hobby apps with high-value features: 5–10%. Target: 5% of monthly active users.

**What to gate (Premium only):**
- AI predictions beyond today (7-day forecast) — highest willingness to pay, directly tied to fishing success
- Unlimited bazár listings (free = 3 active) — creates friction only for power sellers
- Extended stats history (free = current year only, Premium = all-time)
- Premium badge on profile (status signal in community)
- Ad-free experience (free tier: max 1 non-intrusive banner on feed, never in catch flow)

**What must stay free forever (trust builders):**
- Catch diary (unlimited catches)
- Map + revír data
- Community posting + voting
- Basic stats (current year)
- Up to 3 bazár listings
- Today's basic fishing conditions (non-AI, just weather summary)

**Conversion trigger strategy:**
1. **Value-first gate**: User sees "Predikcia pre kapra" card that says "Dnes: DOBRÉ podmienky" (free). Tapping for 7-day forecast → paywall. They already got value, they want more.
2. **4th listing block**: Power sellers list 3 items and hit the wall exactly when they're most engaged. "Chceš pridať viac? Premium." Conversion rate here is high — they're already in the selling mindset.
3. **Annual default**: Show annual price first (€9.99/rok = €0.83/mes). Monthly option small below it. Anchors perception on annual.
4. **Free trial**: 14-day full Premium trial on signup. Research shows opt-in trial (no card) converts at 18–25% — acceptable for community app where trial gets users addicted to AI predictions.
5. **Social proof on paywall screen**: "247 rybárov z tvojho okolia má Premium" — localized social proof.

**RevenueCat integration specifics:**
- Single product: `catch_premium_annual` (€9.99) + `catch_premium_monthly` (€1.49)
- Entitlement: `premium`
- Offering: annual as default, monthly as "flexibility" option
- Paywall trigger points: AI prediction expand, 4th bazár listing, stats history tap

---

## Push Notification Strategy

**Core principle:** Every notification must pass the test: "Would the user thank us for this?" If no — don't send it.

**High-value notification types (send these):**

| Trigger | Message | Timing |
|---------|---------|--------|
| Community reply to your post | "Ján ti odpovedal: 'Skús žltý twister...'" | Immediate |
| Bazár message received | "Nová správa od Petra k tvojmu inzerátu Shimano Baitrunner" | Immediate |
| AI: "Vynikajúce podmienky" tomorrow | "Zajtra ráno ideálne podmienky pre kapra na tvojom oblúbenom revíri" | 20:00 previous day |
| Bazár listing expiring | "Tvoj inzerát 'Prút Daiwa 3.6m' expiruje o 10 dní" | Day 50 of 60 |
| First upvote on catch | "Tvoj úlovok sa páči 5 rybárom!" | Immediate (first 5 only) |
| Weekly fishing report | "Tento týždeň chytili rybári v tvojom kraji 47 kaprov" | Friday 17:00 |

**Anti-patterns (never send these):**
- "Pozri sa čo je nové v komunite" (generic engagement bait)
- Marketing pushes ("Kúp Premium za €1!")
- Daily reminders to log catches
- Duplicate alerts for same event
- Any notification between 22:00–07:00

**User control (mandatory):**
- Notification preferences screen with per-category toggles
- Default: community replies ON, bazár ON, AI alerts ON, weekly report OFF (opt-in)
- iOS requires permission prompt — show it at moment of first community interaction, not on onboarding (context-relevant ask increases acceptance from 46% to 70%)

---

## Complexity Estimates Summary

| Feature | Complexity | Sprint Days | Priority |
|---------|-----------|------------|---------|
| Auth + Profiles | Low-Med | 2–3 days | P0 |
| Catch Diary core | Medium | 3–4 days | P0 |
| Photo upload pipeline | Medium | 2 days | P0 |
| Revír Map SK basic | High | 5–7 days | P0 |
| Feed / Home screen | Medium | 3–4 days | P0 |
| Community forum | High | 8–10 days | P0 |
| Bazár marketplace | High | 7–10 days | P0 |
| In-app chat (Bazár) | High | 3–4 days | P0 |
| AI Predictions | High | 5–7 days | P1 |
| Personal stats dashboard | Med-High | 4–5 days | P1 |
| Gamification / Karma | Medium | 3–4 days | P1 |
| Push notifications | Medium | 2–3 days | P1 |
| RevenueCat Premium | Low-Med | 1–2 days | P1 |
| Seller ratings | Medium | 2 days | P1 |
| i18n SK/CZ | Low | 1–2 days | P0 (baked in from start) |
| Offline catch queue | Medium | 2 days | P1 |
| PDF catch export | Low | 1 day | P2 |
| Personalized AI (own data) | High | 3–4 days | P2 |

**Total P0 estimate:** ~35–45 developer days (MVP launch scope)
**Total P1 estimate:** ~20–28 additional developer days (full v1.0)

---

## References

- [Fishbrain Features](https://fishbrain.com/features) — Official feature page
- [Fishbrain App Store Reviews](https://justuseapp.com/en/app/477967747/fishbrain-fishing-app/reviews) — User complaints aggregation
- [FishAngler vs Fishbrain Comparison](https://blog.fishangler.com/fishangler-vs-fishbrain/) — Feature comparison
- [Best Fishing Apps 2026 — FishingBooker](https://fishingbooker.com/blog/best-fishing-apps/) — Comprehensive app ranking
- [Evaluating Fishing Apps Pros/Cons — SlammingBass](https://www.slammingbass.com/bass-fishing-tips/the-real-catch-assessing-the-impact-of-top-fishing-apps/) — Critical analysis
- [WeFish Marketplace](https://wefish.app/wefish-fishing-marketplace/) — Marketplace competitor
- [WeFish PRO Features](https://wefish.app/en/pro/) — Premium tier analysis
- [Fishsurfing Official](https://www.fishsurfing.com/en/) — Primary SK/CZ competitor
- [Fishsurfing 2.0 Review — LovKapra.cz](https://www.lovkapra.com/fishsurfing-2-0-vylepsena-nejstahovanejsi-aplikace-mezi-ceskymi-rybari/) — Czech angler community response
- [Fishsurfing Review — SMARTmania.cz](https://smartmania.cz/ceska-aplikace-fishsurfing-chce-spojit-rybare-z-celeho-sveta-recenze/) — Czech tech press review
- [Fishsurfing SK — Slovenský Rybár](https://www.slovenskyrybar.sk/magazin/6-2024/70-fishsurfing-omrkni-novu-appku-6904-5564) — Slovak angling media coverage
- [Fishinda App](https://fishinda.com/) — European competitor with marketplace
- [Rybárske Revíry SK — Google Play](https://play.google.com/store/apps/details?id=sk.rr.rybarskereviry&hl=en) — SK utility app
- [Revírník CZ](https://revirnik.cz/) — Emerging CZ+SK competitor
- [Barometric Pressure & Fishing — Kestrel Meters](https://kestrelmeters.com/blog/how-barometric-pressure-affects-fishing) — Scientific basis for predictions
- [Moon Phase & Fishing Science — Fish'n Canada](https://fishncanada.com/do-moon-phases-affect-freshwater-fish-behaviour/) — Solunar science review
- [Solunar Theory — Windy.app](https://windy.app/textbook/what-is-solunar.html) — Prediction methodology
- [State of Subscription Apps 2025 — RevenueCat](https://www.revenuecat.com/state-of-subscription-apps-2025/) — Freemium conversion data
- [SaaS Freemium Conversion Rates 2025 — FirstPageSage](https://firstpagesage.com/seo-blog/saas-freemium-conversion-rates/) — Industry benchmarks
- [Vinted 2025 Global Report — BusinessWire](https://www.businesswire.com/news/home/20260106022808/en/2025-Global-Marketplaces-Report-Vinted-Breaks-Into-Top-5-As-New-Global-Challenger---ResearchAndMarkets.com) — Marketplace success factors
- [Push Notifications Best Practices — Reteno](https://reteno.com/blog/push-notification-best-practices-ultimate-guide-for-2026) — Notification strategy
- [App Gamification Strategies 2025 — StudioKrew](https://studiokrew.com/blog/app-gamification-strategies-2025/) — Engagement mechanics
- [Streaks & Milestones — Plotline](https://www.plotline.so/blog/streaks-for-gamification-in-mobile-apps) — Retention gamification
- [Fishing App Market Size 2025 — CoherentMarketInsights](https://www.coherentmarketinsights.com/industry-reports/fishing-app-market) — Market sizing
- [Fishing in Czech Republic — Expats.cz](https://www.expats.cz/czech-news/article/fishing-in-the-czech-republic) — CZ market context
- [Recast Secondhand Fishing](https://www.recast.market/en/2-home.html) — Niche secondhand marketplace model
- [GilledIt Best Fishing Apps 2026](https://www.gilledit.com/us/blog/best-fishing-apps) — Current app rankings
