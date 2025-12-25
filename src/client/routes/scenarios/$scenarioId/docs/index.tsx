import { createFileRoute, notFound } from '@tanstack/react-router';

import { docsQueryOptions } from '../../../../features/docs/queries/fetchDocsQueryOption';
import { scenarioQueryOptions } from '../../../../features/scenario/queries/fetchScenarioQueryOption';
import { queryClient } from '../../../../query';

import { DocumentListPage } from './-DocumentListPage';

export const Route = createFileRoute('/scenarios/$scenarioId/docs/')({
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
  component: DocumentListPage,
});
