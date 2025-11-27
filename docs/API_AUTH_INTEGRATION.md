# 🔐 API 인증 가이드

## 개요

Axios 기반 API 클라이언트의 자동 인증 시스템입니다.

**핵심 기능:**

- 자동 토큰 주입
- 401 응답 시 자동 토큰 갱신 및 재시도
- 동시 요청의 중복 갱신 방지
- 간결한 구조 (Zustand 스토어 직접 사용)

---

## 구조

### Core 패키지 (`@repo/core/api`)

```typescript
// 인증 토큰
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

// 인증 스토어 (Zustand 호환)
export interface AuthStore {
  getState: () => AuthState & AuthActions;
}

// 설정
configureAuth({
  store: AuthStore,              // Zustand 스토어
  refreshTokens: (token) => Promise<AuthTokens>,
  onAuthFailure: () => void,
});
```

### App 설정

```typescript
// apps/my-app/src/setupApiClient.ts
import { configureAuth } from '@repo/core/api';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';
import { postAuthRefreshToken } from '@/domains/auth/services/authService';

export function setupApiClient() {
  if (typeof window === 'undefined') return;

  configureAuth({
    store: useAuthStore, // Zustand 스토어 직접 전달
    refreshTokens: postAuthRefreshToken,
    onAuthFailure: () => {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    },
  });
}
```

---

## 사용법

### 1. 초기화

```typescript
// main.tsx
import { setupApiClient } from './setupApiClient';

setupApiClient();
```

### 2. API 호출

```typescript
import { api } from '@repo/core/api';

// 자동으로 Authorization 헤더 추가
const response = await api.get('/users/me');

// 401 발생 시 자동 토큰 갱신 후 재시도
```

### 3. 인증이 필요 없는 API

```typescript
// skipAuth 옵션 사용
await api.post('/auth/token', payload, { skipAuth: true });
```

---

## 동작 원리

### Request 인터셉터

1. `store.getState()`로 최신 `accessToken` 조회
2. `Authorization: Bearer {token}` 헤더 추가

### Response 인터셉터 (401 처리)

1. `store.getState()`로 최신 `refreshToken` 조회
2. `refreshTokens(refreshToken)` 호출하여 새 토큰 발급
3. `store.getState().setTokens(newTokens)` 호출하여 스토어 업데이트
4. 원본 요청에 새 토큰을 넣어 재시도

**중복 방지**: 동시 다발적 401 발생 시 하나의 갱신 요청만 실행

```typescript
let refreshPromise: Promise<AuthTokens> | null = null;

if (!refreshPromise) {
  refreshPromise = refreshTokens(token).finally(() => {
    refreshPromise = null;
  });
}
```

---

## 주요 개선 사항

### Before (복잡한 구조)

```typescript
// Provider 패턴 + wrapper 함수
configureAuth({
  store: {
    getState: () => {
      const state = useAuthStore.getState();
      return { accessToken: state.accessToken, refreshToken: state.refreshToken };
    },
    setTokens: tokens => useAuthStore.getState().setTokens(tokens),
    clearAuth: () => useAuthStore.getState().clearAuth(),
  },
  // ...
});
```

### After (간단한 구조)

```typescript
// Zustand 스토어 직접 전달
configureAuth({
  store: useAuthStore, // 끝!
  // ...
});
```

**개선 효과:**

- 코드 라인 40% 감소
- wrapper 함수 제거
- 타입 안정성 향상
- 가독성 향상

---

## 트러블슈팅

**토큰이 주입되지 않음**
→ `setupApiClient()`가 `main.tsx`에서 호출되었는지 확인

**무한 리프레시 루프**
→ `/auth/refresh-token` 엔드포인트는 자동 제외됨 (`skipAuth` 확인)

**로그아웃이 실행되지 않음**
→ `onAuthFailure` 콜백 설정 확인

---

## 관련 문서

- [인증 라우팅 가이드](/docs/ROUTE_AUTH_GUIDE.md)
- [Error Boundary 가이드](/docs/ERROR_BOUNDARY_SUMMARY.md)
