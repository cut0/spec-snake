import {
  type Field,
  type FieldConditionObject,
  type FormField,
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
 * Extract required field IDs, excluding hidden fields
 */
export const extractRequiredFieldIds = (
  fields: Field[],
  formData: Record<string, unknown>,
): string[] => {
  const result: string[] = [];
  for (const field of fields) {
    if (isLayoutField(field)) {
      result.push(...extractRequiredFieldIds(field.fields, formData));
    } else if (field.required === true && isFieldVisible(field, formData)) {
      result.push(field.id);
    }
  }
  return result;
};

/**
 * Get all visible field IDs (for filtering form data)
 */
export const getVisibleFieldIds = (
  fields: Field[],
  formData: Record<string, unknown>,
): string[] => {
  const result: string[] = [];
  for (const field of fields) {
    if (isLayoutField(field)) {
      result.push(...getVisibleFieldIds(field.fields, formData));
    } else if (isFieldVisible(field, formData)) {
      result.push(field.id);
    }
  }
  return result;
};
