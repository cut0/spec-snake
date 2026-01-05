import { defineCommand, runMain } from 'citty';

import { version } from '../../package.json';
import { initCommand } from './commands/init';
import { startCommand } from './commands/start';

const main = defineCommand({
  meta: {
    name: 'spec-snake',
    version,
    description: 'AI-powered design document generator CLI',
  },
  subCommands: {
    init: initCommand,
    start: startCommand,
  },
});

runMain(main);
