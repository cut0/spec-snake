import { useLingui } from '@lingui/react/macro';
import { type FC, useCallback } from 'react';

import type { AiContext } from '../../../../../definitions';
import { CopyIcon } from '../../../../components/Icons';
import { useSnackbar } from '../../../snackbar/stores/snackbar';

type DataViewerProps = {
  formData: Record<string, unknown>;
  aiContext: AiContext;
};

export const DataViewer: FC<DataViewerProps> = ({ formData, aiContext }) => {
  const { t } = useLingui();
  const { showSnackbar } = useSnackbar();

  const handleCopyFormData = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(formData, null, 2));
    showSnackbar(t`Copied to clipboard`, 'success');
  }, [formData, showSnackbar, t]);

  const handleCopyAiContext = useCallback(async () => {
    await navigator.clipboard.writeText(JSON.stringify(aiContext, null, 2));
    showSnackbar(t`Copied to clipboard`, 'success');
  }, [aiContext, showSnackbar, t]);

  return (
    <div className="flex flex-col gap-4 p-6 h-full">
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">formData</h3>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            onClick={handleCopyFormData}
          >
            <span className="*:size-4">
              <CopyIcon />
            </span>
            {t`Copy`}
          </button>
        </div>
        <pre className="flex-1 text-sm font-mono text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-auto">
          {JSON.stringify(formData, null, 2)}
        </pre>
      </div>
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-gray-700">aiContext</h3>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            onClick={handleCopyAiContext}
          >
            <span className="*:size-4">
              <CopyIcon />
            </span>
            {t`Copy`}
          </button>
        </div>
        <pre className="flex-1 text-sm font-mono text-gray-800 whitespace-pre-wrap bg-gray-50 rounded-lg p-4 border border-gray-200 overflow-auto">
          {JSON.stringify(aiContext, null, 2)}
        </pre>
      </div>
    </div>
  );
};
