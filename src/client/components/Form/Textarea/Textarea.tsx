import { Field } from '@base-ui/react/field';
import { type ComponentProps, forwardRef } from 'react';

type TextareaProps = Omit<
  ComponentProps<'textarea'>,
  'id' | 'className' | 'style' | 'popover'
> & {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, hint, required, ...props }, ref) => (
    <Field.Root invalid={error != null}>
      {label != null && (
        <Field.Label className="block text-sm font-bold text-gray-700 mb-1.5">
          {label}
          {required === true && <span className="text-red-500 ml-0.5">*</span>}
        </Field.Label>
      )}
      <textarea
        ref={ref}
        className={`w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:text-gray-500 resize-y min-h-[80px] ${error != null ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : ''}`}
        {...props}
      />
      {hint != null && error == null && (
        <Field.Description className="mt-1.5 text-sm text-gray-500">
          {hint}
        </Field.Description>
      )}
      {error != null && (
        <Field.Error className="mt-1.5 text-sm text-red-600">
          {error}
        </Field.Error>
      )}
    </Field.Root>
  ),
);
