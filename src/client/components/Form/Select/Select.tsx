import { Select as BaseSelect } from '@base-ui/react/select';
import type { FC } from 'react';

import { CheckIcon, ChevronDownIcon } from '../../Icons';

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = {
  label?: string;
  options: SelectOption[];
  value?: string;
  onValueChange?: (value: string | null) => void;
  placeholder?: string;
  error?: string;
  required?: boolean;
};

export const Select: FC<SelectProps> = ({
  label,
  options,
  value,
  onValueChange,
  placeholder = '選択してください',
  error,
  required,
}) => (
  <div className="flex flex-col gap-1.5">
    {label != null && (
      <span className="text-sm font-bold text-gray-700">
        {label}
        {required === true && <span className="text-red-500 ml-0.5">*</span>}
      </span>
    )}
    <BaseSelect.Root value={value} onValueChange={onValueChange}>
      <BaseSelect.Trigger
        className={`flex items-center justify-between w-full rounded-lg border bg-gray-50 px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-300 cursor-pointer ${error != null ? 'border-red-500' : 'border-gray-200 focus:border-indigo-300'}`}
      >
        <BaseSelect.Value>
          {(displayValue) => {
            if (displayValue == null) {
              return <span className="text-gray-400">{placeholder}</span>;
            }
            const selectedOption = options.find(
              (option) => option.value === displayValue,
            );
            return selectedOption?.label ?? displayValue;
          }}
        </BaseSelect.Value>
        <BaseSelect.Icon className="text-gray-400">
          <ChevronDownIcon />
        </BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner>
          <BaseSelect.Popup className="z-50 min-w-[var(--anchor-width)] rounded-lg border border-gray-200 bg-white p-1">
            {options.map((option) => (
              <BaseSelect.Item
                key={option.value}
                className="flex items-center rounded-md px-3 py-2 text-sm text-gray-900 outline-none cursor-pointer hover:bg-gray-100 data-[highlighted]:bg-gray-100 data-[selected]:bg-indigo-50 data-[selected]:text-indigo-500"
                value={option.value}
              >
                <BaseSelect.ItemIndicator className="mr-2">
                  <CheckIcon />
                </BaseSelect.ItemIndicator>
                <BaseSelect.ItemText>{option.label}</BaseSelect.ItemText>
              </BaseSelect.Item>
            ))}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
    {error != null && <p className="text-sm text-red-600">{error}</p>}
  </div>
);
