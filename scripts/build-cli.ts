import * as esbuild from 'esbuild';

await esbuild.build({
  entryPoints: ['src/cli/index.ts'],
  bundle: true,
  platform: 'node',
  target: 'node20',
  format: 'esm',
  outfile: 'dist/cli.js',
  minify: false,
  sourcemap: true,
  banner: {
    js: '#!/usr/bin/env node',
  },
  // node_modules を external (依存関係はランタイムで解決)
  packages: 'external',
});

console.log('CLI built successfully: dist/cli.js');
