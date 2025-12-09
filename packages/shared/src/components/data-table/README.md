# DataTable 사용 가이드

TanStack Table/Query 기반 테이블 컴포넌트를 빠르게 붙이기 위한 최소 사용법입니다. 상태는 `useDataTableController`가 관리하며 URL과 동기화됩니다.

## 특징

- URL 동기화: 페이지·필터·검색 상태를 URL과 양방향 동기화
- 서버/클라이언트 겸용: `useQueryHook`+`queryParams`로 원격 페칭, `globalFilterFn`으로 클라이언트 검색
- UI 일관성: 툴바·필터·페이지네이션 기본 포함

## 빠른 시작

```tsx
import { DataTable, useDataTableController } from '@repo/shared/components/data-table';
import { settlementColumns } from '../columns';
import { useSettlements } from '../hooks/useSettlements';

const controller = useDataTableController({
  tableId: 'settlement',
  columns: settlementColumns,
  useQueryHook: useSettlements,
  queryParams: ({ pagination, columnFilters, globalFilter }) => ({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    status: columnFilters.find(f => f.id === 'status')?.value as string[] | undefined,
    filter: globalFilter?.trim() || undefined,
  }),
  filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
  searchPlaceholder: '정산 ID 또는 Site명 검색',
});

export function SettlementTable() {
  return <DataTable {...controller.tableProps} />;
}
```

## 필수 인자

- `tableId`: 테이블 고유 ID (URL 상태 키)
- `columns`: TanStack Table `ColumnDef[]`
- `useQueryHook(params)`: 데이터를 가져오는 React Query 훅

## 선택 인자

- `queryParams`: 테이블 상태 → API 파라미터 변환
- `filterConfigs`: URL에 동기화할 필터 목록 (`columnId`, `searchKey`, `type: 'array' | 'string'`)
- `renderFilters`: 툴바 필터 옵션
- `globalFilterFn`: 클라이언트 측 검색 함수
- `searchDebounceMs`, `defaultPageSize`, `emptyMessage`, `searchPlaceholder`

## 팁

- 서버 검색은 `queryParams`에서 파라미터를 만든 후 `useQueryHook`으로 전달하세요.
- 클라이언트 검색만 필요하면 `globalFilterFn`만 지정해도 됩니다.
- 필터 값이 비어있으면 `undefined`를 반환해 불필요한 쿼리 파라미터를 줄입니다.

## 참고 링크

- TanStack Table: https://tanstack.com/table/latest
- TanStack Query: https://tanstack.com/query/latest
