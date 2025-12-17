import { cn } from '@shared/lib/utils';
import { FileIcon, FileJson, FolderIcon, Image, Type } from 'lucide-react';

import type { TreeIconProps } from './types';

export const TreeIcon = ({ item, isOpen, isSelected, default: defaultIcon }: TreeIconProps) => {
  let Icon = defaultIcon;

  if (!item.icon && item.type) {
    if (item.type === 'Text') Icon = Type;
    else if (item.type === 'Media') Icon = Image;
    else if (item.type === 'JSON') Icon = FileJson;
  }

  if (isSelected && item.selectedIcon) Icon = item.selectedIcon;
  else if (isOpen && item.openIcon) Icon = item.openIcon;
  else if (item.icon) Icon = item.icon;

  if (!Icon) {
    Icon = item.children ? FolderIcon : FileIcon;
  }

  const iconColorClass = isSelected ? 'text-blue-600 dark:text-blue-400' : 'text-neutral-600 dark:text-neutral-400';

  return Icon ? <Icon className={cn('h-4 w-4 shrink-0', iconColorClass)} /> : <></>;
};
