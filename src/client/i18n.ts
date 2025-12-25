import { i18n } from '@lingui/core';

import { messages as enMessages } from './locales/en';
import { messages as jaMessages } from './locales/ja';

const LOCALE_STORAGE_KEY = 'design-docs-gen-locale';

export const locales = {
  ja: '日本語',
  en: 'English',
} as const;

export type LocaleKey = keyof typeof locales;

i18n.load({
  ja: jaMessages,
  en: enMessages,
});

const getStoredLocale = (): LocaleKey | null => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored === 'ja' || stored === 'en') {
      return stored;
    }
  }
  return null;
};

const getBrowserLocale = (): LocaleKey => {
  if (typeof navigator !== 'undefined') {
    const browserLang = navigator.language.split('-')[0];
    if (browserLang === 'en') {
      return 'en';
    }
  }
  return 'ja';
};

const getDefaultLocale = (): LocaleKey => {
  return getStoredLocale() ?? getBrowserLocale();
};

export const getCurrentLocale = (): LocaleKey => {
  return (i18n.locale as LocaleKey) ?? 'ja';
};

export const activateLocale = (locale: LocaleKey) => {
  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(LOCALE_STORAGE_KEY, locale);
  }
  if (typeof document !== 'undefined') {
    document.documentElement.lang = locale;
  }
  i18n.activate(locale);
};

// Initialize with default locale
activateLocale(getDefaultLocale());

export { i18n };
