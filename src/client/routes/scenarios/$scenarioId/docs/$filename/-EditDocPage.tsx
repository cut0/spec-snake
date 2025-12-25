import { useLingui } from '@lingui/react/macro';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';

import { Header } from '../../../../../components/Header';
import { PreviewContent } from '../../../../../features/docs/components/PreviewContent';
import { PreviewDialog } from '../../../../../features/docs/components/PreviewDialog';
import { usePreviewDocMutation } from '../../../../../features/docs/mutations/usePreviewDocMutation';
import { useUpdateDocMutation } from '../../../../../features/docs/mutations/useUpdateDocMutation';
import { useDocsStore } from '../../../../../features/docs/stores/useDocsStore';
import { scenarioQueryOptions } from '../../../../../features/scenario/queries/fetchScenarioQueryOption';
import { useSnackbar } from '../../../../../features/snackbar/stores/snackbar';
import { ArraySection } from '../../../../../features/step/components/ArraySection';
import { MobileDrawer } from '../../../../../features/step/components/MobileDrawer';
import { SingleSection } from '../../../../../features/step/components/SingleSection';
import { StepAside } from '../../../../../features/step/components/StepAside';
import { StepNavigation } from '../../../../../features/step/components/StepNavigation';
import { StepProgress } from '../../../../../features/step/components/StepProgress';
import { getSectionStatus } from '../../../../../features/step/services';
import { useStepAsideStore } from '../../../../../features/step/stores/useStepAsideStore';
import { useStepFormStore } from '../../../../../features/step/stores/useStepFormStore';

import { Route } from './';

