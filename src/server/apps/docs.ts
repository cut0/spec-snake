import { Hono } from 'hono';
import { createMiddleware } from 'hono/factory';
import { streamSSE } from 'hono/streaming';

import type { Config } from '../../definitions';
import { transformFormData } from '../helpers/docs/transform';
import {
  getDocumentsForScenario,
  getFilename,
  readDocument,
  saveDocument,
} from '../repositories/document';
import { generateDesignDocStream } from '../usecases/docs/generate-doc';

import type { ScenarioInfoMapEntry } from './scenarios';

type Variables = {
  scenarioInfo: ScenarioInfoMapEntry;
};

type CreateDocBody = {
  content: string;
  formData: Record<string, unknown>;
};

type UpdateDocBody = {
  content: string;
  formData: Record<string, unknown>;
};

const createScenarioMiddleware = (
  scenarioInfoMap: Map<string, ScenarioInfoMapEntry>,
) =>
  createMiddleware<{ Variables: Variables }>(async (c, next) => {
    const scenarioId = c.req.param('scenarioId');

    if (scenarioId == null) {
      return c.json({ error: 'Scenario ID is required' }, 400);
    }

    const scenarioInfo = scenarioInfoMap.get(scenarioId);

    if (scenarioInfo == null) {
      return c.json({ error: 'Scenario not found' }, 404);
    }

    c.set('scenarioInfo', scenarioInfo);
    await next();
  });

export const createDocsApp = (
  config: Config,
  scenarioInfoMap: Map<string, ScenarioInfoMapEntry>,
) => {
  const app = new Hono<{ Variables: Variables }>();

  app.use(
    '/api/scenarios/:scenarioId/*',
    createScenarioMiddleware(scenarioInfoMap),
  );

  app.get('/api/scenarios/:scenarioId/docs', async (c) => {
    const { scenario } = c.get('scenarioInfo');
    const docs = await getDocumentsForScenario(scenario);

    return c.json({ docs });
  });

  app.post('/api/scenarios/:scenarioId/docs/preview', async (c) => {
    const { scenario, stepInfoMap } = c.get('scenarioInfo');

    const formData = (await c.req.json()) as Record<string, unknown>;
    const promptContext = transformFormData(formData, stepInfoMap);

    return streamSSE(c, async (stream) => {
      let fullContent = '';

      for await (const chunk of generateDesignDocStream({
        scenario,
        formData,
        promptContext,
      })) {
        fullContent += chunk.text;
        await stream.writeSSE({
          data: JSON.stringify({ type: 'text_delta', text: chunk.text }),
          event: 'message',
        });
      }

      await stream.writeSSE({
        data: JSON.stringify({ type: 'done', content: fullContent }),
        event: 'message',
      });

      if (scenario.hooks?.onPreview != null) {
        await scenario.hooks.onPreview({
          formData,
          promptContext,
          content: fullContent,
        });
      }
    });
  });

  app.post('/api/scenarios/:scenarioId/docs', async (c) => {
    const scenarioId = c.req.param('scenarioId');
    const { scenario, stepInfoMap } = c.get('scenarioInfo');

    if (!config.permissions.allowSave) {
      return c.json({ error: 'Save is not allowed' }, 403);
    }

    const { content, formData } = (await c.req.json()) as CreateDocBody;
    const promptContext = transformFormData(formData, stepInfoMap);
    const filename = getFilename(
      scenario,
      scenarioId,
      content,
      formData,
      promptContext,
    );
    const { outputPath } = await saveDocument({
      scenario,
      scenarioId,
      filename,
      content,
      formData,
    });

    if (scenario.hooks?.onSave != null) {
      await scenario.hooks.onSave({
        content,
        filename,
        outputPath,
        formData,
        promptContext,
      });
    }

    return c.json({ success: true, filename });
  });

  app.get('/api/scenarios/:scenarioId/docs/:filename', async (c) => {
    const filename = c.req.param('filename');
    const { scenario } = c.get('scenarioInfo');

    const result = await readDocument(scenario, filename);

    if (!result.success) {
      return c.json({ error: 'Document not found' }, 404);
    }

    return c.json({ doc: result.doc });
  });

  app.put('/api/scenarios/:scenarioId/docs/:filename', async (c) => {
    const scenarioId = c.req.param('scenarioId');
    const filename = c.req.param('filename');
    const { scenario, stepInfoMap } = c.get('scenarioInfo');

    if (!config.permissions.allowSave) {
      return c.json({ error: 'Save is not allowed' }, 403);
    }

    const { content, formData } = (await c.req.json()) as UpdateDocBody;
    const promptContext = transformFormData(formData, stepInfoMap);
    const { outputPath } = await saveDocument({
      scenario,
      scenarioId,
      filename,
      content,
      formData,
    });

    if (scenario.hooks?.onSave != null) {
      await scenario.hooks.onSave({
        content,
        filename,
        outputPath,
        formData,
        promptContext,
      });
    }

    return c.json({ success: true, filename });
  });

  return app;
};
