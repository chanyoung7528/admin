import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@shared/lib/utils';
import React from 'react';

import { DragHandle } from './DragHandle';
import { dragOverVariants, selectedTreeVariants, treeVariants } from './styles';
import { TreeActions } from './TreeActions';
import { TreeIcon } from './TreeIcon';
import type { TreeLeafProps } from './types';

export const TreeLeaf = React.forwardRef<HTMLDivElement, TreeLeafProps>(({ item, selectedItemId, handleSelectChange, defaultLeafIcon }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: item.id,
    disabled: !item.draggable || item.disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'relative text-left',
        treeVariants(),
        selectedItemId === item.id && selectedTreeVariants(),
        isOver && dragOverVariants(),
        item.disabled && 'pointer-events-none cursor-not-allowed opacity-50'
      )}
      onClick={() => {
        if (item.disabled) return;
        handleSelectChange(item);
        item.onClick?.();
      }}
      {...attributes}
    >
      {/* 수평 연결선 - 왼쪽에서 아이템까지 */}
      <div className="absolute top-[50%] left-0 h-px w-4 -translate-x-4 bg-[#eaeaef] dark:bg-neutral-700" />

      <div className="relative z-10 flex w-full items-center gap-3">
        <DragHandle item={item} listeners={listeners} />
        <TreeIcon item={item} isSelected={selectedItemId === item.id} default={defaultLeafIcon} />
        <div className="flex grow items-center gap-2 truncate">
          <span className="truncate text-neutral-900 dark:text-neutral-100">{item.name}</span>
          {item.type && (
            <span className="shrink-0 rounded bg-neutral-100 px-1.5 py-0.5 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
              {item.type}
            </span>
          )}
        </div>
        <TreeActions isSelected={selectedItemId === item.id && !item.disabled}>{item.actions}</TreeActions>
      </div>
    </div>
  );
});
TreeLeaf.displayName = 'TreeLeaf';
