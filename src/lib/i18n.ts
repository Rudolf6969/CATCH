import { I18n } from 'i18n-js';
import sk from '@/locales/sk.json';
import cs from '@/locales/cs.json';

export const i18n = new I18n({ sk, cs });

// SK ako default, fallback na SK pre neznáme lokalizácie
let deviceLocale = 'sk';
try {
  // expo-localization nie je dostupný v test prostredí
  const Localization = require('expo-localization');
  deviceLocale = Localization.getLocales()[0]?.languageCode ?? 'sk';
} catch {
  // Test prostredie — použiť SK default
  deviceLocale = 'sk';
}

i18n.locale = ['sk', 'cs'].includes(deviceLocale) ? deviceLocale : 'sk';
i18n.enableFallback = true;
i18n.defaultLocale = 'sk';
