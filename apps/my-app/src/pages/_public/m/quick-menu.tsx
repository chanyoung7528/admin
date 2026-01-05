'use client';
import { MobileQuickMenuWithAll, type QuickMenuItemType } from '@repo/shared/components/quick-menu';
import { createFileRoute } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/_public/m/quick-menu')({
  component: MobileQuickMenuPage,
});

function MobileQuickMenuPage() {
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
    ...defaultItems.map(item => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { order, ...rest } = item;
      return rest;
    }),
    { id: '9', title: '뉴스', icon: '📰', href: '/news', color: '#14b8a6' },
    { id: '10', title: '지도', icon: '🗺️', href: '/map', color: '#f43f5e' },
    { id: '11', title: '사진', icon: '📷', href: '/photos', color: '#a855f7' },
    { id: '12', title: '동영상', icon: '🎥', href: '/videos', color: '#0ea5e9' },
    { id: '13', title: '음악', icon: '🎵', href: '/music', color: '#ec4899' },
    { id: '14', title: '게임', icon: '🎮', href: '/games', color: '#8b5cf6' },
    { id: '15', title: '책', icon: '📚', href: '/books', color: '#10b981' },
    { id: '16', title: '날씨', icon: '🌤️', href: '/weather', color: '#06b6d4' },
  ];
  const [items, setItems] = useState(defaultItems.slice(0, 4));

  return (
    <MobileQuickMenuWithAll
      initialItems={items}
      allMenus={allMenus}
      onItemsChange={setItems}
      onItemClick={_item => {
        // Item clicked
      }}
      maxItems={8}
      columns={4}
      enableEdit={true}
    />
  );
}
