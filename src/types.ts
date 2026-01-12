/**
 * Core type definitions for spec-snake
 *
 * This module defines all TypeScript types used throughout the application,
 * including form fields, sections, steps, scenarios, and configuration.
 *
 * @module types
 */

import type {
  McpHttpServerConfig,
  McpSSEServerConfig,
  McpStdioServerConfig,
  Options,
  PermissionMode,
} from '@anthropic-ai/claude-agent-sdk';

// =============================================================================
// Form Field Types
// =============================================================================

/**
 * Option for select/dropdown fields
 *
 * @example
 * ```ts
 * const option: SelectOption = {
 *   value: 'high',
 *   label: 'High Priority'
 * };
 * ```
 */
export type SelectOption = {
  /** Internal value used in form data */
  value: string;
  /** Display label shown to users */
  label: string;
};

// =============================================================================
// Field Condition Types
// =============================================================================

/**
 * Declarative condition for field visibility
 *
 * Use this for simple conditions like "show when field X equals Y".
 * For complex conditions, use a function instead.
 *
 * @example
 * ```ts
 * // Show when priority is 'high'
 * when: { field: 'priority', is: 'high' }
 *
 * // Show when priority is 'high' or 'medium'
 * when: { field: 'priority', is: ['high', 'medium'] }
 *
 * // Show when priority is NOT 'low'
 * when: { field: 'priority', isNot: 'low' }
 *
 * // Show when checkbox is checked
 * when: { field: 'has_deadline', is: true }
 *
 * // Show when field is not empty
 * when: { field: 'title', isNotEmpty: true }
 * ```
 */
export type FieldConditionObject =
  | { field: string; is: string | boolean | (string | boolean)[] }
  | { field: string; isNot: string | boolean | (string | boolean)[] }
  | { field: string; isEmpty: true }
  | { field: string; isNotEmpty: true };

/**
 * Function-based condition for complex visibility logic
 *
 * Receives the current form data and returns whether the field should be visible.
 * Use this when you need to reference multiple fields or complex logic.
 *
 * @example
 * ```ts
 * // Complex condition with multiple fields
 * when: (formData) =>
 *   formData.priority === 'high' && formData.type === 'feature'
 *
 * // Cross-section reference
 * when: (formData) =>
 *   formData.overview?.includeDeadline === true
 * ```
 */
export type FieldConditionFunction<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> = (formData: TFormData) => boolean;

/**
 * Field visibility condition (hybrid: object or function)
 *
 * - Use object form for simple conditions (recommended for most cases)
 * - Use function form for complex conditions
 */
export type FieldCondition<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> = FieldConditionObject | FieldConditionFunction<TFormData>;

/**
 * Text input field configuration
 *
 * Supports various input types including text, date, and URL.
 * Can include autocomplete suggestions.
 *
 * @example
 * ```ts
 * const field: InputField = {
 *   id: 'project_name',
 *   type: 'input',
 *   label: 'Project Name',
 *   description: 'Enter the name of your project',
 *   placeholder: 'My Awesome Project',
 *   required: true,
 *   inputType: 'text',
 *   suggestions: ['Project A', 'Project B']
 * };
 * ```
 */
export type InputField = {
  /** Unique identifier for the field (used as form data key) */
  id: string;
  /** Display label shown above the input */
  label: string;
  /** Help text describing the field's purpose */
  description: string;
  /** Placeholder text shown when input is empty */
  placeholder?: string;
  /** Whether the field must be filled before submission */
  required?: boolean;
  /** Field type discriminator */
  type: 'input';
  /** HTML input type - affects keyboard and validation */
  inputType?: 'text' | 'date' | 'url';
  /** Autocomplete suggestions shown as datalist options */
  suggestions?: string[];
  /** Condition for when this field should be visible */
  when?: FieldCondition;
  /** Default value for the field */
  default?: string;
};

/**
 * Multi-line text area field configuration
 *
 * @example
 * ```ts
 * const field: TextareaField = {
 *   id: 'description',
 *   type: 'textarea',
 *   label: 'Description',
 *   description: 'Provide a detailed description',
 *   rows: 5
 * };
 * ```
 */
