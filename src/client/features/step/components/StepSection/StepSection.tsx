import { type FC, type FormEvent, useCallback, useEffect } from 'react';
import { FormProvider, useForm as useRHFForm, useWatch } from 'react-hook-form';

import type { Field, Step } from '../../../../../definitions';
import { FieldRenderer } from '../../../form/components/FieldRenderer';
import { useSyncStepState } from '../../stores/useSyncStepState';

type StepSectionProps = {
  step: Step;
  formKey?: string;
};

/**
 * Renders a step's form fields.
 * Each step has a name and fields directly on it.
 */
export const StepSection: FC<StepSectionProps> = ({ step, formKey }) => {
  const { stepValue, updateStepValue } = useSyncStepState({
    formKey,
    step,
  });

  const methods = useRHFForm({
    defaultValues: stepValue as Record<string, unknown>,
  });

  const watchedValues = useWatch({ control: methods.control });

  // Sync to zustand
  useEffect(() => {
    updateStepValue(watchedValues);
  }, [watchedValues, updateStepValue]);

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
          {step.fields.map((field: Field) => (
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
