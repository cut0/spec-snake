import { useCallback, useMemo } from 'react';

import type { Section } from '../../../../definitions';
import { getSectionStatus } from '../services';

import { getFormKey, useStepFormStoreBase } from './step-form';

type UseSyncStepStateOptions = {
  formKey?: string;
  section: Section;
};

export const useSyncStepState = ({
  formKey,
  section,
}: UseSyncStepStateOptions) => {
  const key = useMemo(() => getFormKey(formKey), [formKey]);
  const sectionValue = useStepFormStoreBase(
    (state) => state.forms[key]?.values[section.name],
  );
  const setSectionValue = useStepFormStoreBase(
    (state) => state.setSectionValue,
  );
  const setError = useStepFormStoreBase((state) => state.setError);

  const updateSectionValue = useCallback(
    (value: unknown) => {
      setSectionValue(key, section.name, value);
      const hasError = getSectionStatus(section, value) === 'error';
      setError(key, section.name, hasError);
    },
    [key, section, setSectionValue, setError],
  );

  return {
    sectionValue,
    updateSectionValue,
  };
};