export type TextareaField = {
  /** Unique identifier for the field */
  id: string;
  /** Display label shown above the textarea */
  label: string;
  /** Help text describing the field's purpose */
  description: string;
  /** Placeholder text shown when textarea is empty */
  placeholder?: string;
  /** Whether the field must be filled before submission */
  required?: boolean;
  /** Field type discriminator */
  type: 'textarea';
  /** Number of visible text rows (affects initial height) */
  rows?: number;
  /** Condition for when this field should be visible */
  when?: FieldCondition;
  /** Default value for the field */
  default?: string;
};

/**
 * Dropdown select field configuration
 *
 * @example
 * ```ts
 * const field: SelectField = {
 *   id: 'priority',
 *   type: 'select',
 *   label: 'Priority',
 *   description: 'Select the priority level',
 *   options: [
 *     { value: 'low', label: 'Low' },
 *     { value: 'medium', label: 'Medium' },
 *     { value: 'high', label: 'High' }
 *   ]
 * };
 * ```
 */
export type SelectField = {
  /** Unique identifier for the field */
  id: string;
  /** Display label shown above the select */
  label: string;
  /** Help text describing the field's purpose */
  description: string;
  /** Placeholder text (shown as first disabled option) */
  placeholder?: string;
  /** Whether a selection must be made before submission */
  required?: boolean;
  /** Field type discriminator */
  type: 'select';
  /** Available options for selection */
  options: SelectOption[];
  /** Condition for when this field should be visible */
  when?: FieldCondition;
  /** Default value for the field (must match one of the option values) */
  default?: string;
};

/**
 * Boolean checkbox field configuration
 *
 * @example
 * ```ts
 * const field: CheckboxField = {
 *   id: 'agree_terms',
 *   type: 'checkbox',
 *   label: 'I agree to the terms',
 *   description: 'You must agree to continue',
 *   required: true
 * };
 * ```
 */
export type CheckboxField = {
  /** Unique identifier for the field */
  id: string;
  /** Display label shown next to the checkbox */
  label: string;
  /** Help text describing the field's purpose */
  description: string;
  /** Placeholder (not typically used for checkboxes) */
  placeholder?: string;
  /** Whether the checkbox must be checked before submission */
  required?: boolean;
  /** Field type discriminator */
  type: 'checkbox';
  /** Condition for when this field should be visible */
  when?: FieldCondition;
  /** Default value for the field */
  default?: boolean;
};

export type FormField =
  | InputField
  | TextareaField
  | SelectField
  | CheckboxField;

// =============================================================================
// Layout Types
// =============================================================================

/**
 * Grid layout for arranging multiple fields in columns
 *
 * Allows organizing form fields horizontally within a step.
 * Supports nested fields including other grids (recursive).
 *
 * @example
 * ```ts
 * const layout: GridLayout = {
 *   type: 'grid',
 *   columns: 2,
 *   fields: [
 *     { id: 'first_name', type: 'input', ... },
 *     { id: 'last_name', type: 'input', ... }
 *   ]
 * };
 * ```
 */
export type GridLayout = {
  /** Layout type discriminator */
  type: 'grid';
  /** Number of columns (fields per row) */
  columns: number;
  /** Fields to arrange in the grid (can include nested layouts) */
  fields: Field[];
};

/**
 * Group layout for visually grouping multiple fields together
 *
 * Used for visual grouping only. Does not create nested structure in formData.
 * To repeat a group of fields, wrap this in a RepeatableLayout.
 *
 * @example
 * ```ts
 * // Standalone group (visual grouping only)
 * const layout: GroupLayout = {
 *   type: 'group',
 *   fields: [
 *     { id: 'firstName', type: 'input', label: 'First Name', description: '' },
 *     { id: 'lastName', type: 'input', label: 'Last Name', description: '' }
 *   ]
 * };
 * // formData: { firstName: '...', lastName: '...' }
 * ```
 */
