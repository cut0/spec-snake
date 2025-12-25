import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

export type NavItemStatus = 'default' | 'success' | 'error';

type StepAsideStoreState = {
  navStatuses: Record<string, Record<string, NavItemStatus>>;
  setNavStatus: (
    formKey: string,
    sectionName: string,
    status: NavItemStatus,
  ) => void;
  resetNavStatuses: (formKey: string) => void;
};

export const useStepAsideStoreBase = create<StepAsideStoreState>()(
  persist(
    (set) => ({
      navStatuses: {},

      setNavStatus: (formKey, sectionName, status) =>
        set((state) => ({
          navStatuses: {
            ...state.navStatuses,
            [formKey]: {
              ...(state.navStatuses[formKey] ?? {}),
              [sectionName]: status,
            },
          },
        })),

      resetNavStatuses: (formKey) =>
        set((state) => ({
          navStatuses: {
            ...state.navStatuses,
            [formKey]: {},
          },
        })),
    }),
    {
      name: 'design-docs-step-aside',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ navStatuses: state.navStatuses }),
    },
  ),
);
