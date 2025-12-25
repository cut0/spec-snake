import * as fs from 'node:fs';
import * as path from 'node:path';

import { createJiti } from 'jiti';

import { type Config, safeParseConfig } from '../definitions';
import { createApiServer } from './api';

const loadConfig = async (configPath: string): Promise<Config> => {
  const absolutePath = path.resolve(process.cwd(), configPath);

  if (!fs.existsSync(absolutePath)) {
    throw new Error(`Config file not found: ${absolutePath}`);
  }

  const jiti = createJiti(import.meta.url);
  const configModule = await jiti.import(absolutePath);
  const config = (configModule as { default: Config }).default;

  const result = safeParseConfig(config);
  if (!result.success) {
    const issues = result.issues.map((issue) => {
      const pathStr = issue.path?.map((p) => p.key).join('.') ?? '';
      return `  - ${pathStr}: ${issue.message}`;
    });
    throw new Error(`Invalid config:\n${issues.join('\n')}`);
  }

  return config;
};

// biome-ignore lint/complexity/useLiteralKeys: <explanation>
const configPath = process.env['SPEC_SNAKE_CONFIG'];
if (configPath == null) {
  throw new Error('SPEC_SNAKE_CONFIG environment variable is required');
}
const config = await loadConfig(configPath);

const app = createApiServer(config);

export default app;