export type GroupLayout = {
  /** Layout type discriminator */
  type: 'group';
  /** Fields contained in the group */
  fields: Field[];
};

/**
 * Repeatable layout for fields that can be repeated
 *
 * Allows users to add multiple instances of a field or group.
 * The id is used as the key in form data, with values stored as an array.
 *
 * @example
 * ```ts
 * // Single field repeatable
 * const tagsLayout: RepeatableLayout = {
 *   type: 'repeatable',
 *   id: 'tags',
 *   label: 'Tags',
 *   minCount: 1,
 *   field: { id: 'name', type: 'input', label: 'Tag', description: '' }
 * };
 * // formData: { tags: [{ name: 'tag1' }, { name: 'tag2' }] }
 *
 * // Group repeatable (multiple fields)
 * const librariesLayout: RepeatableLayout = {
 *   type: 'repeatable',
 *   id: 'libraries',
 *   label: 'Libraries',
 *   minCount: 1,
 *   field: {
 *     type: 'group',
 *     fields: [
 *       { id: 'name', type: 'input', label: 'Name', description: '' },
 *       { id: 'url', type: 'input', label: 'URL', description: '' }
 *     ]
 *   }
 * };
 * // formData: { libraries: [{ name: 'React', url: '...' }, ...] }
 * ```
 */
export type RepeatableLayout = {
  /** Layout type discriminator */
  type: 'repeatable';
  /** Unique identifier (used as key in form data) */
  id: string;
  /** Display label shown above the repeatable field */
  label: string;
  /** Minimum number of entries required (default: 0) */
  minCount?: number;
  /** Default number of entries to create initially (defaults to minCount if not specified) */
  defaultCount?: number;
  /** The field or group to repeat */
  field: FormField | GroupLayout;
};

export type LayoutField = GridLayout | RepeatableLayout | GroupLayout;
export type Field = FormField | LayoutField;

// =============================================================================
// Step Types
// =============================================================================

/**
 * Step definition for multi-step form wizard
 *
 * Each step represents one page in the form wizard, containing
 * fields for the user to fill out.
 *
 * @example
 * ```ts
 * const step: Step = {
 *   slug: 'basic-info',
 *   title: 'Basic Information',
 *   description: 'Enter the basic details of your project',
 *   name: 'basic',
 *   fields: [
 *     { id: 'title', type: 'input', label: 'Title', description: '...' },
 *     { id: 'priority', type: 'select', label: 'Priority', description: '...', options: [...] }
 *   ]
 * };
 *
 * // For repeatable fields (single field):
 * const stepWithRepeatable: Step = {
 *   slug: 'tags',
 *   title: 'Tags',
 *   description: 'Add tags',
 *   name: 'tags',
 *   fields: [
 *     {
 *       type: 'repeatable',
 *       id: 'items',
 *       minCount: 1,
 *       field: { id: 'name', type: 'input', label: 'Tag', description: '' }
 *     }
 *   ]
 * };
 * // formData: { tags: { items: [{ name: 'tag1' }, { name: 'tag2' }] } }
 *
 * // For repeatable group (multiple fields):
 * const stepWithRepeatableGroup: Step = {
 *   slug: 'libraries',
 *   title: 'Libraries',
 *   description: 'Add libraries',
 *   name: 'libraries',
 *   fields: [
 *     {
 *       type: 'repeatable',
 *       id: 'items',
 *       minCount: 1,
 *       field: {
 *         type: 'group',
 *         fields: [
 *           { id: 'name', type: 'input', label: 'Name', description: '...' },
 *           { id: 'url', type: 'input', label: 'URL', description: '...' }
 *         ]
 *       }
 *     }
 *   ]
 * };
 * // formData: { libraries: { items: [{ name: '...', url: '...' }, ...] } }
 * ```
 */
export type Step = {
  /** URL-friendly identifier (used in routing) */
  slug: string;
  /** Display title shown in step header */
  title: string;
  /** Description text shown below the title */
  description: string;
  /** Step name (used as key in form data output) */
  name: string;
  /** Fields contained in this step */
  fields: Field[];
};

