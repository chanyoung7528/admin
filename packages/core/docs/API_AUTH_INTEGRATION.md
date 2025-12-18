# 🔐 API 인증 가이드

## 개요

`packages/core` 는 axios 인스턴스와 인증 상태 관리를 담당합니다. 앱에서는 한 번의 `setupApiClient()` 호출만으로 토큰 주입/갱신/오류 처리를 자동화할 수 있습니다.

**핵심 기능**

- Authorization 헤더 자동 주입
- 401 응답 시 refresh token 재요청 + 원본 요청 재실행
- 동시 401 발생 시 Promise 공유로 중복 갱신 방지
- `skipAuth` 플래그로 로그인/리프레시 API 분리

---

## 구조

### Core 패키지 (`packages/core/src/api`)

```tsx
export function configureAuth({
  store, // Zustand 스토어 (예: useAuthStore)
  refreshTokens, // refreshToken -> Promise<AuthTokens>
  onAuthFailure, // refresh 실패 시 실행
  onError, // 네트워크/서버 에러 처리
}: AuthConfig): void;
```

```tsx
const api = axios.create({ baseURL: env.apiBaseUrl, timeout: env.apiTimeout });

api.interceptors.request.use(config => {
  if (config.skipAuth) return config;
  const { accessToken } = getAuthConfig()?.store.getState() ?? {};
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});
```

### 앱 초기화 (`apps/my-app/src/setupApiClient.ts`)

```tsx
import { configureAuth } from '@repo/core/api';
import { postAuthRefreshToken } from '@/domains/auth/services/authService';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';

export function setupApiClient() {
  if (typeof window === 'undefined') return;

  configureAuth({
    store: useAuthStore,
    refreshTokens: postAuthRefreshToken,
    onAuthFailure: () => {
      useAuthStore.getState().clearAuth();
      window.location.href = '/login';
    },
    onError: error => {
      if (error.message === 'NETWORK_ERROR') alert('네트워크 연결을 확인해주세요.');
      if (error.message === 'SERVER_ERROR') alert('서버에 문제가 발생했습니다.');
    },
  });
}
```

`setupApiClient()` 는 `apps/my-app/src/main.tsx` 최상단에서 한 번만 호출합니다.

---

## 사용 패턴

### 로그인/리프레시 API

```tsx
// apps/my-app/src/domains/auth/services/authService.ts
export async function postAuthToken(payload: LoginPayload) {
  const { data } = await api.post<AuthTokenResponse>('/auth/token', payload, { skipAuth: true });
  return data.result;
}

export async function postAuthRefreshToken(refreshToken: string) {
  const { data } = await api.post<AuthTokenResponse>('/auth/refresh-token', { refreshToken }, { skipAuth: true });
  if (!data.result) throw new AuthError(AUTH_ERROR_CODES.REFRESH_FAILED);
  return data.result;
}
```

- 로그인과 리프레시 호출에는 `skipAuth: true` 를 반드시 지정합니다.

### 일반 API 호출

```tsx
import { api } from '@repo/core/api';

const users = await api.get('/users/me'); // 토큰 자동 주입
const noAuth = await api.get('/public', { skipAuth: true });
```

---

## Response 인터셉터 흐름

1. 401 + `_retry` 플래그가 없으면 refresh 흐름 시작
2. `refreshPromise` 가 없다면 `refreshTokens` 호출 후 Promise 저장
3. 성공 시 `setTokens` → 원본 요청에 새 토큰 주입 → `_retry = true` 로 재실행
4. refresh API 자체가 401이거나 실패하면 `onAuthFailure()` 실행 후 `AuthError` throw

```tsx
let refreshPromise: Promise<AuthTokens> | null = null;

if (!refreshPromise) {
  refreshPromise = config.refreshTokens(refreshToken).finally(() => {
    refreshPromise = null;
  });
}

const tokens = await refreshPromise;
config.store.getState().setTokens(tokens);
```

---

## 트러블슈팅

| 증상                         | 점검 사항                                                             |
| ---------------------------- | --------------------------------------------------------------------- |
| 토큰이 주입되지 않음         | `setupApiClient()` 호출 여부, `useAuthStore` 에 accessToken 저장 여부 |
| 무한 리프레시                | refresh API 응답이 401 인지, `skipAuth` 누락 여부                     |
| always alert “NETWORK_ERROR” | 로컬 서버 주소(`VITE_API_BASE_URL`) 확인                              |
| 로그아웃이 작동하지 않음     | `onAuthFailure` 에서 `clearAuth` + redirect 처리했는지 확인           |

---

## 연관 문서

- `../../apps/my-app/docs/ROUTE_AUTH_GUIDE.md`: TanStack Router `beforeLoad` 로 인증 라우팅 제어
- `../../apps/my-app/docs/ERROR_BOUNDARY_IMPLEMENTATION.md`: 로그인/리다이렉트 시 에러 UI 정책
- `../../docs/ARCHITECTURE.md`: Auth Store/Setup 흐름 요약
