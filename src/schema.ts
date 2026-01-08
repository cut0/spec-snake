import * as v from 'valibot';
import type { Field, GridLayout, LayoutField } from './types';

// =============================================================================
// Type Guards
// =============================================================================

export const isLayoutField = (field: Field): field is LayoutField => {
  return field.type === 'grid';
};

// =============================================================================
// Form Field Schemas
// =============================================================================

// =============================================================================
// Field Condition Schema
// =============================================================================

const FieldConditionObjectSchema = v.union([
  v.object({
    field: v.string(),
    is: v.union([
      v.string(),
      v.boolean(),
      v.array(v.union([v.string(), v.boolean()])),
    ]),
  }),
  v.object({
    field: v.string(),
    isNot: v.union([
      v.string(),
      v.boolean(),
      v.array(v.union([v.string(), v.boolean()])),
    ]),
  }),
  v.object({
    field: v.string(),
    isEmpty: v.literal(true),
  }),
  v.object({
    field: v.string(),
    isNotEmpty: v.literal(true),
  }),
]);

// Allow both object and function forms
const FieldConditionSchema = v.union([
  FieldConditionObjectSchema,
  v.custom<(formData: Record<string, unknown>) => boolean>(
    (value) => typeof value === 'function',
  ),
]);

const FieldBaseSchema = v.object({
  id: v.string(),
  label: v.string(),
  description: v.string(),
  placeholder: v.optional(v.string()),
  required: v.optional(v.boolean()),
  when: v.optional(FieldConditionSchema),
});

export const SelectOptionSchema = v.object({
  value: v.string(),
  label: v.string(),
});

export const InputFieldSchema = v.object({
  ...FieldBaseSchema.entries,
  type: v.literal('input'),
  inputType: v.optional(v.picklist(['text', 'date', 'url'])),
  suggestions: v.optional(v.array(v.string())),
});

export const TextareaFieldSchema = v.object({
  ...FieldBaseSchema.entries,
  type: v.literal('textarea'),
  rows: v.optional(v.number()),
});

export const SelectFieldSchema = v.object({
  ...FieldBaseSchema.entries,
  type: v.literal('select'),
  options: v.array(SelectOptionSchema),
});

export const CheckboxFieldSchema = v.object({
  ...FieldBaseSchema.entries,
  type: v.literal('checkbox'),
});

export const FormFieldSchema = v.union([
  InputFieldSchema,
  TextareaFieldSchema,
  SelectFieldSchema,
  CheckboxFieldSchema,
]);

// =============================================================================
// Layout Schemas
// =============================================================================

export const GridLayoutSchema: v.GenericSchema<GridLayout> = v.object({
  type: v.literal('grid'),
  columns: v.number(),
  fields: v.array(v.lazy(() => FieldSchema)),
});

export const FieldSchema: v.GenericSchema<Field> = v.union([
  FormFieldSchema,
  GridLayoutSchema,
]);

// =============================================================================
// Section Schemas
// =============================================================================

export const SingleSectionSchema = v.object({
  type: v.literal('single'),
  name: v.string(),
  fields: v.array(FieldSchema),
});

export const ArraySectionSchema = v.object({
  type: v.literal('array'),
  name: v.string(),
  fields: v.array(FieldSchema),
  minFieldCount: v.optional(v.number()),
});

export const SectionSchema = v.union([SingleSectionSchema, ArraySectionSchema]);

// =============================================================================
// Step Schema
// =============================================================================

export const StepSchema = v.object({
  slug: v.string(),
  title: v.string(),
  description: v.string(),
  section: SectionSchema,
});

// =============================================================================
// AI Settings Schemas (Claude Agent SDK)
// =============================================================================

export const McpServerConfigSchema = v.union([
  v.object({
    type: v.optional(v.literal('stdio')),
    command: v.string(),
    args: v.optional(v.array(v.string())),
    env: v.optional(v.record(v.string(), v.string())),
  }),
  v.object({
    type: v.literal('sse'),
    url: v.string(),
    headers: v.optional(v.record(v.string(), v.string())),
  }),
  v.object({
    type: v.literal('http'),
    url: v.string(),
    headers: v.optional(v.record(v.string(), v.string())),
  }),
]);

export const AiSettingsSchema = v.optional(
  v.object({
    model: v.optional(v.string()),
    fallbackModel: v.optional(v.string()),
    maxThinkingTokens: v.optional(v.number()),
    maxTurns: v.optional(v.number()),
    maxBudgetUsd: v.optional(v.number()),
    allowedTools: v.optional(v.array(v.string())),
    disallowedTools: v.optional(v.array(v.string())),
    tools: v.optional(
      v.union([
        v.array(v.string()),
        v.object({
          type: v.literal('preset'),
          preset: v.literal('claude_code'),
        }),
      ]),
    ),
    permissionMode: v.optional(
      v.picklist([
        'default',
        'acceptEdits',
        'bypassPermissions',
        'plan',
        'delegate',
        'dontAsk',
      ]),
    ),
    allowDangerouslySkipPermissions: v.optional(v.boolean()),
    mcpServers: v.optional(v.record(v.string(), McpServerConfigSchema)),
    strictMcpConfig: v.optional(v.boolean()),
  }),
);

// =============================================================================
// Scenario Schema
// =============================================================================

export const ScenarioBaseSchema = v.object({
  id: v.string(),
  name: v.string(),
  steps: v.array(StepSchema),
  prompt: v.unknown(),
  aiSettings: AiSettingsSchema,
});

export const ScenarioSchema = ScenarioBaseSchema;

// =============================================================================
// Configuration Schemas
// =============================================================================

export const PermissionsSchema = v.object({
  allowSave: v.boolean(),
});

export const ConfigSchema = v.object({
  scenarios: v.array(ScenarioSchema),
  permissions: PermissionsSchema,
  hosted: v.optional(v.boolean(), false),
});

// =============================================================================
// Parser Functions
// =============================================================================

export const parseConfig = (data: unknown) => {
  return v.parse(ConfigSchema, data);
};

export const safeParseConfig = (data: unknown) => {
  return v.safeParse(ConfigSchema, data);
};
