import { Hono } from 'hono';

import type { Config, Scenario } from '../../definitions';
import { buildFormDefaultValues } from '../helpers/scenarios/build-form-defaults';
import type { buildSectionInfoMap } from '../helpers/scenarios/build-section-info';

export type ScenarioInfo = {
  sectionInfoMap: ReturnType<typeof buildSectionInfoMap>;
};

export type ScenarioInfoMapEntry = {
  scenario: Scenario;
  sectionInfoMap: ReturnType<typeof buildSectionInfoMap>;
};

export const createScenariosApp = (
  config: Config,
  scenarioInfoMap: Map<string, ScenarioInfoMapEntry>,
) => {
  const app = new Hono();

  // 全シナリオ取得
  app.get('/api/scenarios', (c) => {
    return c.json({
      scenarios: config.scenarios,
    });
  });

  // 単一シナリオ取得
  app.get('/api/scenarios/:scenarioId', (c) => {
    const scenarioId = c.req.param('scenarioId');
    const scenarioInfo = scenarioInfoMap.get(scenarioId);

    if (scenarioInfo == null) {
      return c.json({ error: 'Scenario not found' }, 404);
    }

    const formDefaultValues = buildFormDefaultValues(
      scenarioInfo.scenario.steps,
    );

    return c.json({
      scenario: scenarioInfo.scenario,
      formDefaultValues,
      permissions: config.permissions,
    });
  });

  return app;
};
