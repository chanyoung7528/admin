# 페이지네이션 연동 문제 해결

## 문제 진단

DataTable의 페이지네이션이 API 데이터와 연동되지 않는 문제가 발생했습니다.

## 원인

### 1. React Query 캐시 키 문제

```typescript
// ❌ 문제: 객체를 직접 전달하면 참조가 매번 변경되어 캐싱 실패
queryKey: ['settlements', params];

// ✅ 해결: 각 파라미터를 개별적으로 직렬화
queryKey: ['settlements', params?.page, params?.pageSize, params?.status, params?.service, params?.filter];
```

객체 참조가 매번 바뀌면 React Query가 새로운 요청으로 인식하여 캐싱이 제대로 작동하지 않습니다.

### 2. 불필요한 console.log

개발 중 추가된 `console.log`가 코드를 오염시켰습니다.

## 해결 방법

### 1. React Query 훅 수정

**파일:** `apps/my-app/src/domains/settlement/hooks/useSettlements.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import { getSettlements, type GetSettlementsParams } from '../services/settlementService';

export function useSettlements(params?: GetSettlementsParams) {
  return useQuery({
    // ✅ 각 파라미터를 개별적으로 직렬화
    queryKey: ['settlements', params?.page, params?.pageSize, params?.status, params?.service, params?.filter],
    queryFn: () => getSettlements(params),
    staleTime: 5 * 60 * 1000,
    retry: 2,
  });
}
```

### 2. console.log 제거

**파일:** `apps/my-app/src/domains/settlement/services/settlementService.ts`

```typescript
// ❌ Before
let filteredData = [...settlements];
console.log(filteredData);

// ✅ After
let filteredData = [...settlements];
```

**파일:** `apps/my-app/src/domains/settlement/components/SettlementTable.tsx`

```typescript
// ❌ Before
console.log(data);
console.log(settlements);

// ✅ After (디버깅용 useEffect 추가)
useEffect(() => {
  console.log('🔍 Pagination Debug:', {
    pageIndex: pagination.pageIndex,
    pageSize: pagination.pageSize,
    totalCount,
    pageCount,
    dataLength: settlements.length,
    isLoading,
  });
}, [pagination.pageIndex, pagination.pageSize, totalCount, pageCount, settlements.length, isLoading]);
```

### 3. DataTable 설정 확인

**파일:** `apps/my-app/src/domains/settlement/components/SettlementTable.tsx`

```typescript
<DataTable
  showToolbar={true}
  columns={settlementColumns}
  data={settlements}

  // 서버 사이드 페이지네이션 설정
  pagination={pagination}
  onPaginationChange={onPaginationChange}
  pageCount={pageCount}  // 전체 페이지 수 전달

  // 필터링 설정
  columnFilters={columnFilters}
  onColumnFiltersChange={onColumnFiltersChange}
  globalFilter={globalFilter}
  onGlobalFilterChange={onGlobalFilterChange}

  ensurePageInRange={ensurePageInRange}
  // ...
/>
```

## React Query 캐시 키 베스트 프랙티스

### 1. 원시 타입 사용

```typescript
// ✅ Good: 원시 타입으로 직렬화
queryKey: ['users', userId, page, pageSize];

// ❌ Bad: 객체 직접 사용
queryKey: ['users', { userId, page, pageSize }];
```

### 2. 배열은 JSON.stringify 사용

```typescript
// ✅ Good: 배열을 문자열로 직렬화
queryKey: ['settlements', page, JSON.stringify(status)];

// 또는 개별 값으로 전개
queryKey: ['settlements', page, ...(status || [])];

// ❌ Bad: 배열 직접 사용 (참조가 바뀜)
queryKey: ['settlements', page, status];
```

### 3. Optional 파라미터 처리

```typescript
// ✅ Good: undefined는 자동으로 무시됨
queryKey: ['settlements', params?.page, params?.status];

// ✅ Good: 명시적 처리
queryKey: ['settlements', params?.page ?? 1, params?.status ?? null];
```

## 페이지네이션 동작 확인

### 1. 브라우저 콘솔에서 확인

```
🔍 Pagination Debug: {
  pageIndex: 0,      // 첫 페이지 (0-based)
  pageSize: 10,      // 페이지당 10개
  totalCount: 1000,  // 전체 1000개
  pageCount: 100,    // 총 100 페이지
  dataLength: 10,    // 현재 페이지 데이터 10개
  isLoading: false
}
```

### 2. React Query DevTools에서 확인

- Query Key가 페이지 변경 시 업데이트되는지 확인
- 캐시된 데이터가 재사용되는지 확인
- 네트워크 요청이 적절히 발생하는지 확인

### 3. 페이지네이션 버튼 테스트

- 다음 페이지 클릭 → `pageIndex` 증가
- 이전 페이지 클릭 → `pageIndex` 감소
- 페이지 크기 변경 → `pageSize` 변경 & `pageIndex` 리셋

## DataTable manualPagination 이해

```typescript
// packages/shared/src/components/data-table/data-table.tsx
const table = useReactTable({
  data,
  columns,
  state: {
    pagination: controlledPagination ?? localPagination,
  },
  pageCount: pageCount,
  manualPagination: !!onPaginationChange, // true면 서버 사이드 페이지네이션
  // ...
});
```

- `manualPagination: true`: 서버에서 페이지네이션 처리
  - `pageCount`를 명시적으로 전달해야 함
  - `data`는 현재 페이지의 데이터만 포함
- `manualPagination: false`: 클라이언트에서 페이지네이션 처리
  - `data`에 전체 데이터를 전달
  - TanStack Table이 자동으로 슬라이싱

## 트러블슈팅

### 페이지네이션이 여전히 작동하지 않는 경우

1. **React Query DevTools 확인**

   ```bash
   pnpm add -D @tanstack/react-query-devtools
   ```

2. **Query Key 로깅**

   ```typescript
   useEffect(() => {
     console.log('Query Key:', ['settlements', params?.page, params?.pageSize, params?.status]);
   }, [params]);
   ```

3. **API 응답 확인**

   ```typescript
   const { data } = useSettlements(params);
   useEffect(() => {
     console.log('API Response:', data);
   }, [data]);
   ```

4. **Pagination State 확인**
   ```typescript
   useEffect(() => {
     console.log('Pagination State:', pagination);
   }, [pagination]);
   ```

### 페이지 변경 시 데이터가 업데이트되지 않는 경우

1. **onPaginationChange 확인**

   ```typescript
   onPaginationChange={(updater) => {
     console.log('Pagination Changed:', updater);
     // ...
   }}
   ```

2. **URL 동기화 확인**
   ```typescript
   const navigate: NavigateFn = ({ search }) => {
     console.log('Navigate called:', search);
     // ...
   };
   ```

## 요약

페이지네이션 연동 문제는 주로 다음 두 가지 원인으로 발생합니다:

1. **React Query 캐시 키 문제**: 객체 참조로 인한 캐싱 실패
2. **상태 동기화 문제**: URL ↔ React Query ↔ DataTable 간 동기화

해결 방법:

- Query Key를 원시 타입으로 직렬화
- 페이지네이션 상태를 명확히 관리
- 디버깅 로그로 데이터 흐름 추적
