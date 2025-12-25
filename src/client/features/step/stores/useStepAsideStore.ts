import { useCallback, useMemo } from 'react';

import { type NavItemStatus, useStepAsideStoreBase } from './step-aside';
import { getFormKey, useStepFormStoreBase } from './step-form';

type UseStepAsideStoreOptions = {
  formKey?: string;
};

const emptyNavStatuses: Record<string, NavItemStatus> = {};

export const useStepAsideStore = (options: UseStepAsideStoreOptions = {}) => {
  const key = useMemo(() => getFormKey(options.formKey), [options.formKey]);
  const navStatuses = useStepAsideStoreBase(
    (state) => state.navStatuses[key] ?? emptyNavStatuses,
  );
  const setNavStatus = useStepAsideStoreBase((state) => state.setNavStatus);

  const updateNavStatus = useCallback(
    (sectionName: string) => {
      // 最新のエラー状態を直接ストアから取得
      const currentErrors =
        useStepFormStoreBase.getState().forms[key]?.errors ?? {};
      const hasError = currentErrors[sectionName] === true;
      setNavStatus(key, sectionName, hasError ? 'error' : 'success');
    },
    [key, setNavStatus],
  );

  return {
    navStatuses,
    updateNavStatus,
  };
};
