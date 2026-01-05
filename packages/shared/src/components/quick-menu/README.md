# Mobile Quick Menu Component

네이버 스타일의 모바일 퀵메뉴 컴포넌트입니다. 드래그 앤 드롭, 롱프레스 편집, 애니메이션 효과를 지원합니다.

## 주요 기능

### 🎯 핵심 기능

- **드래그 앤 드롭**: 500ms 롱프레스 후 드래그하여 순서 변경
- **편집 모드**: 편집 버튼 클릭 또는 아이콘 롱프레스로 진입
- **CRUD 작업**: 추가, 수정, 삭제 지원
- **애니메이션**: Framer Motion을 활용한 부드러운 전환 효과
- **북마크 표시**: 상위 4개 아이템에 자동 북마크 표시

### 🛠 기술 스택

- **@dnd-kit**: 드래그 앤 드롭 기능
- **framer-motion**: 애니메이션 효과
- **lucide-react**: 아이콘

## 사용 방법

### 기본 사용

\`\`\`tsx
import { MobileQuickMenu } from '@repo/shared/components/quick-menu';
import type { QuickMenuItemType } from '@repo/shared/components/quick-menu';
import { useState } from 'react';

function App() {
const [items, setItems] = useState<QuickMenuItemType[]>([
{
id: '1',
title: '홈',
icon: 'Home',
href: '/',
color: '#3b82f6',
order: 0
},
// ... more items
]);

return (
<MobileQuickMenu
initialItems={items}
onItemsChange={setItems}
onItemClick={(item) => {
console.log('Clicked:', item);
// 네비게이션 로직
}}
maxItems={12}
columns={4}
enableEdit={true}
/>
);
}
\`\`\`

### 커스텀 훅 사용

UI와 로직을 분리하여 사용할 수 있습니다:

\`\`\`tsx
import { useQuickMenu } from '@repo/shared/components/quick-menu';

function CustomQuickMenu() {
const {
items,
isEditMode,
toggleEditMode,
deleteItem,
addItem,
updateItem,
} = useQuickMenu({
initialItems: [...],
onItemsChange: (items) => {
// 로컬 스토리지나 API에 저장
localStorage.setItem('quickMenu', JSON.stringify(items));
},
maxItems: 12,
});

// 커스텀 UI 구현
return (
<div>
{/_ Your custom UI _/}
</div>
);
}
\`\`\`

## Props

### MobileQuickMenu

| Prop            | Type                               | Default  | Description           |
| --------------- | ---------------------------------- | -------- | --------------------- |
| `initialItems`  | `QuickMenuItem[]`                  | required | 초기 메뉴 아이템 목록 |
| `maxItems`      | `number`                           | `12`     | 최대 아이템 개수      |
| `columns`       | `number`                           | `4`      | 그리드 컬럼 수        |
| `enableEdit`    | `boolean`                          | `true`   | 편집 기능 활성화 여부 |
| `onItemClick`   | `(item: QuickMenuItem) => void`    | -        | 아이템 클릭 핸들러    |
| `onItemsChange` | `(items: QuickMenuItem[]) => void` | -        | 아이템 변경 핸들러    |

### QuickMenuItem Type

\`\`\`typescript
interface QuickMenuItem {
id: string; // 고유 ID
title: string; // 메뉴 제목
icon: string; // lucide-react 아이콘 이름
href: string; // 링크 URL
color?: string; // 배경 색상 (hex)
order: number; // 정렬 순서
}
\`\`\`

## 아이콘 사용

lucide-react의 모든 아이콘을 사용할 수 있습니다:

\`\`\`tsx
const items = [
{ icon: 'Home', ... },
{ icon: 'Search', ... },
{ icon: 'Bell', ... },
{ icon: 'Settings', ... },
{ icon: 'User', ... },
// ... 더 많은 아이콘은 https://lucide.dev 참고
];
\`\`\`

## 사용자 인터랙션

### 편집 모드 진입

1. **편집 버튼 클릭**: 헤더의 "편집" 버튼 클릭
2. **롱프레스**: 아이콘을 500ms 이상 꾹 누르기

### 드래그 앤 드롭

1. 편집 모드 진입
2. 아이콘을 누르고 드래그
3. 원하는 위치에 드롭

### 아이템 삭제

1. 편집 모드 진입
2. 아이템 우측 상단의 X 버튼 클릭

### 아이템 추가

1. 편집 모드 진입
2. - 버튼 클릭 (최대 개수 미만일 때만 표시)

## 애니메이션 효과

### 진입/퇴장 애니메이션

- Scale + Fade 효과
- Spring 타입의 부드러운 전환

### 편집 모드 애니메이션

- 아이콘 흔들림 (wiggle) 효과
- 펄스 효과로 편집 가능 상태 표시

### 드래그 애니메이션

- 드래그 중 확대 효과 (105%)
- 투명도 감소로 드래그 상태 표시

## 예제

### localStorage와 연동

\`\`\`tsx
function PersistentQuickMenu() {
const [items, setItems] = useState<QuickMenuItemType[]>(() => {
const saved = localStorage.getItem('quickMenu');
return saved ? JSON.parse(saved) : defaultItems;
});

const handleItemsChange = (newItems: QuickMenuItemType[]) => {
setItems(newItems);
localStorage.setItem('quickMenu', JSON.stringify(newItems));
};

return (
<MobileQuickMenu
      initialItems={items}
      onItemsChange={handleItemsChange}
    />
);
}
\`\`\`

### 라우터와 연동

\`\`\`tsx
import { useNavigate } from '@tanstack/react-router';

function NavigableQuickMenu() {
const navigate = useNavigate();

return (
<MobileQuickMenu
initialItems={menuItems}
onItemClick={(item) => {
navigate({ to: item.href });
}}
/>
);
}
\`\`\`

### API와 연동

\`\`\`tsx
function ApiQuickMenu() {
const [items, setItems] = useState([]);

useEffect(() => {
// 초기 로드
fetchMenuItems().then(setItems);
}, []);

const handleItemsChange = async (newItems) => {
setItems(newItems);
// API 업데이트
await updateMenuItems(newItems);
};

return (
<MobileQuickMenu
      initialItems={items}
      onItemsChange={handleItemsChange}
    />
);
}
\`\`\`

## Storybook

다양한 예제는 Storybook에서 확인할 수 있습니다:

\`\`\`bash
pnpm storybook
\`\`\`

- **Default**: 기본 사용 예제
- **Interactive**: 인터랙티브 테스트
- **ThreeColumns**: 3컬럼 레이아웃
- **ReadOnly**: 읽기 전용 모드
- **MobileSimulation**: 모바일 화면 시뮬레이션

## 커스터마이징

### 색상 테마

\`\`\`tsx
const customItems = items.map(item => ({
...item,
color: getThemeColor(item.category), // 카테고리별 색상
}));
\`\`\`

### 그리드 레이아웃

\`\`\`tsx
<MobileQuickMenu
columns={3} // 3컬럼
columns={5} // 5컬럼
columns={4} // 4컬럼 (기본)
/>
\`\`\`

### 최대 아이템 제한

\`\`\`tsx
<MobileQuickMenu
maxItems={8} // 최대 8개
maxItems={16} // 최대 16개
/>
\`\`\`

## 브라우저 지원

- Chrome (최신)
- Safari (iOS 14+)
- Firefox (최신)
- Edge (최신)

## 라이센스

MIT
