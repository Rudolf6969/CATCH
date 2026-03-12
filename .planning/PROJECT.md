# CATCH

## What This Is

CATCH je mobilná appka pre slovenských a českých rybárov, ktorá kombinuje osobný denník úlovkov, AI predikcie ideálneho času na rybolov, interaktívnu mapu revírov, Reddit-štýl komunitu a bazár secondhand vybavenia — všetko na jednom mieste v slovenčine. Cieľ je vytiahnuť aktívnych rybárov z Facebook skupín a dať im domov.

## Core Value

Rybár zaznamená úlovok, dostane AI predikciu kedy ísť ďalší raz, a pochváli sa v komunite — celý loop na jednom mieste, v slovenčine.

## Requirements

### Validated

(None yet — ship to validate)

### Active

- [ ] Autentifikácia (email/heslo, session persistence)
- [ ] Denník úlovkov (ryba, váha, dĺžka, fotky, metóda, revír, auto-počasie)
- [ ] Mapa revírov (SK/CZ, filtrovanie, detaily, ratings)
- [ ] AI Predikcie na základe počasia, tlaku, mesiaca (Premium)
- [ ] Fórum / Komunita (Reddit-štýl — posty, komentáre, votes, kategórie)
- [ ] Bazár (inzeráty secondhand vybavenia, in-app chat, hodnotenia predajcov)
- [ ] Push notifikácie (odpovede, správy, predikcie, expiry)
- [ ] Premium subscription cez RevenueCat (€1/mesiac)
- [ ] Profily používateľov s karma/badges systémom

### Out of Scope

- Real-time fishing tournaments — príliš komplexné pre MVP
- Video obsah / live streaming — storage/bandwidth cost mimo budget
- Web verzia — mobile-first, React Native only
- Vlastný platobný systém — RevenueCat rieši iOS + Android

## Context

**Tech Stack (definovaný):**
- Expo SDK 51+ s Expo Router (file-based routing) — iOS + Android z jedného kódu
- Firebase (Firestore, Auth, Storage, Cloud Functions)
- Zustand pre global state, React Query pre server state + caching
- OpenAI GPT-4o mini pre AI predikcie (lacné, rýchle)
- OpenWeatherMap API + Open-Meteo (barometrický tlak zadarmo)
- RevenueCat pre subscription management
- Firebase Cloud Messaging pre push notifikácie
- React Native Maps + Google Maps API
- PostHog (analytics, free tier)

**Cieľová skupina:**
- SK/CZ rybári 18–55 rokov
- Aktívni na Facebook skupinách → chceme ich sem presunúť
- Hovoria po slovensky a česky

**Dizajn systém (definovaný):**
- Primary: `#1B4332` (tmavá zelená)
- Secondary: `#40916C` (stredná zelená)
- Accent: `#F4A261` (oranžová — CTA)
- AccentBlue: `#1E6091` (modrá — voda)
- BG: `#0A1628` (dark navy)
- Surface: `#112240`, SurfaceHigh: `#1A2F52`
- Fonty: Outfit (heading), Inter (body), JetBrains Mono (čísla)

**Dátový model (definovaný):**
- Firestore collections: users, catches, spots, posts, comments, listings, conversations, messages, sellerReviews
- GeoPoint pre všetky lokácie
- Bazár: auto-expiry po 60 dňoch (Cloud Function)

## Constraints

- **Platform**: iOS + Android — React Native / Expo, žiadny web
- **Jazyk UI**: Slovenčina (primárne), čeština (čiastočne)
- **Budget AI**: GPT-4o mini — nie GPT-4o (cenová kontrola)
- **Monetizácia**: Free tier obmedzený (3 inzeráty, bez AI) / Premium €1/mes
- **Maps**: React Native Maps + Google Maps API key

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Expo Router (file-based) | Jednoduchší routing, SDK integrations, OTA updates | — Pending |
| Firebase namiesto Supabase | Real-time chat, FCM push, Auth, Storage v jednom balíku | — Pending |
| RevenueCat namiesto vlastných platby | iOS + Android cross-platform IAP, žiadna réžia | — Pending |
| GPT-4o mini namiesto GPT-4o | 10x lacnejší, dostatočne dobrý pre fishing tips | — Pending |
| Bazár ako core feature v1 | Diferenciátor — žiadna iná SK rybárska appka ho nemá | — Pending |
| Komunita Reddit-štýl | Rybári sú zvyknutí na Facebook Groups → podobný UX pattern | — Pending |

---
*Last updated: 2026-03-12 after initialization*
