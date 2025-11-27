# 🔐 API 인증 통합 가이드

## 개요

API 클라이언트의 인증 인터셉터는 다음 기능을 제공합니다:

- **자동 토큰 주입**: 모든 API 요청에 액세스 토큰 자동 추가
- **토큰 갱신**: 401 응답 시 자동으로 리프레시 토큰으로 갱신 후 재시도
- **중복 요청 방지**: 동시 다발적 401 발생 시 단 한 번만 토큰 갱신
- **인증 실패 처리**: 갱신 실패 시 자동 로그아웃 및 리다이렉트

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

**인터셉터 동작**

1. **Request 인터셉터**: `getAccessToken()`으로 토큰 조회 후 `Authorization` 헤더 주입
2. **Response 인터셉터 (401)**:
   - 리프레시 토큰으로 새 토큰 발급 (`refreshTokens()`)
   - 갱신 중인 경우 다른 요청은 큐에서 대기
   - 갱신 성공 시 `onTokensUpdated()` 호출 후 원본 요청 재시도
   - 갱신 실패 시 `onAuthFailure()` 호출

### My-App 연동

**세션 서비스**

```typescript
// apps/my-app/src/domains/auth/services/sessionService.ts

// 로그인 시 토큰 발급 및 저장
export async function issueSessionTokens(payload: LoginPayload): Promise<AuthTokens>;

// 리프레시 토큰으로 세션 갱신
export async function refreshSessionTokens(refreshToken?: string | null): Promise<AuthTokens>;

// 액세스 토큰 스냅샷 조회
export function getAccessTokenSnapshot(): string | null;

// 리프레시 토큰 스냅샷 조회
export function getRefreshTokenSnapshot(): string | null;

// 세션 초기화 (로그아웃)
export function clearAuthSession(): void;
```

**API 클라이언트 설정**

```typescript
// apps/my-app/src/lib/setupApiClient.ts
import { configureApiAuth } from '@repo/core/api';
import { clearAuthSession, getAccessTokenSnapshot, getRefreshTokenSnapshot, refreshSessionTokens } from '@/domains/auth/services/sessionService';

if (typeof window !== 'undefined') {
  configureApiAuth({
    getAccessToken: getAccessTokenSnapshot,
    getRefreshToken: getRefreshTokenSnapshot,
    refreshTokens: async refreshToken => {
      const tokens = await refreshSessionTokens(refreshToken);
      return tokens;
    },
    onAuthFailure: () => {
      clearAuthSession();
      window.location.href = '/login';
    },
  });
}
```

## 사용 방법

### 1. 앱 초기화 시 설정 로드

`main.tsx`에서 `setupApiClient.ts`를 import하여 자동 실행:

```typescript
import './lib/setupApiClient';
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

### 1. 관심사 분리

- **Core**: 순수한 인터셉터 로직, 애플리케이션 로직 의존성 없음
- **App**: 애플리케이션별 인증 로직 (스토어, 서비스)을 프로바이더로 주입

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

## 트러블슈팅

### 토큰이 주입되지 않음

- `setupApiClient.ts`가 `main.tsx`에서 import되었는지 확인
- `getAccessToken()`이 정상적으로 토큰을 반환하는지 확인

### 무한 리프레시 루프

- `/auth/refresh-token` 엔드포인트는 자동으로 재시도 제외됨
- `_retry` 플래그로 한 번만 재시도

### 로그아웃이 실행되지 않음

- `onAuthFailure` 콜백이 정상적으로 설정되었는지 확인
- 네트워크 에러 (401 아님)인 경우 로그아웃 실행 안 됨

## 확장 가능성

### 커스텀 에러 처리

```typescript
configureApiAuth({
  // ...
  onAuthFailure: error => {
    // 에러 로깅
    console.error('Auth failed:', error);

    // 분석 전송
    analytics.track('auth_failure', { error });

    // 로그아웃
    clearAuthSession();
  },
});
```

### 토큰 갱신 시 추가 로직

```typescript
configureApiAuth({
  // ...
  onTokensUpdated: tokens => {
    // 분석 이벤트
    analytics.track('token_refreshed');

    // 로그
    console.log('Tokens updated at:', new Date());
  },
});
```

## 관련 문서

- [인증 라우팅 가이드](/docs/ROUTE_AUTH_GUIDE.md)
- [Core API 설정](/packages/core/src/api/README.md)
