# 🔐 TanStack Router 인증 가이드

## 1. 기본 구조

```
apps/my-app/src/pages
├── __root.tsx
├── _authenticated.tsx
├── _authenticated/
└── _public/
```

- `__root.tsx` : ErrorBoundary, Loading Overlay, DevTools, RouterProvider
- `/_authenticated` : 인증이 필요한 모든 페이지를 감싸는 레이아웃
- `/_public` : 로그인 등 인증이 필요 없는 페이지 전용 레이아웃

## 2. 인증 레이아웃

```tsx
// apps/my-app/src/pages/_authenticated.tsx
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
  return (
    <Layout onSignOut={logout}>
      <ErrorBoundary fallback="minimal">
        <Header />
      </ErrorBoundary>
      <ErrorBoundary fallback="default">
        <Outlet />
      </ErrorBoundary>
    </Layout>
  );
}
```

## 3. 퍼블릭 레이아웃

```tsx
// apps/my-app/src/pages/_public.tsx
export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  return (
    <div className="min-h-screen">
      <ErrorBoundary fallback="default" showHomeButton>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
```

## 4. 자식 라우트 작성법

### 인증이 필요한 페이지

```tsx
// apps/my-app/src/pages/_authenticated/my-food/settlement.tsx
export const Route = createFileRoute('/_authenticated/my-food/settlement')({
  component: FoodSettlementPage,
  validateSearch: settlementSearchSchema,
});
```

### 퍼블릭 페이지

```tsx
// apps/my-app/src/pages/_public/login.tsx
export const Route = createFileRoute('/_public/login')({
  component: LoginPage,
});
```

## 5. 로그인 성공 후 redirect

```tsx
const navigate = useNavigate();
const search = useSearch({ from: '/_public/login' });

const handleLoginSuccess = () => {
  const redirectTo = (search as { redirect?: string }).redirect || '/';
  navigate({ to: redirectTo });
};
```

`_authenticated` 의 `beforeLoad` 가 `redirect` search param 을 채우므로, 로그인 성공 후 원래 가려던 페이지로 돌아갈 수 있습니다.

## 6. 체크리스트

- [ ] 인증 필요한 파일은 반드시 `_authenticated/<path>.tsx` 로 위치
- [ ] `createFileRoute` 경로가 `/ _authenticated/...` 또는 `/_public/...` 인지 확인
- [ ] `beforeLoad` 에서 Zustand store 를 직접 읽어 동기적으로 인증 여부 판별
- [ ] 로그인 API 응답에서 토큰을 `useAuthStore.setTokens` 로 저장 후 `navigate`
- [ ] 로그아웃 버튼(`Layout` 의 `onSignOut`)은 `useLogout` 훅을 통해 store와 API를 모두 초기화

## 7. 참고 자료

- `docs/API_AUTH_INTEGRATION.md`
- `docs/ERROR_BOUNDARY.md`
- [TanStack Router - Layout Routes](https://tanstack.com/router/latest/docs/framework/react/guide/route-trees#layout-routes)
- [TanStack Router - Authentication](https://tanstack.com/router/latest/docs/framework/react/guide/authenticated-routes)
