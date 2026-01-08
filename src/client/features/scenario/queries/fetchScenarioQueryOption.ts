import { queryOptions } from '@tanstack/react-query';

import type { Permissions, Scenario } from '../../../../definitions';

export type ScenarioData = {
  scenario: Scenario;
  permissions: Permissions;
};

type ScenarioResponse = ScenarioData;

const fetchScenario = async (scenarioId: string): Promise<ScenarioData> => {
  const response = await fetch(
    `/api/scenarios/${encodeURIComponent(scenarioId)}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch scenario');
  }
  return (await response.json()) as ScenarioResponse;
};

export const scenarioQueryOptions = (scenarioId: string) =>
  queryOptions({
    queryKey: ['scenarios', scenarioId],
    queryFn: () => fetchScenario(scenarioId),
  });
