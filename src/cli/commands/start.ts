import * as fs from 'node:fs';
import * as path from 'node:path';
import * as url from 'node:url';

import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { defineCommand } from 'citty';
import { consola } from 'consola';
import { createJiti } from 'jiti';

import { type Config, safeParseConfig } from '../../definitions';
import { createApiServer } from '../../server/api';

const getDistClientDir = (): string => {
  const __filename = url.fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);

  // After build: dist/cli.js → dist/client (same dist directory)
  // During development: src/cli/commands/start.ts → dist/client (3 levels up in dist)
  const isBuilt = __dirname.endsWith('/dist') || __dirname.includes('/dist/');
  return isBuilt
    ? path.resolve(__dirname, 'client')
    : path.resolve(__dirname, '../../../dist/client');
};

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

  // hooks cannot be validated with valibot, so preserve from original config
  return config;
};

const runServer = async (
  config: Config,
  options: { distDir: string; port: number; host: string },
) => {
  consola.start('Starting server...');

  const app = createApiServer(config);

  app.use(
    '/*',
    serveStatic({
      root: options.distDir,
      rewriteRequestPath: (requestPath) => {
        const fullPath = path.join(options.distDir, requestPath);
        if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
          return requestPath;
        }
        return '/index.html';
      },
    }),
  );

  const server = serve(
    {
      fetch: app.fetch,
      port: options.port,
      hostname: options.host,
    },
    (info) => {
      const displayHost =
        info.address === '::1' || info.address === '127.0.0.1'
          ? 'localhost'
          : info.address;
      consola.success('Server started');
      consola.info(`  ➜  Local:   http://${displayHost}:${info.port}/`);
    },
  );

  const cleanup = () => {
    consola.info('Shutting down server...');
    server.close(() => {
      process.exit(0);
    });
  };

  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
};

export const startCommand = defineCommand({
  meta: {
    name: 'start',
    description: 'Start the server with the specified config',
  },
  args: {
    config: {
      type: 'string',
      description: 'Path to config file',
      alias: 'c',
      default: 'spec-snake.config.ts',
    },
    port: {
      type: 'string',
      description: 'Port to run the server on',
      alias: 'p',
      default: '3000',
    },
    host: {
      type: 'string',
      description: 'Host to bind the server to',
      default: 'localhost',
    },
  },
  async run({ args }) {
    const configPath = args.config;
    const port = Number.parseInt(args.port, 10);

    consola.start(`Loading config from: ${configPath}`);

    try {
      const config = await loadConfig(configPath);
      consola.success(
        `Config loaded successfully (${config.scenarios.length} scenarios)`,
      );

      await runServer(config, {
        distDir: getDistClientDir(),
        port,
        host: args.host,
      });
    } catch (error) {
      if (error instanceof Error) {
        consola.error(error.message);
      } else {
        consola.error('Failed to start server:', error);
      }
      process.exit(1);
    }
  },
});
