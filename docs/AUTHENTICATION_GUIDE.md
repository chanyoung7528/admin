# 🔐 인증 & 라우팅 통합 가이드

> **Note**: 인증 상태 관리, TanStack Router 연동, Axios 인터셉터, API 요청 추적을 포함한 통합 가이드입니다.

---

## 1. 시스템 구조

| 모듈               | 파일 경로                                            | 역할                                                                                 |
| ------------------ | ---------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **부트스트랩**     | `apps/my-app/src/main.tsx`                           | `ensureAuthClient()`로 인터셉터 설정 후 `initializeAuthSession()`으로 쿠키 상태 복원 |
| **라우터 가드**    | `apps/my-app/src/pages/_authenticated.tsx`           | `beforeLoad`에서 토큰 유무 검사 및 `/login` 리다이렉트                               |
| **전역 훅**        | `apps/my-app/src/domains/auth/hooks/useAuth.ts`      | UI 컴포넌트용 인증 상태 및 액션(`signOut` 등) 제공                                   |
| **토큰 관리**      | `apps/my-app/src/domains/auth/lib/tokenManager.ts`   | 쿠키 ↔ Zustand 동기화, 토큰 재발급 로직, 강제 로그아웃                              |
| **API 클라이언트** | `apps/my-app/src/domains/auth/lib/apiClient.ts`      | Axios 인터셉터 설정 (토큰 주입, 401 재시도, 로딩 추적)                               |
| **요청 추적**      | `apps/my-app/src/domains/auth/lib/requestTracker.ts` | 300ms 이상 지연 요청 감지 및 전역 로딩 UI 제어                                       |

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

`apiClient.ts`는 `@repo/core/api`를 확장하여 인증과 로딩 추적 기능을 통합합니다.

- **Request Interceptor**:
  - `trackRequest()` 호출로 로딩 타이머 시작
  - `Authorization` 헤더에 Access Token 주입
- **Response Interceptor**:
  - 성공/실패 여부와 관계없이 `clearRequestTracking()`으로 로딩 타이머 정리
  - **401 Unauthorized**: `requestTokenRefresh()`로 토큰 갱신 시도 후 원래 요청 재시도 (`pendingRetryQueue` 활용)
  - 갱신 실패 시 `handleForcedLogout()`으로 강제 로그아웃

### 2.3 토큰 갱신 및 동기화

`tokenManager.ts`는 쿠키와 Zustand 상태를 일치시키는 역할을 합니다.

- **`persistTokens(tokens)`**: 토큰 발급/갱신 시 쿠키와 스토어에 동시 저장.
- **`requestTokenRefresh()`**:
  - 중복 호출 방지 (Promise Singleton 패턴)
  - 최대 3회 재시도
  - 성공 시 `persistTokens` 호출, 실패 시 `null` 반환

### 2.4 느린 요청 추적 (UX)

`requestTracker.ts`는 API 요청이 300ms 이상 걸릴 경우에만 전역 로딩 인디케이터를 표시합니다.

- **작동 방식**: 요청 시작 시 `setTimeout` 설정 -> 300ms 내 응답 오면 `clearTimeout` -> 시간 초과 시 로딩 UI 표시.
- **장점**: 빠른 응답에는 깜빡임(Flicker) 없는 쾌적한 UX 제공.

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

항상 `useAuth().signOut()`을 사용하세요. 이 훅은 다음 작업을 수행합니다:

1.  쿠키 삭제 (`clearPersistedSession`)
2.  스토어 초기화
3.  `/login` 리다이렉트

### API 요청 작성

별도의 설정 없이 `@repo/core/api`를 사용하면 자동으로 토큰이 주입되고 401 처리가 됩니다.

```typescript
import { api } from '@repo/core/api';

// 자동으로 Authorization 헤더 추가됨
await api.get('/users/me');
```

### 쿠키 보안

`utils/cookieHelpers.ts`에서 보안 옵션(`Secure`, `SameSite`, `HttpOnly` 호환 설정 등)을 중앙 관리합니다. 배포 환경에 맞춰 해당 파일을 수정하세요.

---

## 5. 참고 문서

- [TanStack Router Guide](https://tanstack.com/router/latest/docs/framework/react/overview)
- [Axios Interceptors](https://axios-http.com/docs/interceptors)
- [Cookie & Storage 유틸리티](/docs/COOKIE_STORAGE_GUIDE.md)
