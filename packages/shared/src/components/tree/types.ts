import type { UniqueIdentifier } from '@dnd-kit/core';
import type React from 'react';

export interface TreeDataItem {
  id: string;
  name: string;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
  selectedIcon?: React.ComponentType<{ className?: string }>;
  openIcon?: React.ComponentType<{ className?: string }>;
  children?: TreeDataItem[];
  actions?: React.ReactNode;
  onClick?: () => void;
  draggable?: boolean;
  droppable?: boolean;
  disabled?: boolean;
}

export interface TreeProps extends React.HTMLAttributes<HTMLDivElement> {
  data: TreeDataItem[] | TreeDataItem;
  initialSelectedItemId?: string;
  onSelectChange?: (item: TreeDataItem | undefined) => void;
  expandAll?: boolean;
  defaultNodeIcon?: React.ComponentType<{ className?: string }>;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  onReorder?: (items: TreeDataItem[]) => void;
}

export interface TreeItemProps {
  data: TreeDataItem[];
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  defaultNodeIcon?: React.ComponentType<{ className?: string }>;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  parentMap: Map<string, string>;
  isDraggingActive?: boolean;
}

export interface TreeNodeProps {
  item: TreeDataItem;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  expandedItemIds: string[];
  selectedItemId?: string;
  defaultNodeIcon?: React.ComponentType<{ className?: string }>;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  parentMap: Map<string, string>;
  isDraggingActive?: boolean;
}

export interface TreeLeafProps {
  item: TreeDataItem;
  selectedItemId?: string;
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  parentMap: Map<string, string>;
}

export interface TreeIconProps {
  item: TreeDataItem;
  isOpen?: boolean;
  isSelected?: boolean;
  default?: React.ComponentType<{ className?: string }>;
}

export interface DragHandleProps {
  item: TreeDataItem;
  listeners?: unknown;
}

export interface TreeActionsProps {
  children: React.ReactNode;
  isSelected: boolean;
}

export interface TreeContextValue {
  activeId: UniqueIdentifier | null;
  selectedItemId?: string;
  expandedItemIds: string[];
  handleSelectChange: (item: TreeDataItem | undefined) => void;
  defaultNodeIcon?: React.ComponentType<{ className?: string }>;
  defaultLeafIcon?: React.ComponentType<{ className?: string }>;
  parentMap: Map<string, string>;
  isDraggingActive: boolean;
}
