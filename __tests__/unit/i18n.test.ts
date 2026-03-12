/**
 * i18n test
 * Pokrýva: INFRA-03 — SK je default jazyk, fallback na SK
 *
 * STAV: RED — čaká na implementáciu src/lib/i18n.ts a src/locales/sk.json
 */

let i18n: any;
try {
  i18n = require('../../src/lib/i18n').i18n;
} catch {
  i18n = null;
}

describe('INFRA-03: i18n konfigurácia', () => {
  it('i18n modul existuje a je exportovaný', () => {
    expect(i18n).not.toBeNull();
  });

  it('default locale je sk', () => {
    if (!i18n) return;
    expect(i18n.defaultLocale).toBe('sk');
  });

  it('fallback je povolený', () => {
    if (!i18n) return;
    expect(i18n.enableFallback).toBe(true);
  });

  it('SK locale obsahuje základné kľúče', () => {
    if (!i18n) return;
    // Overiť že SK translations sú načítané
    const translations = i18n.translations;
    expect(translations).toBeDefined();
    expect(translations.sk).toBeDefined();
  });
});
