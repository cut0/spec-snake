import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { getFormKey } from '../../step/stores/step-form';

type DocsStoreState = {
  previews: Record<string, string | null>;
  setPreviewContent: (formKey: string, content: string | null) => void;
  initializePreview: (formKey: string, content: string | null) => void;
  resetPreview: (formKey: string) => void;
};

export const usePreviewStoreBase = create<DocsStoreState>()(
  persist(
    (set) => ({
      previews: {},

      setPreviewContent: (formKey, content) =>
        set((state) => ({
          previews: {
            ...state.previews,
            [formKey]: content,
          },
        })),

      initializePreview: (formKey, content) =>
        set((state) => ({
          previews: {
            ...state.previews,
            [formKey]: content,
          },
        })),

      resetPreview: (formKey) =>
        set((state) => ({
          previews: {
            ...state.previews,
            [formKey]: null,
          },
        })),
    }),
    {
      name: 'design-docs-preview',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ previews: state.previews }),
    },
  ),
);

const isPreviewEmpty = (key: string): boolean => {
  const previews = usePreviewStoreBase.getState().previews;
  return !(key in previews);
};

type InitializePreviewOptions = {
  content: string | null;
  formKey?: string;
};

export const initializePreviewIfNeeded = ({
  content,
  formKey,
}: InitializePreviewOptions): void => {
  const key = getFormKey(formKey);
  if (isPreviewEmpty(key)) {
    usePreviewStoreBase.getState().initializePreview(key, content);
  }
};
