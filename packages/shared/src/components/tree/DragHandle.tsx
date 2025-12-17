import { GripVertical } from 'lucide-react';

import type { DragHandleProps } from './types';

export const DragHandle = ({ item, listeners }: DragHandleProps) => {
  if (!item.draggable) {
    return <div className="h-5 w-5" />;
  }
  return (
    <div
      {...(listeners as React.HTMLAttributes<HTMLDivElement>)}
      className="flex cursor-grab items-center justify-center text-neutral-400 transition-colors hover:text-neutral-600 active:cursor-grabbing dark:hover:text-neutral-300"
      onClick={e => e.stopPropagation()}
    >
      <GripVertical className="h-4 w-4" />
    </div>
  );
};
