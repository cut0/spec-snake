import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'motion/react';
import { type FC, type ReactNode, useMemo } from 'react';

import {
  CheckIcon,
  ChevronLeftIcon,
  ExclamationIcon,
} from '../../../../components/Icons';

type NavItemStatus = 'default' | 'success' | 'error';

type StepIconStyle = {
  bgClassName: string;
  textClassName: string;
  content: ReactNode;
  shouldAnimate: boolean;
};

const getStepIconStyle = (
  status: NavItemStatus,
  isActive: boolean,
  step: number,
): StepIconStyle => {
  if (status === 'error') {
    return {
      bgClassName: 'bg-amber-500',
      textClassName: 'text-white',
      content: <ExclamationIcon />,
      shouldAnimate: true,
    };
  }
  if (status === 'success') {
    return {
      bgClassName: 'bg-green-500',
      textClassName: 'text-white',
      content: <CheckIcon />,
      shouldAnimate: true,
    };
  }
  if (isActive) {
    return {
      bgClassName: 'bg-indigo-500',
      textClassName: 'text-white',
      content: <span className="text-sm font-medium">{step}</span>,
      shouldAnimate: false,
    };
  }
  return {
    bgClassName: 'bg-gray-100',
    textClassName: 'text-gray-600',
    content: <span className="text-sm font-medium">{step}</span>,
    shouldAnimate: false,
  };
};

type StepIconProps = {
  iconStyle: StepIconStyle;
  status: NavItemStatus;
  shrink?: boolean;
};

const StepIcon: FC<StepIconProps> = ({ iconStyle, status, shrink }) => {
  return (
    <div
      className={`relative flex items-center justify-center w-8 h-8 rounded-full ${shrink ? 'shrink-0' : ''} ${iconStyle.textClassName}`}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={status}
          className={`absolute inset-0 rounded-full ${iconStyle.bgClassName}`}
          initial={iconStyle.shouldAnimate ? { scale: 0 } : false}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
        />
      </AnimatePresence>
      <motion.div
        key={`content-${status}`}
        className="relative z-10"
        initial={iconStyle.shouldAnimate ? { scale: 0, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.2,
          delay: iconStyle.shouldAnimate ? 0.15 : 0,
        }}
      >
        {iconStyle.content}
      </motion.div>
    </div>
  );
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

type StepAsideProps = {
  scenarioName: string;
  items: NavItem[];
  isCollapsed: boolean;
  onItemClick: () => void;
  onToggleCollapse: () => void;
};

export const StepAside: FC<StepAsideProps> = ({
  scenarioName,
  items,
  isCollapsed,
  onItemClick,
  onToggleCollapse,
}) => {
  const { t } = useLingui();

  const stepIconStyles = useMemo(
    () =>
      items.map((item) =>
        getStepIconStyle(item.status, item.selected, item.step),
      ),
    [items],
  );

  return (
    <motion.aside
      className="hidden xl:flex shrink-0 bg-white rounded-2xl border border-gray-100 flex-col overflow-hidden sticky top-8 h-[calc(100vh-64px-56px-24px)] self-start"
      initial={false}
      animate={{ width: isCollapsed ? 64 : 320 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <div className={`flex-1 overflow-y-auto ${isCollapsed ? 'p-2' : 'p-6'}`}>
        <AnimatePresence mode="popLayout">
          {!isCollapsed && (
            <motion.div
              className="mb-4 pb-4 border-b border-gray-200"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <h2 className="text-base font-semibold text-gray-900 truncate">
                {scenarioName}
              </h2>
            </motion.div>
          )}
        </AnimatePresence>
        <nav
          aria-label={t`Step navigation`}
          className={`space-y-2 ${isCollapsed ? 'flex flex-col items-center' : ''}`}
        >
          {items.map((item, index) => {
            const iconStyle = stepIconStyles[index];
            if (iconStyle == null) return null;

            return (
              <Link
                key={item.to}
                aria-current={item.selected ? 'step' : undefined}
                aria-label={isCollapsed ? item.title : undefined}
                className={`flex items-center rounded-lg transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 ${
                  isCollapsed
                    ? `justify-center w-10 h-10 ${item.selected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`
                    : `items-start gap-3 p-4 ${item.selected ? 'bg-indigo-50 border border-indigo-200' : 'hover:bg-gray-50 border border-transparent'}`
                }`}
                to={item.to}
                onClick={onItemClick}
              >
                <StepIcon
                  shrink={!isCollapsed}
                  iconStyle={iconStyle}
                  status={item.status}
                />
                <AnimatePresence mode="popLayout">
                  {!isCollapsed && (
                    <motion.div
                      className="flex-1 min-w-0 overflow-hidden"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      transition={{ duration: 0.2, delay: 0.2 }}
                    >
                      <div
                        className={`font-medium whitespace-nowrap ${item.selected ? 'text-indigo-900' : 'text-gray-900'}`}
                      >
                        {item.title}
                      </div>
                      <div className="text-sm text-gray-500 whitespace-nowrap">
                        {item.description}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className={isCollapsed ? 'p-2' : 'p-4'}>
        <div
          className={isCollapsed ? 'flex justify-center' : 'flex justify-end'}
        >
          <button
            aria-label={isCollapsed ? t`Expand sidebar` : t`Collapse sidebar`}
            className={`rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer *:size-5 ${
              isCollapsed ? 'flex items-center justify-center w-10 h-10' : 'p-2'
            }`}
            type="button"
            onClick={onToggleCollapse}
          >
            <motion.div
              initial={false}
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="flex items-center justify-center"
            >
              <ChevronLeftIcon />
            </motion.div>
          </button>
        </div>
      </div>
    </motion.aside>
  );
};
