import type { TreeDataItem } from './types';

/**
 * 부모 맵 생성 유틸리티
 * 각 아이템의 부모 ID를 매핑합니다.
 */
export function buildParentMap(items: TreeDataItem[], parentId?: string, map?: Map<string, string>): Map<string, string> {
  if (!map) map = new Map();
  for (const item of items) {
    if (parentId) map.set(item.id, parentId);
    if (item.children) buildParentMap(item.children, item.id, map);
  }
  return map;
}

/**
 * Depth 계산 유틸리티
 * 아이템의 깊이를 계산합니다.
 */
export function getItemDepth(itemId: string, parentMap: Map<string, string>): number {
  let depth = 0;
  let currentId: string | null = itemId;

  while (currentId) {
    const parentId = parentMap.get(currentId);
    if (parentId) {
      depth++;
      currentId = parentId;
    } else {
      break;
    }
  }

  return depth;
}

/**
 * 아이템 찾기 유틸리티
 * ID로 아이템을 찾습니다.
 */
export function findItemById(items: TreeDataItem[], id: string): TreeDataItem | null {
  for (const item of items) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
}

/**
 * 아이템 재정렬 유틸리티
 * 드래그 앤 드롭으로 아이템을 재정렬합니다.
 */
export function reorderItems(items: TreeDataItem[], activeId: string, overId: string, parentMap: Map<string, string>): TreeDataItem[] {
  const activeDepth = getItemDepth(activeId, parentMap);
  const overDepth = getItemDepth(overId, parentMap);

  // 같은 depth가 아니면 재정렬하지 않음
  if (activeDepth !== overDepth) {
    return items;
  }

  // 같은 부모를 가진 경우에만 재정렬
  const activeParentId = parentMap.get(activeId);
  const overParentId = parentMap.get(overId);

  if (activeParentId !== overParentId) {
    return items;
  }

  // 재정렬 로직
  function reorder(list: TreeDataItem[]): TreeDataItem[] {
    const activeIndex = list.findIndex(item => item.id === activeId);
    const overIndex = list.findIndex(item => item.id === overId);

    if (activeIndex !== -1 && overIndex !== -1) {
      const newList = [...list];
      const [movedItem] = newList.splice(activeIndex, 1);
      newList.splice(overIndex, 0, movedItem as TreeDataItem);
      return newList;
    }

    return list.map(item => ({
      ...item,
      children: item.children ? reorder(item.children) : undefined,
    }));
  }

  return reorder(items);
}

/**
 * 모든 노드 ID 수집 유틸리티
 */
export function collectAllNodeIds(items: TreeDataItem[], idsSet: Set<string> = new Set()): Set<string> {
  items.forEach(item => {
    if (item.children && item.children.length > 0) {
      idsSet.add(item.id);
      collectAllNodeIds(item.children, idsSet);
    }
  });
  return idsSet;
}

/**
 * 타겟까지의 경로 찾기 유틸리티
 */
export function findPathToTarget(items: TreeDataItem[], targetId: string, idsSet: Set<string> = new Set()): boolean {
  for (const item of items) {
    if (item.id === targetId) {
      return true;
    }
    if (item.children) {
      idsSet.add(item.id);
      if (findPathToTarget(item.children, targetId, idsSet)) {
        return true;
      }
      idsSet.delete(item.id);
    }
  }
  return false;
}
