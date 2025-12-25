import { type FC, useCallback } from 'react';

import { type LocaleKey, activateLocale, locales } from '../../i18n';

type LanguageSwitcherProps = {
  currentLocale: LocaleKey;
};

type LanguageButtonProps = {
  locale: LocaleKey;
  isActive: boolean;
  onClick: (locale: LocaleKey) => void;
};

const LanguageButton: FC<LanguageButtonProps> = ({
  locale,
  isActive,
  onClick,
}) => {
  const handleClick = useCallback(() => {
    onClick(locale);
  }, [locale, onClick]);

  return (
    <button
      className={`px-2 py-1 text-xs rounded transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 ${
        isActive
          ? 'bg-indigo-500 text-white'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
      }`}
      type="button"
      onClick={handleClick}
    >
      {locale.toUpperCase()}
    </button>
  );
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  currentLocale,
}) => {
  const handleChange = useCallback((locale: LocaleKey) => {
    activateLocale(locale);
    window.location.reload();
  }, []);

  return (
    <div className="flex gap-1">
      {(Object.keys(locales) as LocaleKey[]).map((locale) => (
        <LanguageButton
          key={locale}
          locale={locale}
          isActive={currentLocale === locale}
          onClick={handleChange}
        />
      ))}
    </div>
  );
};
