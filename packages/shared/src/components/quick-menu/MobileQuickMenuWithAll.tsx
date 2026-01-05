import { useState } from 'react';

import { MobileQuickMenu } from './MobileQuickMenu';
import type { QuickMenuItem } from './types';

const defaultItems: QuickMenuItem[] = [
  { id: '1', title: '홈', icon: 'Home', href: '/', color: '#3b82f6', order: 0 },
  { id: '2', title: '검색', icon: 'Search', href: '/search', color: '#10b981', order: 1 },
  { id: '3', title: '알림', icon: 'Bell', href: '/notifications', color: '#f59e0b', order: 2 },
  { id: '4', title: '설정', icon: 'Settings', href: '/settings', color: '#8b5cf6', order: 3 },
  { id: '5', title: '프로필', icon: 'User', href: '/profile', color: '#ec4899', order: 4 },
  { id: '6', title: '메시지', icon: 'MessageSquare', href: '/messages', color: '#06b6d4', order: 5 },
  { id: '7', title: '즐겨찾기', icon: 'Star', href: '/favorites', color: '#eab308', order: 6 },
  { id: '8', title: '장바구니', icon: 'ShoppingCart', href: '/cart', color: '#f97316', order: 7 },
];

interface MobileQuickMenuWithAllProps {
  initialItems?: QuickMenuItem[];
  allMenus?: Omit<QuickMenuItem, 'order'>[];
  onItemClick?: (item: QuickMenuItem) => void;
  onItemsChange?: (items: QuickMenuItem[]) => void;
  maxItems?: number;
  columns?: number;
  enableEdit?: boolean;
}

export function MobileQuickMenuWithAll({
  initialItems,
  allMenus,
  onItemClick,
  onItemsChange: externalOnItemsChange,
  maxItems = 12,
  columns = 4,
  enableEdit = true,
}: MobileQuickMenuWithAllProps = {}) {
  const [items, setItems] = useState<QuickMenuItem[]>(() => {
    if (initialItems) {
      return initialItems;
    }
    // 로컬 스토리지에서 저장된 메뉴 불러오기
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('mobile-quick-menu');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return defaultItems;
        }
      }
    }
    return defaultItems;
  });

  const handleItemsChange = (newItems: QuickMenuItem[]) => {
    setItems(newItems);
    // 외부 핸들러 호출
    externalOnItemsChange?.(newItems);
    // 로컬 스토리지에 저장
    if (typeof window !== 'undefined') {
      localStorage.setItem('mobile-quick-menu', JSON.stringify(newItems));
    }
  };

  const handleItemClick = (item: QuickMenuItem) => {
    if (onItemClick) {
      onItemClick(item);
    } else {
      // 실제 앱에서는 navigate 사용
      alert(`"${item.title}" 메뉴를 클릭했습니다!\n\n경로: ${item.href}`);
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-gray-50 to-gray-100">
      {/* 모바일 상태바 */}
      <div className="flex h-12 items-center justify-between bg-white px-6 shadow-sm">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm font-medium text-gray-700">9:41</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">📶</span>
          <span className="text-xs">📶</span>
          <span className="text-xs">🔋</span>
        </div>
      </div>

      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 py-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">마이페이지</h1>
        <p className="mt-2 text-sm text-blue-100">자주 사용하는 메뉴를 빠르게 이용하세요</p>
      </div>

      {/* 퀵메뉴 영역 */}
      <div className="flex-1 overflow-auto pb-8">
        <div className="-mt-6">
          <MobileQuickMenu
            initialItems={items}
            allMenus={allMenus}
            onItemsChange={handleItemsChange}
            onItemClick={handleItemClick}
            maxItems={maxItems}
            columns={columns}
            enableEdit={enableEdit}
          />
        </div>

        {/* 추가 컨텐츠 */}
        <div className="mx-auto mt-6 max-w-md space-y-4 px-4">
          {/* 최근 활동 */}
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-bold text-gray-900">
              <span className="text-xl">📊</span>
              최근 활동
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                  <span className="text-sm">🔔</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">새로운 알림 3개</p>
                  <p className="text-xs text-gray-500">5분 전</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                  <span className="text-sm">💬</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">메시지 2개</p>
                  <p className="text-xs text-gray-500">30분 전</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100">
                  <span className="text-sm">⭐</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-900">즐겨찾기 추가</p>
                  <p className="text-xs text-gray-500">1시간 전</p>
                </div>
              </div>
            </div>
          </div>

          {/* 가이드 */}
          <div className="rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 p-6 text-white shadow-md">
            <h3 className="mb-3 text-lg font-bold">💡 사용 가이드</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex gap-2">
                <span>•</span>
                <span>아이콘을 500ms 이상 꾹 누르면 편집 모드 진입</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>드래그하여 순서 변경 가능</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>X 버튼으로 삭제, + 버튼으로 추가</span>
              </li>
              <li className="flex gap-2">
                <span>•</span>
                <span>설정은 자동으로 저장됩니다</span>
              </li>
            </ul>
          </div>

          {/* 통계 카드 */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{items.length}</div>
                <div className="mt-1 text-xs text-gray-500">등록된 메뉴</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.min(items.length, 4)}</div>
                <div className="mt-1 text-xs text-gray-500">북마크</div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-md">
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">12</div>
                <div className="mt-1 text-xs text-gray-500">최대 개수</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <div className="border-t bg-white shadow-lg">
        <div className="flex items-center justify-around px-4 py-3">
          <button className="flex flex-col items-center gap-1 text-blue-600">
            <span className="text-xl">🏠</span>
            <span className="text-xs font-medium">홈</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xl">📊</span>
            <span className="text-xs">통계</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xl">⚙️</span>
            <span className="text-xs">설정</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-gray-400">
            <span className="text-xl">👤</span>
            <span className="text-xs">프로필</span>
          </button>
        </div>
      </div>
    </div>
  );
}
