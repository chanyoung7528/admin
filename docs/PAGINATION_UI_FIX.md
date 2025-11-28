# Pagination UI 업데이트 문제 해결

## 문제 진단

DataTable의 `table` 객체가 데이터 업데이트 전에 렌더링되어 pagination UI가 즉시 업데이트되지 않는 문제가 발생했습니다.

## 원인

### 1. `pageCount` 전달 시점

```typescript
// ❌ 문제: pageCount가 undefined일 때 처리하지 않음
pageCount: pageCount;

// ✅ 해결: -1로 폴백 (TanStack Table의 관례)
pageCount: pageCount ?? -1;
```

TanStack Table에서 `pageCount: -1`은 "아직 알 수 없음"을 의미합니다.

### 2. Pagination UI의 pageCount 검증 누락

```typescript
// ❌ 문제: totalPages가 0이거나 무한대일 때 처리하지 않음
const totalPages = table.getPageCount();
const pageNumbers = getPageNumbers(currentPage, totalPages);

// ✅ 해결: 유효성 검증 추가
const isPageCountValid = totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY;
const pageNumbers = isPageCountValid ? getPageNumbers(currentPage, totalPages) : [1];
```

### 3. 버튼 비활성화 로직 누락

데이터 로딩 중이거나 pageCount가 유효하지 않을 때 버튼이 활성화되어 있었습니다.

## 해결 방법

### 1. DataTable 컴포넌트 수정

**파일:** `packages/shared/src/components/data-table/data-table.tsx`

```typescript
const table = useReactTable({
  data,
  columns,
  state: {
    // ... 기존 상태
    pagination: controlledPagination ?? localPagination,
  },
  pageCount: pageCount ?? -1, // ✅ -1은 알 수 없음을 의미
  manualPagination: !!onPaginationChange,
  // ...
});
```

**변경 이유:**

- `pageCount`가 `undefined`일 때 `-1`로 폴백
- TanStack Table이 페이지 계산을 올바르게 처리할 수 있음

### 2. Pagination 컴포넌트 수정

**파일:** `packages/shared/src/components/data-table/pagination.tsx`

```typescript
export function DataTablePagination<TData>({ table, className }: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // ✅ pageCount 유효성 검증
  const isPageCountValid = totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY;
  const pageNumbers = isPageCountValid ? getPageNumbers(currentPage, totalPages) : [1];

  return (
    <div>
      {/* ✅ 로딩 상태 표시 */}
      <div>
        {isPageCountValid ? `Page ${currentPage} of ${totalPages}` : 'Loading...'}
      </div>

      {/* ✅ 버튼 비활성화 */}
      <Button
        onClick={() => table.previousPage()}
        disabled={!table.getCanPreviousPage() || !isPageCountValid}
      >
        Previous
      </Button>

      {/* ✅ 페이지 번호는 pageCount가 유효할 때만 렌더링 */}
      {isPageCountValid &&
        pageNumbers.map((pageNumber, index) => (
          // ...
        ))}

      <Button
        onClick={() => table.nextPage()}
        disabled={!table.getCanNextPage() || !isPageCountValid}
      >
        Next
      </Button>
    </div>
  );
}
```

**주요 변경사항:**

1. `isPageCountValid` 변수로 pageCount 유효성 검증
2. "Loading..." 상태 표시
3. 모든 버튼에 `disabled={... || !isPageCountValid}` 추가
4. 페이지 번호 버튼은 `isPageCountValid`일 때만 렌더링

### 3. ColumnMeta 타입 확장 복원

```typescript
// Custom meta type extension
declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string;
    thClassName?: string;
    tdClassName?: string;
  }
}
```

## 작동 원리

### 데이터 로딩 흐름

```
1. 컴포넌트 마운트
   ↓
   data: []
   pageCount: undefined
   isPageCountValid: false
   UI: "Loading..."

2. React Query 데이터 페칭 시작
   ↓
   isLoading: true

3. 데이터 도착
   ↓
   data: [...10개 아이템]
   pageCount: 100
   isPageCountValid: true
   UI: "Page 1 of 100"

4. 페이지 변경 클릭
   ↓
   pageIndex: 1
   React Query가 새 데이터 페칭
   ↓
   data: [...다음 10개 아이템]
   UI 즉시 업데이트
```

