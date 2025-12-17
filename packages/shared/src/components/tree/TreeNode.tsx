import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import * as AccordionPrimitive from '@radix-ui/react-accordion';
import { cn } from '@shared/lib/utils';
import React from 'react';

import { AccordionContent, AccordionTrigger } from './AccordionComponents';
import { DragHandle } from './DragHandle';
import { dragOverVariants, selectedTreeVariants, treeVariants } from './styles';
import { TreeActions } from './TreeActions';
import { TreeIcon } from './TreeIcon';
import { TreeItem } from './TreeItem';
import type { TreeNodeProps } from './types';

export const TreeNode = ({
  item,
  handleSelectChange,
  expandedItemIds,
  selectedItemId,
  defaultNodeIcon,
  defaultLeafIcon,
  parentMap,
  isDraggingActive,
}: TreeNodeProps) => {
  const expandedSet = React.useMemo(() => new Set(expandedItemIds), [expandedItemIds]);
  const [isExpanded, setIsExpanded] = React.useState(expandedSet.has(item.id));

  React.useEffect(() => {
    setIsExpanded(expandedSet.has(item.id));
  }, [expandedItemIds, item.id, expandedSet]);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging, isOver } = useSortable({
    id: item.id,
    disabled: !item.draggable || item.disabled,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleToggle = (value: string[]) => {
    // 드래그 중일 때는 expand/collapse 변경을 막음
    if (isDraggingActive) {
      return;
    }
    setIsExpanded(value.includes(item.id));
  };

  return (
    <AccordionPrimitive.Root type="multiple" value={isExpanded ? [item.id] : []} onValueChange={handleToggle}>
      <AccordionPrimitive.Item value={item.id}>
        <div ref={setNodeRef} style={style} className="relative">
          <AccordionTrigger
            className={cn(treeVariants(), selectedItemId === item.id && selectedTreeVariants(), isOver && dragOverVariants())}
            onClick={() => {
              handleSelectChange(item);
              item.onClick?.();
            }}
            isExpanded={isExpanded}
            {...attributes}
          >
            <DragHandle item={item} listeners={listeners} />
            <TreeIcon item={item} isSelected={selectedItemId === item.id} isOpen={isExpanded} default={defaultNodeIcon} />
            <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">{item.name}</span>
            <TreeActions isSelected={selectedItemId === item.id}>{item.actions}</TreeActions>
          </AccordionTrigger>
        </div>
        <AccordionContent className="relative ml-6 pl-4">
          {/* 수직 연결선 */}
          {isExpanded && <div className="absolute top-0 bottom-4 left-0 w-px bg-[#eaeaef] dark:bg-neutral-700" />}
          <TreeItem
            data={item.children!}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon}
            defaultNodeIcon={defaultNodeIcon}
            parentMap={parentMap}
            isDraggingActive={isDraggingActive}
          />
        </AccordionContent>
      </AccordionPrimitive.Item>
    </AccordionPrimitive.Root>
  );
};
