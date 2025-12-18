# DataTable 가이드 (@repo/shared)

`packages/shared`의 `DataTable`은 **TanStack Table 기반 UI 컴포넌트**이고, `useDataTableController`는 **URL(Search Params) + 서버 데이터 페칭**을 묶는 범용 컨트롤러 훅입니다.

---

## 빠른 시작

### 1. 기본 사용

도메인마다 `useXxxTable` 훅을 만들고, 내부에서 `useDataTableController`를 호출해 표준 동작을 캡슐화합니다.

```tsxx
import { DataTable, useDataTableController } from '@shared/components/data-table';

export function useUserTable() {
  return useDataTableController({
    tableId: 'users',
    columns: userColumns,
    useQueryHook: useUsers,
  });
}

export function UserTable() {
  const { tableProps } = useUserTable();
  return <DataTable {...tableProps} />;
}
```

### 2. 필터 + 서버 파라미터 매핑

```tsxx
export function useSettlementTable({ service }: { service: 'BODY' | 'FOOD' | 'MIND' }) {
  return useDataTableController({
    tableId: `settlement-${service.toLowerCase()}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,

    // URL 동기화 필터 설정
    filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],

    // 툴바에 표시할 필터
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

    // 테이블 상태 → API 파라미터 변환
    queryParams: ({ pagination, columnFilters, globalFilter, sorting }) => {
      const status = columnFilters.find(f => f.id === 'status')?.value as string[] | undefined;
      return {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        status: status?.length ? status : undefined,
        service,
        filter: globalFilter?.trim() || undefined,
        sortBy: sorting?.[0]?.id,
        sortOrder: sorting?.[0]?.desc ? 'desc' : 'asc',
      };
    },
  });
}
```

---

## URL(Search Params) 키 규칙

컨트롤러는 아래 키를 사용해 URL과 상태를 동기화합니다.

- `page`, `pageSize`: 페이지네이션
- `filter`: 글로벌 검색어
- `sortBy`, `sortOrder`: 정렬
- `filterConfigs`로 정의한 `searchKey`: 컬럼 필터

> 앱 라우팅은 TanStack Router의 search를 사용합니다.

---

## useQueryHook 계약(필수)

`useDataTableController`에 전달하는 쿼리 훅은 아래 형태를 반환해야 합니다.

```tsx
interface QueryResult<TData> {
  data: TData[] | undefined;
  total?: number;
  isLoading: boolean;
  isError: boolean;
}
```

### React Query 어댑터 예시

```tsxx
import { useQuery } from '@tanstack/react-query';

export function useUsers(params: Record<string, unknown>) {
  const query = useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsers(params),
  });

  return {
    data: query.data?.items,
    total: query.data?.total,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
```

---

## 디바운스 튜닝

`searchDebounceMs`로 서버 페칭 디바운스 시간을 조절합니다. (기본 500ms)

```tsxx
useDataTableController({
  // ...
  searchDebounceMs: 300, // 기본 500ms
});
```

**권장 가이드:**

- 빠른 API/짧은 검색: 200~300ms
- 느린 API/무거운 테이블: 500~1000ms

> 툴바 입력은 `useToolbarState`에서 300ms 디바운스로 UI 반응성을 보장하고, 서버 페칭은 `useDataTableController`에서 500ms 디바운스로 API 부하를 줄입니다.

---

## 실제 예시

- `apps/my-app/src/domains/settlement/hooks/useSettlementTable.ts`
- `apps/my-app/src/domains/settlement/components/SettlementTable.tsx`

---

## 추가 문서

- [ARCHITECTURE.md](./ARCHITECTURE.md): 내부 구조/데이터 흐름/파일 구성
