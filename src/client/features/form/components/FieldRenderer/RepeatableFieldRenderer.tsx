import { useLingui } from '@lingui/react/macro';
import { type FC, useCallback, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type {
  Field,
  FormField,
  RepeatableLayout,
} from '../../../../../definitions';
import { CloseIcon, PlusIcon, TrashIcon } from '../../../../components/Icons';
import { buildFieldDefaults } from '../../services';

import { FieldRenderer } from './FieldRenderer';

type RepeatableFieldRendererProps = {
  field: RepeatableLayout;
  namePrefix?: string;
};

export const RepeatableFieldRenderer: FC<RepeatableFieldRendererProps> = ({
  field,
  namePrefix,
}) => {
  const { t } = useLingui();
  const { control } = useFormContext();
  const fieldName = namePrefix != null ? `${namePrefix}.${field.id}` : field.id;

  const { fields, append, remove } = useFieldArray({
    control,
    name: fieldName,
  });

  const minCount = field.minCount ?? 0;

  // Build default value for new item (includes nested repeatables with minCount)
  const defaultItemValue = useMemo(() => {
    if (field.field.type === 'group') {
      return buildFieldDefaults(field.field.fields);
    }
    const singleField = field.field as FormField;
    return { [singleField.id]: singleField.type === 'checkbox' ? false : '' };
  }, [field.field]);

  const handleAppend = useCallback(() => {
    append(defaultItemValue);
  }, [append, defaultItemValue]);

  // Render for group (multiple fields per item)
  if (field.field.type === 'group') {
    const groupFields = field.field.fields;
    return (
      <div className="px-2">
        {fields.map((item, index) => (
          <div key={item.id}>
            {index > 0 && (
              <div className="flex justify-center py-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                </div>
              </div>
            )}
            <div className="rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-base font-bold text-gray-700">
                  #{index + 1}
                </span>
                {fields.length > minCount && (
                  <button
                    aria-label={t`Remove`}
                    className="p-2 rounded-full border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
                    type="button"
                    onClick={() => remove(index)}
                  >
                    <TrashIcon />
                  </button>
                )}
              </div>
              <div className="space-y-3">
                {groupFields.map((innerField: Field) => (
                  <FieldRenderer
                    key={'id' in innerField ? innerField.id : innerField.type}
                    field={innerField}
                    namePrefix={`${fieldName}.${index}`}
                  />
                ))}
              </div>
            </div>
          </div>
        ))}
        <button
          className="flex w-full items-center justify-center gap-1 rounded-lg py-2 mt-3 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
          type="button"
          onClick={handleAppend}
        >
          <PlusIcon />
          <span className="text-sm">{t`Add item`}</span>
        </button>
      </div>
    );
  }

  // Render for single field (FormField only at this point)
  const singleField = field.field as FormField;
  return (
    <div className="space-y-3">
      <div className="px-2">
        {fields.map((item, index) => (
          <div key={item.id}>
            {index > 0 && (
              <div className="flex justify-center py-3">
                <div className="flex flex-col items-center gap-1">
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                  <span className="w-1 h-1 rounded-full bg-gray-500" />
                </div>
              </div>
            )}
            <div className="flex items-start gap-2 rounded-lg border border-gray-200 p-3">
              <div className="flex-1">
                <FieldRenderer
                  field={singleField}
                  namePrefix={`${fieldName}.${index}`}
                />
              </div>
              {fields.length > minCount && (
                <button
                  aria-label={t`Remove`}
                  className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors cursor-pointer"
                  type="button"
                  onClick={() => remove(index)}
                >
                  <CloseIcon />
                </button>
              )}
            </div>
          </div>
        ))}
        <button
          className="flex w-full items-center justify-center gap-1 rounded-lg py-2 mt-3 text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
          type="button"
          onClick={handleAppend}
        >
          <PlusIcon />
          <span className="text-sm">{t`Add ${singleField.label}`}</span>
        </button>
      </div>
    </div>
  );
};
