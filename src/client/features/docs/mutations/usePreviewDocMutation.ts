import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';

import { useSnackbar } from '../../snackbar/stores/snackbar';
import { useDocsStore } from '../stores/useDocsStore';

type PreviewDocInput = {
  scenarioId: string;
  formData: Record<string, unknown>;
};

type PreviewDocResponse = {
  success: boolean;
  content: string;
};

type UsePreviewDocMutationOptions = {
  formKey?: string;
};

const previewDoc = async (input: PreviewDocInput): Promise<string> => {
  const response = await fetch(
    `/api/scenarios/${input.scenarioId}/docs/preview`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input.formData),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to preview');
  }

  const data = (await response.json()) as PreviewDocResponse;
  return data.content;
};

export const usePreviewDocMutation = (
  options: UsePreviewDocMutationOptions = {},
) => {
  const { t } = useLingui();
  const showSnackbar = useSnackbar((state) => state.showSnackbar);
  const { setPreviewContent } = useDocsStore({ formKey: options.formKey });

  return useMutation({
    mutationFn: previewDoc,
    onSuccess: (content) => {
      setPreviewContent(content);
    },
    onError: () => {
      showSnackbar(t`Failed to generate preview`, 'error');
    },
  });
};
