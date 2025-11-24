# 🔐 인증 로직 종합 가이드

이 문서는 `apps/my-app` 기준 인증 흐름을 상위 레이어부터 스토리지, API 단까지 정리한 레퍼런스입니다. 라우트 구조 자체는 `docs/ROUTE_AUTH_GUIDE.md`를 참고하고, 여기서는 **상태 보존·API 연동·리스크**를 중심으로 다룹니다.

---

## 1. 시스템 맵

| 계층           | 파일                                                               | 역할                                                                                  |
| -------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------- |
| 라우터 가드    | `apps/my-app/src/pages/_authenticated.tsx`                         | `beforeLoad`에서 인증 상태 확인 후 `/login` 리다이렉트                                |
| 퍼블릭 진입점  | `apps/my-app/src/pages/_public/login.tsx`                          | 로그인 폼 + access/refresh 토큰 발급/저장                                             |
| 전역 훅        | `apps/my-app/src/domains/auth/hooks/useAuth.ts`                    | CookieStore 기반 토큰 동기화, API 요청/응답 인터셉터, 토큰 저장·재발급·로그아웃 제공  |
| 전역 스토어    | `apps/my-app/src/domains/auth/stores/useAuthStore.ts`              | 토큰·사용자 상태 보관 (쿠키 I/O 없음, `useAuth`에서 관리)                             |
| 로그아웃 UI    | `packages/shared/src/components/layouts/sidebar/SignOutDialog.tsx` | 확인 다이얼로그. `useAuth().signOut()` 콜백을 받아 실제 로직에 위임                   |
| API 클라이언트 | `packages/core/src/api/client.ts`                                  | 공통 Axios 인스턴스. core는 JSON 언랩만 담당, 인증·401·로딩 처리는 `useAuth`가 일원화 |
| 스토리지 유틸  | `packages/core/src/utils/{cookie,storage}.ts`                      | Cookie Store API + SSR 안전한 local/session storage 래퍼                              |

---

## 2. 실행 흐름 상세

### 2.1 보호 라우트 진입

`/_authenticated` 레이아웃은 `beforeLoad`로 인증을 검사합니다.

```7:24:apps/my-app/src/pages/_authenticated.tsx
export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async ({ location }) => {
    const isAuthenticated = await checkAuth();
    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});
```

- `checkAuth()`는 `initializeAuthSession()`으로 미리 동기화된 Zustand 상태만 확인합니다.
- `typeof window === 'undefined'` 시 바로 false를 반환해 SSR/프리렌더 환경에서도 안전합니다.
- `redirect` 시 `search.redirect`를 넘겨 로그인 이후 원래 페이지로 복귀할 수 있는 구조가 이미 마련되어 있습니다.

### 2.2 로그인 절차

```13:25:apps/my-app/src/pages/_public/login.tsx
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  // TODO: 실제 로그인 API 호출
  await setTokens({
    accessToken: 'demo-access-token',
    refreshToken: 'demo-refresh-token',
  });
  navigate({ to: '/' });
};
```

- 아직 API 연동 전이므로 토큰 구조가 확정되지 않았습니다.
- `navigate` 대상이 `/`로 하드코딩되어 `redirect` 쿼리를 활용하지 못합니다.
- 비밀번호 입력 시 별도 밸리데이션/에러 표시가 없습니다.

### 2.3 Zustand 기반 전역 상태

```24:140:apps/my-app/src/domains/auth/hooks/useAuth.ts
export async function initializeAuthSession() {
  if (hasHydratedTokens || typeof window === 'undefined') {
    return;
  }

  const [savedAccess, savedRefresh] = await Promise.all([cookie.get(ACCESS_TOKEN_COOKIE_KEY), cookie.get(REFRESH_TOKEN_COOKIE_KEY)]);
  useAuthStore.getState().setTokens({
    accessToken: savedAccess ?? '',
    refreshToken: savedRefresh ?? '',
  });

  hasHydratedTokens = true;
}

export function useAuth() {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);
  const accessToken = useAuthStore(state => state.accessToken);
  const refreshToken = useAuthStore(state => state.refreshToken);
  const setUser = useAuthStore(state => state.setUser);

  const persistTokens = useCallback(async (tokens: AuthTokens) => {
    const cookieOptions = getCookieSecurityOptions();
    await Promise.all([
      cookie.set(ACCESS_TOKEN_COOKIE_KEY, tokens.accessToken, cookieOptions),
      cookie.set(REFRESH_TOKEN_COOKIE_KEY, tokens.refreshToken, cookieOptions),
    ]);
    useAuthStore.getState().setTokens(tokens);
  }, []);

  const signOut = useCallback(async () => {
    await clearPersistedSession();
    navigate({ to: '/login', replace: true });
  }, [navigate]);

  return {
    user,
    accessToken,
    refreshToken,
    setUser,
    setTokens: persistTokens,
    signOut,
  };
}
```

