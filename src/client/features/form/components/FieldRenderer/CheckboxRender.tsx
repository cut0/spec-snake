import type { FC } from 'react';

import { Checkbox } from '..';
import type { Field } from '../../../../../definitions';

type CheckboxRenderProps = {
  field: Field & { type: 'checkbox' };
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
};

export const CheckboxRender: FC<CheckboxRenderProps> = ({
  field,
  checked,
  onCheckedChange,
}) => (
  <Checkbox
    checked={checked}
    label={field.label}
    required={field.required}
    onCheckedChange={onCheckedChange}
  />
);
