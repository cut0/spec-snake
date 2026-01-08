import type { Section } from '../../../definitions';

import { extractRequiredFieldIds, getVisibleFieldIds } from '../form/services';

/**
 * Filter form data to only include visible fields
 */
export const filterVisibleFormData = (
  section: Section,
  sectionValue: unknown,
): unknown => {
  if (section.type === 'single') {
    const values = sectionValue as Record<string, unknown> | undefined;
    if (values == null) return undefined;

    const visibleIds = getVisibleFieldIds(section.fields, values);
    const filtered: Record<string, unknown> = {};
    for (const id of visibleIds) {
      if (id in values) {
        filtered[id] = values[id];
      }
    }
    return filtered;
  }

  if (section.type === 'array') {
    const items = sectionValue as Record<string, unknown>[] | undefined;
    if (items == null) return undefined;

    return items.map((item) => {
      const visibleIds = getVisibleFieldIds(section.fields, item);
      const filtered: Record<string, unknown> = {};
      for (const id of visibleIds) {
        if (id in item) {
          filtered[id] = item[id];
        }
      }
      return filtered;
    });
  }

  return sectionValue;
};

const isFieldFilled = (value: unknown): boolean => {
  return value !== undefined && value != null && value !== '';
};

export type SectionStatus = 'success' | 'error';

export const getSectionStatus = (
  section: Section,
  sectionValue: unknown,
): SectionStatus => {
  if (section.type === 'single') {
    const values = sectionValue as Record<string, unknown> | undefined;
    if (values == null) {
      return 'error';
    }
    const requiredFieldIds = extractRequiredFieldIds(section.fields, values);
    return requiredFieldIds.every((id) => isFieldFilled(values[id]))
      ? 'success'
      : 'error';
  }
  if (section.type === 'array') {
    const items = sectionValue as Record<string, unknown>[] | undefined;
    const minCount = section.minFieldCount ?? 0;

    if (items == null) {
      return 'error';
    }
    if (items.length < minCount) {
      return 'error';
    }
    return items.every((item) => {
      const requiredFieldIds = extractRequiredFieldIds(section.fields, item);
      return requiredFieldIds.every((id) => isFieldFilled(item[id]));
    })
      ? 'success'
      : 'error';
  }
  throw new Error('Invalid section type');
};
