import { defineCommand, runMain } from 'citty';

import { initCommand } from './commands/init';
import { startCommand } from './commands/start';

const main = defineCommand({
  meta: {
    name: 'design-docs-generator',
    version: '0.0.1',
    description: 'Design Docs Generator CLI',
  },
  subCommands: {
    init: initCommand,
    start: startCommand,
  },
});

runMain(main);
