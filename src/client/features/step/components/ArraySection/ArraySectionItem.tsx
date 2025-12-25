import { type FC, useCallback } from 'react';

import type { Field } from '../../../../../definitions';
import { Button } from '../../../../components/Button';
import { TrashIcon } from '../../../../components/Icons';
import { FieldRenderer } from '../FieldRenderer';

type ArraySectionItemProps = {
  index: number;
  fields: Field[];
  canRemove: boolean;
  onRemove: (index: number) => void;
};

export const ArraySectionItem: FC<ArraySectionItemProps> = ({
  index,
  fields,
  canRemove,
  onRemove,
}) => {
  const namePrefix = `items.${index}`;

  const handleRemove = useCallback(() => {
    onRemove(index);
  }, [index, onRemove]);

  return (
    <div className="space-y-6 pb-6 border-b border-gray-200 last:border-b-0 last:pb-0">
      <div className="flex items-center justify-between">
        <span className="text-base font-medium text-gray-900">
          #{index + 1}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          disabled={!canRemove}
          onClick={handleRemove}
        >
          <TrashIcon />
        </Button>
      </div>
      {fields.map((field) => (
        <FieldRenderer
          key={'id' in field ? field.id : field.type}
          field={field}
          namePrefix={namePrefix}
        />
      ))}
    </div>
  );
};