export const EditDocPage = () => {
  const { t } = useLingui();
  const { stepIndex, prevStep, step, nextStep } = Route.useLoaderData();
  const { scenarioId, filename } = Route.useParams();
  const { data } = useSuspenseQuery(scenarioQueryOptions(scenarioId));
  const { scenario, permissions } = data;
  const { steps } = scenario;

  // filename を formKey として使用
  const formKey = filename;

  // Store
  const { formValues, setFormError } = useStepFormStore({ formKey });
  const { previewContent, setPreviewContent } = useDocsStore({ formKey });
  const { navStatuses, updateNavStatus } = useStepAsideStore({ formKey });

  // Mutations
  const updateMutation = useUpdateDocMutation();
  const previewMutation = usePreviewDocMutation({ formKey });

  // Snackbar
  const { showSnackbar } = useSnackbar();

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAsideCollapsed, setIsAsideCollapsed] = useState(false);
  const [previewMode, setPreviewMode] = useState<'edit' | 'preview'>('preview');

  // Handlers
  const handleUpdate = useCallback(() => {
    if (updateMutation.isPending) {
      return;
    }

    if (previewContent == null) {
      showSnackbar(t`No content to save`, 'error');
      return;
    }

    updateMutation.mutate({
      scenarioId,
      filename,
      content: previewContent,
      formData: formValues,
    });
  }, [
    updateMutation,
    previewContent,
    scenarioId,
    filename,
    formValues,
    showSnackbar,
    t,
  ]);

  const handlePreview = useCallback(() => {
    if (previewMutation.isPending) {
      return;
    }

    // バリデーション
    let hasError = false;
    for (const s of steps) {
      const sectionName = s.section.name;
      const value = formValues[sectionName];
      const isError = getSectionStatus(s.section, value) === 'error';

      setFormError(sectionName, isError);
      updateNavStatus(sectionName);

      if (isError) {
        hasError = true;
      }
    }

    if (hasError) {
      showSnackbar(t`Required fields are not filled`, 'error');
      return;
    }

    previewMutation.mutate({ scenarioId, formData: formValues });
  }, [
    previewMutation,
    steps,
    formValues,
    scenarioId,
    setFormError,
    updateNavStatus,
    showSnackbar,
    t,
  ]);

  const onToggleMode = useCallback(() => {
    setPreviewMode((prev) => (prev === 'edit' ? 'preview' : 'edit'));
  }, []);

  const onContentChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setPreviewContent(e.target.value);
    },
    [setPreviewContent],
  );

  const onOpenDialog = useCallback(() => {
    setIsDialogOpen(true);
  }, []);

  const onCloseDialog = useCallback(() => {
    setIsDialogOpen(false);
  }, []);

  const onToggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  const onToggleAsideCollapse = useCallback(() => {
    setIsAsideCollapsed((prev) => !prev);
  }, []);

  const navItems = useMemo(
    () =>
      steps.map((s, i) => ({
        to: `/scenarios/${scenarioId}/docs/${encodeURIComponent(filename)}?step=${s.slug}`,
        title: s.title,
        description: s.description,
        step: i + 1,
        sectionName: s.section.name,
        status: navStatuses[s.section.name] ?? 'default',
        selected: i === stepIndex,
      })),
    [steps, scenarioId, filename, navStatuses, stepIndex],
  );

  const handleNavigate = useCallback(() => {
    updateNavStatus(step.section.name);
    requestAnimationFrame(() => {
      const activeTab = document.querySelector<HTMLElement>(
        '[role="tab"][aria-selected="true"]',
      );
      activeTab?.focus();
    });
  }, [step.section.name, updateNavStatus]);

  const prev = useMemo(
    () =>
      prevStep != null
        ? {
            to: `/scenarios/${scenarioId}/docs/${encodeURIComponent(filename)}?step=${prevStep.slug}`,
            label: t`Back`,
            onClick: () => updateNavStatus(step.section.name),
          }
        : undefined,
    [prevStep, scenarioId, filename, step.section.name, updateNavStatus, t],
  );

  const next = useMemo(
    () =>
      nextStep != null
        ? {
            to: `/scenarios/${scenarioId}/docs/${encodeURIComponent(filename)}?step=${nextStep.slug}`,
            label: t`Next`,
            onClick: () => updateNavStatus(step.section.name),
          }
        : undefined,
    [nextStep, scenarioId, filename, step.section.name, updateNavStatus, t],
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] xl:grid-cols-[auto_1fr_1fr] grid-rows-[auto_1fr] gap-6 min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <MobileDrawer
        scenarioName={scenario.name}
        isOpen={isMenuOpen}
        items={navItems}
        onClose={onCloseMenu}
        onItemClick={handleNavigate}
      />

      <div className="col-span-1 xl:col-span-2">
        <Header
          isMenuOpen={isMenuOpen}
          onOpenPreview={onOpenDialog}
          onToggleMenu={onToggleMenu}
        />
      </div>

      <aside className="hidden lg:flex row-span-2 min-w-0 bg-white rounded-2xl border border-gray-100 flex-col overflow-hidden sticky top-8 h-[calc(100vh-64px)] self-start">
        <PreviewContent
          allowSave={permissions.allowSave}
          isGenerating={previewMutation.isPending}
          isSubmitting={updateMutation.isPending}
          previewContent={previewContent}
          previewMode={previewMode}
          onContentChange={onContentChange}
          onCreate={handleUpdate}
          onPreview={handlePreview}
          onToggleMode={onToggleMode}
        />
      </aside>

      <StepAside
        scenarioName={scenario.name}
        isCollapsed={isAsideCollapsed}
        items={navItems}
        onItemClick={handleNavigate}
        onToggleCollapse={onToggleAsideCollapse}
      />

      <main className="flex flex-col gap-6 min-w-0">
        <div className="xl:hidden">
          <StepProgress
            current={stepIndex + 1}
            description={step.description}
            title={step.title}
            total={steps.length}
          />
        </div>
        {step.section.type === 'single' ? (
          <SingleSection key={step.slug} step={step} formKey={formKey} />
        ) : (
          <ArraySection key={step.slug} step={step} formKey={formKey} />
        )}

        <StepNavigation
          prev={prev}
          next={next}
          onSubmit={next == null ? handleUpdate : undefined}
        />
      </main>

      <PreviewDialog
        allowSave={permissions.allowSave}
        isGenerating={previewMutation.isPending}
        isOpen={isDialogOpen}
        isSubmitting={updateMutation.isPending}
        previewContent={previewContent}
        previewMode={previewMode}
        onClose={onCloseDialog}
        onContentChange={onContentChange}
        onCreate={handleUpdate}
        onPreview={handlePreview}
        onToggleMode={onToggleMode}
      />
    </div>
  );
};
