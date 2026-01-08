import { Autocomplete } from '@base-ui/react/autocomplete';
import { Field } from '@base-ui/react/field';
import { type ComponentProps, forwardRef, useCallback } from 'react';

type InputProps = Omit<
  ComponentProps<'input'>,
  'className' | 'style' | 'popover'
> & {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  suggestions?: string[];
  onValueChange?: (value: string) => void;
};

const inputClassName =
  'w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:text-gray-500 data-[invalid]:border-red-500 data-[invalid]:focus:border-red-500 data-[invalid]:focus:ring-red-500/20';

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      hint,
      required,
      suggestions,
      value,
      onValueChange,
      ...props
    },
    ref,
  ) => {
    const handleValueChange = useCallback(
      (newValue: string) => {
        onValueChange?.(newValue);
      },
      [onValueChange],
    );

    if (suggestions != null && suggestions.length > 0) {
      return (
        <Field.Root invalid={error != null}>
          {label != null && (
            <Field.Label className="block text-sm font-bold text-gray-700 mb-1.5">
              {label}
              {required === true && (
                <span className="text-red-500 ml-0.5">*</span>
              )}
            </Field.Label>
          )}
          <Autocomplete.Root
            items={suggestions}
            value={value as string}
            onValueChange={handleValueChange}
          >
            <Autocomplete.Input
              ref={ref}
              className={inputClassName}
              {...props}
            />
            <Autocomplete.Portal>
              <Autocomplete.Positioner
                className="z-50"
                sideOffset={4}
                style={{ width: 'var(--anchor-width)' }}
              >
                <Autocomplete.Popup className="rounded-lg border border-gray-200 bg-white shadow-lg overflow-hidden">
                  <Autocomplete.List className="max-h-60 overflow-auto p-1">
                    {(item: string) => (
                      <Autocomplete.Item
                        key={item}
                        value={item}
                        className="px-3 py-2 text-sm text-gray-900 rounded-md cursor-pointer data-[highlighted]:bg-indigo-50 data-[highlighted]:text-indigo-900 data-[selected]:font-medium"
                      >
                        {item}
                      </Autocomplete.Item>
                    )}
                  </Autocomplete.List>
                </Autocomplete.Popup>
              </Autocomplete.Positioner>
            </Autocomplete.Portal>
          </Autocomplete.Root>
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
      );
    }

    return (
      <Field.Root invalid={error != null}>
        {label != null && (
          <Field.Label className="block text-sm font-bold text-gray-700 mb-1.5">
            {label}
            {required === true && (
              <span className="text-red-500 ml-0.5">*</span>
            )}
          </Field.Label>
        )}
        <Field.Control ref={ref} className={inputClassName} {...props} />
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
    );
  },
);