- `initializeAuthSession()`을 앱 부트스트랩 구간에서 한 번만 호출해 쿠키 → Zustand 동기화를 끝낸 뒤, 나머지 레이어는 스토어만 참조합니다.
- CookieStore I/O, API 요청/응답 인터셉터, 토큰 재발급, 로그아웃 등 부수 효과는 모두 `useAuth` 훅에 집중됩니다.
- 쿠키는 `SameSite=strict`, HTTPS 환경에서만 `secure` 옵션을 주도록 하여 기본적인 XSRF 대비책을 적용합니다.

### 2.4 토큰 재발급 & Axios 응답 인터셉터

```85:150:apps/my-app/src/domains/auth/hooks/useAuth.ts
const MAX_REFRESH_ATTEMPTS = 3;

api.interceptors.response.use(
  response => response,
  async error => {
    if (error.response?.status !== 401 || typeof window === 'undefined') {
      return Promise.reject(error);
    }

    const originalRequest = error.config as RetryableRequestConfig | undefined;
    if (!originalRequest || originalRequest._retry || originalRequest.url?.includes('/auth/refresh')) {
      await handleForcedLogout();
      return Promise.reject(error);
    }

    const refreshedTokens = await requestTokenRefresh();
    if (refreshedTokens && originalRequest.headers) {
      originalRequest._retry = true;
      originalRequest.headers.Authorization = `Bearer ${refreshedTokens.accessToken}`;
      return enqueueRequestRetry(originalRequest);
    }

    await handleForcedLogout();
    return Promise.reject(error);
  }
);
```

- `requestTokenRefresh()`는 최대 3회까지 재발급을 시도하며, `refreshPromise`로 동시 호출을 묶습니다.
- 재발급 성공 시 쿠키·Zustand를 동시에 업데이트하고 대기 중이던 API 요청은 `enqueueRequestRetry` 큐를 통해 순차 재시도합니다.
- 재발급 실패 혹은 `/auth/refresh` 401 시에는 세션을 정리한 뒤 TanStack Router `router.navigate`로 `/login` 리다이렉트하며, 직전 위치를 `search.redirect`에 보존합니다.
- 요청/응답 인터셉터는 core `api` 인스턴스와 동일하게 공유되므로 모든 도메인 서비스가 동일한 인증 흐름을 따릅니다.

### 2.4 로그아웃 처리

- `useAuth().signOut()`이 쿠키 삭제 → Zustand 초기화 → `/login` 리다이렉트를 모두 처리합니다.
- 레이아웃(`@repo/shared/components/layouts`)이 `onSignOut` 콜백을 내려 받아 `NavUser`, `ProfileDropdown` 모두 같은 행동을 공유합니다.

### 2.5 API 호출

