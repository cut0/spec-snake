import type { InputData } from '../../../definitions';
import type { SectionInfo } from '../scenarios/build-section-info';

export const transformFormData = (
  body: Record<string, unknown>,
  sectionInfoMap: Map<string, SectionInfo>,
): InputData => {
  const items: InputData['items'] = [];

  for (const [sectionName, sectionValue] of Object.entries(body)) {
    const sectionInfo = sectionInfoMap.get(sectionName);

    if (sectionInfo == null) {
      continue;
    }

    const fieldInfoMap = new Map(sectionInfo.fields.map((f) => [f.id, f]));

    const values = (
      Array.isArray(sectionValue) ? sectionValue : [sectionValue]
    ).map((item: Record<string, unknown>) => {
      const itemValues: Array<{
        label: string;
        description: string;
        value: unknown;
      }> = Object.entries(item)
        .map(([fieldId, fieldValue]) => {
          const fieldInfo = fieldInfoMap.get(fieldId);
          if (fieldInfo) {
            return {
              label: fieldInfo.label,
              description: fieldInfo.description,
              value: fieldValue,
            };
          }
          return null;
        })
        .filter((value) => value != null);

      return itemValues;
    });

    items.push({
      title: sectionInfo.title,
      description: sectionInfo.description,
      values,
    });
  }

  return { items };
};
