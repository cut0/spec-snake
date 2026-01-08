import type { FormField, RepeatableLayout, Step } from '../../../definitions';

import { extractRequiredFieldIds, getVisibleFieldIds } from '../form/services';

/**
 * Filter form data to only include visible fields
 */
export const filterVisibleFormData = (
  step: Step,
  stepValue: unknown,
): unknown => {
  const values = stepValue as Record<string, unknown> | undefined;
  if (values == null) return undefined;

  const visibleIds = getVisibleFieldIds(step.fields, values);
  const filtered: Record<string, unknown> = {};
  for (const id of visibleIds) {
    if (id in values) {
      filtered[id] = values[id];
    }
  }
  return filtered;
};

const isFieldFilled = (value: unknown): boolean => {
  return value !== undefined && value != null && value !== '';
};

/**
 * Check if a repeatable layout has valid data (meets minCount requirement)
 */
const isRepeatableValid = (
  field: RepeatableLayout,
  value: unknown,
): boolean => {
  const items = value as Record<string, unknown>[] | undefined;
  const minCount = field.minCount ?? 0;

  if (items == null || !Array.isArray(items)) {
    return minCount === 0;
  }
  if (items.length < minCount) {
    return false;
  }

  // For group repeatable, check required fields in each item
  if (field.field.type === 'group') {
    const groupFields = field.field.fields;
    return items.every((item) => {
      // Check required fields
      const requiredFieldIds = extractRequiredFieldIds(groupFields, item);
      if (!requiredFieldIds.every((id) => isFieldFilled(item[id]))) {
        return false;
      }
      // Recursively check nested repeatables
      for (const innerField of groupFields) {
        if (innerField.type === 'repeatable') {
          if (!isRepeatableValid(innerField, item[innerField.id])) {
            return false;
          }
        }
      }
      return true;
    });
  }

  // For single field repeatable, check if the field is required
  const singleField = field.field as FormField;
  if (singleField.required === true) {
    return items.every((item) => isFieldFilled(item[singleField.id]));
  }
  return true;
};

export type StepStatus = 'success' | 'error';

export const getStepStatus = (step: Step, stepValue: unknown): StepStatus => {
  const values = stepValue as Record<string, unknown> | undefined;
  if (values == null) {
    return 'error';
  }

  // Check required fields
  const requiredFieldIds = extractRequiredFieldIds(step.fields, values);
  if (!requiredFieldIds.every((id) => isFieldFilled(values[id]))) {
    return 'error';
  }

  // Check repeatable layouts
  for (const field of step.fields) {
    if (field.type === 'repeatable') {
      if (!isRepeatableValid(field, values[field.id])) {
        return 'error';
      }
    }
  }

  return 'success';
};
