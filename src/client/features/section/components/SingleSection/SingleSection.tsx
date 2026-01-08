import { type FC, type FormEvent, useCallback, useEffect } from 'react';
import { FormProvider, useForm as useRHFForm, useWatch } from 'react-hook-form';

import type {
  SingleSection as SingleSectionType,
  Step,
} from '../../../../../definitions';
import { FieldRenderer } from '../../../form/components/FieldRenderer';
import { useSyncStepState } from '../../../step/stores/useSyncStepState';

type SingleSectionProps = {
  step: Step;
  formKey?: string;
};

export const SingleSection: FC<SingleSectionProps> = ({ step, formKey }) => {
  const section = step.section as SingleSectionType;
  const { sectionValue, updateSectionValue } = useSyncStepState({
    formKey,
    section,
  });

  const methods = useRHFForm({
    defaultValues: sectionValue as Record<string, unknown>,
  });

  const watchedValues = useWatch({ control: methods.control });

  // Sync to zustand
  useEffect(() => {
    updateSectionValue(watchedValues);
  }, [watchedValues, updateSectionValue]);

  const handleSubmit = useCallback((e: FormEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="rounded-xl bg-white border border-gray-100">
      <div className="px-6 pt-6">
        <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
        <p className="mt-4 text-sm text-gray-500">{step.description}</p>
      </div>
      <hr className="mx-6 mt-4 border-gray-200" />
      <FormProvider {...methods}>
        <form className="p-6 space-y-6" onSubmit={handleSubmit}>
          {section.fields.map((field) => (
            <FieldRenderer
              key={'id' in field ? field.id : field.type}
              field={field}
            />
          ))}
        </form>
      </FormProvider>
    </div>
  );
};
