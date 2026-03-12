---
phase: 01-foundation-auth
plan: "03"
subsystem: design-system
tags: [theme, i18n, ui-primitives, design-tokens, localization]
dependency_graph:
  requires: [01-01, 01-02]
  provides: [theme-tokens, i18n-sk-cs, ui-primitives]
  affects: [all-screens-phase-1-8]
tech_stack:
  added: [i18n-js@4.5.3, expo-localization]
  patterns: [design-tokens, barrel-exports, pressable-over-touchable, tdd-red-green]
key_files:
  created:
    - src/theme/theme.ts
    - src/lib/i18n.ts
    - src/locales/sk.json
    - src/locales/cs.json
    - src/components/ui/Button.tsx
    - src/components/ui/Card.tsx
    - src/components/ui/Badge.tsx
    - src/components/ui/Avatar.tsx
    - src/components/ui/TextInput.tsx
    - src/components/ui/Skeleton.tsx
    - src/components/ui/index.ts
  modified: []
decisions:
  - "expo-localization require() obalený v try/catch pre graceful test-env fallback — testEnvironment: 'node' nemá Expo runtime"
  - "StyleSheet.create() spread operator cez (theme.typography.body as object) kvôli TypeScript strict const inference"
  - "Card.elevated rozložený cez explicitné shadow properties namiesto spread shadowing kvôli StyleSheet.create type constraints"
metrics:
  duration: "8 min"
  completed_date: "2026-03-12"
  tasks_completed: 2
  files_created: 11
  files_modified: 0
  tests_passed: 9
---

# Phase 1 Plan 3: Design System + i18n + UI Primitives Summary

**One-liner:** Design system tokens (navy/zelená/oranžová), SK/CS i18n konfigurácia a 6 reusable RN primitives (Button/Card/Badge/Avatar/TextInput/Skeleton) — shared foundation pre všetky Phase 1-8 screeny.

---

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | theme.ts + i18n konfigurácia (TDD) | baea484 | theme.ts, i18n.ts, sk.json, cs.json |
| 2 | UI primitives — 6 komponentov | 9880d87 | Button, Card, Badge, Avatar, TextInput, Skeleton, index.ts |

---

## What Was Built

### theme.ts
Kompletný design token systém pre dark-only appku:
- **Farby:** 20 tokenov — bg `#0A1628`, surface `#112240`, surfaceHigh `#1A2F52`, primary `#1B4332`, primaryMid `#40916C`, accent `#F4A261`, semantic colors (error/success/warning), tab bar tokeny
- **Typografia:** 13 variantov — Outfit (headings Bold/SemiBold), Inter (body Regular/Medium), JetBrainsMono (mono pre čísla/štatistiky)
- **Spacing:** xs(4) sm(8) md(16) lg(24) xl(32) xxl(48) xxxl(64)
- **Radius:** xs(4) sm(8) md(12) lg(16) xl(24) full(999)
- **Shadow:** sm, md, accent (oranžový glow pre FAB)

### i18n
- i18n-js konfigurácia s SK ako default locale a fallback
- sk.json: auth flow, tabs, common UI, placeholder strings
- cs.json: kompletné CZ preklady
- try/catch pre expo-localization — funguje v Jest node test environment

### UI Primitives (všetky importujú theme, Pressable namiesto TouchableOpacity)
- **Button:** primary/secondary/ghost/danger varianty, sm/md/lg veľkosti, loading (ActivityIndicator), disabled, fullWidth
- **AppTextInput:** label + error inline + helper text, focus/error border stavy pre auth formy
- **Card:** surface background, radius, border, optional elevated shadow
- **Badge:** 5 variantov, 2 veľkosti, semi-transparent backgrounds
- **Avatar:** uri image alebo initials fallback (prvé 2 písmená mena)
- **Skeleton:** Animated.loop opacity pulse pre placeholder loaders

---

## Verification

```
PASS __tests__/unit/theme.test.ts — 5/5 tests
PASS __tests__/unit/i18n.test.ts  — 4/4 tests
Total: 9/9 GREEN
```

---

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing handling] expo-localization try/catch v i18n.ts**
- **Found during:** Task 1 — implementácia i18n.ts
- **Issue:** expo-localization nie je dostupný v Jest `testEnvironment: 'node'`, spôsobil by runtime error pri testovaní
- **Fix:** `require('expo-localization')` obalený v try/catch, fallback na `'sk'` default
- **Files modified:** src/lib/i18n.ts
- **Commit:** baea484

**2. [Rule 1 - Bug] StyleSheet.create type constraints**
- **Found during:** Task 2 — Button, TextInput, Badge komponenty
- **Issue:** TypeScript strict `as const` inference na theme objekte zabraňuje priamemu spreadu `...theme.typography.body` v StyleSheet.create
- **Fix:** Cast na `(theme.typography.body as object)` pri spreade, eliminovalo typ chyby
- **Files modified:** Button.tsx, TextInput.tsx, Badge.tsx, Avatar.tsx
- **Commit:** 9880d87

**3. [Rule 1 - Bug] Card elevated styles**
- **Found during:** Task 2 — Card komponent
- **Issue:** `elevated: theme.shadow.md as any` v StyleSheet.create spôsobuje nesprávne spread chovanie
- **Fix:** Explicitné rozloženie shadow properties (shadowColor, shadowOffset, shadowOpacity, shadowRadius, elevation)
- **Files modified:** Card.tsx
- **Commit:** 9880d87

---

## Self-Check: PASSED

All 11 files created and verified. Both task commits (baea484, 9880d87) confirmed in git log.