```17:40:packages/core/src/api/client.ts
api.interceptors.request.use(async config => {
  const token = await cookie.get(ACCESS_TOKEN_COOKIE_KEY);
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

- 토큰 조회도 CookieStore를 통일해 단일 소스를 유지합니다.
- 401 응답 시에는 core 레벨에서 아무 작업도 하지 않고, `useAuth`가 Router 기반 재시도/로그아웃을 전담합니다.

### 2.6 전체 페이지 로딩 UI

- `packages/shared/src/hooks/useFullPageLoadingStore.ts`가 300ms 이상 응답이 지연된 요청을 추적하고, `packages/shared/src/components/ui/full-page-loading.tsx`가 `__root` 레이아웃 최상단에 포털 형태로 렌더됩니다.
- 모든 Axios 요청은 `useAuth`에서 오버라이드한 `api.request`를 통과하며, 각 요청마다 타이머를 부착해 지연 여부를 판단합니다.
- 지연 구간에 진입한 요청이 하나라도 존재하면 반투명 오버레이 + 회전 아이콘이 노출되고, 해당 요청이 완료되면 즉시 해제됩니다.

---

## 3. 토큰 저장 지점 비교

| 구분           | 키                                        | 저장소      | 작성 위치                       | 소비 위치                          | 설명                                                           |
| -------------- | ----------------------------------------- | ----------- | ------------------------------- | ---------------------------------- | -------------------------------------------------------------- |
| 라우터 가드    | `auth_access_token`                       | CookieStore | `_public/login.tsx` → `useAuth` | `_authenticated.tsx` → `checkAuth` | 부트스트랩 시 `initializeAuthSession()`으로 쿠키→스토어 동기화 |
| API 클라이언트 | `auth_access_token`                       | CookieStore | `useAuth` (요청 인터셉터 주입)  | `@repo/core/api/client`            | Authorization 헤더 자동 주입                                   |
| 로그아웃 액션  | `auth_access_token`, `auth_refresh_token` | CookieStore | `useAuth().signOut()`           | `Layout` → `SignOutDialog`         | 두 토큰 모두 삭제 후 `/login` 이동                             |
| 리프레시 토큰  | `auth_refresh_token`                      | CookieStore | `_public/login.tsx` → `useAuth` | 추후 refresh API (미구현)          | 향후 토큰 재발급 시 활용 예정                                  |

**결론:** accessToken/refreshToken을 CookieStore로 일원화하면서 라우터·API·로그아웃이 `useAuth` 하나로 묶였습니다.

---

## 4. 리스크 및 개선안

1. **토큰 재발급 미구현**
   - _영향_: accessToken 만료 시 사용자가 즉시 로그아웃되며, refreshToken이 있어도 활용되지 않음.
   - _권장_: refresh API를 연동하고 `setTokens`/`initializeAuthSession` 흐름에서 양쪽 토큰을 동시에 갱신.

2. **CookieStore 비동기 의존**
   - _영향_: 모든 토큰 작업이 Promise 기반이라 초기 hydrate가 완료되기 전까지 flash 상태가 발생할 수 있음.
   - _권장_: `main.tsx` 부트스트랩에서 `initializeAuthSession()`을 await하여 초기 깜빡임을 줄이고, 필요 시 로딩 UI를 제공.

3. **JWT 파싱 미구현**
   - _영향_: 만료 시간·권한 기반 라우팅이 불가능.
   - _권장_: `jwt-decode` 등으로 `AuthUser`를 세팅하고, `exp` 기반 자동 로그아웃/리프레시를 준비.

4. **401 처리 파이프라인**
   - _현황_: core 401 리다이렉트는 제거됐으며, `useAuth`가 Router 기반 강제 이동 + 요청 큐 재시도를 담당.
   - _주의_: Router 인스턴스가 아직 초기화되지 않은 환경(테스트, Storybook)에서는 `window.location.href` 폴백이 동작하도록 예외 처리를 유지.

5. **로그아웃 후 UI 재활용 문제**
   - _영향_: `useAuthStore`를 구독하지 않는 컴포넌트는 갱신되지 않음.
   - _권장_: `RouterProvider` 상단에서 `useAuthStore`를 구독해 토큰 변화를 감지하거나, TanStack Router `context`로 auth 정보를 주입.

---

## 5. 구현 가이드 (제안 수순)

1. **쿠키/인터셉터 일원화**
   - 모든 토큰 접근 및 요청 인터셉터 주입 로직을 `useAuth` 훅 내부에서만 정의해, 다른 레이어가 쿠키 키를 몰라도 되게 유지합니다.
2. **경량 Zustand 스토어**
   - 스토어는 순수 상태(`user`, `accessToken`, `refreshToken`)와 동기식 세터만 노출하고, CookieStore I/O·비동기 처리는 `useAuth`에서 담당합니다.
3. **라우터 가드 개선**
   - `checkAuth()`는 CookieStore를 직접 읽지 않고 `useAuthStore` 상태만 확인하도록 단순화하고, SSR 환경 (`typeof window === 'undefined'`)에서는 즉시 false를 반환합니다.
4. **Axios 인터셉터 정비**
   - `useAuth`에서 api 요청 인터셉터를 주입하고, 401 시 TanStack Router의 `router.navigate`를 사용하는 방향으로 확장합니다.
5. **로그인 페이지 개선**
   - React Hook Form + server error 표시.
   - 로그인 성공 시 API 응답의 access/refresh 토큰을 `setTokens`로 전달한 뒤 `navigate({ to: search.redirect ?? '/' })`.
6. **권한/만료 처리**
   - `refreshToken`으로 토큰을 갱신하거나, `routeTree` 레벨에서 `user.role` 기반 접근 제어를 추가.

---

## 6. 체크리스트 & 테스트

- [ ] 로그인 성공 시 토큰이 단일 키/스토리지에만 저장되는가?
- [ ] 새로고침 후에도 `_authenticated` 가드가 정상 통과되는가?
- [ ] 만료/로그아웃 시 `SignOutDialog` 없이도 API 401 → `/login` 흐름이 작동하는가?
- [ ] `redirect` 쿼리를 이용해 원래 페이지로 복귀하는가?
- [ ] React Query DevTools를 켜서 API 호출이 Authorization 헤더를 포함하는지 확인.

### 권장 시나리오

1. 비로그인 상태에서 `/monitoring` 접근 → `/login` 리다이렉트 확인.
2. 잘못된 비밀번호 → 오류 메시지.
3. 로그인 → `/monitoring` 렌더 + API Authorization 헤더 포함.
4. 쿠키 삭제 → 다음 라우트 진입 시 강제 로그아웃.

---

## 7. 참고 자료

- [라우트 구조 가이드](/docs/ROUTE_AUTH_GUIDE.md)
- [Cookie & Storage 가이드](/docs/COOKIE_STORAGE_GUIDE.md)
- [TanStack Router 인증 가이드](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)
- [Axios 인터셉터 문서](https://axios-http.com/docs/interceptors)

> **TIP**: 인증 로직은 공통(core/shared) 기능에 속하므로 변경 시 본 문서와 루트 `README.md`의 링크를 반드시 업데이트하세요.
