import { type FC, useCallback } from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import type { Field } from '../../../../../definitions';
import { Checkbox, Input, Select, Textarea } from '../../../../components/Form';

type FieldRendererProps = {
  field: Field;
  namePrefix?: string;
};

type SelectRenderProps = {
  field: Field & { type: 'select' };
  value: string;
  onValueChange: (value: string | null) => void;
};

const SelectRender: FC<SelectRenderProps> = ({
  field,
  value,
  onValueChange,
}) => {
  const handleValueChange = useCallback(
    (newValue: string | null) => {
      onValueChange(newValue ?? '');
    },
    [onValueChange],
  );

  return (
    <Select
      label={field.label}
      options={field.options}
      placeholder={field.placeholder}
      required={field.required}
      value={value}
      onValueChange={handleValueChange}
    />
  );
};

type CheckboxRenderProps = {
  field: Field & { type: 'checkbox' };
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

const CheckboxRender: FC<CheckboxRenderProps> = ({
  field,
  checked,
  onCheckedChange,
}) => (
  <Checkbox
    checked={checked}
    label={field.label}
    required={field.required}
    onCheckedChange={onCheckedChange}
  />
);

export const FieldRenderer: FC<FieldRendererProps> = ({
  field,
  namePrefix = '',
}) => {
  const { register, control } = useFormContext();

  const getFieldName = (fieldId: string) =>
    namePrefix ? `${namePrefix}.${fieldId}` : fieldId;

  switch (field.type) {
    case 'input':
      return (
        <Input
          {...register(getFieldName(field.id))}
          label={field.label}
          placeholder={field.placeholder}
          required={field.required}
          suggestions={field.suggestions}
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
          /* eslint-disable react/jsx-no-bind, react/jsx-handler-names */
          render={({ field: controllerField }) => (
            <SelectRender
              field={field}
              value={controllerField.value ?? ''}
              onValueChange={controllerField.onChange}
            />
          )}
          /* eslint-enable react/jsx-no-bind, react/jsx-handler-names */
        />
      );
    case 'checkbox':
      return (
        <Controller
          control={control}
          name={getFieldName(field.id)}
          /* eslint-disable react/jsx-no-bind, react/jsx-handler-names */
          render={({ field: controllerField }) => (
            <CheckboxRender
              checked={controllerField.value ?? false}
              field={field}
              onCheckedChange={controllerField.onChange}
            />
          )}
          /* eslint-enable react/jsx-no-bind, react/jsx-handler-names */
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
    default:
      return null;
  }
};
