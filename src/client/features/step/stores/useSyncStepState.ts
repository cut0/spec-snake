import { useCallback, useMemo } from 'react';

import type { Step } from '../../../../definitions';
import { getStepStatus } from '../services';

import { getFormKey, useStepFormStoreBase } from './step-form';

type UseSyncStepStateOptions = {
  formKey?: string;
  step: Step;
};

export const useSyncStepState = ({
  formKey,
  step,
}: UseSyncStepStateOptions) => {
  const key = useMemo(() => getFormKey(formKey), [formKey]);
  const stepValue = useStepFormStoreBase(
    (state) => state.forms[key]?.values[step.name],
  );
  const setSectionValue = useStepFormStoreBase(
    (state) => state.setSectionValue,
  );
  const setError = useStepFormStoreBase((state) => state.setError);

  const updateStepValue = useCallback(
    (value: unknown) => {
      setSectionValue(key, step.name, value);
      const hasError = getStepStatus(step, value) === 'error';
      setError(key, step.name, hasError);
    },
    [key, step, setSectionValue, setError],
  );

  return {
    stepValue,
    updateStepValue,
  };
};
