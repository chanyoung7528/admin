## 📑 DataTable Pagination 가이드

### 1. 서버 사이드 페이지네이션 설정

```tsx
// packages/shared/src/components/data-table/hooks/useDataTableState.ts
const table = useReactTable({
  data,
  columns,
  state: { ... },
  pageCount: pageCount ?? -1,
  manualPagination: !!onPaginationChange,
});
```

- `pageCount ?? -1` : 아직 총 페이지 수를 모를 때는 -1을 넘겨 TanStack Table이 로딩 상태로 판단하게 합니다.
- `manualPagination` : `onPaginationChange` 가 존재할 때만 true 로 설정됩니다. (즉, 컨트롤러 훅을 쓰면 자동으로 서버 모드가 됩니다.)

### 2. UI 상태 계산

```tsx
// packages/shared/src/components/data-table/hooks/usePaginationState.ts
const totalPages = table.getPageCount();
const isPageCountValid = useMemo(() => totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY, [totalPages]);
const pageNumbers = useMemo(() => (isPageCountValid ? getPageNumbers(currentPage, totalPages) : []), [isPageCountValid, currentPage, totalPages]);
```

```tsx
// packages/shared/src/components/data-table/pagination.tsx
{isPageCountValid ? `Page ${currentPage} of ${totalPages}` : 'Loading...'}
<Button disabled={!canPreviousPage || !isPageCountValid}>Prev</Button>
{isPageCountValid && pageNumbers.map(...)}
```

- 페이지 수를 확정할 수 없으면 버튼이 비활성화되고 `"Loading..."` 상태를 유지합니다.
- `pageNumbers` 는 `getPageNumbers` 유틸을 통해 엘립시스(`...`) 포함 형태로 계산됩니다.

### 3. SettlementTable 연동

```tsx
// apps/my-app/src/domains/settlement/hooks/useSettlementTable.ts
return useDataTableController({
  tableId: `settlement-${service.toLowerCase()}`,
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
});
```

- URL 파라미터는 `useTableUrlState` 가 관리하며, 페이지/필터가 바뀌면 자동으로 1페이지로 리셋됩니다.
- `ensurePageInRange` 는 총 페이지가 줄어든 경우(예: 마지막 페이지에서 필터 조건 변경) 1페이지로 보내는 역할을 합니다.

### 4. Query Key 전략

```tsx
// apps/my-app/src/domains/settlement/hooks/useSettlements.ts
const queryKey = [
  'settlements',
  {
    page: params?.page,
    pageSize: params?.pageSize,
    status: params?.status?.length ? [...params.status].sort().join(',') : undefined,
    service: params?.service,
    filter: params?.filter || undefined,
    sortBy: params?.sortBy || undefined,
    sortOrder: params?.sortOrder || undefined,
  },
];
```

- React Query 캐시는 “깊은 비교”가 아니라 **참조 비교**이므로, 객체를 그대로 넘길 때는 내부 값을 정렬/직렬화해 동일한 문자열을 생성해야 합니다.
- status 배열은 `sort().join(',')` 로 정규화하여 `['pending','completed']` 와 `['completed','pending']` 을 같은 키로 취급합니다.

### 5. 디버깅 팁

```tsx
// apps/my-app/src/domains/settlement/components/SettlementTable.tsx
useEffect(() => {
  console.log('🔍 Pagination Debug:', {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    totalCount,
    pageCount,
    dataLength: settlements.length,
    isLoading,
  });
}, [pagination, totalCount, pageCount, settlements.length, isLoading]);
```

아래 항목을 차례로 확인하세요.

1. `pageCount` 가 `Math.ceil(total/pageSize)` 값과 일치하는가?
2. `isPageCountValid` 가 false로 유지된다면 `pageCount` 계산 로직을 점검 (`total` undefined 여부, 0 처리 등).
3. URL Search Params (`?page=2&pageSize=20&status=completed`) 가 기대대로 변하는가?
4. React Query DevTools 에서 Query Key 가 페이지 이동마다 갱신되는가?

### 6. Troubleshooting

| 증상                                                 | 원인                                  | 해결                                                                             |
| ---------------------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------- |
| 다음/이전 버튼이 즉시 비활성화                       | `pageCount` 누락                      | `useDataTableController` 가 계산한 `pageCount` 를 DataTable에 전달하는지 확인    |
| 페이지 이동 후 데이터가 그대로                       | `onPaginationChange` 미전달           | `<DataTable {...tableProps} />` 로 전달해야 TanStack Table이 URL 상태를 업데이트 |
| URL 은 바뀌는데 테이블이 리셋                        | `tableId` 충돌                        | 동일 페이지에 여러 테이블이 있다면 고유한 `tableId` 부여                         |
| status 필터가 URL에 `status=object%20Object` 로 표시 | `filterConfigs` 누락/serialize 미구현 | `type: 'array'` 설정과 직렬화 함수를 제공                                        |

### 7. 참고 문서

- `docs/DATA_TABLE_IMPLEMENTATION.md`: SettlementTable 전반 구조
- `docs/FAKER_SETUP.md`: Mock 데이터 스펙
- `docs/APP_ARCHITECTURE.md`: URL/라우트 구조
