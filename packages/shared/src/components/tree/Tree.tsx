'use client';

import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  DragOverlay,
  type DragStartEvent,
  PointerSensor,
  type UniqueIdentifier,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { cn } from '@shared/lib/utils';
import { FileIcon, FolderIcon } from 'lucide-react';
import React from 'react';

import { TreeIcon } from './TreeIcon';
import { TreeItem } from './TreeItem';
import type { TreeDataItem, TreeProps } from './types';
import { buildParentMap, collectAllNodeIds, findItemById, findPathToTarget, getItemDepth, reorderItems } from './utils';

const TreeView = React.forwardRef<HTMLDivElement, TreeProps>(
  ({ data, initialSelectedItemId, onSelectChange, expandAll, defaultLeafIcon, defaultNodeIcon, className, onReorder, ...props }, ref) => {
    const [selectedItemId, setSelectedItemId] = React.useState<string | undefined>(initialSelectedItemId);
    const [activeId, setActiveId] = React.useState<UniqueIdentifier | null>(null);
    const [items, setItems] = React.useState<TreeDataItem[]>(Array.isArray(data) ? data : [data]);

    // data prop이 변경되면 items 업데이트
    React.useEffect(() => {
      setItems(Array.isArray(data) ? data : [data]);
    }, [data]);

    // [최적화: Set을 사용하여 중복 없는 expandedId 관리/탐색]
    const [expandedItemIds, setExpandedItemIds] = React.useState<string[]>(() => {
      const dataArray = Array.isArray(data) ? data : [data];
      const idsSet = new Set<string>();

      if (expandAll) {
        collectAllNodeIds(dataArray, idsSet);
      } else if (initialSelectedItemId) {
        findPathToTarget(dataArray, initialSelectedItemId, idsSet);
      }

      return Array.from(idsSet);
    });

    // [최적화: 부모 탐색을 위해 Map 캐싱]
    const parentMap = React.useMemo(() => {
      return buildParentMap(items);
    }, [items]);

    React.useEffect(() => {
      const dataArray = Array.isArray(data) ? data : [data];
      const idsSet = new Set<string>();

      if (expandAll) {
        collectAllNodeIds(dataArray, idsSet);
        setExpandedItemIds(Array.from(idsSet));
      } else if (initialSelectedItemId) {
        findPathToTarget(dataArray, initialSelectedItemId, idsSet);
        setExpandedItemIds(Array.from(idsSet));
      }
    }, [data, expandAll, initialSelectedItemId]);

    const handleSelectChange = React.useCallback(
      (item: TreeDataItem | undefined) => {
        setSelectedItemId(item?.id);
        if (onSelectChange) {
          onSelectChange(item);
        }
      },
      [onSelectChange]
    );

    // dnd-kit 센서 설정
    const sensors = useSensors(
      useSensor(PointerSensor, {
        activationConstraint: {
          distance: 8, // 8px 이동 후 드래그 시작
        },
      })
    );

    const handleDragStart = (event: DragStartEvent) => {
      setActiveId(event.active.id);
    };

    const handleDragEnd = (event: DragEndEvent) => {
      const { active, over } = event;
      setActiveId(null);

      if (!over || active.id === over.id) {
        return;
      }

      const activeItem = findItemById(items, active.id as string);
      const overItem = findItemById(items, over.id as string);

      if (!activeItem || !overItem) {
        return;
      }

      // 같은 depth인지 확인
      const activeDepth = getItemDepth(active.id as string, parentMap);
      const overDepth = getItemDepth(over.id as string, parentMap);

      if (activeDepth !== overDepth) {
        return;
      }

      // 재정렬
      const newItems = reorderItems(items, active.id as string, over.id as string, parentMap);
      setItems(newItems);

      // 콜백 호출
      if (onReorder) {
        onReorder(newItems);
      }
    };

    const activeItem = activeId ? findItemById(items, activeId as string) : null;

    return (
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
        <div ref={ref} className={cn('relative overflow-hidden bg-white py-2 dark:bg-neutral-900', className)} {...props}>
          <TreeItem
            data={items}
            selectedItemId={selectedItemId}
            handleSelectChange={handleSelectChange}
            expandedItemIds={expandedItemIds}
            defaultLeafIcon={defaultLeafIcon || FileIcon}
            defaultNodeIcon={defaultNodeIcon || FolderIcon}
            parentMap={parentMap}
            isDraggingActive={!!activeId}
          />
        </div>
        <DragOverlay dropAnimation={null}>
          {activeItem ? (
            <div
              className={cn(
                'flex items-center gap-3 rounded-md border border-blue-400 bg-white px-3 py-3 text-sm opacity-90 shadow-2xl dark:border-blue-500 dark:bg-neutral-900'
              )}
            >
              <div className="h-4 w-4" />
              <TreeIcon item={activeItem} default={activeItem.children ? defaultNodeIcon : defaultLeafIcon} />
              <span className="truncate font-medium text-neutral-900 dark:text-neutral-100">{activeItem.name}</span>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    );
  }
);
TreeView.displayName = 'TreeView';

export { TreeView };
export type { TreeDataItem, TreeProps } from './types';
