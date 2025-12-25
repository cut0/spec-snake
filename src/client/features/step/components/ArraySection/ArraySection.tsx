import { useLingui } from '@lingui/react/macro';
import { type FC, type FormEvent, useCallback, useEffect } from 'react';
import {
  FormProvider,
  useFieldArray,
  useForm as useRHFForm,
  useWatch,
} from 'react-hook-form';

import type {
  ArraySection as ArraySectionType,
  Step,
} from '../../../../../definitions';
import { Button } from '../../../../components/Button';
import { PlusIcon } from '../../../../components/Icons';
import { useSyncStepState } from '../../stores/useSyncStepState';

import { ArraySectionItem } from './ArraySectionItem';

type ArraySectionProps = {
  step: Step;
  formKey?: string;
};

export const ArraySection: FC<ArraySectionProps> = ({ step, formKey }) => {
  const { t } = useLingui();
  const section = step.section as ArraySectionType;
  const { sectionValue, updateSectionValue } = useSyncStepState({
    formKey,
    section,
  });

  const minFieldCount = section.minFieldCount ?? 0;

  // 初期値を minFieldCount 分確保
  const initialItems = sectionValue as Record<string, unknown>[];
  const defaultItems =
    initialItems.length >= minFieldCount
      ? initialItems
      : [
          ...initialItems,
          ...Array.from(
            { length: minFieldCount - initialItems.length },
            () => ({}),
          ),
        ];

  const methods = useRHFForm({
    defaultValues: { items: defaultItems },
  });

  const { control } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  });

  const watchedValues = useWatch({ control, name: 'items' });

  // zustand に同期
  useEffect(() => {
    if (watchedValues) {
      updateSectionValue(watchedValues);
    }
  }, [watchedValues, updateSectionValue]);

  const canRemove = fields.length > minFieldCount;

  const handleAdd = useCallback(() => {
    append({});
  }, [append]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  const handleRemove = useCallback(
    (index: number) => {
      remove(index);
    },
    [remove],
  );

  return (
    <div className="rounded-xl bg-white border border-gray-100">
      <div className="px-6 pt-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
          <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
            <PlusIcon />
            {t`Add`}
          </Button>
        </div>
        <p className="mt-4 text-sm text-gray-500">{step.description}</p>
      </div>
      <hr className="mx-6 mt-4 border-gray-200" />
      <FormProvider {...methods}>
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {fields.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">
              {t`No items. Please add items using the "Add" button.`}
            </p>
          ) : (
            fields.map((field, index) => (
              <ArraySectionItem
                key={field.id}
                fields={section.fields}
                index={index}
                canRemove={canRemove}
                onRemove={handleRemove}
              />
            ))
          )}
        </form>
      </FormProvider>
    </div>
  );
};
