import { createFileRoute, notFound } from '@tanstack/react-router';
import * as v from 'valibot';

import { buildFormDefaultValues } from '../../../../../features/form/services';
import { scenarioQueryOptions } from '../../../../../features/scenario/queries/fetchScenarioQueryOption';
import { initializeFormIfNeeded } from '../../../../../features/step/stores/step-form';
import { queryClient } from '../../../../../query';

import { NewDocPage } from './-NewDocPage';

const searchSchema = v.object({
  step: v.optional(v.string()),
});

export const Route = createFileRoute('/scenarios/$scenarioId/docs/new/')({
  validateSearch: searchSchema,
  loaderDeps: ({ search }) => ({ step: search.step }),
  loader: async ({ params, deps }) => {
    const data = await queryClient
      .fetchQuery(scenarioQueryOptions(params.scenarioId))
      .catch(() => {
        throw notFound();
      });

    const { steps } = data.scenario;

    // Calculate index from step parameter, default to first step
    const foundIndex =
      deps.step != null ? steps.findIndex((s) => s.slug === deps.step) : -1;
    const stepIndex = foundIndex !== -1 ? foundIndex : 0;

    const step = steps[stepIndex];
    if (step == null) {
      throw notFound();
    }

    // Initialize form (only if needed)
    initializeFormIfNeeded({ initialValues: buildFormDefaultValues(steps) });

    return {
      stepIndex,
      prevStep: steps[stepIndex - 1],
      step,
      nextStep: steps[stepIndex + 1],
    };
  },
  component: NewDocPage,
});
