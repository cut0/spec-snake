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
 * Allows organizing form fields horizontally within a section.
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

export type LayoutField = GridLayout;
export type Field = FormField | LayoutField;

// =============================================================================
// Section Types
// =============================================================================

/**
 * Single-instance section containing one set of fields
 *
 * Used when the user fills out the fields exactly once.
 *
 * @example
 * ```ts
 * const section: SingleSection = {
 *   type: 'single',
 *   name: 'project_info',
 *   fields: [...]
 * };
 * ```
 */
export type SingleSection = {
  /** Section type discriminator */
  type: 'single';
  /** Section name (used as key in form data output) */
  name: string;
  /** Fields contained in this section */
  fields: Field[];
};

/**
 * Array section allowing multiple instances of the same fields
 *
 * Used when the user can add multiple entries (e.g., team members, features).
 * Each entry contains the same field structure.
 *
 * @example
 * ```ts
 * const section: ArraySection = {
 *   type: 'array',
 *   name: 'team_members',
 *   fields: [
 *     { id: 'name', type: 'input', ... },
 *     { id: 'role', type: 'select', ... }
 *   ],
 *   minFieldCount: 1
 * };
 * ```
 */
export type ArraySection = {
  /** Section type discriminator */
  type: 'array';
  /** Section name (used as key in form data output) */
  name: string;
  /** Fields template for each array entry */
  fields: Field[];
  /** Minimum number of entries required (default: 0) */
  minFieldCount?: number;
};

export type Section = SingleSection | ArraySection;

// =============================================================================
// Step Types
// =============================================================================

/**
 * Step definition for multi-step form wizard
 *
 * Each step represents one page in the form wizard, containing
 * a section with fields for the user to fill out.
 *
 * @example
 * ```ts
 * const step: Step = {
 *   slug: 'basic-info',
 *   title: 'Basic Information',
 *   description: 'Enter the basic details of your project',
 *   section: {
 *     type: 'single',
 *     name: 'basic',
 *     fields: [...]
 *   }
 * };
 * ```
 */
