import { useCallback, useMemo } from 'react';

import { getFormKey, useStepFormStoreBase } from './step-form';

type UseStepFormStoreOptions = {
  formKey?: string;
};

const emptyValues: Record<string, unknown> = {};

export const useStepFormStore = (options: UseStepFormStoreOptions = {}) => {
  const key = useMemo(() => getFormKey(options.formKey), [options.formKey]);
  const formValues = useStepFormStoreBase(
    (state) => state.forms[key]?.values ?? emptyValues,
  );
  const setError = useStepFormStoreBase((state) => state.setError);

  const setFormError = useCallback(
    (sectionName: string, hasError: boolean) =>
      setError(key, sectionName, hasError),
    [key, setError],
  );

  return {
    formValues,
    setFormError,
  };
};
