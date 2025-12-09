# Data Table 아키텍처 가이드

## 📋 목차

1. [개요](#개요)
2. [폴더 구조](#폴더-구조)
3. [컴포넌트 계층 구조](#컴포넌트-계층-구조)
4. [렌더링 순서 및 로직 흐름](#렌더링-순서-및-로직-흐름)
5. [커스텀 훅 상세 설명](#커스텀-훅-상세-설명)
6. [상태 관리 전략](#상태-관리-전략)
7. [성능 최적화](#성능-최적화)

## 개요

Data Table은 TanStack Table을 기반으로 한 고성능 테이블 컴포넌트입니다. UI와 비즈니스 로직을 분리하여 유지보수성과 재사용성을 극대화했습니다.

### 핵심 특징

- ✅ **UI/로직 분리**: 커스텀 훅을 통한 관심사 분리
- ✅ **제어/비제어 모드**: 유연한 상태 관리
- ✅ **디바운스 최적화**: 검색 입력 성능 최적화
- ✅ **URL 상태 동기화**: 브라우저 히스토리 관리
- ✅ **타입 안정성**: TypeScript 완전 지원

## 폴더 구조

```
packages/shared/
├── docs/
│   └── data-table/                # 문서 (공용)
│       ├── ARCHITECTURE.md        # 아키텍처 가이드 (현재 문서)
│       ├── CONTROLLER_GUIDE.md    # 컨트롤러 사용 가이드
│       └── DEBOUNCE_GUIDE.md      # 디바운스 가이드
└── src/
    └── components/
        └── data-table/
            ├── hooks/                      # 커스텀 훅 (비즈니스 로직)
            │   ├── use-data-table-state.ts    # 테이블 상태 관리
            │   ├── use-toolbar-state.ts       # 툴바 상태 관리
            │   ├── use-pagination-state.ts    # 페이지네이션 상태 관리
            │   ├── use-faceted-filter-state.ts # 필터 상태 관리
            │   └── index.ts
            ├── data-table.tsx              # 메인 테이블 컴포넌트
            ├── toolbar.tsx                 # 툴바 컴포넌트
            ├── pagination.tsx              # 페이지네이션 컴포넌트
            ├── faceted-filter.tsx          # 패싯 필터 컴포넌트
            ├── use-data-table-controller.ts # URL 동기화 컨트롤러
            ├── use-table-url-state.ts      # URL 상태 관리
            ├── use-table-instance-key.ts   # 인스턴스 키 관리
            └── index.ts
```

## 컴포넌트 계층 구조

```
DataTable (Root)
│
├─ DataTableToolbar
│  ├─ Input (검색)
│  └─ DataTableFacetedFilter (여러 개)
│     └─ Popover > Command (필터 옵션)
│
├─ Table (테이블 본체)
│  ├─ TableHeader
│  └─ TableBody
│     └─ TableRow[]
│        └─ TableCell[]
│
└─ DataTablePagination
   ├─ Select (페이지 크기)
   └─ Button[] (페이지 네비게이션)
```

## 렌더링 순서 및 로직 흐름

### 1️⃣ 초기 렌더링 (Initial Render)

#### 1.1 DataTable 컴포넌트 마운트

```typescript
// 1. Props 받기
DataTable({ columns, data, pagination, onPaginationChange, ... })

// 2. useDataTableState 훅 실행
const { table, rows, hasRows, paginationKey, isFiltered } = useDataTableState({...})

// 3. TanStack Table 인스턴스 생성 (useReactTable)
//    - 상태 초기화 (sorting, filters, pagination 등)
//    - 모델 생성 (Core, Filter, Pagination, Sort, Faceted)
```

**상태 결정 순서:**

```
1. Props에서 controlled state 확인 (예: pagination prop)
2. 없으면 local state 사용 (예: localPagination)
3. 최종 상태 = controlled ?? local
```

#### 1.2 DataTableToolbar 렌더링

```typescript
// 1. useToolbarState 훅 실행
const {
  inputRef,
  inputValue,
  filterSelectedValues,
  isFiltered,
  handleSearchChange,
  handleReset,
  ...
} = useToolbarState({...})

// 2. 초기 상태 설정
//    - 포커스 캐시 확인
//    - 테이블 현재 필터 값 읽기
//    - 로컬 상태 초기화

// 3. 디바운스 함수 생성 (useMemo)
const debouncedApplySearch = debounce((value) => {
  table.setFilterValue(value)
}, 300)

// 4. useEffect 설정
//    - 포커스 유지 효과
//    - 클린업 함수 등록
```

#### 1.3 DataTablePagination 렌더링

```typescript
// 1. usePaginationState 훅 실행
const { pageSize, currentPage, totalPages, isPageCountValid, pageNumbers, ...handlers } = usePaginationState({ table });

// 2. 페이지 정보 계산 (useMemo)
//    - currentPage = pageIndex + 1
//    - isPageCountValid = totalPages > 0 && totalPages !== Infinity
//    - pageNumbers = getPageNumbers(currentPage, totalPages)
```

### 2️⃣ 사용자 상호작용 (User Interaction)

#### 2.1 검색어 입력

```
사용자 입력
    ↓
onChange 이벤트
    ↓
handleSearchChange 실행
    ↓
setLocalSearchValue(value) ← 즉시 UI 업데이트
    ↓
debouncedApplySearch(value) ← 300ms 대기
    ↓
table.setFilterValue(value) ← 디바운스 후 실행
    ↓
TanStack Table 내부 상태 업데이트
    ↓
onColumnFiltersChange / onGlobalFilterChange 콜백 (있으면)
    ↓
URL 업데이트 (Controller 사용 시)
    ↓
테이블 리렌더링 (필터링된 데이터)
```

**포커스 관리:**

```
입력창 포커스
    ↓
handleInputFocus
    ↓
setShouldKeepFocus(true)
    ↓
inputValue = localSearchValue (로컬 값 표시)

입력창 블러
    ↓
handleInputBlur
    ↓
toolbar 내부인지 확인
    ↓
외부면 → setShouldKeepFocus(false)
    ↓
inputValue = tableSearchValue (테이블 값 표시)
```

#### 2.2 필터 선택

```
필터 옵션 클릭
    ↓
handleOptionSelect(optionValue)
    ↓
newSelectedValues = Set 업데이트
    ↓
onSelectedValuesChange(newSelectedValues)
    ↓
column.setFilterValue(filterValues)
    ↓
테이블 상태 업데이트
    ↓
필터링된 데이터 표시
```

#### 2.3 리셋 버튼

```
리셋 버튼 클릭
    ↓
handleReset
    ↓
1. setIsResetting(true) ← UI 즉시 반응
2. debouncedApplySearch.cancel() ← 대기 중인 검색 취소
3. setLocalSearchValue('') ← 로컬 상태 초기화
4. debouncedApplySearch('') ← 빈 값으로 디바운스 실행
5. 모든 필터 초기화
6. table.resetColumnFilters()
7. inputRef.focus() ← 사용자 경험
8. setTimeout(() => setIsResetting(false), 100) ← 상태 복원
```

#### 2.4 페이지 변경

```
페이지 버튼 클릭
    ↓
handlePageClick(pageNumber)
    ↓
table.setPageIndex(pageNumber - 1)
    ↓
onPaginationChange 콜백 (있으면)
    ↓
URL 업데이트 (Controller 사용 시)
    ↓
데이터 리페치 (서버 페이지네이션) 또는 리렌더링 (클라이언트)
```

### 3️⃣ 상태 업데이트 사이클

```
사용자 액션
    ↓
이벤트 핸들러
    ↓
로컬 상태 업데이트 (setState)
    ↓
React 리렌더링 예약
    ↓
커스텀 훅 재실행
    ↓
useMemo로 계산된 값 재계산 (필요시)
    ↓
컴포넌트 리렌더링
    ↓
DOM 업데이트
```

**최적화 포인트:**

- `useMemo`: 비싼 계산 캐싱 (pageNumbers, debouncedApplySearch)
- `useCallback`: 핸들러 함수 안정화 (없지만 필요시 추가 가능)
- `debounce`: 입력 이벤트 최적화

## 커스텀 훅 상세 설명

### useDataTableState

**역할:** 테이블의 핵심 상태와 TanStack Table 인스턴스 관리

**입력:**

- `columns`: 컬럼 정의
- `data`: 테이블 데이터
- 제어 상태들: `pagination`, `columnFilters`, `globalFilter`, etc.
- 콜백들: `onPaginationChange`, `onColumnFiltersChange`, etc.

**출력:**

```typescript
{
  table: Table<TData>,           // TanStack Table 인스턴스
  rows: Row<TData>[],            // 현재 페이지의 행들
  hasRows: boolean,              // 데이터 존재 여부
  paginationKey: string,         // 리마운트용 키
  isFiltered: boolean,           // 필터 적용 여부
  currentPagination: PaginationState
}
```

**내부 로직:**

1. Local state 선언 (비제어 모드용)
2. Controlled vs Local 상태 결정
3. `useReactTable` 호출하여 테이블 인스턴스 생성
4. 페이지 범위 검증 (`ensurePageInRange`)
5. 파생 상태 계산 (rows, hasRows, isFiltered)

### useToolbarState

**역할:** 검색창, 필터 선택, 리셋 로직 관리

**입력:**

- `table`: TanStack Table 인스턴스
- `searchKey`: 검색 대상 컬럼
- `searchDebounceMs`: 디바운스 시간
- `filters`: 필터 설정

**출력:**

```typescript
{
  inputRef: RefObject<HTMLInputElement>,
  inputValue: string,
  filterSelectedValues: Map<string, Set<string>>,
  isFiltered: boolean,
  handleSearchChange: (e) => void,
  handleInputFocus: () => void,
  handleInputBlur: (e) => void,
  handleReset: () => void,
  setFilterSelectedValues: Dispatch<...>
}
```

**핵심 로직:**

1. **포커스 캐시:** 페이지 이동 후 복귀 시 상태 복원
2. **디바운스:** lodash-es의 debounce 사용
3. **입력 값 표시 로직:**
   ```typescript
   inputValue =
     isResetting || shouldKeepFocus
       ? localSearchValue // 사용자가 보는 값
       : tableSearchValue; // 테이블 실제 값
   ```
4. **리셋 로직:**
   - 디바운스 취소로 중복 실행 방지
   - 순차적 상태 업데이트로 깜빡임 방지

### usePaginationState

**역할:** 페이지네이션 UI 상태와 네비게이션 로직

**입력:**

- `table`: TanStack Table 인스턴스

**출력:**

```typescript
{
  pageIndex: number,
  pageSize: number,
  totalPages: number,
  currentPage: number,          // 1-based
  isPageCountValid: boolean,
  pageNumbers: (number | '...')[],
  canPreviousPage: boolean,
  canNextPage: boolean,
  handleFirstPage: () => void,
  handleLastPage: () => void,
  handlePreviousPage: () => void,
  handleNextPage: () => void,
  handlePageSizeChange: (value: string) => void,
  handlePageClick: (pageNumber: number) => void
}
```

**페이지 번호 계산:**

```typescript
// getPageNumbers 유틸 사용
// 예: [1, 2, 3, '...', 10] (현재 페이지 근처만 표시)
```

### useFacetedFilterState

**역할:** 다중 선택 필터의 상태 관리

**입력:**

- `column`: 필터링할 컬럼
- `selectedValues`: 현재 선택된 값들
- `onSelectedValuesChange`: 콜백

**출력:**

```typescript
{
  facets: Map<string, number>,     // 각 옵션의 개수
  handleOptionSelect: (value: string) => void,
  handleClearFilters: () => void
}
```

**선택 로직:**

```typescript
// Toggle 방식
if (isSelected) {
  newSet.delete(value);
} else {
  newSet.add(value);
}
```

## 상태 관리 전략

### 제어 vs 비제어 모드

**제어 모드 (Controlled):**

```typescript
<DataTable
  data={data}
  columns={columns}
  pagination={pagination}              // ← 외부에서 제어
  onPaginationChange={handlePageChange} // ← 변경 알림
/>
```

**비제어 모드 (Uncontrolled):**

```typescript
<DataTable
  data={data}
  columns={columns}
  // pagination prop 없음 → 내부 상태 사용
/>
```

**하이브리드 모드:**

```typescript
<DataTable
  data={data}
  columns={columns}
  pagination={pagination}              // 페이지는 제어
  // columnFilters는 비제어 (prop 없음)
/>
```

### 상태 우선순위

```typescript
const currentValue = controlledValue ?? localValue;
```

**장점:**

- 유연성: 필요한 것만 제어
- 단순성: 기본 동작은 내장
- 확장성: 언제든 제어 모드로 전환 가능

### URL 상태 동기화

**Controller 패턴:**

```typescript
const controller = useDataTableController({
  columns,
  data,
  filters: [...],
  searchKey: 'name'
})

<DataTable {...controller.tableProps} />
```

**동작 흐름:**

```
URL 파라미터
    ↓
useTableUrlState 훅
    ↓
상태 파싱 (page, pageSize, filters, search)
    ↓
DataTable에 제어 props 전달
    ↓
사용자 액션
    ↓
onXxxChange 콜백
    ↓
URL 업데이트 (nuqs)
    ↓
다시 상태 파싱...
```

## 성능 최적화

### 1. 메모이제이션

```typescript
// 비싼 계산 캐싱
const pageNumbers = useMemo(() => {
  return isPageCountValid ? getPageNumbers(currentPage, totalPages) : []
}, [isPageCountValid, currentPage, totalPages])

// 디바운스 함수 캐싱
const debouncedApplySearch = useMemo(
  () => debounce((value: string) => {...}, searchDebounceMs),
  [searchKey, searchDebounceMs, table]
)
```

### 2. 디바운스

```typescript
// 검색 입력 최적화
debouncedApplySearch(value); // 300ms 후 실행

// 리셋 시 취소
debouncedApplySearch.cancel();
debouncedApplySearch.flush(); // 또는 즉시 실행
```

### 3. 조건부 렌더링

```typescript
{isLoading ? (
  // 스켈레톤 UI
) : hasRows ? (
  // 실제 데이터
) : (
  // 빈 상태
)}
```

### 4. Key를 통한 리마운트 제어

```typescript
// 특정 조건에서 컴포넌트 리마운트
const paginationKey = `${pageIndex}-${pageSize}-${pageCount}-${data.length}`

<DataTablePagination key={paginationKey} table={table} />
```

**사용 이유:** 페이지 카운트 변경 시 버튼 상태를 확실하게 리셋

### 5. TanStack Table 내장 최적화

- **Faceted Model:** 필터 옵션 개수 계산 최적화
- **Row Model:** 가상화 지원 준비
- **Memoized Cells:** 셀 렌더링 최적화

## 확장 가이드

### 새로운 필터 타입 추가

1. `DataTableProps`에 prop 추가
2. 새로운 필터 컴포넌트 생성
3. 커스텀 훅 작성 (선택 사항)
4. `DataTableToolbar`에 통합

### 서버 페이지네이션 지원

```typescript
<DataTable
  data={data}
  columns={columns}
  pagination={pagination}
  onPaginationChange={(updater) => {
    // 서버에 요청
    fetchData(newPagination)
  }}
  pageCount={totalPages}  // 서버에서 받은 총 페이지
  isLoading={isLoadingData}
/>
```

### 커스텀 글로벌 필터 함수

```typescript
<DataTable
  globalFilterFn={(row, columnId, filterValue) => {
    // 커스텀 필터 로직
    return customMatch(row, filterValue)
  }}
/>
```

## 문제 해결

### 검색창이 깜빡이는 경우

- `shouldKeepFocus` 상태 확인
- 디바운스 취소 로직 확인
- `inputValue` 계산 로직 검증

### 페이지가 범위를 벗어나는 경우

- `ensurePageInRange` 콜백 구현
- `pageCount` prop 정확성 확인

### 필터가 URL과 동기화되지 않는 경우

- Controller 사용 확인
- `onColumnFiltersChange` 콜백 확인
- nuqs 설정 확인

## 참고 자료

- [TanStack Table 공식 문서](https://tanstack.com/table/latest)
- [CONTROLLER_GUIDE.md](./CONTROLLER_GUIDE.md) - URL 동기화 가이드
- [DEBOUNCE_GUIDE.md](./DEBOUNCE_GUIDE.md) - 디바운스 상세 설명
