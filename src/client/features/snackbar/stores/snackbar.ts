import { create } from 'zustand';

type SnackbarVariant = 'error' | 'success' | 'info';

type SnackbarStore = {
  open: boolean;
  message: string;
  variant: SnackbarVariant;
  showSnackbar: (message: string, variant?: SnackbarVariant) => void;
  hideSnackbar: () => void;
};

export const useSnackbar = create<SnackbarStore>()((set) => ({
  open: false,
  message: '',
  variant: 'info',
  showSnackbar: (message: string, variant: SnackbarVariant = 'info') =>
    set({ open: true, message, variant }),
  hideSnackbar: () => set({ open: false }),
}));
