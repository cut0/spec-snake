import type { FC } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

import { Input, Textarea } from '..';
import type { Field } from '../../../../../definitions';
import { isFieldVisible } from '../../services';

import { CheckboxRender } from './CheckboxRender';
import { GroupFieldRenderer } from './GroupFieldRenderer';
import { RepeatableFieldRenderer } from './RepeatableFieldRenderer';
import { SelectRender } from './SelectRender';

type FieldRendererProps = {
  field: Field;
  namePrefix?: string;
};

export const FieldRenderer: FC<FieldRendererProps> = ({
  field,
  namePrefix,
}) => {
  const { register, control } = useFormContext();
  const formData = useWatch({ control }) as Record<string, unknown>;

  // Extract nested data for array sections (e.g., "items.0" -> formData.items[0])
  const itemData =
    namePrefix != null
      ? namePrefix
          .split('.')
          .reduce<Record<string, unknown>>(
            (acc, key) => (acc?.[key] ?? {}) as Record<string, unknown>,
            formData,
          )
      : formData;

  const getFieldName = (fieldId: string) =>
    namePrefix != null ? `${namePrefix}.${fieldId}` : fieldId;

  // Layout fields (grid, repeatable, group) don't have 'when' condition
  const isVisible =
    field.type === 'grid' ||
    field.type === 'repeatable' ||
    field.type === 'group' ||
    isFieldVisible(field, itemData, formData);

  if (!isVisible) {
    return null;
  }

  switch (field.type) {
    case 'input':
      if (field.suggestions != null && field.suggestions.length > 0) {
        return (
          <Controller
            control={control}
            name={getFieldName(field.id)}
            render={({ field: controllerField }) => (
              <Input
                ref={controllerField.ref}
                label={field.label}
                name={controllerField.name}
                placeholder={field.placeholder}
                required={field.required}
                suggestions={field.suggestions}
                type={field.inputType}
                value={controllerField.value ?? ''}
                onBlur={controllerField.onBlur}
                onValueChange={controllerField.onChange}
              />
            )}
          />
        );
      }
      return (
        <Input
          {...register(getFieldName(field.id))}
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          type={field.inputType}
        />
      );
    case 'textarea':
      return (
        <Textarea
          {...register(getFieldName(field.id))}
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          rows={field.rows}
        />
      );
    case 'select':
      return (
        <Controller
          control={control}
          name={getFieldName(field.id)}
          render={({ field: controllerField }) => (
            <SelectRender
              field={field}
              value={controllerField.value ?? ''}
              onValueChange={controllerField.onChange}
            />
          )}
        />
      );
    case 'checkbox':
      return (
        <Controller
          control={control}
          name={getFieldName(field.id)}
          render={({ field: controllerField }) => (
            <CheckboxRender
              checked={controllerField.value ?? false}
              field={field}
              onCheckedChange={controllerField.onChange}
            />
          )}
        />
      );
    case 'grid':
      return (
        <div
          className="grid gap-4"
          style={{ gridTemplateColumns: `repeat(${field.columns}, 1fr)` }}
        >
          {field.fields.map((gridField) => (
            <FieldRenderer
              key={'id' in gridField ? gridField.id : gridField.type}
              field={gridField}
              namePrefix={namePrefix}
            />
          ))}
        </div>
      );
    case 'repeatable':
      return <RepeatableFieldRenderer field={field} namePrefix={namePrefix} />;
    case 'group':
      return <GroupFieldRenderer field={field} namePrefix={namePrefix} />;
    default:
      return null;
  }
};
