# @repo/shared

공통 UI 컴포넌트 및 레이아웃 패키지

## 📦 주요 컴포넌트

### UI 컴포넌트

Radix UI 기반의 Shadcn 스타일 컴포넌트:

- Button, Input, Select, Checkbox
- Dialog, AlertDialog, Sheet
- Dropdown Menu, Popover, Tooltip
- Table, Tabs, Badge, Avatar
- Sidebar, Skeleton 등

### DataTable

TanStack Table 기반의 고성능 테이블 컴포넌트:

```tsx
import { DataTable } from '@repo/shared/components/data-table';

<DataTable
  columns={columns}
  data={data}
  searchPlaceholder="검색..."
  filters={[...]}
/>
```

자세한 사용법은 [DataTable 가이드](./docs/data-table/README.md) 참조

### Form 컴포넌트

React Hook Form 기반의 폼 컴포넌트:

```tsx
import { FormTable, FormInput, FormError } from '@repo/shared/components/form';

<FormTable title="기본 정보">
  <FormTable.Row>
    <FormTable.Cell label="이름" required>
      <FormInput name="name" control={control} />
    </FormTable.Cell>
  </FormTable.Row>
</FormTable>;
```

자세한 사용법은 [Form 문서](./docs/form/README.md) 참조

### Layouts

앱 레이아웃 컴포넌트:

- Header, Sidebar
- Layout (전체 레이아웃 래퍼)
- Content Wrapper, Widget Card

### Context

- ThemeProvider (다크모드)
- LayoutProvider (레이아웃 설정)

## 🎨 스타일링

Tailwind CSS v4 + CSS Variables 기반:

```css
/* 테마 변수 */
--background, --foreground
--primary, --secondary
--muted, --accent
--card, --border
```

## 📚 문서

- [DataTable 가이드](./docs/data-table/README.md)
- [DataTable 아키텍처](./docs/data-table/ARCHITECTURE.md)
- [Form 컴포넌트](./docs/form/README.md)

## 🔗 관련 링크

- [Radix UI](https://www.radix-ui.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [TanStack Table](https://tanstack.com/table)
