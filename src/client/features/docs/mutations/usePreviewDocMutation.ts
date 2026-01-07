import { useLingui } from '@lingui/react/macro';
import { useMutation } from '@tanstack/react-query';
import { useCallback, useRef } from 'react';

import { useSnackbar } from '../../snackbar/stores/snackbar';
import { useDocsStore } from '../stores/useDocsStore';

type PreviewDocInput = {
  scenarioId: string;
  formData: Record<string, unknown>;
};

type SSEMessage =
  | { type: 'text_delta'; text: string }
  | { type: 'done'; content: string };

type UsePreviewDocMutationOptions = {
  formKey?: string;
};

const previewDocStream = async (
  input: PreviewDocInput,
  onChunk: (text: string) => void,
): Promise<string> => {
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

  const reader = response.body?.getReader();
  if (reader == null) {
    throw new Error('No response body');
  }

  const decoder = new TextDecoder();
  let buffer = '';
  let fullContent = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    const lines = buffer.split('\n');
    buffer = lines.pop() ?? '';

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = line.slice(6);
        try {
          const message = JSON.parse(data) as SSEMessage;
          if (message.type === 'text_delta') {
            fullContent += message.text;
            onChunk(fullContent);
          } else if (message.type === 'done') {
            fullContent = message.content;
          }
        } catch {
          // Ignore parse errors
        }
      }
    }
  }

  return fullContent;
};

export const usePreviewDocMutation = (
  options: UsePreviewDocMutationOptions = {},
) => {
  const { t } = useLingui();
  const showSnackbar = useSnackbar((state) => state.showSnackbar);
  const { setPreviewContent } = useDocsStore({ formKey: options.formKey });
  const contentRef = useRef('');

  const handleChunk = useCallback(
    (content: string) => {
      contentRef.current = content;
      setPreviewContent(content);
    },
    [setPreviewContent],
  );

  return useMutation({
    mutationFn: (input: PreviewDocInput) =>
      previewDocStream(input, handleChunk),
    onMutate: () => {
      contentRef.current = '';
      setPreviewContent('');
    },
    onSuccess: (content) => {
      setPreviewContent(content);
    },
    onError: () => {
      showSnackbar(t`Failed to generate preview`, 'error');
    },
  });
};
