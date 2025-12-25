import { Checkbox as BaseCheckbox } from '@base-ui/react/checkbox';
import { type FC, useId } from 'react';

import { CheckIconSmall } from '../../Icons';

type CheckboxProps = {
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  required?: boolean;
};

export const Checkbox: FC<CheckboxProps> = ({
  label,
  checked,
  onCheckedChange,
  required,
}) => {
  const id = useId();

  return (
    <div className="flex items-center gap-2">
      <BaseCheckbox.Root
        id={id}
        checked={checked}
        className="flex items-center justify-center size-4 rounded border border-gray-200 bg-gray-50 data-[checked]:bg-indigo-500 data-[checked]:border-indigo-500 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-300 focus-visible:ring-offset-2"
        onCheckedChange={onCheckedChange}
      >
        <BaseCheckbox.Indicator className="text-white">
          <CheckIconSmall />
        </BaseCheckbox.Indicator>
      </BaseCheckbox.Root>
      {label != null && (
        <label
          htmlFor={id}
          className="text-sm font-medium text-gray-900 cursor-pointer"
        >
          {label}
          {required === true && <span className="text-red-500 ml-0.5">*</span>}
        </label>
      )}
    </div>
  );
};
