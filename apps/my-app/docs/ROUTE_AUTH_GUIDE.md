# 🔐 인증 기반 라우트 구조 가이드 (my-app)

TanStack Router(File-based)를 사용해 **퍼블릭/인증 라우트**를 레이아웃 단위로 분리하고, 인증이 필요한 영역에서만 **일괄 인증 가드(beforeLoad)**를 실행합니다.

---

## 📁 현재 라우트 구조(현 코드 기준)

```text
apps/my-app/src/pages/
├── __root.tsx
├── _public.tsx
│   └── _public/
│       └── login.tsx
└── _authenticated.tsx
    └── _authenticated/
        ├── index.lazy.tsx
        └── settlement/
            ├── basic-table.tsx
            ├── list.tsx
            ├── register.tsx
            └── view.tsx
```

- `__root.tsx`: 최상위 루트 레이아웃(전역 ErrorBoundary/Global Fetching Overlay)
- `_public.tsx`: **퍼블릭 레이아웃**(사이드바 없음)
- `_authenticated.tsx`: **인증 레이아웃**(사이드바/헤더 포함 + 인증 가드)

> `_` prefix 레이아웃 라우트는 **URL 경로에 포함되지 않습니다.**
>
> - `/_public/login` → `/login`
> - `/_authenticated/settlement/list` → `/settlement/list`

---

## 🎯 핵심 개념

### 1. 레이아웃 라우트(`_` prefix)

- URL에 노출되지 않는 "그룹/레이아웃" 라우트
- 자식 라우트에 공통 UI/로직을 제공
- 인증 체크/전역 에러 처리/레이아웃 구성에 적합

### 2. 인증 가드: `_authenticated.tsx`의 `beforeLoad`

`apps/my-app/src/pages/_authenticated.tsx`

- 모든 인증 영역 진입 시 `beforeLoad`가 실행
- `useAuthStore.getState()`로 현재 인증 상태를 동기적으로 확인
- 미인증이면 `/login`으로 redirect하며, 로그인 후 복귀할 URL을 `search.redirect`로 전달

```tsx
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { useAuthStore } from '@/domains/auth/stores/useAuthStore';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: ({ location }) => {
    const { isAuthenticated } = useAuthStore.getState();

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: { redirect: location.href },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  return <Outlet />;
}
```

### 3. 퍼블릭 레이아웃: `_public.tsx`

`apps/my-app/src/pages/_public.tsx`

- 인증 체크 없이 자식 라우트를 렌더링

```tsx
import { createFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return <Outlet />;
}
```

---

## 🧩 페이지 작성 규칙

### 인증이 필요한 페이지

- 파일 위치: `src/pages/_authenticated/**`
- 라우트 선언: `createFileRoute('/_authenticated/...')`

예) `src/pages/_authenticated/settlement/list.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/settlement/list')({
  component: RouteComponent,
});

function RouteComponent() {
  return <div>정산 리스트</div>;
}
```

### 퍼블릭 페이지

- 파일 위치: `src/pages/_public/**`
- 라우트 선언: `createFileRoute('/_public/...')`

예) `src/pages/_public/login.tsx`

```tsx
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});

function LoginPage() {
  return <div>로그인</div>;
}
```

---

## 🔁 로그인 후 리다이렉트 흐름

- 인증 가드에서 `/login?redirect=<원래 URL>` 형태로 전달
- 로그인 성공 시, `redirect`가 있으면 해당 URL로 이동, 없으면 `/`로 이동

`apps/my-app/src/pages/_public/login.tsx`의 흐름:

- `useSearch({ from: Route.id })`로 `redirect` 파라미터 읽기
- 로그인 성공 콜백에서 `navigate({ to: redirectTo })`

---

## 🧱 인증 상태 저장소

- 위치: `apps/my-app/src/domains/auth/stores/useAuthStore.ts`
- Zustand + persist를 사용하며, 토큰/인증 플래그를 부분 저장(partialize)합니다.

---

## ✅ 체크리스트

- [ ] 인증 페이지는 반드시 `src/pages/_authenticated/**`에 위치
- [ ] 인증 가드는 `_authenticated.tsx`의 `beforeLoad`에서만 처리(페이지별 중복 금지)
- [ ] 퍼블릭 페이지는 `src/pages/_public/**`에 위치
- [ ] 미인증 접근 시 `/login`으로 이동하고, 로그인 후 원복(redirect) 동작 확인

## 참고

- [TanStack Router - Layout Routes](https://tanstack.com/router/latest/docs/framework/react/guide/route-trees#layout-routes)
- [TanStack Router - Authentication](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)
- [TanStack Router - Redirect](https://tanstack.com/router/latest/docs/framework/react/api/redirect)