### PageCount 유효성 검증

```typescript
const isPageCountValid = totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY;
```

**검증 조건:**

- `totalPages > 0`: 페이지가 최소 1개 이상
- `totalPages !== Number.POSITIVE_INFINITY`: 무한대가 아님

**무효한 경우:**

- `totalPages === 0`: 데이터가 아직 없음
- `totalPages === -1`: 아직 계산되지 않음
- `totalPages === Infinity`: 계산 오류

## 버튼 비활성화 전략

### 1. Previous / First 버튼

```typescript
disabled={!table.getCanPreviousPage() || !isPageCountValid}
```

- 첫 페이지이거나 pageCount가 유효하지 않으면 비활성화

### 2. Next / Last 버튼

```typescript
disabled={!table.getCanNextPage() || !isPageCountValid}
```

- 마지막 페이지이거나 pageCount가 유효하지 않으면 비활성화

### 3. 페이지 번호 버튼

```typescript
{isPageCountValid && pageNumbers.map(...)}
```

- pageCount가 유효할 때만 렌더링

## TanStack Table의 manualPagination

### Server-side Pagination (manualPagination: true)

```typescript
const table = useReactTable({
  data, // 현재 페이지의 데이터만 (예: 10개)
  pageCount: 100, // 전체 페이지 수 (서버에서 계산)
  manualPagination: true,
  onPaginationChange: updater => {
    // 페이지 변경 시 서버에 새 데이터 요청
  },
});
```

**특징:**

- 서버가 필터링, 정렬, 페이지네이션 처리
- `data`는 현재 페이지의 데이터만 포함
- `pageCount`를 명시적으로 전달해야 함
- 페이지 변경 시 `onPaginationChange` 호출

### Client-side Pagination (manualPagination: false)

```typescript
const table = useReactTable({
  data, // 전체 데이터 (예: 1000개)
  manualPagination: false,
  // pageCount는 자동 계산됨
});
```

**특징:**

- TanStack Table이 모든 것을 클라이언트에서 처리
- `data`에 전체 데이터를 전달
- `pageCount` 자동 계산

## 트러블슈팅

### 페이지 번호가 표시되지 않는 경우

1. **pageCount 확인**

   ```typescript
   console.log('Page Count:', table.getPageCount());
   console.log('Is Valid:', isPageCountValid);
   ```

2. **데이터 확인**

   ```typescript
   console.log('Data Length:', data.length);
   console.log('Total Count:', totalCount);
   console.log('Calculated Page Count:', Math.ceil(totalCount / pageSize));
   ```

3. **Pagination State 확인**
   ```typescript
   console.log('Pagination:', table.getState().pagination);
   ```

### "Loading..." 상태가 사라지지 않는 경우

1. **React Query 상태 확인**

   ```typescript
   const { data, isLoading, isError } = useSettlements(params);
   console.log('Query State:', { data, isLoading, isError });
   ```

2. **pageCount prop 전달 확인**

   ```typescript
   const pageCount = Math.ceil(totalCount / pagination.pageSize);
   console.log('Page Count Prop:', pageCount);
   ```

3. **manualPagination 설정 확인**
   ```typescript
   <DataTable
     data={data}
     pagination={pagination}
     onPaginationChange={onPaginationChange}  // ✅ 이게 있어야 함
     pageCount={pageCount}  // ✅ 이것도 전달해야 함
   />
   ```

## 요약

Pagination UI 업데이트 문제는 다음 세 가지 수정으로 해결했습니다:

1. **pageCount 폴백**: `pageCount ?? -1`로 undefined 처리
2. **유효성 검증**: `isPageCountValid`로 UI 상태 관리
3. **버튼 비활성화**: 데이터 로딩 중 사용자 액션 방지

이제 데이터가 업데이트되면 pagination UI가 즉시 반영됩니다.
