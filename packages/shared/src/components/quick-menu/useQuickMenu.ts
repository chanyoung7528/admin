import { type DragCancelEvent, type DragEndEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { useCallback, useState } from 'react';

import type { QuickMenuItem } from './types';

interface UseQuickMenuProps {
  initialItems: QuickMenuItem[];
  onItemsChange?: (items: QuickMenuItem[]) => void;
  maxItems?: number;
}

export function useQuickMenu({ initialItems, onItemsChange, maxItems = 12 }: UseQuickMenuProps) {
  const [items, setItems] = useState<QuickMenuItem[]>(initialItems);
  const [isEditMode, setIsEditMode] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<ReturnType<typeof setTimeout> | null>(null);

  // DnD sensors - 꾹 누르기 지원
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 500, // 500ms 꾹 누르기
        tolerance: 8,
      },
    })
  );

  // 드래그 종료 처리
  const handleDragEnd = useCallback(
    (event: DragEndEvent) => {
      const { active, over } = event;

      if (over && active.id !== over.id) {
        setItems(prevItems => {
          const oldIndex = prevItems.findIndex(item => item.id === active.id);
          const newIndex = prevItems.findIndex(item => item.id === over.id);

          const newItems = arrayMove(prevItems, oldIndex, newIndex).map((item, index) => ({
            ...item,
            order: index,
          }));

          onItemsChange?.(newItems);
          return newItems;
        });
      } else {
        // 드래그가 취소되었거나 같은 위치에 드롭된 경우, order를 재정렬하여 위치 재배치
        setItems(prevItems => {
          const newItems = prevItems.map((item, index) => ({
            ...item,
            order: index,
          }));
          // order가 변경되지 않았어도 상태를 업데이트하여 재렌더링 유도
          onItemsChange?.(newItems);
          return newItems;
        });
      }
    },
    [onItemsChange]
  );

  // 드래그 취소 처리 (명시적으로 취소된 경우)
  const handleDragCancel = useCallback(
    (_event: DragCancelEvent) => {
      // 드래그 취소 시 order를 재정렬하여 위치 재배치
      setItems(prevItems => {
        const newItems = prevItems.map((item, index) => ({
          ...item,
          order: index,
        }));
        // 상태를 업데이트하여 재렌더링 유도
        onItemsChange?.(newItems);
        return newItems;
      });
    },
    [onItemsChange]
  );

  // 편집 모드 토글
  const toggleEditMode = useCallback(() => {
    setIsEditMode(prev => !prev);
  }, []);

  // 아이템 삭제
  const deleteItem = useCallback(
    (id: string) => {
      setItems(prevItems => {
        const newItems = prevItems
          .filter(item => item.id !== id)
          .map((item, index) => ({
            ...item,
            order: index,
          }));
        onItemsChange?.(newItems);
        return newItems;
      });
    },
    [onItemsChange]
  );

  // 아이템 추가
  const addItem = useCallback(
    (item: Omit<QuickMenuItem, 'id' | 'order'>) => {
      if (items.length >= maxItems) {
        alert(`최대 ${maxItems}개까지만 추가할 수 있습니다.`);
        return;
      }

      setItems(prevItems => {
        const newItem: QuickMenuItem = {
          ...item,
          id: crypto.randomUUID(),
          order: prevItems.length,
        };
        const newItems = [...prevItems, newItem];
        onItemsChange?.(newItems);
        return newItems;
      });
    },
    [items.length, maxItems, onItemsChange]
  );

  // 아이템 수정
  const updateItem = useCallback(
    (id: string, updates: Partial<Omit<QuickMenuItem, 'id' | 'order'>>) => {
      setItems(prevItems => {
        const newItems = prevItems.map(item => (item.id === id ? { ...item, ...updates } : item));
        onItemsChange?.(newItems);
        return newItems;
      });
    },
    [onItemsChange]
  );

  // 롱프레스 시작
  const handleLongPressStart = useCallback(() => {
    const timer = setTimeout(() => {
      setIsEditMode(true);
    }, 500);
    setLongPressTimer(timer);
  }, []);

  // 롱프레스 취소
  const handleLongPressCancel = useCallback(() => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  }, [longPressTimer]);

  return {
    items,
    isEditMode,
    setIsEditMode,
    sensors,
    handleDragEnd,
    handleDragCancel,
    toggleEditMode,
    deleteItem,
    addItem,
    updateItem,
    handleLongPressStart,
    handleLongPressCancel,
  };
}
