# 상태 관리 가이드

서버 상태(TanStack Query)와 클라이언트 상태(Zustand)를 관리하는 방법을 설명합니다.

## 상태 분류

| 상태 종류       | 출처 | 도구                  | 예시                      |
| --------------- | ---- | --------------------- | ------------------------- |
| 서버 상태       | API  | TanStack Query        | 사용자 목록, 정산 데이터  |
| 클라이언트 상태 | 로컬 | Zustand / React State | 인증 토큰, 모달 열림 상태 |

**관련 문서**: [TanStack Query](https://tanstack.com/query/latest), [Zustand](https://zustand-demo.pmnd.rs/)

## 서버 상태 (TanStack Query)

### 설정

```tsx
// main.tsx
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 1000 * 60 * 5, // 5분간 fresh
      gcTime: 1000 * 60 * 30, // 30분간 캐시 유지
    },
  },
});

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>;
```

### useQuery (조회)

```tsx
// 기본
const { data, isLoading, error } = useQuery({
  queryKey: ['settlements', params],
  queryFn: () => getSettlements(params),
});

// 옵션
const { data } = useQuery({
  queryKey: ['settlements'],
  queryFn: getSettlements,
  staleTime: 1000 * 60 * 5, // 캐시 유효 시간
  enabled: !!id, // 조건부 실행
  retry: 3, // 재시도 횟수
});
```

### useMutation (변경)

```tsx
const mutation = useMutation({
  mutationFn: createSettlement,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['settlements'] });
  },
});

// 사용
mutation.mutate(newData, {
  onSuccess: () => alert('성공!'),
});
```

### 쿼리 키 설계

```tsx
// 계층적 구조
['settlements'][('settlements', { page: 1 })][('settlement', id)]; // 모든 정산 // 1페이지 // 특정 정산

// 무효화
queryClient.invalidateQueries({ queryKey: ['settlements'] });
```

## 클라이언트 상태 (Zustand)

### 기본 사용법

```tsx
import { create } from 'zustand';

interface BearStore {
  bears: number;
  increase: () => void;
}

export const useBearStore = create<BearStore>(set => ({
  bears: 0,
  increase: () => set(state => ({ bears: state.bears + 1 })),
}));

// 컴포넌트에서
const bears = useBearStore(state => state.bears);
const increase = useBearStore(state => state.increase);
```

### persist (로컬 스토리지)

```tsx
import { persist, createJSONStorage } from 'zustand/middleware';

export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      accessToken: null,
      setTokens: tokens => set(tokens),
      clearAuth: () => set({ accessToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### 선택자 (리렌더링 최적화)

```tsx
// ❌ 나쁜 예: 전체 스토어 구독
const store = useAuthStore(); // 모든 변경 시 리렌더링

// ✅ 좋은 예: 필요한 부분만
const userName = useAuthStore(state => state.user?.name);
```

## 상태 배치 전략

```
상태가 필요한가?
├─ 서버에서 가져오는가?
│  └─ YES → TanStack Query
│
└─ 로컬 상태인가?
   ├─ 여러 컴포넌트에서 공유?
   │  ├─ YES → Zustand
   │  └─ NO → React State
   │
   └─ 영속화 필요?
      └─ YES → Zustand + persist
```

## 실전 예시

### 인증 상태 (Zustand + persist)

```tsx
export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      setTokens: tokens => set(tokens),
      setUser: user => set({ user }),
      clearAuth: () => set({ user: null, accessToken: null, refreshToken: null }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: state => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);
```

### 페이지네이션 (TanStack Query)

```tsx
export function useSettlements(page, pageSize) {
  return useQuery({
    queryKey: ['settlements', { page, pageSize }],
    queryFn: () => getSettlements({ page, pageSize }),
    placeholderData: previousData => previousData, // 이전 데이터 유지
  });
}

// 컴포넌트
const [page, setPage] = useState(1);
const { data } = useSettlements(page, 10);
```

### 낙관적 업데이트

```tsx
const mutation = useMutation({
  mutationFn: updateSettlement,
  onMutate: async newData => {
    await queryClient.cancelQueries({ queryKey: ['settlement', id] });
    const previous = queryClient.getQueryData(['settlement', id]);
    queryClient.setQueryData(['settlement', id], newData);
    return { previous };
  },
  onError: (err, variables, context) => {
    queryClient.setQueryData(['settlement', id], context.previous);
  },
});
```

## 디버깅

```tsx
// TanStack Query DevTools
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

<QueryClientProvider client={queryClient}>
  <App />
  <ReactQueryDevtools initialIsOpen={false} />
</QueryClientProvider>;

// Zustand DevTools
import { devtools } from 'zustand/middleware';

export const useStore = create(
  devtools(
    set => ({
      /* ... */
    }),
    { name: 'MyStore' }
  )
);
```

## 체크리스트

**서버 상태**

- ✅ useQuery로 조회
- ✅ useMutation으로 변경
- ✅ queryKey 명확히 정의
- ✅ 적절한 staleTime, gcTime

**클라이언트 상태**

- ✅ 전역 공유는 Zustand
- ✅ 로컬 상태는 useState
- ✅ 선택자로 리렌더링 최적화
- ✅ 영속화 필요 시 persist

## 관련 가이드

- [API 통합 가이드](API_INTEGRATION.md) - 서비스/훅 패턴
- [TanStack Query](https://tanstack.com/query/latest) - 공식 문서
- [Zustand](https://zustand-demo.pmnd.rs/) - 공식 문서
