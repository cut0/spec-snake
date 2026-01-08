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

- [`examples/local/spec-snake.config.ts`](./examples/local/spec-snake.config.ts) - Basic config example (English)
- [`examples/local/spec-snake-ja.config.ts`](./examples/local/spec-snake-ja.config.ts) - Basic config example (Japanese)

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
          name: "overview",
          fields: [
            { id: "title", type: "input", label: "Title", description: "" },
          ],
        },
      ],
      prompt: "...",
      outputDir: "docs",
      filename: ({ formData, timestamp }) =>
        `${formData.overview?.title ?? "untitled"}-${timestamp}.md`,
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
| `prompt`     | `Function`           | Yes      | Prompt function sent to Claude |
| `outputDir`  | `string`             | No       | Directory for saving documents |
| `filename`   | `string \| Function` | No       | Custom filename for documents  |
| `aiSettings` | `AiSettings`         | No       | Claude Agent SDK settings      |
| `hooks`      | `ScenarioHooks`      | No       | Lifecycle hooks                |

**`Step`** - Each step in the multi-step form

| Property      | Type      | Required | Description                    |
| ------------- | --------- | -------- | ------------------------------ |
| `slug`        | `string`  | Yes      | URL-friendly identifier        |
| `title`       | `string`  | Yes      | Title displayed in step header |
| `description` | `string`  | Yes      | Description shown below title  |
| `name`        | `string`  | Yes      | Key used in formData           |
| `fields`      | `Field[]` | Yes      | Array of fields in this step   |

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

#### GridField - Layout for arranging fields in columns

```typescript
{
  type: 'grid',
  columns: 2,
  fields: [
    { type: 'input', id: 'firstName', label: 'First Name' },
    { type: 'input', id: 'lastName', label: 'Last Name' }
  ]
}
```

#### RepeatableLayout - Layout for repeating fields

Allows users to add multiple instances of a field or group.

```typescript
// Single field repeatable
{
  type: 'repeatable',
  id: 'tags',
  minCount: 1,  // Minimum entries (optional)
  field: { type: 'input', id: 'name', label: 'Tag', description: '' }
}
// formData: { tags: [{ name: 'tag1' }, { name: 'tag2' }] }

// Group repeatable (multiple fields per entry)
{
  type: 'repeatable',
  id: 'libraries',
  minCount: 1,
  field: {
    type: 'group',
    fields: [
      { type: 'input', id: 'name', label: 'Library Name', description: '' },
      { type: 'input', id: 'url', label: 'URL', description: '', inputType: 'url' }
    ]
  }
}
// formData: { libraries: [{ name: 'React', url: 'https://...' }, ...] }
```

#### GroupLayout - Visual grouping of fields

Groups fields together visually (no repetition). To repeat a group, wrap it in a RepeatableLayout.

```typescript
{
  type: 'group',
  fields: [
    { type: 'input', id: 'firstName', label: 'First Name', description: '' },
    { type: 'input', id: 'lastName', label: 'Last Name', description: '' }
  ]
}
// formData: { firstName: '...', lastName: '...' }
```

### Conditional Field Display

Fields can be conditionally shown/hidden based on other field values using the `when` property.

#### Object-based conditions (recommended for simple cases)

```typescript
// Show when priority is 'high'
{ type: 'input', id: 'deadline', label: 'Deadline', when: { field: 'priority', is: 'high' } }

// Show when priority is 'high' or 'medium'
{ type: 'textarea', id: 'risk', label: 'Risk', when: { field: 'priority', is: ['high', 'medium'] } }

// Show when priority is NOT 'low'
{ type: 'input', id: 'reviewer', label: 'Reviewer', when: { field: 'priority', isNot: 'low' } }

// Show when checkbox is checked
{ type: 'input', id: 'date', label: 'Date', when: { field: 'has_deadline', is: true } }

// Show when field is not empty
{ type: 'textarea', id: 'notes', label: 'Notes', when: { field: 'title', isNotEmpty: true } }

// Show when field is empty
{ type: 'input', id: 'fallback', label: 'Fallback', when: { field: 'title', isEmpty: true } }
```

#### Function-based conditions (for complex logic)

```typescript
// Complex condition with multiple fields
{
  type: 'textarea',
  id: 'details',
  label: 'Details',
  when: (formData) => formData.priority === 'high' && formData.type === 'feature'
}
```

**Note**: Hidden fields are automatically excluded from validation and form submission.

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

### `scenario.filename` - Custom document filename

```typescript
// Static filename
filename: 'design-doc.md'

// Or dynamic filename
filename: ({ formData, timestamp }) =>
  `${formData.project_name}-${timestamp}.md`
```

### Prompt Function

Prompts are defined as functions that receive `formData` and `promptContext` parameters.

```typescript
const prompt = ({ formData, promptContext }) => `Generate a design document.

${JSON.stringify(promptContext, null, 2)}`;
```

#### `formData`

Raw form data from UI, keyed by section name. Useful for accessing specific field values directly.

```typescript
// Example formData structure
{
  overview: {
    title: "My Project",
    description: "Project description",
    priority: "high"
  },
  requirements: [
    { name: "Feature A", priority: "high" },
    { name: "Feature B", priority: "medium" }
  ]
}
```

Usage example:

```typescript
const prompt = ({ formData }) =>
  `Generate a ${formData.overview?.priority} priority document for ${formData.overview?.title}.`;
```

#### `promptContext`

Transformed form data with step/field metadata. Includes labels and descriptions, suitable for AI prompts.

```typescript
// Example promptContext structure
{
  steps: [
    {
      title: "Overview",
      description: "Project overview",
      fields: [
        { label: "Title", description: "Project title", value: "My Project" },
        { label: "Description", description: "Project description", value: "..." },
        { label: "Priority", description: "Priority level", value: "high" }
      ]
    },
    {
      title: "Requirements",
      description: "List requirements",
      fields: [
        [
          { label: "Name", description: "Requirement name", value: "Feature A" },
          { label: "Priority", description: "Priority", value: "high" }
        ],
        [
          { label: "Name", description: "Requirement name", value: "Feature B" },
          { label: "Priority", description: "Priority", value: "medium" }
        ]
      ]
    }
  ]
}
```

Usage example:

```typescript
const prompt = ({ promptContext }) => `Generate a design document based on:

${JSON.stringify(promptContext, null, 2)}`;
```

## License

MIT
