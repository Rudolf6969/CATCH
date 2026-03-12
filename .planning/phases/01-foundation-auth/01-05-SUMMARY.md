---
phase: 01-foundation-auth
plan: "05"
subsystem: tab-navigation
tags: [expo-router, tabs, navigation, ui, placeholder]
dependency_graph:
  requires: [01-03, 01-04]
  provides: [tab-navigation, placeholder-screens]
  affects: [all-future-phases]
tech_stack:
  added:
    - expo-router/ui (headless Tabs, TabList, TabTrigger, TabSlot, useTabTrigger)
  patterns:
    - FocusableTab wrapper s useTabTrigger hook pre isFocused stav
    - SafeAreaProvider v tab layout pre dynamic insets
    - Center FAB Pressable (nie TabTrigger) pre modal navigation
key_files:
  created:
    - app/(tabs)/podmienky.tsx
    - app/(tabs)/feed.tsx
    - app/(tabs)/pridat.tsx
    - app/(tabs)/dennik.tsx
    - app/(tabs)/bazar.tsx
    - src/components/tabs/CustomTabBar.tsx
    - src/components/tabs/TabIcon.tsx
  modified:
    - app/(tabs)/_layout.tsx
decisions:
  - "useTabTrigger hook namiesto render prop pre isFocused — TabTrigger.children je ReactNode nie function"
  - "FocusableTab wrapper komponent obaluje TabTrigger + useTabTrigger pre focused stav"
  - "index.tsx ponechané — expo-router môže redirectovať, podmienky.tsx je primárny screen"
metrics:
  duration: "4 min"
  completed: "2026-03-12"
  tasks: 2
  files: 8
---

# Phase 01 Plan 05: Tab Navigácia s Custom FAB Summary

**One-liner:** 5-tabová expo-router/ui headless navigácia s oranžovým FAB center buttonom a branded placeholder screenmi pre každý tab.

---

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Custom tab navigácia s FAB | f6289b0 | _layout.tsx, CustomTabBar.tsx, TabIcon.tsx |
| 2 | Branded placeholder screeny | 821b6f2 | podmienky.tsx, feed.tsx, pridat.tsx, dennik.tsx, bazar.tsx |

---

## What Was Built

### Tab Navigation Architecture
- `app/(tabs)/_layout.tsx` — headless `expo-router/ui` `Tabs` + `TabSlot` + `CustomTabBar`
- `src/components/tabs/CustomTabBar.tsx` — `TabList` s 4 `TabTrigger` + 1 center FAB `Pressable`
- `src/components/tabs/TabIcon.tsx` — reusable ikona + label s focused/unfocused farbami

### Tab Bar Design
- Background: `#0A1628` (tabBar), border top: `#1A2F52` (tabBorder)
- Aktívna ikona: `#40916C` (zelená), neaktívna: `#6B7280` (šedá)
- FAB: `60x60`, `borderRadius 30`, `#F4A261` (oranžová), shadow s accent farbou, `marginTop -20` floating efekt
- `useSafeAreaInsets` pre `paddingBottom` (Android edge-to-edge + iOS home bar)

### Placeholder Screens
1. **Podmienky** — dummy weather widget (teplota 14°C, tlak 1018 hPa, vietor, mesiac, AI skóre 7/10)
2. **Feed** — skeleton posty s Avatar + animovaný Skeleton komponent
3. **Pridat** — modal placeholder s fish icon, close button, "Phase 2" badge
4. **Denník** — empty state s book icon + CTA tap ⊕
5. **Bazár** — empty state s storefront icon + "Phase 6" badge

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] TabTrigger nepodporuje function-as-children render prop**
- **Found during:** Task 1
- **Issue:** Plan predpokladal `({ focused }) => (...)` children callback pattern. `TabTrigger` v expo-router/ui má `children?: ReactNode` — nie function prop.
- **Fix:** Vytvorený `FocusableTab` wrapper komponent ktorý volá `useTabTrigger({ name, href })` hook a z `trigger.isFocused` číta focused stav, potom renderuje `TabIcon` s correct farbou.
- **Files modified:** src/components/tabs/CustomTabBar.tsx
- **Commit:** f6289b0

---

## Screenshot Description

Na zariadení developer uvidí:
- Tmavý navy tab bar (`#0A1628`) na spodku obrazovky so 4 ikonami a 1 floating FAB
- FAB je oranžový kruh s `+` ikonou, jemne vysunutý nad tab bar (floating efekt)
- Podmienky tab (default) zobrazuje weather grid cards s dummy dátami, AI score card s `7/10`
- Feed tab zobrazuje animated skeleton posty (pulse animácia)
- Pridat tab sa otvára ako full-screen modal s fish ilustráciou v strede
- Denník a Bazár majú centered empty states s veľkými Ionicons ikonami

---

## Self-Check: PASSED

All 8 files confirmed on disk. Both commits (f6289b0, 821b6f2) confirmed in git log.
