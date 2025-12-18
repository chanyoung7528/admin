# @repo/core

핵심 인프라 패키지 - API 클라이언트 및 공통 유틸리티

## 📦 주요 모듈

### API Client

Axios 기반 HTTP 클라이언트 with 인증 인터셉터:

```typescript
import { api } from '@repo/core/api';

// API 호출
const users = await api.get('/users');

// skipAuth 옵션 (로그인, 리프레시 토큰 API)
const result = await api.post('/auth/login', payload, { skipAuth: true });
```

### Config

환경 변수 관리:

```typescript
import { env } from '@repo/core/config';

const apiUrl = env.apiBaseUrl;
const timeout = env.apiTimeout;
```

## 🔐 인증 설정

앱 초기화 시 인증 설정:

```typescript
import { configureAuth } from '@repo/core/api';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';

configureAuth({
  store: useAuthStore,
  refreshTokens: postAuthRefreshToken,
  onAuthFailure: () => {
    useAuthStore.getState().clearAuth();
    window.location.href = '/login';
  },
});
```

`my-app`은 위 설정을 `apps/my-app/src/setupApiClient.ts`에서 한 번만 수행합니다.\n+\n+자세한 사용법은 [API 인증 가이드](./docs/API_AUTH_INTEGRATION.md) 참조

## 📚 문서

- [API 인증 통합 가이드](./docs/API_AUTH_INTEGRATION.md)