export type Step = {
  /** URL-friendly identifier (used in routing) */
  slug: string;
  /** Display title shown in step header */
  title: string;
  /** Description text shown below the title */
  description: string;
  /** Section containing the step's fields */
  section: Section;
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
 * PromptContext type (transformed form data sent to Claude)
 *
 * This is the structure of `promptContext` passed to hooks, prompts, and overrides.
 */
export type PromptContext = {
  steps: Array<{
    title: string;
    description: string;
    fields:
      | Array<{ label: string; description: string; value: unknown }>
      | Array<Array<{ label: string; description: string; value: unknown }>>;
  }>;
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
   * @param params.promptContext - The transformed data sent to Claude
   * @param params.content - The generated markdown content
   */
  onPreview?: (params: {
    formData: TFormData;
    promptContext: PromptContext;
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
   * @param params.promptContext - The transformed data sent to Claude
   */
  onSave?: (params: {
    content: string;
    filename: string;
    outputPath: string;
    formData: TFormData;
    promptContext: PromptContext;
  }) => Promise<void>;
};

/**
 * Override options for scenario behavior
 *
 * @typeParam TFormData - Type of the raw form data from UI
 */
export type ScenarioOverrides<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> = {
  /**
   * Custom filename for saved documents
   *
   * Can be a static string or a function for dynamic naming.
   * Default format: `{scenarioId}-{timestamp}.md`
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
  filename?:
    | string
    | ((params: {
        scenarioId: string;
        timestamp: string;
        content: string;
        formData: TFormData;
        promptContext: PromptContext;
      }) => string);
};

/**
 * Prompt function type
 *
 * A function that generates the prompt string.
 * Use `promptContext` parameter directly to include form data in the prompt.
 *
 * @typeParam TFormData - Type of the raw form data from UI
 *
 * @example
 * ```ts
 * prompt: ({ formData, promptContext }) =>
 *   `Create a ${formData.doc_type} document based on:\n${JSON.stringify(promptContext, null, 2)}`
 * ```
 */
export type ScenarioPrompt<
  TFormData extends Record<string, unknown> = Record<string, unknown>,
> = (params: { formData: TFormData; promptContext: PromptContext }) => string;

/**
 * Complete scenario definition
 *
 * Extends ScenarioBase with function-based fields that cannot be
 * serialized to JSON (prompt can be a function, hooks, overrides).
 *
 * @typeParam TFormData - Type of the raw form data from UI (inferred from steps)
 *
 * @example
 * ```ts
 * const scenario: Scenario = {
 *   id: 'design-doc',
 *   name: 'Design Document',
 *   steps: [...],
 *   prompt: ({ promptContext }) =>
 *     `Generate a design doc based on:\n${JSON.stringify(promptContext, null, 2)}`,
 *   outputDir: './docs/designs',
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
  /** Lifecycle hooks for custom behavior */
  hooks?: ScenarioHooks<TFormData>;
  /** Override default behaviors */
  overrides?: ScenarioOverrides<TFormData>;
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
 * in hooks, prompts, and overrides.
 *
 * **Note**: This utility works with FormField arrays only (not GridLayout).
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
 *       section: {
 *         type: 'single',
 *         name: 'overview',
 *         fields: [
 *           { id: 'title', type: 'input', label: 'Title', description: '' },
 *           { id: 'description', type: 'textarea', label: 'Description', description: '' },
 *         ] as const,
 *       },
 *     },
 *     {
 *       slug: 'requirements',
 *       title: 'Requirements',
 *       description: 'List requirements',
 *       section: {
 *         type: 'array',
 *         name: 'requirements',
 *         fields: [
 *           { id: 'name', type: 'input', label: 'Name', description: '' },
 *         ] as const,
 *       },
 *     },
 *   ],
 *   prompt: '...',
 * } as const satisfies Scenario;
 *
 * type MyFormData = InferFormData<typeof scenario>;
 * // Result:
 * // {
 * //   overview: { title: string; description: string };
 * //   requirements: Array<{ name: string }>;
 * // }
 * ```
 */
export type InferFormData<T extends Scenario> =
  T['steps'] extends readonly (infer S)[]
    ? S extends { section: infer Sec }
      ? Sec extends {
          type: 'single';
          name: infer N;
          fields: readonly FormField[];
        }
        ? N extends string
          ? { [K in N]: FormFieldsToObject<Sec['fields']> }
          : never
        : Sec extends {
              type: 'array';
              name: infer N;
              fields: readonly FormField[];
            }
          ? N extends string
            ? { [K in N]: Array<FormFieldsToObject<Sec['fields']>> }
            : never
          : never
      : never
    : never;

/**
 * Infer the merged formData type from a Scenario
 *
 * This flattens all steps' sections into a single object type.
 *
 * @example
 * ```ts
 * type MyFormData = InferFormDataMerged<typeof scenario>;
 * // {
 * //   overview: { title: string; description: string };
 * //   requirements: Array<{ name: string }>;
 * // }
 * ```
 */
export type InferFormDataMerged<T extends Scenario> = UnionToIntersection<
  InferFormData<T>
>;

/**
 * Helper type to extract FormField from Field (handling one level of GridLayout)
 */
type ExtractFormFields<F> = F extends FormField
  ? F
  : F extends { type: 'grid'; fields: readonly (infer GF)[] }
    ? GF extends FormField
      ? GF
      : never
    : never;

/**
 * Helper type to create an object type from Field array (supporting GridLayout)
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
 * for type-safe access to formData in hooks, prompts, and overrides.
 *
 * **Note**: For best results, define steps with `as const satisfies Step[]`
 * to preserve literal types for section names and field IDs.
 *
 * @example
 * ```ts
 * const steps = [
 *   {
 *     slug: 'basic-info',
 *     title: 'Basic Info',
 *     description: 'Enter basic information',
 *     section: {
 *       type: 'single',
 *       name: 'basicInfo',
 *       fields: [
 *         { id: 'title', type: 'input', label: 'Title', description: '' },
 *       ],
 *     },
 *   },
 *   {
 *     slug: 'items',
 *     title: 'Items',
 *     description: 'Add items',
 *     section: {
 *       type: 'array',
 *       name: 'items',
 *       fields: [
 *         { id: 'name', type: 'input', label: 'Name', description: '' },
 *       ],
 *     },
 *   },
 * ] as const satisfies Step[];
 *
 * type FormData = InferFormDataFromSteps<typeof steps>;
 * // {
 * //   basicInfo?: { title?: string };
 * //   items?: Array<{ name?: string }>;
 * // }
 * ```
 */
export type InferFormDataFromSteps<TSteps extends readonly Step[]> =
  UnionToIntersection<
    TSteps[number] extends infer S
      ? S extends { section: infer Sec }
        ? Sec extends {
            type: 'single';
            name: infer N extends string;
            fields: readonly Field[];
          }
          ? { [K in N]?: FieldsToObject<Sec['fields']> }
          : Sec extends {
                type: 'array';
                name: infer N extends string;
                fields: readonly Field[];
              }
            ? { [K in N]?: Array<FieldsToObject<Sec['fields']>> }
            : never
        : never
      : never
  > &
    Record<string, unknown>;

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
};

// =============================================================================
// Helper Functions
// =============================================================================

/**
 * Helper function to define a scenario with type-safe formData
 *
 * This function uses TypeScript's const type parameters to infer
 * literal types from the steps array, enabling type-safe access
 * to formData in hooks, prompts, and overrides.
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
 *     section: {
 *       type: 'single',
 *       name: 'basicInfo',
 *       fields: [
 *         { id: 'projectName', type: 'input', label: 'Project Name', description: '' },
 *         { id: 'overview', type: 'textarea', label: 'Overview', description: '' },
 *       ],
 *     },
 *   },
 *   {
 *     slug: 'features',
 *     title: 'Features',
 *     description: 'List features',
 *     section: {
 *       type: 'array',
 *       name: 'features',
 *       fields: [
 *         { id: 'name', type: 'input', label: 'Feature Name', description: '' },
 *       ],
 *     },
 *   },
 * ] as const satisfies Step[];
 *
 * const scenario = defineScenario({
 *   id: 'my-scenario',
 *   name: 'My Scenario',
 *   steps,
 *   prompt: '...',
 *   outputDir: 'docs',
 *   overrides: {
 *     filename: ({ formData }) => {
 *       // formData is now type-safe!
 *       // formData.basicInfo?.projectName is typed as string | undefined
 *       return `${formData.basicInfo?.projectName ?? 'untitled'}.md`;
 *     },
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
    hooks?: ScenarioHooks<InferFormDataFromSteps<TSteps>>;
    overrides?: ScenarioOverrides<InferFormDataFromSteps<TSteps>>;
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
