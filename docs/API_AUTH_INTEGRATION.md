# 🔐 API 인증 통합 가이드

## 개요

API 클라이언트의 인증 인터셉터는 다음 기능을 제공합니다:

- **자동 토큰 주입**: 모든 API 요청에 액세스 토큰 자동 추가
- **토큰 갱신**: 401 응답 시 자동으로 리프레시 토큰으로 갱신 후 재시도
- **중복 요청 방지**: 동시 다발적 401 발생 시 단 한 번만 토큰 갱신
- **에러 처리**: 인증 실패, 네트워크 오류, 서버 에러를 구조화된 방식으로 처리
- **타입 안정성**: TypeScript 기반의 완전한 타입 지원

## 아키텍처

### Core 패키지 (`@repo/core`)

**인증 프로바이더 인터페이스**

```typescript
// packages/core/src/api/auth.ts
export interface ApiAuthProvider {
  getAccessToken?: () => MaybePromise<string | null | undefined>;
  getRefreshToken?: () => MaybePromise<string | null | undefined>;
  refreshTokens?: (refreshToken: string) => Promise<ApiAuthTokens | null>;
  onTokensUpdated?: (tokens: ApiAuthTokens) => void;
  onAuthFailure?: (error: unknown) => void;
}
```

**에러 처리**

```typescript
// packages/core/src/api/auth.ts
export const AUTH_ERROR_CODES = {
  MISSING_REFRESH_TOKEN: 'MISSING_REFRESH_TOKEN',
  MISSING_REFRESH_HANDLER: 'MISSING_REFRESH_HANDLER',
  REFRESH_FAILED: 'REFRESH_FAILED',
  INVALID_CREDENTIALS: 'INVALID_CREDENTIALS',
  UNAUTHORIZED: 'UNAUTHORIZED',
} as const;

export class AuthError extends Error {
  constructor(
    public code: AuthErrorCode,
    message?: string
  ) {
    super(message || code);
    this.name = 'AuthError';
  }
}
```

**참고**: 네트워크 에러와 서버 에러는 일반 `AxiosError`로 처리되며, Error Boundary가 포착합니다.

**인터셉터 동작**

1. **Request 인터셉터**: `getAccessToken()`으로 토큰 조회 후 `Authorization` 헤더 주입
2. **Response 인터셉터 (401)**:
   - 리프레시 토큰으로 새 토큰 발급 (`refreshTokens()`)
   - 갱신 중인 경우 다른 요청은 큐에서 대기
   - 갱신 성공 시 `onTokensUpdated()` 호출 후 원본 요청 재시도
   - 갱신 실패 시 `onAuthFailure()` 호출

### My-App 연동

**인증 서비스**

```typescript
// apps/my-app/src/domains/auth/services/authService.ts

// Auth Store 인터페이스 (의존성 역전)
export interface AuthStore {
  getAccessToken: () => string | null;
  getRefreshToken: () => string | null;
  setTokens: (tokens: AuthTokens) => void;
  clearAuth: () => void;
}

// 로그인 시 토큰 발급 및 저장
export async function issueSessionTokens(payload: LoginPayload, store: AuthStore): Promise<AuthTokens>;

// 리프레시 토큰으로 세션 갱신
export async function refreshSessionTokens(refreshToken: string, store: AuthStore): Promise<AuthTokens>;

// Auth Store 어댑터 생성
export function createAuthStoreAdapter(store: ZustandStore): AuthStore;
```

**API 클라이언트 설정**

```typescript
// apps/my-app/src/setupApiClient.ts
import { configureApiAuth } from '@repo/core/api';
import { createAuthStoreAdapter, refreshSessionTokens } from '@/domains/auth/services/authService';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';

export function setupApiClient() {
  if (typeof window === 'undefined') return;

  const authStore = createAuthStoreAdapter(useAuthStore);

  configureApiAuth({
    getAccessToken: () => authStore.getAccessToken(),
    getRefreshToken: () => authStore.getRefreshToken(),
    refreshTokens: async refreshToken => {
      const tokens = await refreshSessionTokens(refreshToken, authStore);
      return tokens;
    },
    onAuthFailure: () => {
      authStore.clearAuth();
      window.location.href = '/login';
    },
  });
}
```

## 사용 방법

### 1. 앱 초기화 시 설정 로드

`main.tsx`에서 `setupApiClient()` 함수 호출:

```typescript
import { setupApiClient } from './lib/setupApiClient';

setupApiClient();
```

### 2. 로그인 Hook 사용

```typescript
import { useLogin } from '@/domains/auth/hooks/useLogin';

function LoginForm() {
  const { login, isLoading } = useLogin();

  const handleSubmit = data => {
    login(data); // 자동으로 토큰 발급 및 저장
  };
}
```

### 3. API 호출 (자동 인증 처리)

```typescript
import { api } from '@repo/core/api';

// 자동으로 Authorization 헤더가 추가됨
const response = await api.get('/users/me');

// 401 발생 시 자동으로 토큰 갱신 후 재시도
```

## 주요 개선사항

### 1. 관심사 분리 및 의존성 역전

- **Core**: 순수한 인터셉터 로직, 애플리케이션 로직 의존성 없음
- **App**: 애플리케이션별 인증 로직 (스토어, 서비스)을 프로바이더로 주입
- **AuthService**: AuthStore 인터페이스를 통한 의존성 주입으로 테스트 용이성 향상

