## DataTable Architecture

### 1. 레이어 개요

```
Page (createFileRoute + validateSearch)
  ↓
Domain Table Component (ex. SettlementTable)
  ↓
useXxxTable (도메인 전용 컨트롤러 훅)
  ↓
useDataTableController
  ↓
useTableUrlState + useDataTableState + usePaginationState
  ↓
DataTable / Toolbar / Pagination UI
```

- **Page**: URL 검색 스키마(Zod)와 레이아웃 조합 담당.
- **Domain Component**: 통계 카드, 에러 블록, `<DataTable {...tableProps} />` 배치.
- **Controller Hook**: URL ↔ React Query ↔ Table props를 연결하는 유일한 진입점.

### 2. 파일 구조

```
data-table/
├── data-table.tsx
├── toolbar.tsx
├── pagination.tsx
├── faceted-filter.tsx
├── hooks/
│   ├── useDataTableState.ts
│   ├── useDataTableController.ts
│   ├── useTableUrlState.ts
│   └── usePaginationState.ts
└── docs/
    ├── ARCHITECTURE.md
    ├── CONTROLLER_GUIDE.md
    └── DEBOUNCE_GUIDE.md
```

### 3. 렌더 순서

1. `<DataTable>` 이 `useDataTableState` 를 호출하여 TanStack Table 인스턴스를 생성
2. `<DataTableToolbar>` 가 `table.getState()` 를 읽어 검색/필터 UI를 구성
3. `<DataTablePagination>` 이 `usePaginationState` 로 `isPageCountValid`, 버튼 핸들러 계산
4. 사용자 인터랙션은 모두 `table` 또는 `onPaginationChange`/`onColumnFiltersChange` 를 통해 URL 상태를 곧바로 갱신

### 4. 상태 흐름

1. **URL → 테이블**  
   `useTableUrlState` 는 Search Params 를 파싱해 `pagination`, `columnFilters`, `globalFilter` 를 계산합니다.
2. **테이블 → 컨트롤러**  
   `useDataTableController` 는 위 상태를 React Query 파라미터로 변환하고, 디바운스된 검색어를 관리합니다.
3. **컨트롤러 → DataTable**  
   `tableProps` 에 pagination/filters/sorting/ensurePageInRange 등을 모아 `<DataTable>` 로 전달합니다.

### 5. 주요 훅

| 훅                       | 핵심 역할                                                                      |
| ------------------------ | ------------------------------------------------------------------------------ |
| `useDataTableState`      | controlled vs local state 결정, `useReactTable` 호출, skeleton 행 계산         |
| `useTableUrlState`       | Search Params ↔ pagination/filters/globalFilter 양방향 동기화                 |
| `useDataTableController` | URL 상태 + React Query + 디바운스 검색을 조합한 `tableProps` 생성              |
| `usePaginationState`     | `table.getPageCount()` 기반 UI/핸들러 계산 (`isPageCountValid`, `pageNumbers`) |

### 6. 상태 전략

- URL 이 단일 소스이기 때문에 키(`key` prop)를 강제로 변경하거나 별도의 로컬 상태를 유지할 필요가 없습니다.
- Controlled/Uncontrolled 혼합 가능: pagination 을 URL로 제어하면서 columnVisibility 는 로컬 상태로 둘 수 있습니다.
- 검색은 `useDataTableController` 에서 디바운스 후 React Query 키에 반영하므로, 입력창은 즉시 반응하면서 API 요청은 최소화됩니다.

### 7. 성능 포인트

- `pageCount ?? -1` : 페이지 수를 아직 모를 때는 -1로 두어 버튼을 잠시 비활성화합니다.
- `paginationKey` : 페이지 크기 변경 시 Pagination 컴포넌트를 강제로 리렌더링해 ARIA 속성을 초기화합니다.
- Devtools(React Query, Router)는 상위 앱에서 `lazy` 로 임포트하므로 DataTable에는 영향이 없습니다.

### 8. 적용 가이드

1. Page 에서 `validateSearch` 로 page/pageSize/status/filter 를 정의
2. Domain 훅(`useXxxTable`) 에서 `useDataTableController` 호출
3. Domain 컴포넌트에서 통계/에러 UI를 추가하고 `<DataTable {...tableProps} />` 렌더
4. React Query 훅은 `{ data, total, isLoading, isError }` 형식을 맞추고, Query Key 를 정규화 (ex. status 배열 정렬)

### 9. 참고

- `docs/CONTROLLER_GUIDE.md` : `useDataTableController` 파라미터 상세
- `docs/DEBOUNCE_GUIDE.md` : 검색 디바운스 동작
- 루트 `/docs/DATA_TABLE_IMPLEMENTATION.md`, `/docs/DATA_TABLE_PAGINATION.md`
