import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';

import { queryClient } from '../../../query';
import { useSnackbar } from '../../snackbar/stores/snackbar';
import { docsQueryOptions } from '../queries/fetchDocsQueryOption';

type SubmitDocInput = {
  scenarioId: string;
  content: string;
  formData: Record<string, unknown>;
};

const submitDoc = async (input: SubmitDocInput): Promise<void> => {
  const response = await fetch(`/api/scenarios/${input.scenarioId}/docs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content: input.content, formData: input.formData }),
  });

  if (!response.ok) {
    throw new Error('Failed to submit');
  }

  await queryClient.invalidateQueries({
    queryKey: docsQueryOptions(input.scenarioId).queryKey,
  });
};

export const useSubmitDocMutation = () => {
  const { t } = useLingui();
  const showSnackbar = useSnackbar((state) => state.showSnackbar);

  return useMutation({
    mutationFn: submitDoc,
    onSuccess: () => {
      showSnackbar(t`Design Doc has been created`, 'success');
    },
    onError: () => {
      showSnackbar(t`An error occurred`, 'error');
    },
  });
};
