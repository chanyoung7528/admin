import { ContentHeader, ContentWrapper } from '@repo/shared/components/layouts/content';
import type { QuickMenuItemType } from '@repo/shared/components/quick-menu';
import { MobileQuickMenu } from '@repo/shared/components/quick-menu';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_public/mobile-quick-menu-example')({
  component: MobileQuickMenuExamplePage,
});

const defaultItems: QuickMenuItemType[] = [
  { id: '1', title: '홈', icon: 'Home', href: '/', color: '#3b82f6', order: 0 },
  { id: '2', title: '검색', icon: 'Search', href: '/search', color: '#10b981', order: 1 },
  { id: '3', title: '알림', icon: 'Bell', href: '/notifications', color: '#f59e0b', order: 2 },
  { id: '4', title: '설정', icon: 'Settings', href: '/settings', color: '#8b5cf6', order: 3 },
  { id: '5', title: '프로필', icon: 'User', href: '/profile', color: '#ec4899', order: 4 },
  { id: '6', title: '메시지', icon: 'MessageSquare', href: '/messages', color: '#06b6d4', order: 5 },
  { id: '7', title: '즐겨찾기', icon: 'Star', href: '/favorites', color: '#eab308', order: 6 },
  { id: '8', title: '장바구니', icon: 'ShoppingCart', href: '/cart', color: '#f97316', order: 7 },
];

function MobileQuickMenuExamplePage() {
  const [items, setItems] = useState(defaultItems);

  return (
    <ContentWrapper>
      <ContentHeader
        title="모바일 퀵메뉴 예제"
        description="네이버 스타일의 드래그 앤 드롭 퀵메뉴입니다. 아이콘을 길게 눌러 편집 모드로 전환하거나, 편집 버튼을 클릭하세요."
      />

      <div className="space-y-6">
        {/* 사용 가이드 */}
        <div className="rounded-lg border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
          <h3 className="mb-3 text-lg font-bold text-blue-900">🎯 인터랙티브 가이드</h3>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <span className="mt-0.5">👆</span>
              <span>
                <strong>롱프레스 편집:</strong> 아이콘을 500ms 이상 꾹 눌러 편집 모드 진입
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">✏️</span>
              <span>
                <strong>편집 버튼:</strong> 상단 우측의 "편집" 버튼으로도 진입 가능
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">🎨</span>
              <span>
                <strong>드래그 앤 드롭:</strong> 편집 모드에서 아이콘을 드래그하여 순서 변경
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">❌</span>
              <span>
                <strong>삭제:</strong> 우측 상단 X 버튼으로 아이템 삭제
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">➕</span>
              <span>
                <strong>추가:</strong> + 버튼으로 새 아이템 추가 (최대 12개)
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-0.5">⭐</span>
              <span>
                <strong>북마크:</strong> 상위 4개 아이템에 자동으로 북마크 표시
              </span>
            </li>
          </ul>
        </div>

        {/* 모바일 시뮬레이션 */}
        <div className="flex justify-center">
          <div className="w-full max-w-md overflow-hidden rounded-2xl border-8 border-gray-800 bg-white shadow-2xl">
            {/* 상태바 */}
            <div className="flex h-7 items-center justify-between bg-gray-900 px-6 text-xs text-white">
              <span className="font-medium">9:41</span>
              <div className="flex items-center gap-2">
                <span>📶</span>
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>

            {/* 헤더 */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6 pb-8 text-white">
              <h1 className="text-2xl font-bold">마이페이지</h1>
              <p className="mt-1 text-sm text-blue-100">자주 사용하는 메뉴를 빠르게 이용하세요</p>
            </div>

            {/* 퀵메뉴 */}
            <div className="-mt-4">
              <MobileQuickMenu
                initialItems={items}
                onItemsChange={newItems => {
                  setItems(newItems);
                }}
                onItemClick={item => {
                  alert(`"${item.title}" 메뉴를 클릭했습니다!\n\n경로: ${item.href}`);
                }}
                maxItems={12}
                columns={4}
                enableEdit={true}
              />
            </div>

            {/* 추가 컨텐츠 */}
            <div className="space-y-4 p-6">
              <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
              <div className="h-24 animate-pulse rounded-lg bg-gray-100" />
            </div>
          </div>
        </div>

        {/* 현재 상태 디버깅 */}
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
          <h3 className="mb-3 flex items-center gap-2 font-bold text-gray-900">
            <span>🔍</span>
            현재 메뉴 상태 ({items.length}개)
          </h3>
          <div className="space-y-2">
            {items.map((item, index) => (
              <div key={item.id} className="flex items-center gap-3 rounded border bg-white p-2 text-sm">
                <div className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-white" style={{ backgroundColor: item.color }}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-gray-500">
                    {item.href} • {item.icon}
                  </div>
                </div>
                {index < 4 && <span className="text-blue-500">⭐</span>}
              </div>
            ))}
          </div>
        </div>

        {/* 기술 스택 */}
        <div className="rounded-lg border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-6">
          <h3 className="mb-3 text-lg font-bold text-purple-900">🛠 기술 스택</h3>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-purple-100 bg-white p-3">
              <div className="font-semibold text-purple-900">@dnd-kit</div>
              <div className="mt-1 text-xs text-purple-600">드래그 앤 드롭</div>
            </div>
            <div className="rounded-lg border border-purple-100 bg-white p-3">
              <div className="font-semibold text-purple-900">framer-motion</div>
              <div className="mt-1 text-xs text-purple-600">애니메이션</div>
            </div>
            <div className="rounded-lg border border-purple-100 bg-white p-3">
              <div className="font-semibold text-purple-900">lucide-react</div>
              <div className="mt-1 text-xs text-purple-600">아이콘</div>
            </div>
            <div className="rounded-lg border border-purple-100 bg-white p-3">
              <div className="font-semibold text-purple-900">Custom Hook</div>
              <div className="mt-1 text-xs text-purple-600">UI/로직 분리</div>
            </div>
          </div>
        </div>
      </div>
    </ContentWrapper>
  );
}