// =============================================================================
// AI Settings Types (Claude Agent SDK)
// =============================================================================

/**
 * MCP (Model Context Protocol) Server Configuration
 *
 * Defines how to connect to an MCP server. Supports three transport types:
 * - stdio: Local process started with a command
 * - sse: Remote server via Server-Sent Events
 * - http: Remote server via HTTP
 *
 * Re-exported from `@anthropic-ai/claude-agent-sdk` for convenience.
 * Note: The SDK also supports an 'sdk' type for in-memory servers,
 * but that requires runtime instances and is not serializable to config files.
 *
 * @see https://docs.anthropic.com/en/docs/claude-code/mcp
 *
 * @example
 * ```ts
 * // stdio server (local process)
 * const stdioConfig: McpServerConfig = {
 *   command: 'npx',
 *   args: ['@modelcontextprotocol/server-filesystem'],
 *   env: { ALLOWED_PATHS: '/home/user/projects' }
 * };
 *
 * // SSE server (remote)
 * const sseConfig: McpServerConfig = {
 *   type: 'sse',
 *   url: 'https://api.example.com/mcp/sse',
 *   headers: { 'Authorization': 'Bearer token' }
 * };
 *
 * // HTTP server (remote)
 * const httpConfig: McpServerConfig = {
 *   type: 'http',
 *   url: 'https://api.example.com/mcp',
 *   headers: { 'Authorization': 'Bearer token' }
 * };
 * ```
 */
export type McpServerConfig =
  | McpStdioServerConfig
  | McpSSEServerConfig
  | McpHttpServerConfig;

// Re-export SDK types for convenience
export type {
  PermissionMode,
  McpStdioServerConfig,
  McpSSEServerConfig,
  McpHttpServerConfig,
};

/**
 * AI Settings for Claude Agent SDK query options
 *
 * Derived from the SDK's `Options` type using `Pick` to select only the
 * fields relevant for config file serialization. This ensures type safety
 * and automatic updates when the SDK changes.
 *
 * This is a simplified subset focused on model selection, tools, MCP, and permissions.
 * Other SDK options (session, environment, output format, etc.) are managed by the server.
 *
 * @see https://docs.anthropic.com/en/docs/claude-code/sdk
 * @see https://www.npmjs.com/package/@anthropic-ai/claude-agent-sdk
 *
 * @example
 * ```ts
 * const aiSettings: AiSettings = {
 *   model: 'claude-sonnet-4-5-20250929',
 *   maxTurns: 10,
 *   maxBudgetUsd: 1.0,
 *   permissionMode: 'bypassPermissions',
 *   allowDangerouslySkipPermissions: true,
 *   mcpServers: {
 *     filesystem: {
 *       command: 'npx',
 *       args: ['@modelcontextprotocol/server-filesystem']
 *     }
 *   }
 * };
 * ```
 *
 * **Available Tools:**
 *
 * File Operations:
 * - `Read` - Read file contents
 * - `Write` - Write/create files
 * - `Edit` - Edit existing files
 * - `Glob` - Find files by pattern
 * - `Grep` - Search file contents
 * - `NotebookEdit` - Edit Jupyter notebooks
 *
 * Command Execution:
 * - `Bash` - Execute shell commands
 *
 * Web:
 * - `WebSearch` - Search the web
 * - `WebFetch` - Fetch content from URLs
 *
 * Agent & Task:
 * - `Task` - Launch sub-agents
 * - `TodoWrite` - Manage task lists
 *
 * Code Intelligence:
 * - `LSP` - Language Server Protocol operations
 *
 * MCP Tools:
 * - Format: `mcp__<server>__<tool>` (e.g., `mcp__filesystem__read_file`)
 */
export type AiSettings = Omit<
  Pick<
    Options,
    | 'model'
    | 'fallbackModel'
    | 'maxThinkingTokens'
    | 'maxTurns'
    | 'maxBudgetUsd'
    | 'allowedTools'
    | 'disallowedTools'
    | 'tools'
    | 'permissionMode'
    | 'allowDangerouslySkipPermissions'
    | 'mcpServers'
    | 'strictMcpConfig'
  >,
  'mcpServers'
