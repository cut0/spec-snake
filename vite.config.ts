import * as path from 'node:path';

import devServer, { defaultOptions } from '@hono/vite-dev-server';
import { lingui } from '@lingui/vite-plugin';
import tailwindcss from '@tailwindcss/vite';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const isDev = process.env.NODE_ENV === 'development';

export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routesDirectory: path.resolve(__dirname, 'src/client/routes'),
      generatedRouteTree: path.resolve(
        __dirname,
        'src/client/routeTree.gen.ts',
      ),
    }),
    react({
      babel: {
        plugins: ['@lingui/babel-plugin-lingui-macro'],
      },
    }),
    lingui(),
    tailwindcss(),
    ...(isDev
      ? [
          devServer({
            entry: 'src/server/dev.ts',
            exclude: [
              ...defaultOptions.exclude,
              // /api 以外のすべてのパスを除外
              /^(?!\/api\/).*/,
            ],
          }),
        ]
      : []),
  ],
  build: {
    outDir: 'dist/client',
    emptyOutDir: true,
  },
});
