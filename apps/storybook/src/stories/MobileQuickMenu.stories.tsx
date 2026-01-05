import type { QuickMenuItemType } from '@repo/shared/components/quick-menu';
import { MobileQuickMenu, MobileQuickMenuWithAll } from '@repo/shared/components/quick-menu';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import CustomDocsPage from '../components/CustomDocsPage';

const meta = {
  title: 'Components/MobileQuickMenu',
  component: MobileQuickMenu,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Mobile Quick Menu"
          description="네이버 스타일의 모바일 퀵메뉴 컴포넌트입니다. 드래그 앤 드롭, 롱프레스 편집, 전체 메뉴 선택을 지원합니다."
          installationDeps={['@dnd-kit/core', '@dnd-kit/sortable', '@dnd-kit/utilities', 'framer-motion', 'lucide-react']}
          implementationCode={`// types.ts
export interface QuickMenuItem {
  id: string;
  title: string;
  icon: string; // lucide-react icon name or emoji
  href: string;
  color?: string;
  order: number;
}

// useQuickMenu.ts - Custom Hook
import { useState, useCallback } from 'react';
import { useSensors, useSensor, MouseSensor, TouchSensor } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';

export function useQuickMenu({ initialItems, onItemsChange, maxItems = 12 }) {
  const [items, setItems] = useState(initialItems);
  const [isEditMode, setIsEditMode] = useState(false);

  const sensors = useSensors(
    useSensor(MouseSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 500, tolerance: 8 } })
  );

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);
        const newItems = arrayMove(prevItems, oldIndex, newIndex).map((item, index) => ({
          ...item,
          order: index,
        }));
        onItemsChange?.(newItems);
        return newItems;
      });
    }
  }, [onItemsChange]);

  // ... more methods
  return { items, isEditMode, sensors, handleDragEnd, ... };
}`}
          exampleCode={`import { MobileQuickMenuWithAll } from '@repo/shared/components/quick-menu';
import { useState } from 'react';

function MyPage() {
  const [items, setItems] = useState(defaultItems);

  return (
    <MobileQuickMenuWithAll
      initialItems={items}
      allMenus={allAvailableMenus}
      onItemsChange={setItems}
      onItemClick={(item) => navigate(item.href)}
      maxItems={12}
      columns={4}
      enableEdit={true}
    />
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    maxItems: {
      control: 'number',
      description: '최대 아이템 개수',
    },
    columns: {
      control: { type: 'range', min: 2, max: 6, step: 1 },
      description: '그리드 컬럼 수',
    },
    enableEdit: {
      control: 'boolean',
      description: '편집 기능 활성화',
    },
  },
} satisfies Meta<typeof MobileQuickMenu>;

export default meta;
type Story = StoryObj<typeof meta>;

const defaultItems: QuickMenuItemType[] = [
  { id: '1', title: '홈', icon: '🏠', href: '/', color: '#3b82f6', order: 0 },
  { id: '2', title: '검색', icon: '🔍', href: '/search', color: '#10b981', order: 1 },
  { id: '3', title: '알림', icon: '🔔', href: '/notifications', color: '#f59e0b', order: 2 },
  { id: '4', title: '설정', icon: '⚙️', href: '/settings', color: '#8b5cf6', order: 3 },
  { id: '5', title: '프로필', icon: '👤', href: '/profile', color: '#ec4899', order: 4 },
  { id: '6', title: '메시지', icon: '💬', href: '/messages', color: '#06b6d4', order: 5 },
  { id: '7', title: '즐겨찾기', icon: '⭐', href: '/favorites', color: '#eab308', order: 6 },
  { id: '8', title: '장바구니', icon: '🛒', href: '/cart', color: '#f97316', order: 7 },
];

const allMenus: Omit<QuickMenuItemType, 'order'>[] = [
  ...defaultItems.map(({ order: _order, ...rest }) => rest),
  { id: '9', title: '뉴스', icon: '📰', href: '/news', color: '#14b8a6' },
  { id: '10', title: '지도', icon: '🗺️', href: '/map', color: '#f43f5e' },
  { id: '11', title: '사진', icon: '📷', href: '/photos', color: '#a855f7' },
  { id: '12', title: '동영상', icon: '🎥', href: '/videos', color: '#0ea5e9' },
  { id: '13', title: '음악', icon: '🎵', href: '/music', color: '#ec4899' },
  { id: '14', title: '게임', icon: '🎮', href: '/games', color: '#8b5cf6' },
  { id: '15', title: '책', icon: '📚', href: '/books', color: '#10b981' },
  { id: '16', title: '날씨', icon: '🌤️', href: '/weather', color: '#06b6d4' },
];

/**
 * 기본 퀵메뉴 (전체 메뉴 없음)
 */
export const Default: Story = {
  args: {
    initialItems: defaultItems,
    maxItems: 12,
    columns: 4,
    enableEdit: true,
    onItemClick: item => {
      alert(`클릭: ${item.title}`);
    },
    onItemsChange: () => {
      // 상태 변경 처리
    },
  },
};

/**
 * 전체 메뉴 포함 (권장)
 * 상단에 나의 퀵메뉴, 하단에 전체 메뉴가 표시됩니다.
 */
function WithAllMenusComponent() {
  const [items, setItems] = useState(defaultItems.slice(0, 4));

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <MobileQuickMenuWithAll
        initialItems={items}
        allMenus={allMenus}
        onItemsChange={setItems}
        onItemClick={item => alert(`${item.title} 클릭!`)}
        maxItems={12}
        columns={4}
        enableEdit={true}
      />
    </div>
  );
}

export const WithAllMenus: Story = {
  args: {
    initialItems: [],
  },
  render: () => <WithAllMenusComponent />,
};

/**
 * 인터랙티브 테스트
 * 실시간으로 상태를 확인하면서 테스트할 수 있습니다.
 */
function InteractiveComponent() {
  const [items, setItems] = useState(defaultItems);

  return (
    <div className="space-y-6 p-4">
      {/* 가이드 */}
      <div className="mx-auto max-w-md rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 font-semibold text-blue-900">🎯 사용 방법</h3>
        <ul className="space-y-1 text-sm text-blue-700">
          <li>• 편집 버튼을 눌러 편집 모드 진입</li>
          <li>• 아이콘을 드래그하여 순서 변경</li>
          <li>• X 버튼으로 아이템 삭제</li>
          <li>• 드래그가 부드럽게 작동합니다</li>
          <li>• 흔들림 효과가 자연스럽게 개선됨</li>
        </ul>
      </div>

      {/* 컴포넌트 */}
      <MobileQuickMenu
        initialItems={items}
        onItemsChange={setItems}
        onItemClick={item => alert(`${item.title} 클릭!`)}
        maxItems={12}
        columns={4}
        enableEdit={true}
      />

      {/* 상태 표시 */}
      <div className="mx-auto max-w-md rounded-lg border bg-gray-50 p-4">
        <h4 className="mb-2 font-semibold text-gray-900">현재 상태 ({items.length}개)</h4>
        <div className="space-y-1 text-xs">
          {items.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <span className="font-mono text-gray-500">#{index + 1}</span>
              <span>{item.icon}</span>
              <span>{item.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Interactive: Story = {
  args: {
    initialItems: [],
  },
  render: () => <InteractiveComponent />,
};

/**
 * 모바일 화면 시뮬레이션
 * 실제 모바일 기기처럼 보여줍니다.
 */
function MobileSimulationComponent() {
  const [items, setItems] = useState(defaultItems.slice(0, 6));

  return (
    <div className="flex justify-center bg-gray-200 p-8">
      <div className="relative h-[667px] w-[375px] overflow-hidden rounded-[3rem] border-[14px] border-gray-900 bg-white shadow-2xl">
        {/* 노치 */}
        <div className="absolute top-0 left-1/2 z-50 h-7 w-40 -translate-x-1/2 rounded-b-3xl bg-gray-900" />

        {/* 상태바 */}
        <div className="flex h-12 items-center justify-between bg-gradient-to-r from-blue-500 to-indigo-600 px-6 pt-2 text-xs text-white">
          <span className="font-medium">9:41</span>
          <div className="flex items-center gap-2">
            <span>📶</span>
            <span>🔋</span>
          </div>
        </div>

        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-6 pb-6 text-white">
          <h1 className="text-xl font-bold">마이페이지</h1>
          <p className="mt-1 text-sm text-blue-100">자주 사용하는 메뉴</p>
        </div>

        {/* 컨텐츠 */}
        <div className="h-[calc(667px-120px)] overflow-auto bg-gray-50">
          <div className="-mt-4">
            <MobileQuickMenuWithAll
              initialItems={items}
              allMenus={allMenus}
              onItemsChange={setItems}
              onItemClick={item => {
                // 실제 앱에서는 navigate 사용
                alert(`${item.title} 클릭!`);
              }}
              maxItems={8}
              columns={4}
              enableEdit={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export const MobileSimulation = {
  render: () => <MobileSimulationComponent />,
};

/**
 * 빈 상태
 */
function EmptyStateComponent() {
  const [items, setItems] = useState<QuickMenuItemType[]>([]);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <MobileQuickMenuWithAll
        initialItems={items}
        allMenus={allMenus}
        onItemsChange={setItems}
        onItemClick={item => {
          // 실제 앱에서는 navigate 사용
          alert(`${item.title} 클릭!`);
        }}
        maxItems={12}
        columns={4}
        enableEdit={true}
      />
    </div>
  );
}

export const EmptyState = {
  render: () => <EmptyStateComponent />,
};
/**
 * 최대 개수 도달
 */
function MaxItemsComponent() {
  const [items, setItems] = useState(defaultItems);

  return (
    <div className="min-h-screen w-full bg-gray-50 p-4">
      <MobileQuickMenuWithAll
        initialItems={items}
        allMenus={allMenus}
        onItemsChange={setItems}
        onItemClick={item => {
          // 실제 앱에서는 navigate 사용
          alert(`${item.title} 클릭!`);
        }}
        maxItems={8}
        columns={4}
        enableEdit={true}
      />
    </div>
  );
}

export const MaxItems = {
  render: () => <MaxItemsComponent />,
};
