# API 통합 가이드

서비스 → 훅 → 컴포넌트 패턴으로 API를 통합하는 방법을 설명합니다.

## 핵심 개념

**패턴**: 서비스(순수 API 호출) → 훅(TanStack Query) → 컴포넌트(UI)

**자동 기능**: 토큰 주입, 401 에러 시 토큰 갱신, 에러 핸들링

**관련 문서**: [TanStack Query](https://tanstack.com/query/latest), [Core 패키지](../packages/core/README.md)

## 초기 설정

### 1. 환경변수

```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_API_ACCEPT_LANGUAGE=ko-KR
```

### 2. API 클라이언트 초기화

```tsx
// src/setupApiClient.ts
import { configureAuth } from '@repo/core/api';

export function setupApiClient() {
  configureAuth({
    store: useAuthStore,
    refreshTokens: postAuthRefreshToken,
    onAuthFailure: () => {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    },
  });
}

// main.tsx에서 호출
setupApiClient();
```

### 3. 인증 스토어

```tsx
// domains/auth/stores/useAuthStore.ts
export const useAuthStore = create<AuthStore>()(
  persist(
    set => ({
      accessToken: null,
      refreshToken: null,
      setTokens: tokens => set(tokens),
      clearAuth: () => set({ accessToken: null, refreshToken: null }),
    }),
    { name: 'auth-storage', storage: createJSONStorage(() => localStorage) }
  )
);
```

## 기본 패턴

### 1단계: 서비스 (순수 API 호출)

```tsx
// domains/settlement/services/settlementService.ts
import { api } from '@repo/core/api';

export async function getSettlements(params) {
  const { data } = await api.get('/settlements', { params });
  return data;
}

export async function createSettlement(settlement) {
  const { data } = await api.post('/settlements', settlement);
  return data;
}
```

### 2단계: 훅 (TanStack Query)

```tsx
// domains/settlement/hooks/useSettlements.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// 조회
export function useSettlements(params) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => getSettlements(params),
  });
}

// 생성
export function useCreateSettlement() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
    },
  });
}
```

### 3단계: 컴포넌트

```tsx
// domains/settlement/components/SettlementList.tsx
export function SettlementList() {
  const { data, isLoading } = useSettlements({ page: 1, pageSize: 10 });
  const createMutation = useCreateSettlement();

  if (isLoading) return <div>로딩 중...</div>;

  return (
    <div>
      {data?.items.map(item => (
        <div key={item.id}>{item.site}</div>
      ))}
      <button onClick={() => createMutation.mutate(newData)}>생성</button>
    </div>
  );
}
```

## 주요 패턴

### 조회 (useQuery)

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
  staleTime: 1000 * 60 * 5, // 5분간 fresh
  enabled: !!id, // 조건부 실행
});
```

### 변경 (useMutation)

```tsx
const mutation = useMutation({
  mutationFn: createSettlement,
  onSuccess: data => {
    // 캐시 무효화
    queryClient.invalidateQueries({ queryKey: ['settlements'] });

    // 또는 직접 업데이트
    queryClient.setQueryData(['settlements'], old => ({
      ...old,
      items: [...old.items, data],
    }));
  },
});

// 사용
mutation.mutate(newData);
```

### 페이지네이션

```tsx
export function useSettlements(page, pageSize) {
  return useQuery({
    queryKey: ['settlements', { page, pageSize }],
    queryFn: () => getSettlements({ page, pageSize }),
    placeholderData: previousData => previousData, // 이전 데이터 유지
  });
}
```

### 낙관적 업데이트

```tsx
const mutation = useMutation({
  mutationFn: updateSettlement,
  onMutate: async newData => {
    // 진행 중 쿼리 취소
    await queryClient.cancelQueries({ queryKey: ['settlement', id] });

    // 이전 데이터 백업
    const previous = queryClient.getQueryData(['settlement', id]);

    // 낙관적 업데이트
    queryClient.setQueryData(['settlement', id], newData);

    return { previous };
  },
  onError: (err, variables, context) => {
    // 롤백
    queryClient.setQueryData(['settlement', id], context.previous);
  },
});
```

## 쿼리 키 관리

```tsx
// 계층적 설계
['settlements'][('settlements', { page: 1 })][('settlements', { page: 1, status: 'pending' })][('settlement', id)]; // 모든 정산 // 1페이지 // 필터 포함 // 특정 정산

// 무효화
queryClient.invalidateQueries({ queryKey: ['settlements'] }); // 전체
queryClient.invalidateQueries({ queryKey: ['settlement', 1] }); // 특정
```

## 에러 처리

```tsx
// 서비스 레이어
export async function getSettlements(params) {
  try {
    const { data } = await api.get('/settlements', { params });
    return data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('정산 데이터를 찾을 수 없습니다.');
    }
    throw error;
  }
}

// 훅 레이어
export function useSettlements(params) {
  return useQuery({
    queryKey: ['settlements', params],
    queryFn: () => getSettlements(params),
    retry: (failureCount, error) => {
      if (error.message.includes('찾을 수 없습니다')) return false;
      return failureCount < 3;
    },
  });
}

// 컴포넌트
const { data, error, isError } = useSettlements(params);

if (isError) {
  return <Alert variant="error">{error.message}</Alert>;
}
```

## 공개 API (토큰 없이)

```tsx
export async function getPublicData() {
  const { data } = await api.get('/public/data', {
    skipAuth: true, // 토큰 헤더 제외
  });
  return data;
}
```

## 개발 환경 프록시

```ts
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api/, ''),
      },
    },
  },
});
```

```env
# .env.development
VITE_API_BASE_URL=http://localhost:8080
VITE_API_PROXY_PREFIX=/api
```

## 체크리스트

**필수**

- ✅ setupApiClient() 호출 (앱 시작 시)
- ✅ 인증 스토어 구현 (setTokens, clearAuth)
- ✅ 서비스 → 훅 → 컴포넌트 패턴
- ✅ queryKey 명확하게 정의

**권장**

- ✅ 에러 처리 각 계층에서
- ✅ staleTime, gcTime 적절히 설정
- ✅ 낙관적 업데이트 (UX 향상)

## 관련 가이드

- [상태 관리 가이드](STATE_MANAGEMENT.md) - TanStack Query 상세
- [도메인 구조](DOMAIN_STRUCTURE.md) - 파일 구조
- [Core 패키지](../packages/core/README.md) - API 클라이언트
- [TanStack Query](https://tanstack.com/query/latest) - 공식 문서
