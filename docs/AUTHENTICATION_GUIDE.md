# 🔐 인증 시스템 가이드

인증 상태 관리, TanStack Router 연동, Axios 인터셉터, API 요청 추적을 포함한 통합 가이드입니다.

> **관련 문서**: [Cookie & Storage 유틸리티](./COOKIE_STORAGE_GUIDE.md)

---

## 1. 시스템 구조

| 모듈               | 파일 경로                                            | 역할                                                                                 |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **부트스트랩**     | `apps/my-app/src/main.tsx`                           | `ensureAuthClient()`로 인터셉터 설정 후 `initializeAuthSession()`으로 쿠키 상태 복원 |
| **라우터 가드**    | `apps/my-app/src/pages/_authenticated.tsx`           | `beforeLoad`에서 토큰 유무 검사 및 `/login` 리다이렉트                               |
| **전역 훅**        | `apps/my-app/src/domains/auth/hooks/useAuth.ts`      | UI 컴포넌트용 인증 상태 및 액션 제공                                                 |
| **토큰 관리**      | `apps/my-app/src/domains/auth/lib/tokenManager.ts`   | 쿠키 ↔ Zustand 동기화, 토큰 재발급, 강제 로그아웃                                   |
| **API 클라이언트** | `apps/my-app/src/domains/auth/lib/apiClient.ts`      | Axios 인터셉터 설정 (토큰 주입, 401 재시도)                                          |
| **요청 추적**      | `apps/my-app/src/domains/auth/lib/requestTracker.ts` | 300ms 이상 지연 요청 감지 및 전역 로딩 UI 제어                                       |
| **타입/상수**      | `apps/my-app/src/domains/auth/types.ts`              | 타입 정의 및 설정 상수 관리                                                          |

---

## 2. 핵심 로직 상세

### 2.1 부트스트랩 (초기화)

앱 시작 시 두 단계로 인증 환경을 구성합니다.

1.  **`ensureAuthClient()`**: Axios 인터셉터를 등록합니다. (Request: 토큰 주입/로딩 시작, Response: 로딩 종료/401 처리)
2.  **`initializeAuthSession()`**: 쿠키에 저장된 토큰을 읽어 Zustand 스토어(`useAuthStore`)를 초기화합니다.

```typescript:apps/my-app/src/main.tsx
// main.tsx
ensureAuthClient(); // 인터셉터 등록
await initializeAuthSession(); // 쿠키 -> 스토어 동기화

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(...);
```

### 2.2 API 클라이언트 및 인터셉터

`@repo/core/api`의 중앙 집중식 인터셉터 설정 기능을 활용하여 인증과 로딩 추적을 통합 관리합니다.

- **`@repo/core/api`**: 기본 Axios 인스턴스와 인터셉터 주입 함수(`setupInterceptors`)를 제공합니다.
- **`apps/my-app/.../apiClient.ts`**: `setupInterceptors`를 호출하여 앱 전용 로직을 주입합니다.

**주입되는 로직:**

1.  **getAuthToken**: 쿠키에서 Access Token을 조회하여 헤더에 자동 주입합니다.
2.  **onRequest**: 요청 시작 시 `trackRequest()`를 호출하여 로딩 추적을 시작합니다.
3.  **onResponse / onError**: 응답 완료 시 `clearRequestTracking()`으로 로딩 추적을 종료합니다.
4.  **onUnauthorized**: 401 에러 발생 시 토큰 갱신 로직을 수행하고 재시도 큐(`pendingRetryQueue`)를 처리합니다.

### 2.3 토큰 갱신 및 동기화

`tokenManager.ts`는 쿠키와 Zustand 상태를 일치시키는 역할을 합니다.

- **`persistTokens(tokens)`**: 토큰 발급/갱신 시 쿠키와 스토어에 동시 저장
- **`requestTokenRefresh()`**:
  - 중복 호출 방지 (Promise Singleton 패턴)
  - 최대 3회 재시도 (`AUTH_CONFIG.MAX_REFRESH_ATTEMPTS`)
  - 실패 시 로깅 및 `null` 반환

### 2.4 느린 요청 추적 (UX 개선)

`requestTracker.ts`는 API 요청이 일정 시간 이상 걸릴 경우에만 전역 로딩 인디케이터를 표시합니다.

- **작동 방식**: 요청 시작 시 `setTimeout` 설정 → 임계값(`AUTH_CONFIG.SLOW_REQUEST_THRESHOLD`) 내 응답 오면 `clearTimeout` → 시간 초과 시 로딩 UI 표시
- **장점**: 빠른 응답에는 깜빡임(Flicker) 없는 쾌적한 UX 제공

---

## 3. 라우팅 및 가드

TanStack Router의 `beforeLoad`와 파일 기반 라우팅을 활용합니다.

- **`_authenticated.tsx`**:
  - 인증이 필요한 모든 라우트의 상위 레이아웃.
  - `beforeLoad`: 토큰이 없으면 `/login`으로 리다이렉트 (`search.redirect`에 원래 경로 저장).
  - 로그아웃 콜백(`onSignOut`)을 하위 컴포넌트에 제공.
- **`_public.tsx`**:
  - 로그인 등 비인증 페이지용 레이아웃.

---

## 4. 개발 가이드

### 로그아웃 처리

항상 `useAuth().signOut()`을 사용하세요:

```typescript
const { signOut } = useAuth();

await signOut(); // 쿠키 삭제 → 스토어 초기화 → /login 리다이렉트
```

### API 요청

`@repo/core/api`를 사용하면 자동으로 토큰이 주입되고 401 처리가 됩니다:

```typescript
import { api } from '@repo/core/api';

await api.get('/users/me'); // Authorization 헤더 자동 추가
await api.post('/users', { name: 'New User' });
```

### 설정 커스터마이징

**인증 설정** (`types.ts`):

```typescript
export const AUTH_CONFIG = {
  MAX_REFRESH_ATTEMPTS: 3, // 토큰 갱신 최대 재시도 횟수
  SLOW_REQUEST_THRESHOLD: 300, // 로딩 UI 표시 임계값 (ms)
} as const;
```

**쿠키 보안** (`utils/cookieHelpers.ts`):

```typescript
// HTTPS 환경에서만 Secure 활성화
export function getCookieSecurityOptions() {
  const isHttps = window.location.protocol === 'https:';
  return {
    sameSite: 'strict' as const,
    secure: isHttps,
    path: '/',
  };
}
```

---

## 5. 참고 문서

- [TanStack Router Guide](https://tanstack.com/router/latest/docs/framework/react/overview)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [Cookie & Storage 유틸리티](/docs/COOKIE_STORAGE_GUIDE.md)