### 2. 중복 요청 방지

동시에 여러 API가 401을 받아도 토큰 갱신은 단 한 번만 실행:

```typescript
// queueTokenRefresh: Promise 재사용으로 중복 방지
let refreshPromise: Promise<ApiAuthTokens | null> | null = null;

async function queueTokenRefresh(provider: ApiAuthProvider): Promise<ApiAuthTokens | null> {
  if (!refreshPromise) {
    refreshPromise = runRefresh(provider).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}
```

### 3. 타입 안정성

- `MaybePromise<T>`: 동기/비동기 유연성 제공
- 모든 프로바이더 함수는 선택적 (`?`)으로 설정 가능
- Generic 타입으로 확장 가능

### 4. 무한 재시도 방지

```typescript
originalRequest._retry = true; // 한 번만 재시도
if (originalRequest._retry || originalRequest.url?.includes('/auth/refresh-token')) {
  // 재시도 스킵
}
```

### 5. React Error Boundary 통합

- **Alert 제거**: 인터셉터에서 직접 UI 표시하지 않음
- **AuthError**: 인증 관련 에러만 처리 (로그인 실패, 토큰 갱신 실패 등)
- **일반 에러**: 네트워크/서버 에러는 `AxiosError`로 throw되어 Error Boundary가 포착
- **UI 레이어 처리**: 각 컴포넌트에서 에러 타입에 따라 사용자 친화적 메시지 표시

```typescript
// LoginForm 예시
const getErrorMessage = (error: Error | null): string => {
  if (error instanceof AuthError) {
    switch (error.code) {
      case AUTH_ERROR_CODES.INVALID_CREDENTIALS:
        return '사용자명 또는 비밀번호가 올바르지 않습니다.';
      default:
        return '로그인 처리 중 오류가 발생했습니다.';
    }
  }

  if (error instanceof AxiosError) {
    if (!error.response) {
      return '네트워크 연결을 확인해주세요.';
    }
    if (error.response.status >= 500) {
      return '서버에 일시적인 문제가 있습니다.';
    }
  }

  return '로그인에 실패했습니다.';
};
```

## Error Boundary 통합

### 1. 페이지 레벨 에러 처리

```typescript
// pages/_authenticated.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

function AuthenticatedLayout() {
  return (
    <Layout>
      <ErrorBoundary
        fallback="default"
        title="페이지 로딩 실패"
        description="페이지를 불러오는 중 문제가 발생했습니다."
      >
        <Outlet />
      </ErrorBoundary>
    </Layout>
  );
}
```

### 2. 컴포넌트 레벨 에러 처리

```typescript
// 특정 컴포넌트 보호
<ErrorBoundary fallback="simple">
  <DataTable {...props} />
</ErrorBoundary>
```

### 3. 수동 에러 전달

```typescript
import { useErrorHandler } from '@repo/shared/components/ui';

function MyComponent() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      await api.get('/data');
    } catch (error) {
      handleError(error); // Error Boundary로 전달
    }
  };
}
```

## 트러블슈팅

### 토큰이 주입되지 않음

- `setupApiClient()`가 `main.tsx`에서 호출되었는지 확인
- `getAccessToken()`이 정상적으로 토큰을 반환하는지 확인

### 무한 리프레시 루프

- `/auth/refresh-token` 엔드포인트는 자동으로 재시도 제외됨
- `_retry` 플래그로 한 번만 재시도

### 로그아웃이 실행되지 않음

- `onAuthFailure` 콜백이 정상적으로 설정되었는지 확인

### 에러가 Error Boundary에 포착되지 않음

- React Query를 사용하는 경우 `throwOnError: true` 설정 필요
- 이벤트 핸들러 내 에러는 `useErrorHandler`로 수동 전달 필요

## 추가 개선 아이디어

### 1. 토스트 알림 통합

```typescript
import { toast } from 'sonner'; // 또는 다른 toast 라이브러리

// 전역 에러 핸들러
window.addEventListener('unhandledrejection', event => {
  const error = event.reason;

  if (error instanceof AxiosError) {
    if (!error.response) {
      toast.error('네트워크 연결을 확인해주세요');
    } else if (error.response.status >= 500) {
      toast.error('서버에 문제가 발생했습니다');
    }
  }
});
```

### 2. 에러 모니터링 통합

```typescript
configureApiAuth({
  onAuthFailure: error => {
    // Sentry 등의 모니터링 서비스로 전송
    Sentry.captureException(error, {
      tags: { type: 'auth_failure' },
    });

    authStore.clearAuth();
    window.location.href = '/login';
  },
});
```

### 3. 재시도 로직

```typescript
import { api } from '@repo/core/api';
import axios from 'axios';

// Axios 재시도 인터셉터
axios -
  retry(api, {
    retries: 3,
    retryDelay: axios - retry.exponentialDelay,
    retryCondition: error => {
      return error.response?.status >= 500 || !error.response;
    },
  });
```

## 관련 문서

- [인증 라우팅 가이드](/docs/ROUTE_AUTH_GUIDE.md)
- [Core API 설정](/packages/core/src/api/README.md)
