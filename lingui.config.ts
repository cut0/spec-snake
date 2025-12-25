import type { LinguiConfig } from '@lingui/conf';

const config: LinguiConfig = {
  locales: ['ja', 'en'],
  sourceLocale: 'ja',
  catalogs: [
    {
      path: '<rootDir>/src/client/locales/{locale}',
      include: ['src/client'],
      exclude: ['**/node_modules/**', '**/config.ts'],
    },
  ],
  format: 'po',
  compileNamespace: 'ts',
};

export default config;
