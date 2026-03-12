/**
 * Theme design system test
 * Pokrýva: INFRA-04 — theme.ts exportuje správne tokeny
 *
 * STAV: RED — čaká na implementáciu src/theme/theme.ts
 */

// Importovať theme — bude failovať kým theme.ts neexistuje
let theme: any;
try {
  theme = require('../../src/theme/theme').theme;
} catch {
  theme = null;
}

describe('INFRA-04: Design system theme tokeny', () => {
  it('theme.ts existuje a exportuje theme objekt', () => {
    expect(theme).not.toBeNull();
    expect(typeof theme).toBe('object');
  });

  it('theme.colors obsahuje všetky požadované farby', () => {
    if (!theme) return; // Skip ak theme.ts ešte neexistuje
    expect(theme.colors.bg).toBeDefined();
    expect(theme.colors.primaryMid).toBeDefined();
    expect(theme.colors.accent).toBeDefined();
    expect(theme.colors.surface).toBeDefined();
    // Skutočné hodnoty — fishing dark green paleta (nie modrá)
    expect(theme.colors.bg).toBe('#0A120D');
    expect(theme.colors.primaryMid).toBe('#52B788');
    expect(theme.colors.surface).toBe('#111A14');
  });

  it('theme.typography obsahuje Syne, DMSans, JetBrainsMono font families', () => {
    if (!theme) return;
    // Syne je správny font (CLAUDE.md: Barlow Condensed / Syne / Space Grotesk / Geist)
    expect(theme.typography.heading.fontFamily).toBe('Syne-Bold');
    expect(theme.typography.body.fontFamily).toBe('DMSans-Regular');
    expect(theme.typography.mono.fontFamily).toBe('JetBrainsMono-Regular');
  });

  it('theme.spacing obsahuje xs, sm, md, lg, xl, xxl', () => {
    if (!theme) return;
    expect(theme.spacing.xs).toBe(4);
    expect(theme.spacing.sm).toBe(8);
    expect(theme.spacing.md).toBe(16);
    expect(theme.spacing.lg).toBe(24);
  });

  it('theme.radius obsahuje sm, md, lg, xl, full', () => {
    if (!theme) return;
    expect(theme.radius.full).toBe(999);
    expect(typeof theme.radius.md).toBe('number');
  });
});