> & {
  /**
   * MCP server configurations keyed by server name
   *
   * Each server provides additional tools and capabilities to the model.
   * Only serializable transport types (stdio, sse, http) are supported in config files.
   *
   * @see https://docs.anthropic.com/en/docs/claude-code/mcp
   */
  mcpServers?: Record<string, McpServerConfig>;
};

// =============================================================================
// Scenario Types
// =============================================================================

/**
 * Base scenario definition (serializable to JSON)
 *
 * Contains the core fields that can be validated by Valibot schema.
 * Extended by `Scenario` with function-based fields.
 */
export type ScenarioBase = {
  /** Unique identifier for the scenario (used in URLs) */
  id: string;
  /** Display name shown in the scenario list */
  name: string;
  /** Steps that make up the scenario's form wizard */
  steps: Step[];
  /**
   * AI settings for Claude Agent SDK
   * @see AiSettings
   */
  aiSettings?: AiSettings;
};

/**
 * Step metadata in AiContext
 */
export type AiContextStepMeta = {
  title: string;
  description: string;
};

/**
 * Field metadata in AiContext
 */
export type AiContextFieldMeta = {
  label: string;
  description: string;
};

/**
 * AiContext for a repeatable field (nested structure)
 */
export type AiContextRepeatable = {
  [fieldId: string]: AiContextFieldMeta | AiContextRepeatable;
};

/**
 * AiContext for a step
 */
export type AiContextStep = {
  _step: AiContextStepMeta;
  [fieldId: string]:
    | AiContextStepMeta
    | AiContextFieldMeta
    | AiContextRepeatable;
};

/**
 * AiContext type - metadata for form fields to help AI understand the data
 *
 * This is included in formData as `ai_context` property.
 * Contains labels and descriptions for each field, organized by step name.
 *
 * @example
 * ```ts
 * {
 *   overview: {
 *     _step: { title: "Overview", description: "Basic information" },
 *     title: { label: "Title", description: "Feature title" },
 *     priority: { label: "Priority", description: "Priority level" }
 *   },
 *   modules: {
 *     _step: { title: "Modules", description: "Module structure" },
 *     items: {
 *       name: { label: "Module Name", description: "Name of the module" },
 *       features: {
 *         feature_name: { label: "Feature Name", description: "Name of feature" }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export type AiContext = {
  [stepName: string]: AiContextStep;
};

/**
 * Lifecycle hooks for scenario events
 *
 * Allows custom behavior during preview and save operations.
 *
 * @typeParam TFormData - Type of the raw form data from UI
 */
export type ScenarioHooks<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> = {
  /**
   * Called after preview is generated but before displaying to user
   *
   * Use for logging, analytics, or transforming the preview content.
   *
   * @param params.formData - The raw form data from the UI
   * @param params.aiContext - Field metadata (labels, descriptions) for AI
   * @param params.content - The generated markdown content
   */
  onPreview?: (params: {
    formData: TFormData;
    aiContext: AiContext;
    content: string;
  }) => Promise<void>;

  /**
   * Called after document is saved to disk
   *
   * Use for post-processing, notifications, or integrations.
   *
   * @param params.content - The saved markdown content
   * @param params.filename - The filename that was used
   * @param params.outputPath - Full path to the saved file
   * @param params.formData - The raw form data from the UI
   * @param params.aiContext - Field metadata (labels, descriptions) for AI
   */
  onSave?: (params: {
    content: string;
    filename: string;
    outputPath: string;
    formData: TFormData;
    aiContext: AiContext;
  }) => Promise<void>;
};

/**
 * Filename function type for custom document naming
 *
 * Can be a static string or a function for dynamic naming.
 * Default format: `design-doc-{scenarioId}-{timestamp}.md`
 *
 * @typeParam TFormData - Type of the raw form data from UI
 *
 * @example
 * ```ts
 * // Static filename
 * filename: 'design-doc.md'
 *
 * // Dynamic filename based on form data
 * filename: ({ formData, timestamp }) =>
 *   `${formData.project_name}-${timestamp}.md`
 * ```
 */
