import { useLingui } from '@lingui/react/macro';
import { AnimatePresence, motion } from 'motion/react';
import { type FC, useEffect } from 'react';

import { CheckIcon, ExclamationIcon, InfoIcon } from '../Icons';

type SnackbarVariant = 'error' | 'success' | 'info';

type SnackbarProps = {
  message: string;
  variant?: SnackbarVariant;
  open: boolean;
  onClose: () => void;
  duration?: number;
};

const iconStyles: Record<SnackbarVariant, string> = {
  error: 'text-red-500',
  success: 'text-green-500',
  info: 'text-gray-500',
};

const SnackbarIcon: FC<{ variant: SnackbarVariant }> = ({ variant }) => {
  switch (variant) {
    case 'success':
      return <CheckIcon />;
    case 'error':
      return <ExclamationIcon />;
    case 'info':
      return <InfoIcon />;
  }
};

export const Snackbar: FC<SnackbarProps> = ({
  message,
  variant = 'info',
  open,
  onClose,
  duration = 4000,
}) => {
  const { t } = useLingui();

  useEffect(() => {
    if (open && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [open, duration, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed top-6 left-1/2 z-50"
          initial={{ y: -100, x: '-50%', opacity: 0 }}
          animate={{ y: 0, x: '-50%', opacity: 1 }}
          exit={{ y: -100, x: '-50%', opacity: 0 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <div
            className="flex items-center gap-3 px-5 py-4 rounded-2xl bg-white border border-gray-100"
            role="alert"
          >
            <span className={`*:size-6 ${iconStyles[variant]}`}>
              <SnackbarIcon variant={variant} />
            </span>
            <span className="text-sm font-bold text-gray-700">{message}</span>
            <button
              type="button"
              className="ml-2 p-1 rounded text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              aria-label={t`Close`}
              onClick={onClose}
            >
              <svg
                aria-hidden="true"
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
              >
                <path
                  d="M12 4L4 12M4 4L12 12"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
