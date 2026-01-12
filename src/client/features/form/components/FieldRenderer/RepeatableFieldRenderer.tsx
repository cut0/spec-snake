import { useLingui } from '@lingui/react/macro';
import { type FC, useCallback, useMemo } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type {
  Field,
  FormField,
  RepeatableLayout,
} from '../../../../../definitions';
import { PlusIcon, TrashIcon } from '../../../../components/Icons';
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

  // Get inner fields to render
  const innerFields: Field[] =
    field.field.type === 'group' ? field.field.fields : [field.field];

  return (
    <div className="px-2">
      <div className="flex items-center justify-between mb-3">
        <span className="text-base font-bold text-gray-700">{field.label}</span>
        <button
          className="flex items-center gap-1 px-3 py-1 rounded-lg border border-gray-200 bg-gray-50 text-gray-500 hover:bg-gray-100 active:bg-gray-200 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
          type="button"
          onClick={handleAppend}
        >
          <PlusIcon />
          <span className="text-sm">{t`Add`}</span>
        </button>
      </div>
      <div className="space-y-3">
        {fields.map((item, index) => (
          <div key={item.id} className="rounded-lg border border-gray-200 p-4">
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
              {innerFields.map((innerField: Field) => (
                <FieldRenderer
                  key={'id' in innerField ? innerField.id : innerField.type}
                  field={innerField}
                  namePrefix={`${fieldName}.${index}`}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
