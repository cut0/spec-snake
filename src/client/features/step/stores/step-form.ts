import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

const NEW_FORM_KEY = '__new__';

export const getFormKey = (formKey?: string): string => formKey ?? NEW_FORM_KEY;

type FormState = {
  values: Record<string, unknown>;
  errors: Record<string, boolean>;
};

type StepFormStoreState = {
  forms: Record<string, FormState>;
  setSectionValue: (
    formKey: string,
    sectionName: string,
    value: unknown,
  ) => void;
  setError: (formKey: string, sectionName: string, hasError: boolean) => void;
  initializeForm: (
    formKey: string,
    initialValues: Record<string, unknown>,
  ) => void;
  resetForm: (formKey: string) => void;
};

const createEmptyFormState = (): FormState => ({
  values: {},
  errors: {},
});

const getFormState = (
  forms: Record<string, FormState>,
  formKey: string,
): FormState => {
  return forms[formKey] ?? createEmptyFormState();
};

export const useStepFormStoreBase = create<StepFormStoreState>()(
  persist(
    (set) => ({
      forms: {},

      setSectionValue: (formKey, sectionName, value) =>
        set((state) => {
          const form = getFormState(state.forms, formKey);
          return {
            forms: {
              ...state.forms,
              [formKey]: {
                ...form,
                values: { ...form.values, [sectionName]: value },
              },
            },
          };
        }),

      setError: (formKey, sectionName, hasError) =>
        set((state) => {
          const form = getFormState(state.forms, formKey);
          return {
            forms: {
              ...state.forms,
              [formKey]: {
                ...form,
                errors: { ...form.errors, [sectionName]: hasError },
              },
            },
          };
        }),

      initializeForm: (formKey, initialValues) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: {
              values: initialValues,
              errors: {},
            },
          },
        })),

      resetForm: (formKey) =>
        set((state) => ({
          forms: {
            ...state.forms,
            [formKey]: createEmptyFormState(),
          },
        })),
    }),
    {
      name: 'design-docs-step-form',
      storage: createJSONStorage(() => sessionStorage),
      partialize: (state) => ({ forms: state.forms }),
    },
  ),
);

const isFormEmpty = (key: string): boolean => {
  const form = useStepFormStoreBase.getState().forms[key];
  return form == null || Object.keys(form.values).length === 0;
};

type InitializeFormOptions = {
  initialValues: Record<string, unknown>;
  formKey?: string;
};

export const initializeFormIfNeeded = ({
  initialValues,
  formKey,
}: InitializeFormOptions): void => {
  const key = getFormKey(formKey);
  if (isFormEmpty(key)) {
    useStepFormStoreBase.getState().initializeForm(key, initialValues);
  }
};
