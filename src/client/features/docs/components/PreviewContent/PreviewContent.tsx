import { useLingui } from '@lingui/react/macro';
import { AnimatePresence, motion } from 'motion/react';
import { type FC, useCallback } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { Button } from '../../../../components/Button';
import {
  CopyIcon,
  EyeIcon,
  PencilIcon,
  RefreshIcon,
  SaveIcon,
  ShareIcon,
} from '../../../../components/Icons';
import { useSnackbar } from '../../../snackbar/stores/snackbar';

type PreviewContentProps = {
  previewContent: string | null;
  previewMode: 'edit' | 'preview';
  isGenerating: boolean;
  isSubmitting: boolean;
  allowSave: boolean;
  onToggleMode: () => void;
  onPreview: () => void;
  onCreate: () => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

export const PreviewContent: FC<PreviewContentProps> = ({
  previewContent,
  previewMode,
  isGenerating,
  isSubmitting,
  allowSave,
  onToggleMode,
  onPreview,
  onCreate,
  onContentChange,
}) => {
  const { t } = useLingui();
  const { showSnackbar } = useSnackbar();
  const isLoading = isGenerating || isSubmitting;
  const loadingMessage = isGenerating ? t`Generating...` : t`Saving...`;

  const handleCopy = useCallback(async () => {
    if (previewContent == null) return;
    await navigator.clipboard.writeText(previewContent);
    showSnackbar(t`Copied to clipboard`, 'success');
  }, [previewContent, showSnackbar, t]);

  const handleShare = useCallback(async () => {
    if (previewContent == null) return;
    if (navigator.share == null) return;
    await navigator.share({
      text: previewContent,
    });
  }, [previewContent]);

  return (
    <div className="flex-1 overflow-y-auto p-6 relative">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center gap-4 z-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
          >
            <motion.div
              className="w-8 h-8 border-3 border-gray-200 border-t-indigo-500 rounded-full"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Number.POSITIVE_INFINITY,
                ease: 'linear',
              }}
            />
            <p className="text-sm text-gray-500">{loadingMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {previewContent != null && (
        <div className="sticky top-0 right-0 flex gap-1 bg-white rounded-lg shadow-sm border border-gray-200 p-1 mb-4 w-fit ml-auto z-10">
          <button
            aria-label={
              previewMode === 'edit'
                ? t`Switch to preview mode`
                : t`Switch to edit mode`
            }
            className="p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            type="button"
            onClick={onToggleMode}
          >
            {previewMode === 'edit' ? <EyeIcon /> : <PencilIcon />}
          </button>
          <button
            aria-label={t`Regenerate`}
            className="p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            disabled={isLoading}
            type="button"
            onClick={onPreview}
          >
            <RefreshIcon />
          </button>
          <button
            aria-label={t`Copy`}
            className="p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
            type="button"
            onClick={handleCopy}
          >
            <CopyIcon />
          </button>
          {navigator.share != null && (
            <button
              aria-label={t`Share`}
              className="p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              type="button"
              onClick={handleShare}
            >
              <ShareIcon />
            </button>
          )}
          {allowSave && (
            <button
              aria-label={t`Save`}
              className="p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              disabled={isLoading}
              type="button"
              onClick={onCreate}
            >
              <SaveIcon />
            </button>
          )}
        </div>
      )}

      {previewContent != null && previewMode === 'edit' && (
        <textarea
          className="w-full h-full min-h-screen p-4 font-mono text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
          value={previewContent}
          onChange={onContentChange}
        />
      )}

      {previewContent != null && previewMode === 'preview' && (
        <div className="prose prose-sm prose-gray max-w-none">
          <Markdown remarkPlugins={[remarkGfm]}>{previewContent}</Markdown>
        </div>
      )}

      {previewContent == null && !isLoading && (
        <div className="flex flex-col items-center justify-center h-full text-center gap-4">
          <p className="text-gray-400 text-sm whitespace-pre-line">
            {t`Press the button to generate a Design Doc preview`}
          </p>
          <Button variant="primary" onClick={onPreview}>
            {t`Generate preview`}
          </Button>
        </div>
      )}
    </div>
  );
};