export type ScenarioFilename<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> =
  | string
  | ((params: {
      scenarioId: string;
      timestamp: string;
      content: string;
      formData: TFormData;
      aiContext: AiContext;
    }) => string);

/**
 * Prompt function type
 *
 * A function that generates the prompt string.
 * Use `formData` for raw values and `aiContext` for field metadata.
 *
 * @typeParam TFormData - Type of the raw form data from UI
 *
 * @example
 * ```ts
 * prompt: ({ formData, aiContext }) =>
 *   `Create a document based on:\n${JSON.stringify({ formData, aiContext }, null, 2)}`
 * ```
 */
export type ScenarioPrompt<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> = (params: { formData: TFormData; aiContext: AiContext }) => string;

/**
 * Complete scenario definition
 *
 * Extends ScenarioBase with function-based fields that cannot be
 * serialized to JSON (prompt and filename can be functions, hooks).
 *
 * @typeParam TFormData - Type of the raw form data from UI (inferred from steps)
 *
 * @example
 * ```ts
 * const scenario: Scenario = {
 *   id: 'design-doc',
 *   name: 'Design Document',
 *   steps: [...],
 *   prompt: ({ formData, aiContext }) =>
 *     `Generate a design doc based on:\n${JSON.stringify({ formData, aiContext }, null, 2)}`,
 *   outputDir: './docs/designs',
 *   filename: ({ formData, timestamp }) =>
 *     `${formData.overview?.title ?? 'untitled'}-${timestamp}.md`,
 *   aiSettings: {
 *     model: 'claude-sonnet-4-5'
 *   },
 *   hooks: {
 *     onSave: async ({ filename }) => {
 *       console.log(`Saved: ${filename}`);
 *     }
 *   }
 * };
 * ```
 */
export type Scenario<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> = ScenarioBase & {
  /** Prompt template function */
  prompt: ScenarioPrompt<TFormData>;
  /** Directory where generated documents are saved */
  outputDir?: string;
  /** Custom filename for saved documents */
  filename?: ScenarioFilename<TFormData>;
  /** Lifecycle hooks for custom behavior */
  hooks?: ScenarioHooks<TFormData>;
};

// =============================================================================
// Type Inference Utilities
// =============================================================================

/**
 * Helper type to get the value type for a form field
 */
type FieldValueType<F> = F extends { type: 'checkbox' }
  ? boolean
  : F extends { type: 'select'; options: readonly { value: infer V }[] }
    ? V
    : string;

/**
 * Helper type to create an object type from FormField array (not supporting nested GridLayout)
 */
type FormFieldsToObject<Fields extends readonly FormField[]> = {
  [F in Fields[number] as F['id']]: FieldValueType<F>;
};

/**
 * Helper type to merge union to intersection
 */
type UnionToIntersection<U> = (
  U extends unknown
    ? (k: U) => void
    : never
) extends (k: infer I) => void
  ? I
  : never;

/**
 * Infer the formData type from a Scenario's steps
 *
 * Use this utility type to get type-safe access to raw form data
 * in hooks, prompts, and filename.
 *
 * **Note**: This utility works with FormField arrays only (not nested layouts).
 * Define fields with `as const` for literal type inference.
 *
 * @example
 * ```ts
 * const scenario = {
 *   id: 'design-doc',
 *   name: 'Design Document',
 *   steps: [
 *     {
 *       slug: 'overview',
 *       title: 'Overview',
 *       description: 'Project overview',
 *       name: 'overview',
 *       fields: [
 *         { id: 'title', type: 'input', label: 'Title', description: '' },
 *         { id: 'description', type: 'textarea', label: 'Description', description: '' },
 *       ] as const,
 *     },
 *   ],
 *   prompt: ({ formData, aiContext }) => '...',
 * } as const satisfies Scenario;
 *
 * type MyFormData = InferFormData<typeof scenario>;
 * // Result:
 * // {
 * //   overview: { title: string; description: string };
 * // }
 * ```
 */
