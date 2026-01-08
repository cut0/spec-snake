import { type FC, useCallback } from 'react';

import { Select } from '..';
import type { Field } from '../../../../../definitions';

type SelectRenderProps = {
  field: Field & { type: 'select' };
  value: string;
  onValueChange: (value: string | null) => void;
};

export const SelectRender: FC<SelectRenderProps> = ({
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
