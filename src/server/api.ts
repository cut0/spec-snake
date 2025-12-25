import { Hono } from 'hono';

import type { Config } from '../definitions';

import { createDocsApp } from './apps/docs';
import { createScenariosApp } from './apps/scenarios';
import { buildSectionInfoMap } from './helpers/scenarios/build-section-info';

export const createApiServer = (config: Config) => {
  const app = new Hono();

  // シナリオごとの情報を事前にビルド
  const scenarioInfoMap = new Map(
    config.scenarios.map((scenario) => [
      scenario.id,
      {
        scenario,
        sectionInfoMap: buildSectionInfoMap(scenario.steps),
      },
    ]),
  );

  // Scenarios App
  const scenariosApp = createScenariosApp(config, scenarioInfoMap);

  // Docs App
  const docsApp = createDocsApp(config, scenarioInfoMap);

  // Mount sub-apps
  app.route('/', scenariosApp);
  app.route('/', docsApp);

  return app;
};
