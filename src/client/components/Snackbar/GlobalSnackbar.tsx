import type { FC } from 'react';

import { useSnackbar } from '../../features/snackbar/stores/snackbar';

import { Snackbar } from './Snackbar';

export const GlobalSnackbar: FC = () => {
  const { open, message, variant, hideSnackbar } = useSnackbar();

  return (
    <Snackbar
      open={open}
      message={message}
      variant={variant}
      onClose={hideSnackbar}
    />
  );
};
