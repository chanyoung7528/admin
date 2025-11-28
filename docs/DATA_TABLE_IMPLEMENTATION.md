# DataTable 공통화 작업 완료 요약

## 📋 프로젝트 구조

```
src/
├── domains/
│   ├── settlement/
│   │   ├── components/
│   │   │   └── SettlementTable.tsx      # 공통 DataTable 적용
│   │   ├── types/
│   │   │   └── settlement.ts            # Settlement 타입 정의
│   │   └── columns/
│   │       └── settlementColumns.tsx    # Settlement 컬럼 정의
│   └── user/
│       ├── components/
│       │   └── UserListTable.tsx        # 공통 DataTable 적용
│       ├── types/
│       │   └── user.ts                  # User 타입 정의
│       └── columns/
│           └── userColumns.tsx          # User 컬럼 정의
│
└── packages/shared/src/components/
    └── data-table/
        ├── data-table.tsx               # ✨ 공통 DataTable 컴포넌트
        ├── pagination.tsx               # 페이지네이션
        ├── toolbar.tsx                  # 검색/필터 툴바
        ├── faceted-filter.tsx           # 패싯 필터
        └── use-table-url-state.ts       # URL 상태 관리 훅
```

## ✅ 완료된 작업

### 1. 공통 DataTable 컴포넌트 생성

- **위치**: `packages/shared/src/components/data-table/data-table.tsx`
- **기능**:
  - @tanstack/react-table 기반
  - 검색, 필터링, 정렬, 페이지네이션 자동 지원
  - Controlled/Uncontrolled 모드 지원
  - 기존 Toolbar, Pagination 컴포넌트 통합
  - 커스터마이징 가능한 empty state

### 2. Settlement 도메인 적용

- **타입 정의** (`settlement/types/settlement.ts`):

  ```typescript
  interface Settlement {
    id: string;
    site: string;
    amount: number;
    period: string;
    status: 'completed' | 'pending';
    date: string;
  }
  ```

- **컬럼 정의** (`settlement/columns/settlementColumns.tsx`):
  - 금액 포맷팅 (KRW 통화)
  - 상태 배지 (완료/대기)
  - 필터링 지원

- **SettlementTable 리팩토링**:
  - 하드코딩된 테이블 HTML → 공통 DataTable 사용
  - 요약 통계 동적 계산
  - 상태 필터 적용

### 3. User 도메인 적용

- **타입 정의** (`user/types/user.ts`):

  ```typescript
  interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    site: string;
    status: 'active' | 'inactive' | 'suspended';
    createdAt: string;
  }
  ```

- **컬럼 정의** (`user/columns/userColumns.tsx`):
  - 상태 배지 (활성/비활성/정지)
  - 필터링 지원

- **UserListTable 구현**:
  - TODO 주석 제거 및 실제 구현
  - 공통 DataTable 사용
  - 샘플 데이터 추가

### 4. 버그 수정

- `@tanstack/react-table` 의존성 추가
- `dialog.tsx`, `popover.tsx` import 경로 수정
  - `'src/lib/utils'` → `'@shared/lib/utils'`

## 🎯 사용 방법

### 기본 사용

```tsx
import { DataTable } from '@shared/components/data-table';
import { columns } from '../columns';
import { type Data } from '../types';

function MyTable() {
  const data: Data[] = [...];

  return (
    <DataTable
      columns={columns}
      data={data}
      searchPlaceholder="검색..."
      emptyMessage="데이터가 없습니다."
    />
  );
}
```

### 필터 추가

```tsx
<DataTable
  columns={columns}
  data={data}
  filters={[
    {
      columnId: 'status',
      title: '상태',
      options: [
        { label: '활성', value: 'active' },
        { label: '비활성', value: 'inactive' },
      ],
    },
  ]}
/>
```

### URL 상태 관리 (선택적)

```tsx
import { useTableUrlState } from '@shared/components/data-table';

const { pagination, onPaginationChange, columnFilters, onColumnFiltersChange, globalFilter, onGlobalFilterChange } = useTableUrlState({
  search: router.query,
  navigate: router.navigate,
});

<DataTable
  columns={columns}
  data={data}
  pagination={pagination}
  onPaginationChange={onPaginationChange}
  columnFilters={columnFilters}
  onColumnFiltersChange={onColumnFiltersChange}
  globalFilter={globalFilter}
  onGlobalFilterChange={onGlobalFilterChange}
/>;
```

## 🔄 다음 도메인 적용 가이드

다른 도메인에 적용하려면:

1. **타입 정의** (`domains/{domain}/types/{domain}.ts`)
2. **컬럼 정의** (`domains/{domain}/columns/{domain}Columns.tsx`)
3. **테이블 컴포넌트**에서 DataTable 사용

모든 테이블이 일관된 UX와 기능을 제공하게 됩니다!

## 📦 의존성

- `@tanstack/react-table`: ^8.21.3
- 기존 shared 컴포넌트들 (Table, Input, Button, Select 등)

## ✅ 테스트 완료

- ✅ TypeScript 타입 체크 통과
- ✅ ESLint 통과
- ✅ 전체 빌드 성공
- ✅ Settlement 테이블 동작 확인
- ✅ User 테이블 동작 확인
