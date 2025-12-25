import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import { type FC, type ReactNode, useCallback, useMemo } from 'react';

import {
  CheckIcon,
  CloseIcon,
  ExclamationIcon,
} from '../../../../components/Icons';

type NavItemStatus = 'default' | 'success' | 'error';

type StepIconStyle = {
  className: string;
  content: ReactNode;
};

const getStepIconStyle = (
  status: NavItemStatus,
  isActive: boolean,
  step: number,
): StepIconStyle => {
  if (status === 'error') {
    return {
      className: 'bg-amber-500 text-white',
      content: <ExclamationIcon />,
    };
  }
  if (status === 'success') {
    return {
      className: 'bg-green-500 text-white',
      content: <CheckIcon />,
    };
  }
  if (isActive) {
    return {
      className: 'bg-indigo-500 text-white',
      content: <span className="text-sm font-medium">{step}</span>,
    };
  }
  return {
    className: 'bg-gray-100 text-gray-600',
    content: <span className="text-sm font-medium">{step}</span>,
  };
};

type NavItem = {
  to: string;
  title: string;
  description: string;
  step: number;
  sectionName: string;
  status: NavItemStatus;
  selected: boolean;
};

type MobileDrawerProps = {
  scenarioName: string;
  isOpen: boolean;
  onClose: () => void;
  items: NavItem[];
  onItemClick: () => void;
};

export const MobileDrawer: FC<MobileDrawerProps> = ({
  scenarioName,
  isOpen,
  onClose,
  items,
  onItemClick,
}) => {
  const { t } = useLingui();

  const stepIconStyles = useMemo(
    () =>
      items.map((item) =>
        getStepIconStyle(item.status, item.selected, item.step),
      ),
    [items],
  );

  const handleItemClick = useCallback(() => {
    onItemClick();
    onClose();
  }, [onItemClick, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-40 xl:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed top-0 left-0 bottom-0 w-80 max-w-full bg-white z-50 flex flex-col overflow-y-auto xl:hidden"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h1 className="text-xl font-bold text-gray-900">
                Spec Snake Beta
              </h1>
              <button
                aria-label={t`Close menu`}
                className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer *:size-5"
                type="button"
                onClick={onClose}
              >
                <CloseIcon />
              </button>
            </div>
            <div className="p-4 flex-1">
              <div className="mb-4">
                <h2 className="text-base font-semibold text-gray-900">
                  {scenarioName}
                </h2>
              </div>
              <nav aria-label={t`Step navigation`} className="space-y-2">
                {items.map((item, index) => {
                  const iconStyle = stepIconStyles[index];
                  if (iconStyle == null) return null;
                  return (
                    <Link
                      key={item.to}
                      aria-current={item.selected ? 'step' : undefined}
                      className={`flex items-start gap-3 p-4 rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 ${
                        item.selected
                          ? 'bg-indigo-50 border border-indigo-200'
                          : 'hover:bg-gray-50 border border-transparent'
                      }`}
                      to={item.to}
                      onClick={handleItemClick}
                    >
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-full ${iconStyle.className}`}
                      >
                        {iconStyle.content}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div
                          className={`font-medium ${item.selected ? 'text-indigo-900' : 'text-gray-900'}`}
                        >
                          {item.title}
                        </div>
                        <div className="text-sm text-gray-500 truncate">
                          {item.description}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
