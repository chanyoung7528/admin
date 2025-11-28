# @repo/core

공용 axios 인스턴스와 인증 설정, 환경 변수 검증을 담당합니다.

## 📦 모듈

| 경로                | 설명                                                     |
| ------------------- | -------------------------------------------------------- |
| `src/api/client.ts` | axios 인스턴스 + interceptors (`skipAuth`, refresh flow) |
| `src/api/auth.ts`   | `configureAuth`, `AuthTokens`, `AuthError` 정의          |
| `src/config/env.ts` | `VITE_*` 값 검증 및 `env` 객체 생성                      |

## 사용 예시

```ts
// apps/my-app/src/setupApiClient.ts
import { configureAuth } from '@repo/core/api';
import { postAuthRefreshToken } from '@/domains/auth/services/authService';
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

```ts
// 일반 API 호출
import { api } from '@repo/core/api';
const me = await api.get('/users/me'); // 토큰 자동 주입
const login = await api.post('/auth/token', payload, { skipAuth: true });
```

## 환경 변수

`src/config/env.ts` 는 아래 키를 검증합니다.

| 키                         | 예시                      | 비고                     |
| -------------------------- | ------------------------- | ------------------------ |
| `VITE_API_BASE_URL`        | `https://api.example.com` | 절대/상대 경로 모두 허용 |
| `VITE_API_TIMEOUT`         | `30000`                   | ms 단위                  |
| `VITE_API_ACCEPT_LANGUAGE` | `ko-KR`                   | 기본 요청 헤더           |
| `VITE_FEATURE_DEBUG`       | `false`                   | DevTools 노출 여부       |

앱에서 `import { env } from '@repo/core/config';` 으로 사용할 수 있습니다.
