import { createFileRoute, notFound } from '@tanstack/react-router';
import * as v from 'valibot';

import { docQueryOptions } from '../../../../../features/docs/queries/fetchDocQueryOption';
import { initializePreviewIfNeeded } from '../../../../../features/docs/stores/preview';
import { scenarioQueryOptions } from '../../../../../features/scenario/queries/fetchScenarioQueryOption';
import { initializeFormIfNeeded } from '../../../../../features/step/stores/step-form';
import { queryClient } from '../../../../../query';

import { EditDocPage } from './-EditDocPage';

const searchSchema = v.object({
  step: v.optional(v.string()),
});

export const Route = createFileRoute('/scenarios/$scenarioId/docs/$filename/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ step: search.step }),
  loader: async ({ params, deps }) => {
    const [scenarioData, doc] = await Promise.all([
      queryClient.fetchQuery(scenarioQueryOptions(params.scenarioId)),
      queryClient.fetchQuery(
        docQueryOptions(params.scenarioId, params.filename),
      ),
    ]).catch(() => {
      throw notFound();
    });

    if (doc.metadata == null) {
      throw notFound();
    }

    const { steps } = scenarioData.scenario;

    // Calculate index from step parameter, default to first step
    const foundIndex =
      deps.step != null ? steps.findIndex((s) => s.slug === deps.step) : -1;
    const stepIndex = foundIndex !== -1 ? foundIndex : 0;

    const step = steps[stepIndex];
    if (step == null) {
      throw notFound();
    }

    // Use filename as formKey
    const formKey = params.filename;

    // Initialize state for edit mode (only if needed)
    initializeFormIfNeeded({ initialValues: doc.metadata.formData, formKey });
    initializePreviewIfNeeded({ content: doc.content, formKey });

    return {
      stepIndex,
      prevStep: steps[stepIndex - 1],
      step,
      nextStep: steps[stepIndex + 1],
    };
  },
  component: EditDocPage,
});
