# @repo/core

API 클라이언트, 인증 토큰 갱신, 환경변수 파싱을 담당하는 인프라 패키지입니다.

## 빠른 시작

1. 환경변수 설정 (`apps/*/.env*`)

```env
VITE_API_BASE_URL=https://api.example.com
VITE_API_TIMEOUT=30000
VITE_API_ACCEPT_LANGUAGE=ko-KR
VITE_FEATURE_DEBUG=false
```

2. 인증 훅/스토어 주입 후 API 사용

```ts
import { api, configureAuth } from '@repo/core/api';

configureAuth({
  store: authStore, // accessToken/refreshToken + setTokens/clearAuth 제공
  refreshTokens: refreshFn, // refreshToken => Promise<AuthTokens>
  onAuthFailure: () => router.navigate({ to: '/login' }),
  onError: console.error,
});

const users = await api.get('/users'); // 토큰 자동 주입, 401 시 자동 갱신
```

## 모듈

- `api`: Axios 인스턴스 + 인터셉터 (401 자동 리프레시, 5xx/네트워크 오류 핸들링).
- `config/env`: Vite 환경변수 검증 및 기본값 제공.
- `api/auth`: `AuthTokens`, `AuthError`, `configureAuth`/`getAuthConfig`.

## 사용 팁

- 토큰이不要한 요청: `api.get('/public', { skipAuth: true })`
- 리프레시 실패/토큰 없음: `AuthError`(`REFRESH_FAILED`/`UNAUTHORIZED`) 발생 → `onAuthFailure` 호출 후 예외 전달.
- 개발 프록시: 로컬에서 절대 URL을 넣어도 `VITE_API_PROXY_PREFIX`가 있으면 프록시 경로(`/api`)로 강제됩니다.
