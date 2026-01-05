import { Input } from '@shared/ui/input';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Plus, Search } from 'lucide-react';
import { useState } from 'react';

import type { QuickMenuItem } from './types';

interface AllMenuSelectorProps {
  allMenus: Omit<QuickMenuItem, 'order'>[];
  selectedMenuIds: string[];
  onSelect: (menu: Omit<QuickMenuItem, 'order'>) => void;
  maxItems?: number;
}

export function AllMenuSelector({ allMenus, selectedMenuIds, onSelect, maxItems = 12 }: AllMenuSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredMenus = allMenus.filter(menu => menu.title.toLowerCase().includes(searchQuery.toLowerCase()));

  const isSelected = (id: string) => selectedMenuIds.includes(id);
  const canAddMore = selectedMenuIds.length < maxItems;

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-gray-900">전체 메뉴</h3>
          <p className="text-sm text-gray-500">
            원하는 메뉴를 선택하여 빠른 메뉴에 추가하세요 ({selectedMenuIds.length}/{maxItems})
          </p>
        </div>
      </div>

      {/* 검색 */}
      <div className="relative">
        <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <Input type="text" placeholder="메뉴 검색..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)} className="pl-10" />
      </div>

      {/* 메뉴 그리드 */}
      <div className="grid grid-cols-4 gap-3">
        <AnimatePresence mode="popLayout">
          {filteredMenus.map(menu => {
            const selected = isSelected(menu.id);
            const disabled = !selected && !canAddMore;

            return (
              <motion.button
                key={menu.id}
                layout
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: disabled ? 0.4 : 1 }}
                exit={{ scale: 0, opacity: 0 }}
                whileHover={disabled ? {} : { scale: 1.05 }}
                whileTap={disabled ? {} : { scale: 0.95 }}
                onClick={() => !disabled && onSelect(menu)}
                disabled={disabled}
                className="relative flex flex-col items-center justify-center gap-2 rounded-2xl p-4 transition-all disabled:cursor-not-allowed"
                style={{
                  backgroundColor: menu.color || '#f3f4f6',
                }}
              >
                {/* 선택 체크 */}
                {selected && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg"
                  >
                    <Check className="h-4 w-4" />
                  </motion.div>
                )}

                {/* 추가 아이콘 (미선택 상태) */}
                {!selected && canAddMore && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1 -right-1 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-white shadow-lg"
                  >
                    <Plus className="h-3 w-3" />
                  </motion.div>
                )}

                {/* 메뉴 내용 */}
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/50 text-2xl">{menu.icon}</div>

                <span className="line-clamp-2 text-center text-xs font-medium text-gray-800">{menu.title}</span>
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 검색 결과 없음 */}
      {filteredMenus.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-2 text-4xl">🔍</div>
          <p className="text-sm text-gray-500">검색 결과가 없습니다</p>
        </div>
      )}

      {/* 최대 개수 도달 */}
      {!canAddMore && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-center">
          <p className="text-sm text-amber-800">최대 {maxItems}개까지 선택할 수 있습니다. 기존 메뉴를 삭제 후 추가해주세요.</p>
        </motion.div>
      )}
    </div>
  );
}
