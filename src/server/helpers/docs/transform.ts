import type {
  AiContext,
  AiContextFieldMeta,
  AiContextRepeatable,
  AiContextStep,
  Field,
  Step,
} from '../../../definitions';

/**
 * Build field metadata for aiContext from a field
 * Handles nested structures (repeatable > group > repeatable)
 */
const buildFieldMeta = (
  field: Field,
): AiContextFieldMeta | AiContextRepeatable | null => {
  switch (field.type) {
    case 'input':
    case 'textarea':
    case 'select':
    case 'checkbox':
      return {
        label: field.label,
        description: field.description,
      };

    case 'grid':
      // Grid is a visual layout, flatten its fields
      return buildFieldsMeta(field.fields);

    case 'repeatable': {
      const innerField = field.field;
      if (innerField.type === 'group') {
        // repeatable > group: build nested structure
        return buildFieldsMeta(innerField.fields);
      }
      // repeatable > single field
      const meta = buildFieldMeta(innerField);
      if (meta != null && 'label' in meta) {
        return { [innerField.id]: meta };
      }
      return meta;
    }

    case 'group':
      // Group without repeatable parent (visual grouping)
      return buildFieldsMeta(field.fields);

    default:
      return null;
  }
};

/**
 * Build field metadata object from an array of fields
 */
const buildFieldsMeta = (
  fields: readonly Field[],
): AiContextRepeatable | null => {
  const result: AiContextRepeatable = {};

  for (const field of fields) {
    // Layout fields (grid, group) don't have id, process their children
    if (field.type === 'grid') {
      const gridMeta = buildFieldsMeta(field.fields);
      if (gridMeta != null) {
        Object.assign(result, gridMeta);
      }
      continue;
    }

    if (field.type === 'group') {
      const groupMeta = buildFieldsMeta(field.fields);
      if (groupMeta != null) {
        Object.assign(result, groupMeta);
      }
      continue;
    }

    if (field.type === 'repeatable') {
      const meta = buildFieldMeta(field);
      if (meta != null) {
        result[field.id] = meta;
      }
      continue;
    }

    // Form fields have id
    const meta = buildFieldMeta(field);
    if (meta != null) {
      result[field.id] = meta;
    }
  }

  return Object.keys(result).length > 0 ? result : null;
};

/**
 * Build AiContext from steps
 *
 * Creates a metadata structure that helps AI understand form fields.
 * Contains labels and descriptions for each field, organized by step name.
 *
 * @example
 * ```ts
 * // Input: steps with nested repeatable fields
 * // Output:
 * {
 *   overview: {
 *     _step: { title: "Overview", description: "Basic info" },
 *     title: { label: "Title", description: "Feature title" }
 *   },
 *   modules: {
 *     _step: { title: "Modules", description: "Module structure" },
 *     items: {
 *       name: { label: "Module Name", description: "..." },
 *       features: {
 *         feature_name: { label: "Feature Name", description: "..." }
 *       }
 *     }
 *   }
 * }
 * ```
 */
export const buildAiContext = (steps: Step[]): AiContext => {
  const result: AiContext = {};

  for (const step of steps) {
    const stepContext: AiContextStep = {
      _step: {
        title: step.title,
        description: step.description,
      },
    };

    const fieldsMeta = buildFieldsMeta(step.fields);
    if (fieldsMeta != null) {
      Object.assign(stepContext, fieldsMeta);
    }

    result[step.name] = stepContext;
  }

  return result;
};
