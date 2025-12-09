# DataTable 공용 컨트롤러 가이드

## 개요

`useDataTableController`는 테이블 기능을 빠르게 구현할 수 있도록 설계된 범용 컨트롤러 훅입니다. URL 상태 관리, API 연동, 필터링, 페이징 등 테이블에 필요한 모든 로직을 자동으로 처리합니다.

## 핵심 장점

### ✅ Before (기존 방식)

```typescript
// 각 테이블마다 100줄 이상의 보일러플레이트 필요
export function useSettlementTableController({ service }) {
  const routerNavigate = useNavigate();
  const searchParams = useSearch({ strict: false });

  const navigate: NavigateFn = ({ search }) => {
    // 20줄의 navigate 로직
  };

  const { globalFilter, onGlobalFilterChange, ... } = useTableUrlState({
    // 10줄의 URL 상태 관리
  });

  const statusFilter = useMemo(() => {
    // 필터 정규화 로직
  }, [columnFilters]);

  const { data, isLoading, isError } = useSettlements({
    // API 파라미터 구성
  });

  const tableInstanceKey = useMemo(() => {
    // 테이블 키 생성
  }, [...]);

  useEffect(() => {
    // 페이지 범위 체크
  }, [pageCount, ensurePageInRange]);

  const tableProps = useMemo(() => ({
    // 30줄의 props 구성
  }), [...]);

  return { tableProps, ... };
}
```

### ✅ After (새로운 방식)

```typescript
// 단 15줄로 동일한 기능 구현
export function useSettlementTable({ service }) {
  return useDataTableController({
    tableId: `settlement-${service}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters, globalFilter }) => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      status: columnFilters.find(f => f.id === 'status')?.value,
      service,
      filter: globalFilter?.trim() || undefined,
    }),
    filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
    renderFilters: () => [{ columnId: 'status', title: '상태', options: [...] }],
  });
}
```

## 사용 패턴

### 1. 기본 사용 (최소 설정)

```typescript
import { useDataTableController } from '@shared/components/data-table';

export function useUserTable() {
  return useDataTableController({
    tableId: 'users',
    columns: userColumns,
    useQueryHook: useUsers, // { data, total, isLoading, isError } 반환 필요
  });
}
```

### 2. 필터 추가

```typescript
export function useUserTable() {
  return useDataTableController({
    tableId: 'users',
    columns: userColumns,
    useQueryHook: useUsers,
    filterConfigs: [
      { columnId: 'role', searchKey: 'role', type: 'array' },
      { columnId: 'status', searchKey: 'status', type: 'string' },
    ],
    renderFilters: () => [
      {
        columnId: 'role',
        title: '역할',
        options: [
          { label: '관리자', value: 'admin' },
          { label: '사용자', value: 'user' },
        ],
      },
    ],
  });
}
```

### 3. 커스텀 쿼리 파라미터

```typescript
export function useOrderTable() {
  return useDataTableController({
    tableId: 'orders',
    columns: orderColumns,
    useQueryHook: useOrders,
    queryParams: ({ pagination, columnFilters, globalFilter }) => {
      const dateRange = columnFilters.find(f => f.id === 'dateRange')?.value;
      return {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        startDate: dateRange?.[0],
        endDate: dateRange?.[1],
        search: globalFilter,
      };
    },
  });
}
```

### 4. 커스텀 검색 로직

```typescript
export function useProductTable() {
  return useDataTableController({
    tableId: 'products',
    columns: productColumns,
    useQueryHook: useProducts,
    searchPlaceholder: '상품명, SKU 검색...',
    globalFilterFn: (row, _, filterValue) => {
      const name = row.getValue('name').toLowerCase();
      const sku = row.getValue('sku').toLowerCase();
      const search = filterValue.toLowerCase();
      return name.includes(search) || sku.includes(search);
    },
  });
}
```

## useQueryHook 요구사항

`useDataTableController`에 전달하는 쿼리 훅은 다음 형식을 반환해야 합니다:

```typescript
interface QueryResult<TData> {
  data: TData[]; // 테이블 데이터
  total?: number; // 전체 데이터 수 (페이징용)
  isLoading: boolean; // 로딩 상태
  isError: boolean; // 에러 상태
}
```

### 예제: React Query 어댑터

```typescript
export function useSettlements(params) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: async () => {
      const result = await getSettlements(params);
      return result;
    },
    select: result => ({
      data: result.settlements,
      total: result.total,
      isLoading: false,
      isError: false,
    }),
  });
}
```

## 컴포넌트 통합

```typescript
export function SettlementTable({ service }) {
  const { tableProps, data, isLoading, isError } = useSettlementTable({ service });

  // 추가 UI 로직 (통계 등)
  const stats = useMemo(() => calculateStats(data), [data]);

  return (
    <div>
      <SummaryCards stats={stats} isLoading={isLoading} />
      {isError && <ErrorMessage />}
      <DataTable {...tableProps} />
    </div>
  );
}
```

## API 레퍼런스

### UseDataTableControllerParams

| 속성                | 타입                                | 필수 | 설명                               |
| ------------------- | ----------------------------------- | ---- | ---------------------------------- |
| `tableId`           | `string`                            | ✅   | 테이블 고유 식별자 (URL 키 생성용) |
| `columns`           | `ColumnDef<TData, TValue>[]`        | ✅   | TanStack Table 컬럼 정의           |
| `useQueryHook`      | `(params: any) => QueryResult`      | ✅   | 데이터 조회 훅                     |
| `queryParams`       | `(urlState) => any`                 | ❌   | URL 상태를 API 파라미터로 변환     |
| `filterConfigs`     | `FilterConfig[]`                    | ❌   | URL과 동기화할 필터 설정           |
| `renderFilters`     | `(columnFilters) => Filter[]`       | ❌   | 툴바에 표시할 필터 UI              |
| `searchPlaceholder` | `string`                            | ❌   | 검색창 플레이스홀더                |
| `emptyMessage`      | `string`                            | ❌   | 데이터 없을 때 메시지              |
| `globalFilterFn`    | `(row, columnId, value) => boolean` | ❌   | 커스텀 검색 로직                   |
| `defaultPageSize`   | `number`                            | ❌   | 기본 페이지 크기 (기본값: 10)      |

### UseDataTableControllerReturn

| 속성            | 타입                            | 설명                     |
| --------------- | ------------------------------- | ------------------------ |
| `tableProps`    | `DataTableProps<TData, TValue>` | DataTable에 전달할 props |
| `data`          | `TData[]`                       | 현재 페이지 데이터       |
| `isLoading`     | `boolean`                       | 로딩 상태                |
| `isError`       | `boolean`                       | 에러 상태                |
| `pagination`    | `PaginationState`               | 현재 페이징 상태         |
| `columnFilters` | `ColumnFiltersState`            | 현재 필터 상태           |
| `globalFilter`  | `string \| undefined`           | 현재 검색어              |

## 마이그레이션 가이드

### Step 1: 기존 컨트롤러 훅 삭제

```typescript
// ❌ 삭제: useXXXTableController.ts (100줄+)
```

### Step 2: 새 훅 생성

```typescript
// ✅ 생성: useXXXTable.ts (15줄)
export function useXXXTable(params) {
  return useDataTableController({
    tableId: 'xxx',
    columns: xxxColumns,
    useQueryHook: useXXX,
    // ... 나머지 설정
  });
}
```

### Step 3: 컴포넌트 업데이트

```typescript
// Before
const { tableProps, summaryStats, ... } = useXXXTableController({ ... });

// After
const { tableProps, data, isLoading, ... } = useXXXTable({ ... });
```

## 모범 사례

1. **쿼리 훅 분리**: API 호출 로직은 별도 훅으로 분리
2. **타입 안정성**: 제네릭으로 타입 지정 `useDataTableController<User, unknown>`
3. **도메인 커스텀 훅**: 도메인별로 설정을 래핑한 훅 제공
4. **통계 로직 분리**: 통계 계산은 컴포넌트에서 처리

## 실제 예제

### Settlement 테이블 (완성)

```typescript
// hooks/useSettlementTable.ts
export function useSettlementTable({ service }) {
  return useDataTableController<Settlement, unknown>({
    tableId: `settlement-${service}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters, globalFilter }) => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      status: columnFilters.find(f => f.id === 'status')?.value,
      service,
      filter: globalFilter?.trim(),
    }),
    filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
    renderFilters: () => [{
      columnId: 'status',
      title: '상태',
      options: [
        { label: '완료', value: 'completed' },
        { label: '대기', value: 'pending' },
      ],
    }],
    globalFilterFn: (row, _, value) => {
      const id = String(row.getValue('id')).toLowerCase();
      const site = String(row.getValue('site')).toLowerCase();
      return id.includes(value) || site.includes(value);
    },
  });
}

// components/SettlementTable.tsx
export function SettlementTable({ service }) {
  const { tableProps, data } = useSettlementTable({ service });
  const stats = useMemo(() => calculateStats(data), [data]);

  return (
    <div>
      <SummaryCards stats={stats} />
      <DataTable {...tableProps} />
    </div>
  );
}
```

## 정리

- ✅ 100줄+ 보일러플레이트 → 15줄로 축약
- ✅ 모든 테이블에서 재사용 가능
- ✅ URL 상태 관리 자동화
- ✅ 타입 안전성 보장
- ✅ 확장 가능한 설계
