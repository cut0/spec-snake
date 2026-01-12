import {
  type Field,
  type FieldConditionObject,
  type FormField,
  type Step,
  isLayoutField,
} from '../../../definitions';

/**
 * Evaluate a field condition against the current form data
 */
export const evaluateCondition = (
  condition: FieldConditionObject,
  formData: Record<string, unknown>,
): boolean => {
  const fieldValue = formData[condition.field];

  if ('is' in condition) {
    const expected = condition.is;
    if (Array.isArray(expected)) {
      return expected.includes(fieldValue as string | boolean);
    }
    return fieldValue === expected;
  }

  if ('isNot' in condition) {
    const expected = condition.isNot;
    if (Array.isArray(expected)) {
      return !expected.includes(fieldValue as string | boolean);
    }
    return fieldValue !== expected;
  }

  if ('isEmpty' in condition) {
    return fieldValue == null || fieldValue === '' || fieldValue === false;
  }

  if ('isNotEmpty' in condition) {
    return fieldValue != null && fieldValue !== '' && fieldValue !== false;
  }

  return true;
};

/**
 * Check if a field is visible based on its `when` condition
 */
export const isFieldVisible = (
  field: FormField,
  formData: Record<string, unknown>,
): boolean => {
  const condition = field.when;
  if (condition == null) return true;

  if (typeof condition === 'function') {
    return condition(formData);
  }

  return evaluateCondition(condition, formData);
};

/**
 * Get fields from a layout field (handles grid, repeatable, group)
 */
const getLayoutFields = (field: Field): Field[] => {
  if (field.type === 'grid' || field.type === 'group') {
    return field.fields;
  }
  if (field.type === 'repeatable') {
    return [field.field];
  }
  return [];
};

/**
 * Extract required field IDs, excluding hidden fields
 * Note: Repeatable fields are skipped here as they are validated separately by isRepeatableValid
 */
export const extractRequiredFieldIds = (
  fields: Field[],
  formData: Record<string, unknown>,
): string[] => {
  const result: string[] = [];
  for (const field of fields) {
    if (field.type === 'repeatable') {
      // Skip repeatable - validated separately by isRepeatableValid
      continue;
    }
    if (isLayoutField(field)) {
      result.push(...extractRequiredFieldIds(getLayoutFields(field), formData));
    } else if (field.required === true && isFieldVisible(field, formData)) {
      result.push(field.id);
    }
  }
  return result;
};

/**
 * Get all visible field IDs (for filtering form data)
 * Note: For repeatable fields, returns the repeatable ID itself (the array data)
 */
export const getVisibleFieldIds = (
  fields: Field[],
  formData: Record<string, unknown>,
): string[] => {
  const result: string[] = [];
  for (const field of fields) {
    if (field.type === 'repeatable') {
      // Include the repeatable ID (the array), not the inner field IDs
      result.push(field.id);
      continue;
    }
    if (isLayoutField(field)) {
      result.push(...getVisibleFieldIds(getLayoutFields(field), formData));
    } else if (isFieldVisible(field, formData)) {
      result.push(field.id);
    }
  }
  return result;
};

/**
 * Get the default value for a form field
 */
const getFieldDefaultValue = (field: FormField): unknown => {
  if (field.default != null) {
    return field.default;
  }
  return field.type === 'checkbox' ? false : '';
};

/**
 * Build default values for fields, respecting minCount/defaultCount for nested repeatables
 */
export const buildFieldDefaults = (
  fields: Field[],
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  for (const field of fields) {
    if (field.type === 'grid') {
      Object.assign(defaults, buildFieldDefaults(field.fields));
    } else if (field.type === 'group') {
      Object.assign(defaults, buildFieldDefaults(field.fields));
    } else if (field.type === 'repeatable') {
      // Use defaultCount if specified, otherwise fall back to minCount
      const count = field.defaultCount ?? field.minCount ?? 0;
      if (field.field.type === 'group') {
        const groupFields = field.field.fields;
        defaults[field.id] = Array.from({ length: count }, () =>
          buildFieldDefaults(groupFields),
        );
      } else {
        const singleField = field.field as FormField;
        defaults[field.id] = Array.from({ length: count }, () => ({
          [singleField.id]: getFieldDefaultValue(singleField),
        }));
      }
    } else if (!isLayoutField(field)) {
      defaults[field.id] = getFieldDefaultValue(field);
    }
  }
  return defaults;
};

/**
 * Build default values for all steps
 */
export const buildFormDefaultValues = (
  steps: Step[],
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  for (const step of steps) {
    defaults[step.name] = buildFieldDefaults(step.fields);
  }
  return defaults;
};
