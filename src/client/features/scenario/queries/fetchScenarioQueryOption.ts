import { queryOptions } from '@tanstack/react-query';

import type { Permissions, Scenario } from '../../../../definitions';

export type ScenarioWithDefaults = {
  scenario: Scenario;
  formDefaultValues: Record<string, unknown>;
  permissions: Permissions;
};

type ScenarioResponse = ScenarioWithDefaults;

const fetchScenario = async (
  scenarioId: string,
): Promise<ScenarioWithDefaults> => {
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
