import React from 'react';

import { TreeLeaf } from './TreeLeaf';
import { TreeNode } from './TreeNode';
import type { TreeItemProps } from './types';

export const TreeItem = React.forwardRef<HTMLDivElement, TreeItemProps>(
  ({ data, selectedItemId, handleSelectChange, expandedItemIds, defaultNodeIcon, defaultLeafIcon, parentMap, isDraggingActive }, ref) => {
    return (
      <div ref={ref} role="tree">
        {data.map((item, index) => (
          <div key={item.id} className={index === 0 ? 'first:border-t-0' : ''}>
            {item.children ? (
              <TreeNode
                item={item}
                selectedItemId={selectedItemId}
                expandedItemIds={expandedItemIds}
                handleSelectChange={handleSelectChange}
                defaultNodeIcon={defaultNodeIcon}
                defaultLeafIcon={defaultLeafIcon}
                parentMap={parentMap}
                isDraggingActive={isDraggingActive}
              />
            ) : (
              <TreeLeaf
                item={item}
                selectedItemId={selectedItemId}
                handleSelectChange={handleSelectChange}
                defaultLeafIcon={defaultLeafIcon}
                parentMap={parentMap}
              />
            )}
          </div>
        ))}
      </div>
    );
  }
);
TreeItem.displayName = 'TreeItem';
