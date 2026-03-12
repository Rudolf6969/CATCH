---
phase: 1
slug: foundation-auth
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-12
---

# Phase 1 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Jest 29 + React Native Testing Library + Detox (E2E) |
| **Config file** | `jest.config.js` — Wave 0 inštaluje |
| **Quick run command** | `npx jest --testPathPattern="__tests__/unit"` |
| **Full suite command** | `npx jest` |
| **Estimated runtime** | ~15 seconds (unit only), ~2 min (+ E2E) |

---

## Sampling Rate

- **After every task commit:** Run `npx jest --testPathPattern="__tests__/unit"`
- **After every plan wave:** Run `npx jest`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** 20 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | Status |
|---------|------|------|-------------|-----------|-------------------|--------|
| 1-01-01 | 01 | 1 | INFRA-01 | manual | EAS build + install on device | ⬜ pending |
| 1-01-02 | 01 | 1 | INFRA-02 | manual | Firebase console: app connected | ⬜ pending |
| 1-01-03 | 01 | 1 | INFRA-03 | unit | `npx jest i18n` | ⬜ pending |
| 1-01-04 | 01 | 1 | INFRA-04 | unit | `npx jest theme` | ⬜ pending |
| 1-01-05 | 01 | 1 | INFRA-05 | unit | `npx jest components` | ⬜ pending |
| 1-02-01 | 02 | 2 | AUTH-01 | unit | `npx jest auth/register` | ⬜ pending |
| 1-02-02 | 02 | 2 | AUTH-02 | manual | Verifikačný email dorazí na inbox | ⬜ pending |
| 1-02-03 | 02 | 2 | AUTH-03 | manual | Reset email dorazí, link funguje | ⬜ pending |
| 1-02-04 | 02 | 2 | AUTH-04 | unit | `npx jest auth/session` | ⬜ pending |
| 1-02-05 | 02 | 2 | AUTH-05 | unit | `npx jest auth/guard` | ⬜ pending |
| 1-02-06 | 02 | 2 | AUTH-06 | unit | `npx jest auth/logout` | ⬜ pending |
| 1-03-01 | 03 | 3 | INFRA-06 | manual | EAS profiles build bez chýb | ⬜ pending |
| 1-03-02 | 03 | 3 | INFRA-07 | manual | PostHog dashboard: eventy viditeľné | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `jest.config.js` — Jest + RNTL konfigurácia
- [ ] `__tests__/unit/theme.test.ts` — stub pre INFRA-04 (theme tokeny exported)
- [ ] `__tests__/unit/i18n.test.ts` — stub pre INFRA-03 (SK locale default)
- [ ] `__tests__/unit/auth/guard.test.ts` — stub pre AUTH-05 (unauthenticated redirect)
- [ ] `__tests__/unit/auth/session.test.ts` — stub pre AUTH-04 (session persistence)

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| EAS dev build inštaluje na zariadenie | INFRA-01 | Vyžaduje fyzické zariadenie + EAS cloud | `eas build --profile development --platform android`, stiahnuť APK, nainštalovať |
| Firebase projekt pripojený | INFRA-02 | Vyžaduje Firebase console + google-services.json | Overiť v Firebase Console → Project Settings → Apps |
| Verifikačný email dorazí | AUTH-02 | Externá email služba | Registrovať nový účet, skontrolovať inbox |
| Reset hesla email funguje | AUTH-03 | Externá email služba + deep link | Tap "Zabudol si heslo?", zadať email, skontrolovať link |
| PostHog eventy viditeľné | INFRA-07 | Vyžaduje PostHog dashboard | Spustiť appku → PostHog Live Events → overiť `app_opened` event |
| Animated splash → login flow | INFRA-01 | Vizuálna verifikácia | Prvé spustenie: splash animácia, potom login screen |
| Return user → Podmienky tab | AUTH-04 | Device restart required | Prihlásiť sa, reštartovať appku, overiť že ide priamo na Podmienky |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 20s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending
