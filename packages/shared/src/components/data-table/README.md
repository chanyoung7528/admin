# DataTable 구조 설계 가이드

이 문서는 정산관리(Settlement)를 예제로 하여, 원격 데이터 기반 DataTable을 구축하는 표준 설계 패턴을 제시합니다.

---

## 📋 목차

1. [아키텍처 개요](#아키텍처-개요)
2. [디렉터리 구조](#디렉터리-구조)
3. [핵심 훅 설명](#핵심-훅-설명)
4. [구현 단계별 가이드](#구현-단계별-가이드)
5. [코드 예제: 정산관리](#코드-예제-정산관리)
6. [Best Practices](#best-practices)

---

## 아키텍처 개요

DataTable 시스템은 다음 레이어로 구성됩니다:

```
┌─────────────────────────────────────────────────┐
│           Page Component (라우트)                │ ← 라우트 정의, 검색 스키마 검증
└─────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│       Domain Table Component                     │ ← 도메인별 UI, 통계, 에러 핸들링
│       (예: SettlementTable)                      │
└─────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│       Domain Table Hook                          │ ← useDataTableController 설정
│       (예: useSettlementTable)                   │    (컬럼, 필터, 쿼리 파라미터 매핑)
└─────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│       useDataTableController                     │ ← 테이블 상태 오케스트레이션
│       (공용 컨트롤러 훅)                          │    (URL 동기화, API 연동, 디바운스)
└─────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│       Domain Query Hook                          │ ← React Query 기반 API 호출
│       (예: useSettlements)                       │    (캐싱, 재시도, 에러 처리)
└─────────────────────────────────────────────────┘
                       ▼
┌─────────────────────────────────────────────────┐
│       Service Layer                              │ ← API 엔드포인트 호출
│       (예: settlementService)                    │    (HTTP 요청, 응답 변환)
└─────────────────────────────────────────────────┘
```

### 책임 분리

- **Page**: 라우트 정의, Search Params 스키마 검증 (Zod)
- **Domain Table Component**: 도메인별 UI 레이아웃, 통계 표시, 에러 상태 표시
- **Domain Table Hook**: 테이블 설정 (컬럼, 필터, 쿼리 파라미터 변환)
- **Controller Hook**: 테이블 상태 관리 (URL 동기화, 페이지네이션, 필터링)
- **Query Hook**: 데이터 페칭 (캐싱, 로딩, 에러 처리)
- **Service**: API 통신 로직

---

## 디렉터리 구조

```
src/
├── pages/
│   └── _authenticated/
│       └── my-mind/
│           └── settlement.tsx          # 라우트 컴포넌트 + 검색 스키마
│
└── domains/
    └── settlement/
        ├── columns/
        │   └── settlementColumns.tsx   # 테이블 컬럼 정의
        ├── components/
        │   ├── SettlementTable.tsx     # 도메인 테이블 컴포넌트
        │   └── index.ts
        ├── hooks/
        │   ├── useSettlements.ts       # React Query 훅 (API 호출)
        │   ├── useSettlementTable.ts   # 테이블 컨트롤러 훅 (설정)
        │   └── index.ts
        ├── services/
        │   └── settlementService.ts    # API 서비스 레이어
        └── types/
            └── settlementTypes.ts      # 도메인 타입 정의
```

---

## 핵심 훅 설명

### 1. `useTableUrlState`

**역할**: URL Search Params와 테이블 상태(페이지네이션, 필터, 검색어)를 양방향 동기화

**주요 기능**:

- URL에서 현재 상태를 읽어와 `pagination`, `columnFilters`, `globalFilter` 반환
- 상태 변경 시 URL 업데이트 (브라우저 뒤로가기/앞으로가기 지원)
- 페이지 범위 검증 (`ensurePageInRange`)

**사용 예시**:

```tsx
const { pagination, onPaginationChange, columnFilters, onColumnFiltersChange, globalFilter, onGlobalFilterChange, ensurePageInRange } = useTableUrlState({
  search: searchParams,
  navigate,
  pagination: { defaultPage: 1, defaultPageSize: 10 },
  globalFilter: { enabled: true, key: 'filter' },
  columnFilters: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
});
```

---

### 2. `useTableInstanceKey`

**역할**: 테이블 인스턴스를 고유하게 식별하는 키를 만들어 **선택적으로** 리마운트를 강제할 수 있습니다.

**언제 필요할까?**

- TanStack Table을 직접 구성하면서 특정 가상 스크롤·차트·3rd party 위젯을 상태 변화에 맞춰 초기화해야 할 때
- 외부 의존성이 크게 바뀌었지만 내부 캐시가 유지돼 의도치 않은 값이 남아 있을 때

> ⚠️ `useDataTableController`는 필터 팝오버·툴바 포커스를 유지하기 위해 더 이상 이 키를 자동으로 사용하지 않습니다. 기본 `DataTable`은 모든 핵심 상태를 컨트롤 모드로 전달하므로 별도 리마운트 없이도 최신 데이터를 반영합니다. 키가 꼭 필요하다면 Popover 같은 장기 UI를 감싸지 않는 별도 Boundary에만 적용하세요.

**사용 예시 (커스텀 테이블을 직접 구성하는 경우)**:

```tsx
const tableInstanceKey = useTableInstanceKey({
  tableId: 'tasks',
  pagination,
  globalFilter,
  columnFilters,
});

return <TasksTable key={tableInstanceKey} {...props} />;
```

#### 왜 과거에는 목록이 갱신되지 않았나?

- 초창기 구현은 URL → 테이블 상태, 테이블 상태 → URL을 `useState` + `useEffect`로 동기화했습니다. 이중 버퍼 구조 때문에 URL이 먼저 변해도 로컬 상태가 늦게 따라오면 `useReactTable`이 “필터가 안 바뀌었다”고 판단하는 타이밍이 존재했습니다.
- 이를 우회하려고 `tableInstanceKey`로 전체 `DataTable`을 강제 리마운트했지만, 팝오버 같은 UI 상태가 매번 초기화되는 부작용이 있었습니다.
- 현재 버전은 `useTableUrlState`가 URL을 단일 소스로 취급하며, `columnFilters`와 `pagination`을 `useMemo`로 계산해 즉시 새로운 참조를 `useReactTable`에 전달합니다. 그래서 키 없이도 목록이 바로 갱신됩니다.

#### 리렌더 vs 리마운트

- **리렌더**: 동일한 컴포넌트 인스턴스가 새 props로 다시 그려집니다. Radix Popover처럼 내부적으로 관리하는 `open` 상태는 그대로 유지됩니다.
- **리마운트**: `key`가 바뀌면 React가 기존 노드를 언마운트하고 완전히 새 인스턴스를 만듭니다. 모든 훅 상태가 초기화되어 팝오버가 닫히는 문제가 여기서 발생했습니다.
- 현재는 `tableInstanceKey`를 기본적으로 넘기지 않아 필터 변경 → 데이터 페칭 → `DataTable` 리렌더 흐름만 일어나며, UI 상태는 안정적으로 유지됩니다. 강제 리마운트가 필요하면 해당 Boundary에만 키를 적용하세요.

#### 데이터 흐름 상세 (필터 → 목록 → UI)

1. **필터 선택**  
   `DataTableFacetedFilter`에서 `column.setFilterValue`를 호출하면 곧바로 `onColumnFiltersChange`가 실행되고, URL Search Params가 업데이트됩니다.

```64:90:packages/shared/src/components/data-table/faceted-filter.tsx
<CommandItem
  key={option.value}
  onSelect={() => {
    if (isSelected) {
      selectedValues.delete(option.value);
    } else {
      selectedValues.add(option.value);
    }
    const filterValues = Array.from(selectedValues);
    column?.setFilterValue(filterValues.length ? filterValues : undefined);
  }}
>
  {/* ... */}
</CommandItem>
```

2. **URL → 테이블 상태**  
   `useTableUrlState`는 URL을 유일한 진실 공급원(single source of truth)으로 간주하고 `columnFilters`, `pagination`, `globalFilter`를 `useMemo`로 재구성합니다. 검색/필터 값이 달라지면 항상 새로운 참조가 생성되어 TanStack Table state에 주입됩니다.

```70:98:packages/shared/src/components/data-table/use-table-url-state.ts
const columnFilters: ColumnFiltersState = useMemo(() => {
  const collected: ColumnFiltersState = [];
  for (const cfg of columnFiltersCfg) {
    const raw = (search as SearchRecord)[cfg.searchKey];
    if (cfg.type === 'array') {
      const value = (deserialize(raw) as unknown[]) ?? [];
      if (Array.isArray(value) && value.length > 0) {
        collected.push({ id: cfg.columnId, value });
      }
      continue;
    }
    // string 처리 ...
  }
  return collected;
}, [columnFiltersCfg, search]);
```

3. **React Query 재요청**  
   `useDataTableController`는 위 상태를 `queryParams`에 전달해 API 파라미터를 만들고, 이 값이 React Query `queryKey`에 포함됩니다. 키가 바뀌었으므로 새 fetch가 발생하고, 응답 데이터가 `data` prop에 들어옵니다.

```114:125:packages/shared/src/components/data-table/use-data-table-controller.ts
const apiParams = useMemo(() => {
  if (queryParams) {
    return queryParams({ pagination, columnFilters, globalFilter: debouncedGlobalFilter });
  }
  return {
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    filter: debouncedGlobalFilter && debouncedGlobalFilter.trim() !== '' ? debouncedGlobalFilter : undefined,
  };
}, [pagination, columnFilters, debouncedGlobalFilter, queryParams]);

const queryResult = useQueryHook(apiParams);
```

4. **렌더 단계**  
   `useReactTable`은 `state.columnFilters`와 새 `data`를 기반으로 RowModel을 재계산합니다. 컴포넌트는 리렌더만 수행하므로 Radix Popover, Toolbar 입력 포커스 등 클라이언트 상태는 보존됩니다.

```123:150:packages/shared/src/components/data-table/data-table.tsx
const table = useReactTable({
  data,
  columns,
  state: {
    sorting: controlledSorting ?? localSorting,
    columnVisibility: controlledColumnVisibility ?? localColumnVisibility,
    rowSelection: controlledRowSelection ?? localRowSelection,
    columnFilters: controlledColumnFilters ?? localColumnFilters,
    globalFilter: controlledGlobalFilter ?? localGlobalFilter,
    pagination: controlledPagination ?? localPagination,
  },
  manualPagination: !!onPaginationChange,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  getPaginationRowModel: getPaginationRowModel(),
  // ...
});
```

이 모든 과정이 “상태 → 파라미터 → 데이터 → 렌더”로 이어지는 순수 데이터 흐름이기 때문에, 예전처럼 키로 강제 리마운트할 필요가 없습니다. 만약 도메인 특성상 특정 섹션만 완전 초기화가 필요하다면, 해당 Boundary에 한정해 `useTableInstanceKey`를 적용하세요.

---

### 3. `useDataTableController`

**역할**: 테이블 상태 오케스트레이션 (URL 동기화 + API 연동 + 디바운스)

**주요 기능**:

1. `useTableUrlState`를 사용하여 URL과 상태 동기화
2. 도메인별 `useQueryHook`을 호출하여 API 데이터 페칭
3. `queryParams` 함수로 테이블 상태를 API 파라미터로 변환
4. 검색어 입력 시 디바운스 적용 (기본 500ms)
5. Debounce/포커스 유지 상태를 포함한 `DataTable` props를 메모이제이션하여 반환

**파라미터**:
| 파라미터 | 타입 | 필수 | 설명 |
|---------|------|------|------|
| `tableId` | `string` | ✅ | 테이블 고유 ID (예: `settlement-mind`) |
| `columns` | `ColumnDef[]` | ✅ | TanStack Table 컬럼 정의 |
| `useQueryHook` | `Function` | ✅ | 데이터 페칭 훅 (예: `useSettlements`) |
| `queryParams` | `Function` | ❌ | 테이블 상태 → API 파라미터 변환 함수 |
| `filterConfigs` | `FilterConfig[]` | ❌ | URL 동기화할 컬럼 필터 설정 |
| `renderFilters` | `Function` | ❌ | 툴바에 표시할 필터 옵션 반환 |
| `globalFilterFn` | `Function` | ❌ | 클라이언트 측 검색 필터 함수 |
| `searchPlaceholder` | `string` | ❌ | 검색창 플레이스홀더 |
| `emptyMessage` | `string` | ❌ | 빈 데이터 메시지 |
| `defaultPageSize` | `number` | ❌ | 기본 페이지 크기 (기본값: 10) |
| `searchDebounceMs` | `number` | ❌ | 검색 디바운스 시간 (기본값: 500ms) |

**반환값**:

```tsx
{
  tableProps: DataTableProps;  // DataTable에 전달할 props
  data: TData[];               // 현재 데이터 배열
  isLoading: boolean;          // 로딩 상태 (검색 중 포함)
  isError: boolean;            // 에러 상태
  pagination: PaginationState; // 현재 페이지네이션
  columnFilters: ColumnFiltersState; // 현재 컬럼 필터
  globalFilter?: string;       // 현재 검색어
}
```

---

## 구현 단계별 가이드

### Step 1: 타입 정의

```tsx
// domains/settlement/types/settlementTypes.ts
export interface Settlement {
  id: string;
  site: string;
  period: string;
  amount: number;
  date: string;
  status: 'completed' | 'pending';
}
```

---

### Step 2: 서비스 레이어

```tsx
// domains/settlement/services/settlementService.ts
import { faker } from '@faker-js/faker';
import type { Settlement } from '../types';

export interface GetSettlementsParams {
  page?: number;
  pageSize?: number;
  status?: string[];
  service: 'BODY' | 'FOOD' | 'MIND';
  filter?: string;
}

export interface GetSettlementsResponse {
  settlements: Settlement[];
  total: number;
}

export async function getSettlements(params?: GetSettlementsParams): Promise<GetSettlementsResponse> {
  const page = params?.page || 1;
  const pageSize = params?.pageSize || 10;
  const statusFilter = params?.status || [];
  const searchFilter = params?.filter?.toLowerCase() || '';

  // Mock 데이터 생성
  const allData: Settlement[] = Array.from({ length: 100 }, (_, i) => ({
    id: `ST${String(i + 1).padStart(4, '0')}`,
    site: faker.company.name(),
    period: '2025-01-01 ~ 2025-01-31',
    amount: faker.number.int({ min: 100000, max: 10000000 }),
    date: faker.date.recent({ days: 30 }).toLocaleDateString('ko-KR'),
    status: faker.helpers.arrayElement(['completed', 'pending']),
  }));

  // 필터 적용
  let filtered = allData;
  if (statusFilter.length > 0) {
    filtered = filtered.filter(item => statusFilter.includes(item.status));
  }
  if (searchFilter) {
    filtered = filtered.filter(item => item.id.toLowerCase().includes(searchFilter) || item.site.toLowerCase().includes(searchFilter));
  }

  // 페이지네이션
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const settlements = filtered.slice(start, end);

  // 지연 시뮬레이션
  await new Promise(resolve => setTimeout(resolve, 800));

  return { settlements, total: filtered.length };
}
```

---

### Step 3: React Query 훅

```tsx
// domains/settlement/hooks/useSettlements.ts
import { useQuery } from '@tanstack/react-query';
import { getSettlements, type GetSettlementsParams } from '../services/settlementService';

export function useSettlements(params?: GetSettlementsParams) {
  const queryKey = [
    'settlements',
    {
      page: params?.page,
      pageSize: params?.pageSize,
      status: params?.status?.length ? [...params.status].sort().join(',') : undefined,
      service: params?.service,
      filter: params?.filter || undefined,
    },
  ];

  const query = useQuery({
    queryKey,
    queryFn: async () => await getSettlements(params),
    staleTime: 0, // 항상 최신 데이터
    gcTime: 5 * 60 * 1000, // 5분 캐시 유지
    retry: 2,
    placeholderData: undefined,
  });

  return {
    data: query.data?.settlements,
    total: query.data?.total,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
```

---

### Step 4: 컬럼 정의

```tsx
// domains/settlement/columns/settlementColumns.tsx
import { type ColumnDef } from '@tanstack/react-table';
import { type Settlement } from '../types';

export const settlementColumns: ColumnDef<Settlement>[] = [
  {
    accessorKey: 'id',
    header: '정산 ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    size: 120,
    meta: { className: 'w-[120px]' },
  },
  {
    accessorKey: 'site',
    header: 'Site명',
    size: 300,
    meta: { className: 'w-[300px]' },
  },
  {
    accessorKey: 'period',
    header: '정산 기간',
    size: 180,
    meta: { className: 'w-[180px]' },
  },
  {
    accessorKey: 'amount',
    header: '정산 금액',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
    size: 150,
    meta: { className: 'w-[150px]' },
  },
  {
    accessorKey: 'date',
    header: '처리일',
    size: 120,
    meta: { className: 'w-[120px]' },
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center">상태</div>,
    cell: ({ row }) => {
      const status = row.getValue('status') as Settlement['status'];
      return (
        <div className="flex justify-center">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              status === 'completed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            {status === 'completed' ? '완료' : '대기'}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    size: 100,
    meta: { className: 'w-[100px]' },
  },
];
```

---

### Step 5: 도메인 테이블 훅

```tsx
// domains/settlement/hooks/useSettlementTable.ts
import { useDataTableController } from '@shared/components/data-table';
import { settlementColumns } from '../columns';
import { type Settlement } from '../types';
import { useSettlements } from './useSettlements';

interface UseSettlementTableParams {
  service: 'BODY' | 'FOOD' | 'MIND';
}

export function useSettlementTable({ service }: UseSettlementTableParams) {
  return useDataTableController<Settlement, unknown>({
    // 1. 테이블 고유 ID
    tableId: `settlement-${service.toLowerCase()}`,

    // 2. 컬럼 정의
    columns: settlementColumns,

    // 3. 데이터 페칭 훅
    useQueryHook: useSettlements,

    // 4. 테이블 상태 → API 파라미터 변환
    queryParams: ({ pagination, columnFilters, globalFilter }) => {
      const statusFilter = columnFilters.find(f => f.id === 'status')?.value as string[] | undefined;

      return {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        status: statusFilter?.length ? statusFilter : undefined,
        service,
        filter: globalFilter?.trim() || undefined,
      };
    },

    // 5. URL 동기화할 필터 설정
    filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],

    // 6. UI 설정
    searchPlaceholder: '정산 ID 또는 Site명 검색...',
    emptyMessage: '정산 내역이 없습니다.',

    // 7. 툴바 필터 옵션
    renderFilters: () => [
      {
        columnId: 'status',
        title: '상태',
        options: [
          { label: '완료', value: 'completed' },
          { label: '대기', value: 'pending' },
        ],
      },
    ],

    // 8. 클라이언트 측 검색 필터
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue('id')).toLowerCase();
      const site = String(row.getValue('site')).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();
      return id.includes(searchValue) || site.includes(searchValue);
    },
  });
}
```

---

### Step 6: 도메인 테이블 컴포넌트

```tsx
// domains/settlement/components/SettlementTable.tsx
import { DataTable } from '@shared/components/data-table';
import { useSettlementTable } from '../hooks';
import { type Settlement } from '../types';

interface SettlementTableProps {
  service: 'BODY' | 'FOOD' | 'MIND';
}

export function SettlementTable({ service }: SettlementTableProps) {
  const serviceLabel = {
    BODY: 'MY BODY',
    FOOD: 'MY FOOD',
    MIND: 'MY MIND',
  }[service];

  const { tableProps, data, isError, isLoading } = useSettlementTable({
    service,
  });

  // 요약 통계
  const totalAmount = data.reduce((sum: number, s: Settlement) => sum + s.amount, 0);
  const completedCount = data.filter((s: Settlement) => s.status === 'completed').length;
  const pendingCount = data.filter((s: Settlement) => s.status === 'pending').length;

  return (
    <div className="bg-card p-6">
      {/* 헤더 */}
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{serviceLabel} 정산 내역</h2>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">정산 엑셀 다운로드</button>
      </div>

      <p className="text-muted-foreground mb-6">{serviceLabel} 서비스의 Site별 정산 내역을 확인하세요</p>

      {/* 요약 통계 */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">총 정산 금액</p>
          <p className="mt-1 text-2xl font-bold">
            {isLoading
              ? '...'
              : new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(totalAmount)}
          </p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">정산 완료</p>
          <p className="mt-1 text-2xl font-bold">{isLoading ? '...' : `${completedCount}건`}</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">정산 대기</p>
          <p className="mt-1 text-2xl font-bold">{isLoading ? '...' : `${pendingCount}건`}</p>
        </div>
      </div>

      {/* 에러 상태 */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
          데이터를 불러오는데 실패했습니다. 다시 시도해주세요.
        </div>
      )}

      {/* 테이블 */}
      <DataTable {...tableProps} />
    </div>
  );
}
```

---

### Step 7: 페이지 컴포넌트

```tsx
// pages/_authenticated/my-mind/settlement.tsx
import { SettlementTable } from '@/domains/settlement/components';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

// Search Params 스키마 (Zod 검증)
const settlementSearchSchema = z.object({
  page: z.number().int().positive().catch(1),
  pageSize: z.number().int().positive().catch(10),
  status: z.array(z.string()).catch([]),
  filter: z.string().catch(''),
});

export const Route = createFileRoute('/_authenticated/my-mind/settlement')({
  component: MindSettlementPage,
  validateSearch: settlementSearchSchema,
});

function MindSettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY MIND B2B 정산 관리</h1>
        <p className="text-muted-foreground">MY MIND 서비스 B2B 정산 내역</p>
      </div>

      <SettlementTable service="MIND" />
    </div>
  );
}
```

---

## Best Practices

### ✅ DO

1. **도메인별 테이블 훅 분리**
   - 각 도메인마다 `useXxxTable` 훅 생성
   - `useDataTableController`를 래핑하여 도메인 특화 설정 캡슐화

2. **테이블 ID는 고유하게**
   - `tableId`는 서비스/페이지별로 고유하게 설정 (예: `settlement-mind`)
   - URL 상태가 다른 테이블과 충돌하지 않도록 보장

3. **API 파라미터 변환 함수 사용**
   - `queryParams`에서 테이블 상태를 API 파라미터로 명시적 변환
   - 필터 값이 비어있으면 `undefined` 반환 (불필요한 파라미터 제거)

4. **컬럼 필터에 `filterFn` 정의**
   - 배열 필터의 경우 `filterFn: (row, id, value) => value.includes(row.getValue(id))`

5. **로딩/에러 상태 처리**
   - `isLoading`으로 스켈레톤 표시
   - `isError`로 에러 메시지 표시

6. **디바운스 시간 조정**
   - 기본 500ms가 적절하나, 느린 API는 1000ms로 증가 고려

### ❌ DON'T

1. **`DataTable`에 직접 상태 전달 금지**
   - ❌ `<DataTable data={data} ... />` + 별도 상태 관리
   - ✅ `<DataTable {...tableProps} />` (컨트롤러에서 관리)

2. **테이블 데이터 불필요한 복사 금지**
   - ❌ `data={[...settlements]}`
   - ✅ `data={settlements}` (참조 전달)

3. **불필요한 리마운트 금지**
   - ❌ `key={service}-${page}-${filter}` (툴바/Popover 상태가 매번 초기화)
   - ✅ 기본 `DataTable`은 키 없이 사용하고, 꼭 필요할 때만 별도 Boundary에 `useTableInstanceKey`

4. **필터 상태를 로컬에서 관리 금지**
   - ❌ `useState`로 필터 관리 후 URL에 동기화
   - ✅ URL이 단일 진실 공급원 (useTableUrlState)

5. **클라이언트 필터링과 서버 필터링 혼용 주의**
   - `globalFilterFn`은 **클라이언트 측 검색**용
   - 원격 검색은 `queryParams`에서 API 파라미터로 전달

---

## 요약

| 계층     | 파일                    | 역할                                |
| -------- | ----------------------- | ----------------------------------- |
| 페이지   | `settlement.tsx`        | 라우트 정의, 검색 스키마 검증       |
| 컴포넌트 | `SettlementTable.tsx`   | UI 레이아웃, 통계, 에러 표시        |
| 훅       | `useSettlementTable.ts` | 테이블 설정 (컬럼, 필터, 쿼리 변환) |
| 쿼리     | `useSettlements.ts`     | React Query 기반 API 호출           |
| 서비스   | `settlementService.ts`  | HTTP 요청 및 응답 처리              |
| 컬럼     | `settlementColumns.tsx` | 테이블 컬럼 정의                    |
| 타입     | `settlementTypes.ts`    | 도메인 타입 정의                    |

이 구조를 따르면 테이블 기능이 표준화되고, 새로운 도메인 테이블을 빠르게 추가할 수 있습니다.
