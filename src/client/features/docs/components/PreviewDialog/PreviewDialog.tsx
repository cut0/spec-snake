import { useLingui } from '@lingui/react/macro';
import { AnimatePresence, motion } from 'motion/react';
import type { FC } from 'react';

import { CloseIcon } from '../../../../components/Icons';
import { PreviewContent } from '../PreviewContent';

type PreviewDialogProps = {
  isOpen: boolean;
  onClose: () => void;
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

export const PreviewDialog: FC<PreviewDialogProps> = ({
  isOpen,
  onClose,
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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-white"
          initial={{ opacity: 0, y: '100%' }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: '100%' }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">{t`Preview`}</h2>
            <button
              aria-label={t`Close`}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
              type="button"
              onClick={onClose}
            >
              <CloseIcon />
            </button>
          </div>
          <PreviewContent
            allowSave={allowSave}
            isGenerating={isGenerating}
            isSubmitting={isSubmitting}
            previewContent={previewContent}
            previewMode={previewMode}
            onContentChange={onContentChange}
            onCreate={onCreate}
            onPreview={onPreview}
            onToggleMode={onToggleMode}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
