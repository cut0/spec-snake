import type { PromptContext } from '../../../definitions';
import type { StepInfo } from '../scenarios/build-step-info';

type FieldTransformed = {
  label: string;
  description: string;
  value: unknown;
};

/**
 * Transform a step's form value to an array of field objects
 * Handles nested structures from repeatable and group layouts
 */
const transformStepValue = (
  stepValue: unknown,
  fieldInfoMap: Map<string, { label: string; description: string }>,
): FieldTransformed[] => {
  if (stepValue == null) {
    return [];
  }

  const values = stepValue as Record<string, unknown>;
  const result: FieldTransformed[] = [];

  for (const [fieldId, fieldValue] of Object.entries(values)) {
    const fieldInfo = fieldInfoMap.get(fieldId);

    if (fieldInfo) {
      // Direct field value
      result.push({
        label: fieldInfo.label,
        description: fieldInfo.description,
        value: fieldValue,
      });
    } else if (Array.isArray(fieldValue)) {
      // Repeatable layout: array of objects
      result.push({
        label: fieldId,
        description: '',
        value: fieldValue.map((v: Record<string, unknown>) =>
          Object.fromEntries(
            Object.entries(v).map(([k, val]) => {
              const info = fieldInfoMap.get(k);
              return [info?.label ?? k, val];
            }),
          ),
        ),
      });
    }
  }

  return result;
};

export const transformFormData = (
  body: Record<string, unknown>,
  stepInfoMap: Map<string, StepInfo>,
): PromptContext => {
  const steps: PromptContext['steps'] = [];

  for (const [stepName, stepValue] of Object.entries(body)) {
    const stepInfo = stepInfoMap.get(stepName);

    if (stepInfo == null) {
      continue;
    }

    const fieldInfoMap = new Map(
      stepInfo.fields.map((f) => [
        f.id,
        { label: f.label, description: f.description },
      ]),
    );

    const fields = transformStepValue(stepValue, fieldInfoMap);

    steps.push({
      title: stepInfo.title,
      description: stepInfo.description,
      fields,
    });
  }

  return { steps };
};
