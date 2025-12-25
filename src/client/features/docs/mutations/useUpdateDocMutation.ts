import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '../../../query';
import { useSnackbar } from '../../snackbar/stores/snackbar';
import { docsQueryOptions } from '../queries/fetchDocsQueryOption';

type UpdateDocInput = {
  scenarioId: string;
  filename: string;
  content: string;
  formData: Record<string, unknown>;
};

const updateDoc = async (input: UpdateDocInput): Promise<void> => {
  const response = await fetch(
    `/api/scenarios/${input.scenarioId}/docs/${encodeURIComponent(input.filename)}`,
    {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        content: input.content,
        formData: input.formData,
      }),
    },
  );

  if (!response.ok) {
    throw new Error('Failed to update');
  }

  await queryClient.invalidateQueries({
    queryKey: docsQueryOptions(input.scenarioId).queryKey,
  });
};

export const useUpdateDocMutation = () => {
  const { t } = useLingui();
  const showSnackbar = useSnackbar((state) => state.showSnackbar);

  return useMutation({
    mutationFn: updateDoc,
    onSuccess: () => {
      showSnackbar(t`Document has been updated`, 'success');
    },
    onError: () => {
      showSnackbar(t`An error occurred`, 'error');
    },
  });
};
