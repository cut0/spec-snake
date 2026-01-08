import type { FC } from 'react';

import type { GroupLayout } from '../../../../../definitions';

import { FieldRenderer } from './FieldRenderer';

type GroupFieldRendererProps = {
  field: GroupLayout;
  namePrefix?: string;
};

/**
 * GroupFieldRenderer - renders fields grouped together (visual only, no repetition)
 */
export const GroupFieldRenderer: FC<GroupFieldRendererProps> = ({
  field,
  namePrefix,
}) => {
  return (
    <div className="space-y-3">
      {field.fields.map((groupField) => (
        <FieldRenderer
          key={'id' in groupField ? groupField.id : groupField.type}
          field={groupField}
          namePrefix={namePrefix}
        />
      ))}
    </div>
  );
};
