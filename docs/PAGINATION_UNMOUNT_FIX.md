# 페이지네이션 UI 업데이트 버그 수정

## 문제 상황

페이지를 이동한 후 다시 돌아와서 페이지네이션을 동작시키면 UI가 업데이트되지 않는 버그 발생.

## 원인 분석

### 1. 조건부 렌더링 문제

```typescript
// ❌ 문제 코드
{showPagination && tablePageCount > 0 && <DataTablePagination table={table} />}
```

**문제점:**

- `tablePageCount > 0` 조건이 추가됨
- 페이지 이동 시 `tablePageCount`가 잠시 `0` 또는 `-1`이 될 수 있음
- 조건이 `false`가 되면 `DataTablePagination` 컴포넌트가 **언마운트**됨
- 다시 마운트될 때 React가 내부 상태를 초기화함
- 결과: UI 업데이트 실패

### 2. 컴포넌트 언마운트/마운트 사이클

```
1. 페이지 1 표시
   tablePageCount: 100
   DataTablePagination: 마운트 ✅

2. 페이지 이동 클릭
   데이터 로딩 시작
   tablePageCount: -1 (잠시)
   DataTablePagination: 언마운트 ❌

3. 새 데이터 도착
   tablePageCount: 100
   DataTablePagination: 재마운트 ✅

4. 하지만 내부 상태가 리셋되어 UI 업데이트 안됨 ❌
```

## 해결 방법

### 1. 조건부 렌더링 제거

**파일:** `packages/shared/src/components/data-table/data-table.tsx`

```typescript
// ✅ 해결: 항상 렌더링
{showPagination && <DataTablePagination table={table} className="mt-auto" />}
```

**이유:**

- `DataTablePagination` 컴포넌트를 항상 마운트 상태로 유지
- 컴포넌트 내부에서 `isPageCountValid`로 상태 처리
- React가 컴포넌트를 재사용하여 상태 업데이트가 정상 작동

### 2. useMemo로 안정적인 값 계산

**파일:** `packages/shared/src/components/data-table/pagination.tsx`

```typescript
import { useMemo } from 'react';

export function DataTablePagination<TData>({ table, className }: DataTablePaginationProps<TData>) {
  const currentPage = table.getState().pagination.pageIndex + 1;
  const totalPages = table.getPageCount();

  // ✅ useMemo로 안정적인 값 계산
  const isPageCountValid = useMemo(() => {
    return totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY;
  }, [totalPages]);

  const pageNumbers = useMemo(() => {
    return isPageCountValid ? getPageNumbers(currentPage, totalPages) : [];
  }, [isPageCountValid, currentPage, totalPages]);

  // ...
}
```

**개선점:**

- `useMemo`로 계산 결과를 메모이제이션
- `totalPages`가 실제로 변경될 때만 재계산
- 불필요한 리렌더링 방지

### 3. 향상된 디버깅 로그

**파일:** `apps/my-app/src/domains/settlement/components/SettlementTable.tsx`

```typescript
useEffect(() => {
  console.log('🔍 Pagination Debug:', {
    'pagination.pageIndex': pagination.pageIndex,
    'pagination.pageSize': pagination.pageSize,
    'data?.total': data?.total,
    totalCount,
    pageCount,
    'data?.settlements.length': data?.settlements?.length,
    'settlements.length': settlements.length,
    isLoading,
    isError,
    hasData: !!data,
  });
}, [data, pagination.pageIndex, pagination.pageSize, totalCount, pageCount, settlements.length, isLoading, isError]);
```

## 작동 원리

### Before (문제 상황)

```
페이지 1 → 페이지 2 클릭
  ↓
tablePageCount: 100 → -1 (잠시) → 100
  ↓
DataTablePagination: 마운트 → 언마운트 → 재마운트
  ↓
내부 상태 리셋 → UI 업데이트 실패 ❌
```

### After (해결 후)

```
페이지 1 → 페이지 2 클릭
  ↓
tablePageCount: 100 → -1 (잠시) → 100
  ↓
DataTablePagination: 마운트 상태 유지
  ↓
isPageCountValid: true → false → true
  ↓
UI 즉시 업데이트 ✅
```

## React의 조건부 렌더링 주의사항

### 문제가 되는 패턴

```typescript
// ❌ Bad: 조건에 따라 마운트/언마운트 반복
{condition1 && <Component />}
{condition2 && <Component />}
```

**문제점:**

- 조건이 자주 변경되면 컴포넌트가 계속 언마운트/마운트됨
- 내부 상태가 유지되지 않음
- 애니메이션, 포커스 상태 등이 리셋됨

### 권장하는 패턴

```typescript
// ✅ Good: 항상 마운트, 내부에서 조건 처리
<Component show={condition} />

// 또는
<Component>
  {condition ? <ActualContent /> : <Placeholder />}
</Component>
```

**장점:**

- 컴포넌트가 항상 마운트 상태
- 내부 상태 유지
- 부드러운 전환

## DataTablePagination의 내부 처리

```typescript
export function DataTablePagination<TData>({ table }: Props) {
  const totalPages = table.getPageCount();
  const isPageCountValid = totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY;

  return (
    <div>
      {/* 로딩 상태 표시 */}
      {isPageCountValid ? `Page ${currentPage} of ${totalPages}` : 'Loading...'}

      {/* 버튼 비활성화 */}
      <Button disabled={!isPageCountValid}>Previous</Button>

      {/* 페이지 번호는 유효할 때만 렌더링 */}
      {isPageCountValid && pageNumbers.map(...)}

      <Button disabled={!isPageCountValid}>Next</Button>
    </div>
  );
}
```

**처리 방식:**

- 컴포넌트는 항상 렌더링됨
- `isPageCountValid`에 따라 내용만 변경
- 언마운트/마운트 없이 상태 유지

## 테스트 시나리오

### 1. 정상 페이지 이동

```
페이지 1 → 페이지 2 클릭
Expected: 페이지 2 데이터 표시 + UI 업데이트 ✅
```

### 2. 빠른 연속 클릭

```
페이지 1 → 페이지 2 → 페이지 3 빠르게 클릭
Expected: 모든 클릭에 대해 UI 정상 업데이트 ✅
```

### 3. 새로고침 후 이동

```
새로고침 → 페이지 2 클릭
Expected: 정상 작동 ✅
```

### 4. 필터 적용 후 이동

```
필터 적용 → 페이지 2 클릭 → 필터 해제 → 페이지 1 클릭
Expected: 모든 단계에서 UI 정상 업데이트 ✅
```

## 성능 최적화

### useMemo 사용

```typescript
const isPageCountValid = useMemo(() => {
  return totalPages > 0 && totalPages !== Number.POSITIVE_INFINITY;
}, [totalPages]);
```

**효과:**

- `totalPages`가 실제로 변경될 때만 재계산
- 불필요한 리렌더링 방지
- 성능 향상

## 요약

**문제:** 조건부 렌더링으로 인한 컴포넌트 언마운트 → 상태 리셋 → UI 업데이트 실패

**해결:**

1. 조건부 렌더링 제거 → 컴포넌트 항상 마운트
2. `useMemo`로 안정적인 값 계산
3. 내부에서 `isPageCountValid`로 상태 처리

**결과:** 페이지 이동 시 UI가 항상 즉시 업데이트됨 ✅
