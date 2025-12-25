import { createFileRoute, notFound } from '@tanstack/react-router';

import { docsQueryOptions } from '../../../features/docs/queries/fetchDocsQueryOption';
import { scenarioQueryOptions } from '../../../features/scenario/queries/fetchScenarioQueryOption';
import { queryClient } from '../../../query';

import { ScenarioModePage } from './-ScenarioModePage';

export const Route = createFileRoute('/scenarios/$scenarioId/')({
  loader: async ({ params }) => {
    try {
      await Promise.all([
        queryClient.fetchQuery(scenarioQueryOptions(params.scenarioId)),
        queryClient.prefetchQuery(docsQueryOptions(params.scenarioId)),
      ]);
    } catch {
      throw notFound();
    }
  },
  component: ScenarioModePage,
});
