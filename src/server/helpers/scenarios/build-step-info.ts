import { type Field, type Step, isLayoutField } from '../../../definitions';

export type FieldInfo = {
  id: string;
  label: string;
  description: string;
};

export type StepInfo = {
  name: string;
  title: string;
  description: string;
  fields: FieldInfo[];
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

export const extractFieldInfos = (fields: Field[]): FieldInfo[] => {
  const result: FieldInfo[] = [];
  for (const field of fields) {
    if (isLayoutField(field)) {
      result.push(...extractFieldInfos(getLayoutFields(field)));
    } else {
      result.push({
        id: field.id,
        label: field.label,
        description: field.description,
      });
    }
  }
  return result;
};

export const buildStepInfoMap = (steps: Step[]): Map<string, StepInfo> => {
  const stepMap = new Map<string, StepInfo>(
    steps.map((step) => [
      step.name,
      {
        name: step.name,
        title: step.title,
        description: step.description,
        fields: extractFieldInfos(step.fields),
      },
    ]),
  );

  return stepMap;
};