export type InferFormData<T extends Scenario> =
  T['steps'] extends readonly (infer S)[]
    ? S extends { name: infer N extends string; fields: readonly FormField[] }
      ? { [K in N]: FormFieldsToObject<S['fields']> }
      : never
    : never;

/**
 * Infer the merged formData type from a Scenario
 *
 * This flattens all steps into a single object type.
 *
 * @example
 * ```ts
 * type MyFormData = InferFormDataMerged<typeof scenario>;
 * // {
 * //   overview: { title: string; description: string };
 * // }
 * ```
 */
export type InferFormDataMerged<T extends Scenario> = UnionToIntersection<
  InferFormData<T>
>;

/**
 * Helper type to extract FormField from Field (handling grid, repeatable, group layouts)
 */
type ExtractFormFields<F> = F extends FormField
  ? F
  : F extends { type: 'grid'; fields: readonly (infer GF)[] }
    ? GF extends FormField
      ? GF
      : never
    : F extends { type: 'repeatable'; field: infer RF }
      ? RF extends FormField
        ? RF
        : never
      : F extends { type: 'group'; fields: readonly (infer GF)[] }
        ? GF extends FormField
          ? GF
          : never
        : never;

/**
 * Helper type to create an object type from Field array (supporting layouts)
 */
type FieldsToObject<Fields extends readonly Field[]> = {
  [F in ExtractFormFields<Fields[number]> as F extends {
    id: infer ID extends string;
  }
    ? ID
    : never]?: F extends FormField ? FieldValueType<F> : unknown;
};

/**
 * Infer the formData type directly from a steps array
 *
 * Use this utility type when defining scenarios with `defineScenario`
 * for type-safe access to formData in hooks, prompts, and filename.
 *
 * **Note**: For best results, define steps with `as const satisfies Step[]`
 * to preserve literal types for step names and field IDs.
 *
 * @example
 * ```ts
 * const steps = [
 *   {
 *     slug: 'basic-info',
 *     title: 'Basic Info',
 *     description: 'Enter basic information',
 *     name: 'basicInfo',
 *     fields: [
 *       { id: 'title', type: 'input', label: 'Title', description: '' },
 *     ],
 *   },
 *   {
 *     slug: 'libraries',
 *     title: 'Libraries',
 *     description: 'Add libraries',
 *     name: 'libraries',
 *     fields: [
 *       {
 *         type: 'group',
 *         id: 'items',
 *         minCount: 1,
 *         fields: [
 *           { id: 'name', type: 'input', label: 'Name', description: '' },
 *         ],
 *       },
 *     ],
 *   },
 * ] as const satisfies Step[];
 *
 * type FormData = InferFormDataFromSteps<typeof steps>;
 * // {
 * //   basicInfo?: { title?: string };
 * //   libraries?: { items?: Array<{ name?: string }> };
 * // }
 * ```
 */
export type InferFormDataFromSteps<TSteps extends readonly Step[]> =
  UnionToIntersection<
    TSteps[number] extends infer S
      ? S extends { name: infer N extends string; fields: readonly Field[] }
        ? { [K in N]?: FieldsToObject<S['fields']> }
        : never
      : never
  > &
    Record<string, unknown>;

// =============================================================================
// AI Mode Types
// =============================================================================

/**
 * AI mode for document generation
 *
 * - `'stream'` - AI enabled with SSE streaming (default)
 * - `'sync'` - AI enabled, returns full response at once
 * - `'mock'` - AI disabled, returns fixed mock response
 *
 * @example
 * ```ts
 * // Streaming mode (default)
 * ai: 'stream'
 *
 * // Non-streaming mode
 * ai: 'sync'
 *
 * // Mock mode for development/testing
 * ai: 'mock'
 * ```
 */
export type AiMode = 'stream' | 'sync' | 'mock';

/**
 * Default mock response when AI is disabled
 */
export const DEFAULT_MOCK_RESPONSE =
  '# Mock Document\n\nAI is disabled. This is a mock response.';

