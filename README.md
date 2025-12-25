# Spec Snake Beta

AI-powered design document generator

[日本語版](./README.ja.md)

- Config Base
  - Define scenarios, forms, and prompts in TypeScript config files
- Multi Step Form
  - Collect required information step by step through wizard-style forms
- AI Generation
  - Generate high-quality documents from collected information using Claude Agent SDK
- MCP Integration
  - Connect with external tools like Figma to generate more detailed documents

## Concept

Documents are managed based on three core concepts:

- Scenario
  - A unit representing the type of document. Define scenarios for each purpose such as technical design docs, implementation plans, etc.
- Step
  - Form input steps within a scenario. Collect information progressively through multiple steps
- Document
  - The generated markdown document. Created from form input and AI

## Installation

```bash
# npm
npm install spec-snake@beta

# yarn
yarn add spec-snake@beta

# pnpm
pnpm add spec-snake@beta
```

**Note**: Published on GitHub Packages

## Requirements

- **Node.js**: 18 or higher
- **Claude Code**: [Claude Code](https://claude.ai/code) must be installed

## CLI Commands

### `init` - Initialize config file

Creates a new config file.

```bash
npx spec-snake-beta init
```

Options:

| Option     | Alias | Default                | Description              |
| ---------- | ----- | ---------------------- | ------------------------ |
| `--output` | `-o`  | `spec-snake.config.ts` | Output file path         |
| `--force`  | `-f`  | `false`                | Overwrite existing files |

Examples:

```bash
# Create with default filename
npx spec-snake-beta init

# Create with custom filename
npx spec-snake-beta init -o my-config.ts

# Overwrite existing file
npx spec-snake-beta init -f
```

### `start` - Start the server

Loads the config file and starts the Web UI server.

```bash
npx spec-snake-beta start
```

Options:

| Option     | Alias | Default                | Description      |
| ---------- | ----- | ---------------------- | ---------------- |
| `--config` | `-c`  | `spec-snake.config.ts` | Config file path |
| `--port`   | `-p`  | `3000`                 | Server port      |
| `--host`   | -     | `localhost`            | Host to bind     |

Examples:

```bash
# Start with default settings
npx spec-snake-beta start

# Start with custom config and port
npx spec-snake-beta start -c my-config.ts -p 8080

# Listen on all interfaces
npx spec-snake-beta start --host 0.0.0.0
```

## Config File

### Config Examples

See the [`examples/`](./examples/) directory for config file examples.

- [`examples/spec-snake.ts`](./examples/spec-snake-ja.ts) - Basic config example

Also refer to [src/types.ts](./src/types.ts) for configurable options.

### Config Structure

```typescript
import { defineConfig, defineScenario } from "spec-snake";

export default defineConfig({
  scenarios: [
    defineScenario({
      id: "design-doc",
      name: "Design Document",
      steps: [
        {
          slug: "overview",
          title: "Overview",
          description: "Project overview",
          section: {
            type: "single",
            name: "overview",
            fields: [
              { id: "title", type: "input", label: "Title", description: "" },
            ],
          },
        },
      ],
      prompt: "...",
      outputDir: "docs",
      overrides: {
        filename: ({ formData, timestamp }) =>
          `${formData.overview?.title ?? "untitled"}-${timestamp}.md`,
      },
    }),
  ],
  permissions: {
    allowSave: true,
  },
});
```

### Type Definitions

**`Config`** - Root config object

| Property      | Type          | Required | Description              |
| ------------- | ------------- | -------- | ------------------------ |
| `scenarios`   | `Scenario[]`  | Yes      | Array of scenarios       |
| `permissions` | `Permissions` | Yes      | Global permission config |

**`Permissions`** - Permission settings

| Property    | Type      | Description                  |
| ----------- | --------- | ---------------------------- |
| `allowSave` | `boolean` | Whether to allow saving docs |

**`Scenario`** - Scenario definition. Each scenario represents one document type

| Property     | Type                 | Required | Description                    |
| ------------ | -------------------- | -------- | ------------------------------ |
| `id`         | `string`             | Yes      | Unique identifier used in URL  |
| `name`       | `string`             | Yes      | Display name                   |
| `steps`      | `Step[]`             | Yes      | Form wizard steps              |
| `prompt`     | `string \| Function` | Yes      | Prompt template sent to Claude |
| `outputDir`  | `string`             | No       | Directory for saving documents |
| `aiSettings` | `AiSettings`         | No       | Claude Agent SDK settings      |
| `hooks`      | `ScenarioHooks`      | No       | Lifecycle hooks                |
| `overrides`  | `ScenarioOverrides`  | No       | Override default behaviors     |

**`Step`** - Each step in the multi-step form

| Property      | Type      | Required | Description                    |
| ------------- | --------- | -------- | ------------------------------ |
| `slug`        | `string`  | Yes      | URL-friendly identifier        |
| `title`       | `string`  | Yes      | Title displayed in step header |
| `description` | `string`  | Yes      | Description shown below title  |
| `section`     | `Section` | Yes      | Section containing step fields |

### `Section` - Two types available

SingleSection - A group of fields entered once

```typescript
{
  type: 'single',
  name: 'overview',
  fields: [...]
}
```

ArraySection - A group of fields that can have multiple entries

```typescript
{
  type: 'array',
  name: 'requirements',
  fields: [...],
  minFieldCount: 1  // Minimum entries (optional)
}
```

### Field Types

#### InputField - Text input

```typescript
{
  type: 'input',
  id: 'title',
  label: 'Title',
  description: 'Field description',
  placeholder: 'Placeholder',
  required: true,
  inputType: 'text' | 'date' | 'url',
  suggestions: ['Option 1', 'Option 2']
}
```

#### TextareaField - Multi-line text

```typescript
{
  type: 'textarea',
  id: 'description',
  label: 'Description',
  description: 'Field description',
  rows: 4
}
```

#### SelectField - Dropdown select

```typescript
{
  type: 'select',
  id: 'priority',
  label: 'Priority',
  description: 'Field description',
  options: [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' }
  ]
}
```

#### CheckboxField - Checkbox

```typescript
{
  type: 'checkbox',
  id: 'agree',
  label: 'I agree',
  description: 'Field description'
}
```

### `AiSettings` - Claude Agent SDK settings

| Property                          | Type                              | Description                                                 |
| --------------------------------- | --------------------------------- | ----------------------------------------------------------- |
| `model`                           | `string`                          | Model to use (e.g., `claude-sonnet-4-5-20250929`)           |
| `fallbackModel`                   | `string`                          | Fallback model                                              |
| `maxTurns`                        | `number`                          | Maximum turns                                               |
| `maxBudgetUsd`                    | `number`                          | Budget limit in USD                                         |
| `tools`                           | `object`                          | Tool settings (`{ type: 'preset', preset: 'claude_code' }`) |
| `allowedTools`                    | `string[]`                        | Allowed tools                                               |
| `disallowedTools`                 | `string[]`                        | Disallowed tools                                            |
| `permissionMode`                  | `PermissionMode`                  | Permission mode                                             |
| `allowDangerouslySkipPermissions` | `boolean`                         | Skip permission checks                                      |
| `mcpServers`                      | `Record<string, McpServerConfig>` | MCP server config                                           |

#### Available Tools

- File operations: `Read`, `Write`, `Edit`, `Glob`, `Grep`, `NotebookEdit`
- Command execution: `Bash`
- Web: `WebSearch`, `WebFetch`
- Agents: `Task`, `TodoWrite`
- Code completion: `LSP`
- MCP tools: `mcp__<server>__<tool>` format

### `scenario.hooks` - Lifecycle hooks

```typescript
{
  // Called after preview generation
  onPreview: async ({ formData, content }) => {
    console.log('Preview generated');
  },
  // Called after document save
  onSave: async ({ content, filename, outputPath, formData }) => {
    console.log(`Saved to ${outputPath}`);
  }
}
```

### `scenario.overrides` - Override default behaviors

```typescript
{
  // Static filename
  filename: 'design-doc.md',
  // Or dynamic filename
  filename: ({ formData, timestamp }) =>
    `${formData.project_name}-${timestamp}.md`
}
```

### Prompt Template

Use `{{INPUT_JSON}}` in prompts to insert form data as JSON.

```typescript
const prompt = `Generate a design document based on the following input.

{{INPUT_JSON}}

Output in markdown format.`;
```

Prompts can also be defined as functions.

```typescript
const prompt = ({ formData }) =>
  `Generate ${formData.doc_type} document: {{INPUT_JSON}}`;
```

## License

MIT
