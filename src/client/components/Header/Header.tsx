import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import type { FC } from 'react';

import { getCurrentLocale } from '../../i18n';
import { CloseIcon, EyeIcon, MenuIcon } from '../Icons';
import { LanguageSwitcher } from '../LanguageSwitcher';

type HeaderProps = {
  isMenuOpen?: boolean;
  onToggleMenu?: () => void;
  onOpenPreview?: () => void;
};

export const Header: FC<HeaderProps> = ({
  isMenuOpen,
  onToggleMenu,
  onOpenPreview,
}) => {
  const { t } = useLingui();
  const currentLocale = getCurrentLocale();

  return (
    <header className="flex items-center justify-between h-14 px-4 xl:px-6 bg-white rounded-2xl border border-gray-100">
      <div className="flex items-center gap-2">
        {onToggleMenu != null && (
          <button
            aria-label={isMenuOpen ? t`Close menu` : t`Open menu`}
            className="xl:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            type="button"
            onClick={onToggleMenu}
          >
            {isMenuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        )}
        <Link
          to="/scenarios"
          className="text-lg font-bold text-gray-900 hover:text-indigo-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 rounded"
        >
          Spec Snake Beta
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <LanguageSwitcher currentLocale={currentLocale} />
        {onOpenPreview != null && (
          <button
            aria-label={t`Show preview`}
            className="lg:hidden p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            type="button"
            onClick={onOpenPreview}
          >
            <EyeIcon />
          </button>
        )}
      </div>
    </header>
  );
};