// =============================================================================
// Configuration Types
// =============================================================================

/**
 * Permission settings for the application
 */
export type Permissions = {
  /** Whether users can save generated documents to disk */
  allowSave: boolean;
};

/**
 * Root configuration object
 *
 * This is the type for the config file exported from `config.ts`.
 *
 * @example
 * ```ts
 * // config.ts
 * import type { Config } from '@anthropic-ai/claude-agent-sdk';
 *
 * export default {
 *   scenarios: [
 *     { id: 'design-doc', name: 'Design Doc', ... }
 *   ],
 *   permissions: {
 *     allowSave: true
 *   }
 * } satisfies Config;
 * ```
 */
export type Config = {
  /** Available scenarios (each represents a document type) */
  scenarios: Scenario[];
  /** Global permission settings */
  permissions: Permissions;
  /** When true, runs in hosted mode where saving is disabled regardless of permissions.allowSave */
  hosted?: boolean;
  /**
   * AI mode for document generation
   * @default 'stream'
   */
  ai?: AiMode;
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Helper function to define a scenario with type-safe formData
 *
 * This function uses TypeScript's const type parameters to infer
 * literal types from the steps array, enabling type-safe access
 * to formData in hooks, prompts, and filename.
 *
 * **Usage**: Define your steps with `as const satisfies Step[]` for best results.
 *
 * @example
 * ```ts
 * import { defineScenario, type Step, type Config } from 'spec-snake';
 *
 * const steps = [
 *   {
 *     slug: 'basic-info',
 *     title: 'Basic Info',
 *     description: 'Enter basic information',
 *     name: 'basicInfo',
 *     fields: [
 *       { id: 'projectName', type: 'input', label: 'Project Name', description: '' },
 *       { id: 'overview', type: 'textarea', label: 'Overview', description: '' },
 *     ],
 *   },
 *   {
 *     slug: 'features',
 *     title: 'Features',
 *     description: 'List features',
 *     name: 'features',
 *     fields: [
 *       {
 *         type: 'repeatable',
 *         id: 'items',
 *         minCount: 1,
 *         field: {
 *           type: 'group',
 *           fields: [
 *             { id: 'name', type: 'input', label: 'Feature Name', description: '' },
 *           ],
 *         },
 *       },
 *     ],
 *   },
 * ] as const satisfies Step[];
 *
 * const scenario = defineScenario({
 *   id: 'my-scenario',
 *   name: 'My Scenario',
 *   steps,
 *   prompt: ({ formData, aiContext }) =>
 *     `Generate document based on:\n${JSON.stringify({ formData, aiContext }, null, 2)}`,
 *   outputDir: 'docs',
 *   filename: ({ formData }) => {
 *     // formData is now type-safe!
 *     // formData.basicInfo?.projectName is typed as string | undefined
 *     return `${formData.basicInfo?.projectName ?? 'untitled'}.md`;
 *   },
 * });
 *
 * const config: Config = {
 *   scenarios: [scenario],
 *   permissions: { allowSave: true },
 * };
 * ```
 */
export function defineScenario<const TSteps extends readonly Step[]>(
  scenario: Omit<ScenarioBase, 'steps' | 'prompt'> & {
    steps: TSteps;
    prompt: ScenarioPrompt<InferFormDataFromSteps<TSteps>>;
    outputDir?: string;
    filename?: ScenarioFilename<InferFormDataFromSteps<TSteps>>;
    hooks?: ScenarioHooks<InferFormDataFromSteps<TSteps>>;
  },
): Scenario {
  return scenario as unknown as Scenario;
}

/**
 * Helper function to define a config object
 *
 * This is a simple identity function that provides better type inference
 * and editor support when defining config files.
 *
 * @example
 * ```ts
 * import { defineConfig, defineScenario } from 'spec-snake';
 *
 * export default defineConfig({
 *   scenarios: [
 *     defineScenario({ ... }),
 *   ],
 *   permissions: {
 *     allowSave: true,
 *   },
 * });
 * ```
 */
export function defineConfig(config: Config): Config {
  return config;
}
