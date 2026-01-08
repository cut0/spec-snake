import { Hono } from 'hono';

import type { Config, Scenario } from '../../definitions';
import type { buildStepInfoMap } from '../helpers/scenarios/build-step-info';

export type ScenarioInfo = {
  stepInfoMap: ReturnType<typeof buildStepInfoMap>;
};

export type ScenarioInfoMapEntry = {
  scenario: Scenario;
  stepInfoMap: ReturnType<typeof buildStepInfoMap>;
};

export const createScenariosApp = (
  config: Config,
  scenarioInfoMap: Map<string, ScenarioInfoMapEntry>,
) => {
  const app = new Hono();

  // Get all scenarios
  app.get('/api/scenarios', (c) => {
    return c.json({
      scenarios: config.scenarios,
    });
  });

  // Get single scenario
  app.get('/api/scenarios/:scenarioId', (c) => {
    const scenarioId = c.req.param('scenarioId');
    const scenarioInfo = scenarioInfoMap.get(scenarioId);

    if (scenarioInfo == null) {
      return c.json({ error: 'Scenario not found' }, 404);
    }

    return c.json({
      scenario: scenarioInfo.scenario,
      permissions: config.permissions,
    });
  });

  return app;
};
