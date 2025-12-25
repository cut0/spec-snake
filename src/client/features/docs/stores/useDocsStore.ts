import { useCallback, useMemo } from 'react';

import { getFormKey } from '../../step/stores/step-form';

import { usePreviewStoreBase } from './preview';

type UseDocsStoreOptions = {
  formKey?: string;
};

export const useDocsStore = (options: UseDocsStoreOptions = {}) => {
  const key = useMemo(() => getFormKey(options.formKey), [options.formKey]);
  const previewContent = usePreviewStoreBase(
    (state) => state.previews[key] ?? null,
  );
  const setPreviewContentBase = usePreviewStoreBase(
    (state) => state.setPreviewContent,
  );

  const setPreviewContent = useCallback(
    (content: string | null) => setPreviewContentBase(key, content),
    [key, setPreviewContentBase],
  );

  return {
    previewContent,
    setPreviewContent,
  };
};
