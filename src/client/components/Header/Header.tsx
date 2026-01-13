import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import { type FC, useState } from 'react';

import { getCurrentLocale } from '../../i18n';
import { CloseIcon, EyeIcon, GitHubIcon, MenuIcon } from '../Icons';
import { LanguageSwitcher } from '../LanguageSwitcher';

const TOOLTIP_DISMISSED_KEY = 'spec-snake-github-tooltip-dismissed';

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
  const [isTooltipVisible, setIsTooltipVisible] = useState(
    () => sessionStorage.getItem(TOOLTIP_DISMISSED_KEY) !== 'true',
  );

  const handleDismissTooltip = () => {
    setIsTooltipVisible(false);
    sessionStorage.setItem(TOOLTIP_DISMISSED_KEY, 'true');
  };

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
        <div className="relative">
          <a
            href="https://github.com/cut0/spec-snake"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 block"
          >
            <GitHubIcon />
          </a>
          <AnimatePresence>
            {isTooltipVisible && (
              <motion.div
                className="absolute top-full right-1/2 translate-x-1/2 mt-1 whitespace-nowrap"
                initial={{ opacity: 0, scale: 0.8, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -4 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
              >
                <div className="relative bg-gray-800 text-white text-xs pl-2 pr-1 py-1 rounded-md flex items-center gap-1">
                  <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-gray-800 rotate-45" />
                  {t`Send feedback!`}
                  <button
                    type="button"
                    onClick={handleDismissTooltip}
                    className="p-0.5 hover:bg-gray-700 rounded transition-colors cursor-pointer *:size-3"
                    aria-label={t`Close`}
                  >
                    <CloseIcon />
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
};
