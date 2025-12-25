import { createFileRoute } from '@tanstack/react-router';

import { scenariosQueryOptions } from '../../features/scenario/queries/fetchScenariosQueryOption';
import { queryClient } from '../../query';

import { ScenarioListPage } from './-ScenarioListPage';

export const Route = createFileRoute('/scenarios/')({
  loader: async () => {
    await queryClient.prefetchQuery(scenariosQueryOptions());
  },
  component: ScenarioListPage,
});
