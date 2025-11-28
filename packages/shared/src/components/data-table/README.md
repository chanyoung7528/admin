## DataTable 구성 가이드

TanStack Table, React Query, URL Search Params를 묶어 “페이지 ↔ 도메인 ↔ 컨트롤러 ↔ 서비스” 흐름을 표준화한 컴포넌트 세트입니다.

```
Route(createFileRoute) ──▶ DomainTable Component ──▶ useXxxTable ──▶ useDataTableController
                         │                                 │
                         │                                 └─ useQueryHook (React Query)
                         └─ validateSearch(zod)                 + useTableUrlState
```

### 1. 주요 파일

| 파일                                | 설명                                                            |
| ----------------------------------- | --------------------------------------------------------------- |
| `data-table.tsx`                    | TanStack Table 인스턴스 생성, 스켈레톤/빈 상태/선택 상태 처리   |
| `toolbar.tsx`, `faceted-filter.tsx` | 검색 인풋, 패싯 필터 UI                                         |
| `pagination.tsx`                    | 페이지 번호/크기 UI (`usePaginationState` 기반)                 |
| `hooks/useDataTableState.ts`        | 상태 집계 + `useReactTable` 호출                                |
| `hooks/useTableUrlState.ts`         | Search Params ↔ pagination / filters / globalFilter 동기화     |
| `hooks/useDataTableController.ts`   | URL/React Query/디바운스 검색을 조합해 `<DataTable>` props 반환 |

### 2. Settlement 예시

```tsx
// apps/my-app/src/domains/settlement/hooks/useSettlementTable.ts
export function useSettlementTable({ service }) {
  return useDataTableController({
    tableId: `settlement-${service}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters, globalFilter, sorting }) => ({
      page: pagination.pageIndex + 1,
      pageSize: pagination.pageSize,
      status: statusFilter?.length ? statusFilter : undefined,
      service,
      filter: globalFilter?.trim() || undefined,
      sortBy: sorting?.[0]?.id,
      sortOrder: sorting?.[0]?.desc ? 'desc' : 'asc',
    }),
    filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
    searchPlaceholder: '정산 ID 또는 Site명 검색...',
    globalFilterFn: (row, _, value) => {
      const keyword = String(value).toLowerCase();
      return String(row.getValue('id')).toLowerCase().includes(keyword) || String(row.getValue('site')).toLowerCase().includes(keyword);
    },
  });
}
```

```tsx
// apps/my-app/src/domains/settlement/components/SettlementTable.tsx
const { tableProps, data, isLoading, isError } = useSettlementTable({ service });
return (
  <section className="space-y-6">
    <SummaryCards data={data} loading={isLoading} />
    {isError && <InlineError />}
    <DataTable {...tableProps} />
  </section>
);
```

### 3. pagination & Query Key

- `useDataTableState` 는 `pageCount ?? -1` 과 `manualPagination` 으로 서버 사이드 페이지네이션을 활성화합니다.
- `usePaginationState` 는 `isPageCountValid` 를 계산하여 버튼/메시지 상태를 제어합니다.
- React Query 훅에서는 `['settlements', { page, pageSize, status: [...status].sort().join(',') }]` 처럼 파라미터를 정규화해 캐시 키를 안정적으로 유지하세요. (자세한 내용은 `docs/DATA_TABLE_PAGINATION.md`)

### 4. 새 도메인 적용 순서

1. 타입/컬럼 정의 (`ColumnDef` + `meta`)
2. 서비스 + React Query 훅 작성 (`{ data, total, isLoading, isError }` 형식)
3. `useXxxTable` 훅에서 `useDataTableController` 호출
4. 도메인 컴포넌트에서 `<DataTable {...tableProps} />` 와 부가 UI(통계, 다운로드 버튼 등)를 조합
5. 페이지에서 `createFileRoute` + `validateSearch` 로 URL 스키마를 고정

### 5. 체크리스트

- `tableId` 는 페이지마다 고유하게 지정 (`settlement-food`, `tasks`, …)
- URL에 노출할 필터는 `filterConfigs` 와 `renderFilters` 를 같이 정의
- 서버 검색/정렬은 `queryParams` 에서 처리하고, `globalFilterFn` 은 클라이언트 검색 전용으로만 사용
- 스켈레톤/에러/빈 상태 문구는 도메인 컴포넌트에서 지정 (`emptyMessage`)
- 데이터 Fetch → URL → UI 순환에 의존하므로, 직접 `DataTable` state 를 조작하지 말 것

### 6. 참고 문서

- 루트 `docs/DATA_TABLE_IMPLEMENTATION.md`, `docs/DATA_TABLE_PAGINATION.md`
- `packages/shared/src/components/data-table/docs/ARCHITECTURE.md`
- `docs/DEBOUNCE_GUIDE.md`
