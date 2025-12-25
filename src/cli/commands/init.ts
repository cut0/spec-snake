import * as fs from 'node:fs';
import * as path from 'node:path';

import { defineCommand } from 'citty';
import { consola } from 'consola';

const CONFIG_TEMPLATE = `// For more detailed configuration examples, see:
// https://github.com/cut0/spec-snake/blob/main/examples/spec-snake.ts

import { defineConfig, defineScenario } from '@cut0/spec-snake';

export default defineConfig({
  scenarios: [
    defineScenario({
      id: 'default',
      name: 'Design Doc Generator',
      steps: [
        {
          slug: 'overview',
          title: 'Overview',
          description: 'Basic information about the feature',
          section: {
            type: 'single',
            name: 'overview',
            fields: [
              {
                type: 'input',
                id: 'title',
                label: 'Title',
                description: 'Feature title',
                placeholder: 'Enter feature title',
                required: true,
              },
              {
                type: 'textarea',
                id: 'description',
                label: 'Description',
                description: 'Detailed description of the feature',
                placeholder: 'Describe the feature...',
                rows: 4,
              },
              {
                type: 'select',
                id: 'priority',
                label: 'Priority',
                description: 'Feature priority level',
                placeholder: 'Select priority',
                options: [
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ],
              },
            ],
          },
        },
      ],
      overrides: {
        filename: (params) => {
          return \`\${params.timestamp}.md\`;
        },
      },
      prompt:
        'Generate a design doc based on the following input: {{INPUT_JSON}}',
    }),
  ],
  permissions: {
    allowSave: true,
  },
});
`;

export const initCommand = defineCommand({
  meta: {
    name: 'init',
    description:
      'Initialize a new spec-snake.config.ts file in the current directory',
  },
  args: {
    output: {
      type: 'string',
      description: 'Output file path',
      alias: 'o',
      default: 'spec-snake.config.ts',
    },
    force: {
      type: 'boolean',
      description: 'Overwrite existing file',
      alias: 'f',
      default: false,
    },
  },
  async run({ args }) {
    const outputPath = path.resolve(process.cwd(), args.output);

    if (fs.existsSync(outputPath) && !args.force) {
      consola.error(`File already exists: ${outputPath}`);
      consola.info('Use --force (-f) to overwrite');
      process.exit(1);
    }

    try {
      fs.writeFileSync(outputPath, CONFIG_TEMPLATE, 'utf-8');
      consola.success(`Config file created: ${outputPath}`);
    } catch (error) {
      consola.error('Failed to create config file:', error);
      process.exit(1);
    }
  },
});
