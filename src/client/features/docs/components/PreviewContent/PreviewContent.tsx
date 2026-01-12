import { useLingui } from '@lingui/react/macro';
import { AnimatePresence, motion } from 'motion/react';
import { type FC, useCallback, useMemo, useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import type { Step } from '../../../../../definitions';
import { Button } from '../../../../components/Button';
import {
  CopyIcon,
  EyeIcon,
  PencilIcon,
  RefreshIcon,
  SaveIcon,
  ShareIcon,
} from '../../../../components/Icons';
import { buildAiContext } from '../../../form/services';
import { useSnackbar } from '../../../snackbar/stores/snackbar';
import { DataViewer } from '../DataViewer';
import { TabButton } from '../TabButton';

type PreviewContentProps = {
  previewContent: string | null;
  isGenerating: boolean;
  isSubmitting: boolean;
  allowSave: boolean;
  steps?: Step[];
  formData?: Record<string, unknown>;
  onPreview: () => void;
  onCreate: () => void;
  onContentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
};

type ContentTab = 'content' | 'data';

export const PreviewContent: FC<PreviewContentProps> = ({
  previewContent,
  isGenerating,
  isSubmitting,
  allowSave,
  steps,
  formData,
  onPreview,
  onCreate,
  onContentChange,
}) => {
  const { t } = useLingui();
  const { showSnackbar } = useSnackbar();
  const [activeTab, setActiveTab] = useState<ContentTab>('content');
  const [isEditMode, setIsEditMode] = useState(false);
  const hasContent = previewContent != null && previewContent.length > 0;
  const showOverlay = isSubmitting || (isGenerating && !hasContent);
  const hasDataView = steps != null && formData != null;

  const aiContext = useMemo(() => {
    if (steps == null) return {};
    return buildAiContext(steps);
  }, [steps]);

  const handleCopyContent = useCallback(async () => {
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

  const handleToggleEditMode = useCallback(() => {
    setIsEditMode((prev) => !prev);
  }, []);

  return (
    <div className="flex-1 flex flex-col overflow-hidden relative">
      <AnimatePresence>
        {showOverlay && (
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
            <p className="text-sm text-gray-500">
              {isSubmitting ? t`Saving...` : t`Generating...`}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {previewContent != null && (
        <>
          {/* Action buttons */}
          <div className="flex items-center justify-end gap-1 px-4 py-2">
            <button
              aria-label={t`Regenerate`}
              className="p-2.5 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed *:size-5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              disabled={isGenerating || isSubmitting}
              type="button"
              onClick={onPreview}
            >
              <RefreshIcon />
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
                disabled={isGenerating || isSubmitting}
                type="button"
                onClick={onCreate}
              >
                <SaveIcon />
              </button>
            )}
          </div>

          {/* Tabs (only show if data view is available) */}
          {hasDataView && (
            <div className="flex items-center gap-1 px-4 border-b border-gray-200">
              <TabButton
                label={t`Content`}
                isActive={activeTab === 'content'}
                onClick={() => setActiveTab('content')}
              />
              <TabButton
                label={t`Data`}
                isActive={activeTab === 'data'}
                onClick={() => setActiveTab('data')}
              />
            </div>
          )}

          {/* Tab content */}
          <div className="flex-1 overflow-y-auto">
            {activeTab === 'content' && (
              <div className="p-6">
                <div className="flex justify-end gap-1 mb-4">
                  <button
                    type="button"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
                    onClick={handleCopyContent}
                  >
                    <span className="*:size-4">
                      <CopyIcon />
                    </span>
                    {t`Copy`}
                  </button>
                  <button
                    type="button"
                    aria-label={
                      isEditMode
                        ? t`Switch to preview mode`
                        : t`Switch to edit mode`
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
                    onClick={handleToggleEditMode}
                  >
                    <span className="*:size-4">
                      {isEditMode ? <EyeIcon /> : <PencilIcon />}
                    </span>
                    {isEditMode ? t`Preview` : t`Edit`}
                  </button>
                </div>

                {isEditMode ? (
                  <textarea
                    className="w-full min-h-[calc(100vh-350px)] p-4 font-mono text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-transparent"
                    value={previewContent}
                    onChange={onContentChange}
                  />
                ) : (
                  <div className="prose prose-sm prose-gray max-w-none">
                    <Markdown remarkPlugins={[remarkGfm]}>
                      {previewContent}
                    </Markdown>
                    {isGenerating && (
                      <motion.span
                        className="inline-block w-2 h-4 bg-indigo-500 ml-1 align-middle"
                        animate={{ opacity: [1, 0] }}
                        transition={{
                          duration: 0.5,
                          repeat: Number.POSITIVE_INFINITY,
                          repeatType: 'reverse',
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'data' && formData != null && (
              <DataViewer formData={formData} aiContext={aiContext} />
            )}
          </div>
        </>
      )}

      {previewContent == null && !isGenerating && !isSubmitting && (
        <div className="flex-1 flex flex-col items-center justify-center text-center gap-4 p-6">
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
