import { type Field, type Section, isLayoutField } from '../../../definitions';

export const extractRequiredFieldIds = (fields: Field[]): string[] => {
  const result: string[] = [];
  for (const field of fields) {
    if (isLayoutField(field)) {
      result.push(...extractRequiredFieldIds(field.fields));
    } else if (field.required === true) {
      result.push(field.id);
    }
  }
  return result;
};

const isFieldFilled = (value: unknown): boolean => {
  return value !== undefined && value != null && value !== '';
};

export type SectionStatus = 'success' | 'error';

export const getSectionStatus = (
  section: Section,
  sectionValue: unknown,
): SectionStatus => {
  const requiredFieldIds = extractRequiredFieldIds(section.fields);

  if (section.type === 'single') {
    const values = sectionValue as Record<string, unknown> | undefined;
    if (values == null) {
      return 'error';
    }
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
    return items.every((item) =>
      requiredFieldIds.every((id) => isFieldFilled(item[id])),
    )
      ? 'success'
      : 'error';
  }
  throw new Error('Invalid section type');
};
