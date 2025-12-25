import { type Field, type Step, isLayoutField } from '../../../definitions';

export const buildFieldDefaults = (
  fields: Field[],
): Record<string, unknown> => {
  const getFieldDefaultValue = (field: Field): unknown => {
    if (isLayoutField(field)) {
      return undefined;
    }
    switch (field.type) {
      case 'checkbox':
        return false;
      default:
        return '';
    }
  };

  const defaults: Record<string, unknown> = {};
  for (const field of fields) {
    if (isLayoutField(field)) {
      Object.assign(defaults, buildFieldDefaults(field.fields));
    } else {
      defaults[field.id] = getFieldDefaultValue(field);
    }
  }
  return defaults;
};

export const buildFormDefaultValues = (
  steps: Step[],
): Record<string, unknown> => {
  const defaults: Record<string, unknown> = {};
  for (const config of steps) {
    if (config.section.type === 'single') {
      defaults[config.section.name] = buildFieldDefaults(config.section.fields);
    } else {
      const minCount = config.section.minFieldCount ?? 1;
      defaults[config.section.name] = Array.from({ length: minCount }, () =>
        buildFieldDefaults(config.section.fields),
      );
    }
  }
  return defaults;
};
