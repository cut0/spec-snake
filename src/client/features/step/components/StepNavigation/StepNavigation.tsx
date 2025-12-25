import { useLingui } from '@lingui/react/macro';
import { Link } from '@tanstack/react-router';
import { type FC, useCallback } from 'react';

import { Button } from '../../../../components/Button';
import { ArrowLeftIcon, ArrowRightIcon } from '../../../../components/Icons';

type NavigationItem = {
  label: string;
  to: string;
  onClick?: () => void;
};

type StepNavigationProps = {
  prev?: NavigationItem;
  next?: NavigationItem;
  onSubmit?: () => void;
};

const linkBase =
  'inline-flex items-center justify-center rounded-full font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2 cursor-pointer px-4 py-2 text-sm gap-2';

const linkPrimary = `${linkBase} bg-indigo-500 text-white hover:bg-indigo-600 active:bg-indigo-700`;
const linkOutline = `${linkBase} border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 active:bg-gray-200`;

export const StepNavigation: FC<StepNavigationProps> = ({
  prev,
  next,
  onSubmit,
}) => {
  const { t } = useLingui();

  const handlePrevClick = useCallback(() => {
    prev?.onClick?.();
  }, [prev]);

  const handleNextClick = useCallback(() => {
    next?.onClick?.();
  }, [next]);

  const handleSubmit = useCallback(() => {
    onSubmit?.();
  }, [onSubmit]);

  return (
    <div className="flex items-center justify-between">
      <div>
        {prev != null && (
          <Link to={prev.to} className={linkOutline} onClick={handlePrevClick}>
            <ArrowLeftIcon />
            {prev.label}
          </Link>
        )}
      </div>
      <div>
        {next != null && (
          <Link to={next.to} className={linkPrimary} onClick={handleNextClick}>
            {next.label}
            <ArrowRightIcon />
          </Link>
        )}
        {onSubmit != null && (
          <Button variant="primary" onClick={handleSubmit}>
            {t`Create`}
          </Button>
        )}
      </div>
    </div>
  );
};
