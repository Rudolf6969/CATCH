# CATCH

## What This Is

CATCH je **sociálna sieť pre rybárov** — Instagram pre kaprárov. Kombinuje Instagram-štýl feed úlovkov, live podmienky s AI odporúčaniami návnad, osobný denník s filtrom podľa revíru a bazár secondhand vybavenia. MVP je zameraný na kaprarinu (carp fishing), neskôr rozšírenie na privlač. Cieľ: vytiahnuť aktívnych SK/CZ rybárov z Facebook skupín a dať im natívny domov.

## Core Value

Rybár ráno skontroluje podmienky a dostane profesionálny tip na nástrahu → ide na ryby → zaloguje úlovok jedným tapom → zdieľa do Feedu komunite. Celý loop v jednej appke, v slovenčine.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Autentifikácia (email/heslo, session persistence, auth guard)
- [ ] **Podmienky tab** — live počasie (teplota vody+vzduchu, tlak, vietor, fáza mesiaca) + AI tip na nástrahu podľa podmienok
- [ ] **Feed tab** — Instagram/TikTok FYP štýl, fotky úlovkov komunity, like, komentár, profil cez tap na meno
- [ ] **"+" center FAB** — foto/video → form → post do Feedu + auto-uloženie do Denníka
- [ ] **Denník tab** — moje úlovky, filter podľa revíru (názov vodnej plochy + SRZ číslo)
- [ ] **Bazár tab** — secondhand rybárske vybavenie, geo-filter, in-app chat
- [ ] Mapa revírov (SK/CZ, 330+ SRZ/ČRS revírov s reguláciami) — dostupná z Podmienky tabu alebo mapy v Denníku
- [ ] AI odporúčania návnad (kaprarína) — expertné tipy podľa teploty vody, tlaku, vetra, fázy mesiaca, ročného obdobia
- [ ] Profily používateľov — Instagram-štýl grid, štatistiky, karma/badges
- [ ] Push notifikácie (odpovede, správy, expiry inzerátov, ideálne podmienky)
- [ ] Premium subscription cez RevenueCat (€1/mes alebo €9.99/rok)

### Out of Scope

- Reddit-štýl komunita ako samostatný tab — MVP: kategória postov vo Feede (tip, montáž, technika)
- Real-time fishing tournaments — príliš komplexné pre MVP
- Privlač (spinning) sekcia — v2 po launchi kaprariny
- Web verzia — mobile-first, React Native only
- Vlastný platobný systém — RevenueCat rieši iOS + Android
- Live GPS zdieľanie polohy — kultúrna tabu SK/CZ rybárov (tajné miesta)
- Offline maps tile cache — Google/Apple maps pokrývajú potrebu

## Context

**Fishing focus:**
- MVP: Kaprarína (carp fishing) — bait, techniky, podmienky všetko kapor-first
- v2: Privlač (spinning/predatory) — vlastné podmienky, nástrahy, techniky

**Tech Stack (definovaný):**
- Expo SDK 53 + Expo Router v5 (file-based routing) — iOS + Android z jedného kódu
- Firebase: Firestore, Auth, Storage, Cloud Functions (`@react-native-firebase` natívny SDK)
- Zustand (global state: auth, UI, unread) + React Query (server state + caching)
- OpenAI GPT-4o mini — AI odporúčania návnad v SK
- Open-Meteo (primárny, free, DWD ICON-D2 model, najvyššia presnosť SK/CZ)
- RevenueCat pre subscription (iOS + Android IAP)
- Firebase Cloud Messaging (push notifikácie)
- React Native Maps v1.18 + Google Maps API
- PostHog (analytics, free tier)

**Cieľová skupina:**
- SK/CZ kapráři 18–55 rokov, aktívni na Facebook skupinách
- Primárne slovenčina, čiastočne čeština

**Dizajn systém:**
- Dark only (brand decision — žiadny light mode)
- Primary: `#1B4332` | Secondary: `#40916C` | Accent: `#F4A261` (CTA oranžová)
- AccentBlue: `#1E6091` | BG: `#0A1628` | Surface: `#112240` | SurfaceHigh: `#1A2F52`
- Fonty: Outfit (headings), Inter (body), JetBrains Mono (čísla/štatistiky)

**Dátový model:**
- Firestore: users, posts (=catches verejné), catches (súkromné záznamy), spots, listings, conversations, messages, sellerReviews
- Post = verejný (Feed) + catch = súkromný záznam (Denník) — jeden submit, dva dokumenty
- GeoPoint pre všetky lokácie, geohash vedľa GeoPoint pre proximity queries

## Constraints

- **Platform**: iOS + Android — Expo/React Native, žiadny web
- **Jazyk UI**: Slovenčina primárne, čeština čiastočne
- **AI budget**: GPT-4o mini — nie GPT-4o (cenová kontrola)
- **Monetizácia**: Free (obmedzené inzeráty, len dnešná predikcia) / Premium €1/mes alebo €9.99/rok
- **MVP fishing scope**: Kaprarína only — žiadne spinning, fly fishing funkcie v MVP

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Expo Router v5 + file-based routing | Auth guard (Stack.Protected), OTA updates, jednoduchší routing | — Pending |
| Firebase (`@react-native-firebase`) | Natívny SDK — offline persistence, FCM, Auth, Storage v jednom | — Pending |
| RevenueCat namiesto vlastných platieb | iOS + Android IAP compliance, žiadna réžia | — Pending |
| GPT-4o mini | 10x lacnejší ako GPT-4o, dostatočný pre fishing advice | — Pending |
| Feed = Instagram FYP (nie Reddit-štýl) | Rybári sú vizuálni — fotky úlovkov, nie text-heavy diskusie | — Pending |
| Podmienky tab = default (tab 1) | Hlavný dôvod spustiť appku ráno pred odchodom na ryby | — Pending |
| Post + Catch = 1 submit, 2 dokumenty | Feed (verejný) a Denník (súkromný) z jednej akcie — UX simplicity | — Pending |
| MVP = kaprarína only | Hlbší fokus = lepší produkt. Privlač v2 po validácii core loopu. | — Pending |

---
*Last updated: 2026-03-12 after discuss-phase 1 — tab štruktúra a app vízia aktualizované*
