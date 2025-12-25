import { type Field, type Step, isLayoutField } from '../../../definitions';

export type FieldInfo = {
  id: string;
  label: string;
  description: string;
};

export type SectionInfo = {
  name: string;
  title: string;
  description: string;
  fields: FieldInfo[];
};

export const extractFieldInfos = (fields: Field[]): FieldInfo[] => {
  const result: FieldInfo[] = [];
  for (const field of fields) {
    if (isLayoutField(field)) {
      result.push(...extractFieldInfos(field.fields));
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

export const buildSectionInfoMap = (
  steps: Step[],
): Map<string, SectionInfo> => {
  const sectionMap = new Map<string, SectionInfo>(
    steps.map((step) => [
      step.section.name,
      {
        name: step.section.name,
        title: step.title,
        description: step.description,
        fields: extractFieldInfos(step.section.fields),
      },
    ]),
  );

  return sectionMap;
};
