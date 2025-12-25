import { queryOptions } from '@tanstack/react-query';

import type { Scenario } from '../../../../definitions';

type ScenariosResponse = {
  scenarios: Scenario[];
};

const fetchScenarios = async (): Promise<Scenario[]> => {
  const response = await fetch('/api/scenarios');
  if (!response.ok) {
    throw new Error('Failed to fetch scenarios');
  }
  const data = (await response.json()) as ScenariosResponse;
  return data.scenarios;
};

export const scenariosQueryOptions = () =>
  queryOptions({
    queryKey: ['scenarios'],
    queryFn: fetchScenarios,
  });
