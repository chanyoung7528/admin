import { DndContext } from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import { Button } from '@shared/ui/button';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@shared/ui/sheet';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Edit3, icons, Plus, Save } from 'lucide-react';
import React, { useState } from 'react';

import { QuickMenuItem } from './QuickMenuItem';
import type { QuickMenuConfig, QuickMenuItem as QuickMenuItemType } from './types';
import { useQuickMenu } from './useQuickMenu';

interface MobileQuickMenuProps extends QuickMenuConfig {
  initialItems: QuickMenuItemType[];
  allMenus?: Omit<QuickMenuItemType, 'order'>[];
}

export function MobileQuickMenu({ initialItems, maxItems = 12, columns = 4, enableEdit = true, onItemClick, onItemsChange, allMenus }: MobileQuickMenuProps) {
  const { items, isEditMode, sensors, handleDragEnd, handleDragCancel, toggleEditMode, deleteItem, addItem, handleLongPressStart, handleLongPressCancel } =
    useQuickMenu({
      initialItems,
      onItemsChange,
      maxItems,
    });

  const [isMenuSheetOpen, setIsMenuSheetOpen] = useState(false);
  const [selectedMenus, setSelectedMenus] = useState<Set<string>>(new Set());

  const handleItemClick = (item: QuickMenuItemType) => {
    if (!isEditMode) {
      onItemClick?.(item);
    }
  };

  const handleAddButtonClick = () => {
    if (allMenus && allMenus.length > 0) {
      // 전체 메뉴 Sheet 열기
      setSelectedMenus(new Set()); // 선택 초기화
      setIsMenuSheetOpen(true);
    } else {
      // allMenus가 없으면 기본 동작
      const newItem = {
        title: `메뉴 ${items.length + 1}`,
        icon: 'Star',
        href: `/menu-${items.length + 1}`,
        color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
      };
      addItem(newItem);
    }
  };

  const handleToggleMenuSelection = (menuId: string) => {
    setSelectedMenus(prev => {
      const newSet = new Set(prev);
      if (newSet.has(menuId)) {
        newSet.delete(menuId);
      } else {
        // 최대 개수 체크
        if (items.length + newSet.size < maxItems) {
          newSet.add(menuId);
        } else {
          alert(`최대 ${maxItems}개까지만 추가할 수 있습니다.`);
        }
      }
      return newSet;
    });
  };

  const handleCompleteSelection = () => {
    if (selectedMenus.size === 0) {
      setIsMenuSheetOpen(false);
      return;
    }

    // 선택된 메뉴들을 모두 추가
    const menusToAdd = availableMenus.filter(menu => selectedMenus.has(menu.id));
    menusToAdd.forEach(menu => {
      addItem(menu);
    });

    // Sheet 닫기 및 선택 초기화
    setSelectedMenus(new Set());
    setIsMenuSheetOpen(false);
  };

  // 사용 가능한 메뉴 목록 (아직 추가되지 않은 메뉴)
  const availableMenus = allMenus?.filter(menu => !items.some(item => item.id === menu.id)) || [];

  return (
    <div className="mx-auto w-full max-w-md space-y-4 p-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">빠른 메뉴</h2>
        {enableEdit && (
          <motion.div whileTap={{ scale: 0.95 }}>
            <Button variant={isEditMode ? 'default' : 'outline'} size="sm" onClick={toggleEditMode} className="gap-2">
              {isEditMode ? (
                <>
                  <Save className="h-4 w-4" />
                  완료
                </>
              ) : (
                <>
                  <Edit3 className="h-4 w-4" />
                  편집
                </>
              )}
            </Button>
          </motion.div>
        )}
      </div>

      {/* 설명 텍스트 */}
      <AnimatePresence mode="wait">
        {isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 25,
            }}
            className="overflow-hidden"
          >
            <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
              <p className="text-center text-sm font-medium text-blue-700">🎨 아이콘을 꾹 눌러 드래그하거나 X 버튼으로 삭제하세요</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 메뉴 그리드 */}
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragCancel={handleDragCancel}>
        <SortableContext items={items.map(item => item.id)} strategy={rectSortingStrategy}>
          <motion.div
            layout
            className="grid gap-3"
            style={{
              gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            }}
          >
            <AnimatePresence mode="popLayout">
              {items.map(item => (
                <QuickMenuItem
                  key={item.id}
                  item={item}
                  isEditMode={isEditMode}
                  onDelete={deleteItem}
                  onClick={handleItemClick}
                  onLongPressStart={handleLongPressStart}
                  onLongPressCancel={handleLongPressCancel}
                />
              ))}

              {/* 추가 버튼 (편집 모드) */}
              {isEditMode && items.length < maxItems && (
                <motion.button
                  key="add-button"
                  layout
                  layoutId="add-button"
                  initial={{ scale: 0, opacity: 0, rotate: -180 }}
                  animate={{ scale: 1, opacity: 1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{
                    type: 'spring',
                    stiffness: 260,
                    damping: 20,
                  }}
                  whileHover={{ scale: 1.05, borderColor: '#3b82f6' }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleAddButtonClick}
                  className="flex flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100 p-4 transition-all duration-200 hover:from-blue-50 hover:to-blue-100 hover:shadow-md"
                >
                  <motion.div
                    animate={{ rotate: [0, 90, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-sm"
                  >
                    <Plus className="h-6 w-6 text-blue-500" />
                  </motion.div>
                  <span className="text-xs font-medium text-gray-600">추가</span>
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        </SortableContext>
      </DndContext>

      {/* 안내 문구 (편집 모드 아닐 때) */}
      <AnimatePresence mode="wait">
        {!isEditMode && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{
              type: 'spring',
              stiffness: 200,
              damping: 20,
              delay: 0.2,
            }}
            className="pt-2 text-center text-xs text-gray-400"
          >
            <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
              💡 아이콘을 길게 눌러 편집 모드로 전환할 수 있습니다
            </motion.span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 전체 메뉴 선택 Sheet */}
      {allMenus && allMenus.length > 0 && (
        <Sheet
          open={isMenuSheetOpen}
          onOpenChange={open => {
            setIsMenuSheetOpen(open);
            if (!open) {
              // Sheet가 닫힐 때 선택 상태 초기화
              setSelectedMenus(new Set());
            }
          }}
        >
          <SheetContent side="bottom" className="flex h-[85vh] flex-col rounded-t-2xl p-0">
            <div className="flex flex-1 flex-col overflow-hidden">
              <div className="p-6 pb-4">
                <SheetHeader>
                  <SheetTitle className="flex items-center justify-between">
                    <span>메뉴 추가</span>
                    {selectedMenus.size > 0 && <span className="text-sm font-normal text-blue-600">({selectedMenus.size}개 선택됨)</span>}
                  </SheetTitle>
                  <SheetDescription>추가할 메뉴를 선택하고 완료 버튼을 눌러주세요</SheetDescription>
                </SheetHeader>
              </div>

              <div className="flex-1 overflow-auto px-6 pb-4">
                <div className="space-y-4">
                  {availableMenus.length === 0 ? (
                    <div className="py-12 text-center">
                      <p className="text-sm text-gray-500">추가할 수 있는 메뉴가 없습니다.</p>
                      <p className="mt-1 text-xs text-gray-400">모든 메뉴가 이미 추가되었습니다.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-4 gap-3">
                      {availableMenus.map(menu => {
                        const isSelected = selectedMenus.has(menu.id);
                        // 아이콘 동적 가져오기
                        const IconComponent = (icons as Record<string, React.ComponentType<{ className?: string }>>)[menu.icon] || Plus;

                        return (
                          <motion.button
                            key={menu.id}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleToggleMenuSelection(menu.id)}
                            className={`relative flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-all ${
                              isSelected ? 'shadow-lg ring-4 ring-blue-500 ring-offset-2' : 'hover:shadow-md'
                            }`}
                            style={{ backgroundColor: menu.color || '#f3f4f6' }}
                          >
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 shadow-lg"
                              >
                                <Check className="h-4 w-4 text-white" />
                              </motion.div>
                            )}
                            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm">
                              {typeof menu.icon === 'string' && menu.icon.length <= 2 ? (
                                <span className="text-2xl">{menu.icon}</span>
                              ) : (
                                <IconComponent className="h-6 w-6 text-gray-700" />
                              )}
                            </div>
                            <span className="line-clamp-2 text-center text-xs font-medium text-gray-800">{menu.title}</span>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}

                  {/* 이미 추가된 메뉴 표시 (회색 처리) */}
                  {allMenus.filter(menu => items.some(item => item.id === menu.id)).length > 0 && (
                    <div className="mt-8 border-t pt-6">
                      <h3 className="mb-4 text-sm font-semibold text-gray-500">이미 추가된 메뉴</h3>
                      <div className="grid grid-cols-4 gap-3">
                        {allMenus
                          .filter(menu => items.some(item => item.id === menu.id))
                          .map(menu => {
                            const IconComponent = (icons as Record<string, React.ComponentType<{ className?: string }>>)[menu.icon] || Plus;

                            return (
                              <div
                                key={menu.id}
                                className="relative flex flex-col items-center justify-center gap-2 rounded-2xl p-4 opacity-50"
                                style={{ backgroundColor: menu.color || '#f3f4f6' }}
                              >
                                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/60 backdrop-blur-sm">
                                  {typeof menu.icon === 'string' && menu.icon.length <= 2 ? (
                                    <span className="text-2xl">{menu.icon}</span>
                                  ) : (
                                    <IconComponent className="h-6 w-6 text-gray-700" />
                                  )}
                                </div>
                                <span className="line-clamp-2 text-center text-xs font-medium text-gray-800">{menu.title}</span>
                                <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-green-500">
                                  <Check className="h-3 w-3 text-white" />
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 완료 버튼 (하단 고정) */}
            <div className="border-t bg-white p-4 shadow-lg">
              <div className="mx-auto max-w-md">
                <div className="mb-3 flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {selectedMenus.size > 0 ? (
                      <span className="font-medium text-blue-600">{selectedMenus.size}개 메뉴 선택됨</span>
                    ) : (
                      <span className="text-gray-400">메뉴를 선택해주세요</span>
                    )}
                  </span>
                  <span className="text-gray-400">
                    {items.length}/{maxItems}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedMenus(new Set());
                      setIsMenuSheetOpen(false);
                    }}
                  >
                    취소
                  </Button>
                  <Button
                    className="flex-1"
                    onClick={handleCompleteSelection}
                    disabled={selectedMenus.size === 0 || items.length + selectedMenus.size > maxItems}
                  >
                    <Check className="mr-2 h-4 w-4" />
                    완료 ({selectedMenus.size})
                  </Button>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </div>
  );
}
