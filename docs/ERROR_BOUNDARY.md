## 🛡️ ErrorBoundary 가이드

### 1. 컴포넌트 개요

- 구현 위치: `packages/shared/src/components/ui/error-boundary.tsx`
- 폴백 타입: `default`, `simple`, `minimal`
- 공통 옵션: `title`, `description`, `showHomeButton`, `onError`, `onReset`
- 보조 훅: `useErrorHandler` (비동기 로직에서 Boundary로 예외 전달)

### 2. 계층 구조

| 레벨                 | 파일                                       | 폴백                                | 역할                                                               |
| -------------------- | ------------------------------------------ | ----------------------------------- | ------------------------------------------------------------------ |
| Root                 | `apps/my-app/src/pages/__root.tsx`         | `default` + 홈 버튼                 | 전체 앱 보호, DevTools/로딩 오버레이 포함                          |
| Authenticated Layout | `apps/my-app/src/pages/_authenticated.tsx` | Header=`minimal`, Content=`default` | 인증된 사용자 레이아웃, Header 오류가 본문에 영향 주지 않도록 분리 |
| Public Layout        | `apps/my-app/src/pages/_public.tsx`        | `default` + 홈 버튼                 | 로그인/소개 페이지 컨테이너                                        |
| 도메인/페이지        | 필요 시                                    | `simple` 또는 `minimal`             | `DashboardView`, `MonitoringPanel` 등 도메인 컴포넌트 보호         |

```tsx
// apps/my-app/src/pages/_authenticated.tsx
<Layout onSignOut={logout}>
  <ErrorBoundary fallback="minimal">
    <Header />
  </ErrorBoundary>
  <ErrorBoundary fallback="default" title="페이지 로딩 실패" description="페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요.">
    <Outlet />
  </ErrorBoundary>
</Layout>
```

### 3. Root Boundary 세부 동작

- `onError`: `console.error` 로 에러와 stack 을 출력 (Sentry 연동 지점)
- `onReset`: 홈(`/`)으로 navigate
- `env.isDebug` 가 true면 React/TanStack DevTools 를 Lazy import 하므로, Boundary 아래에서 Suspense를 사용합니다.

```tsx
// apps/my-app/src/pages/__root.tsx
<ErrorBoundary
  fallback="default"
  showHomeButton
  onError={(error, info) => {
    console.error('🚨 Root Level Error:', error);
    console.error('Component Stack:', info.componentStack);
  }}
  onReset={() => router.navigate({ to: '/' })}
>
  <Outlet />
  {isFetchingPosts > 0 && <LoadingPageOverlay />}
  {env.isDebug && (
    <Suspense fallback={null}>
      <TanStackRouterDevtools position="bottom-right" />
    </Suspense>
  )}
</ErrorBoundary>
```

### 4. 페이지 단 예시

```tsx
// apps/my-app/src/pages/_authenticated/my-food/dashboard.tsx
<div className="space-y-6">
  <ErrorBoundary fallback="simple" onError={err => console.error('Dashboard Error', err)}>
    <DashboardView service="FOOD" />
  </ErrorBoundary>
  <ErrorBoundary fallback="simple" onError={err => console.error('Monitoring Error', err)}>
    <MonitoringPanel service="FOOD" />
  </ErrorBoundary>
</div>
```

### 5. 비동기 에러 전달

```tsx
import { ErrorBoundary, useErrorHandler } from '@repo/shared/components/ui';

function AsyncSection() {
  const handleError = useErrorHandler();

  const fetchData = async () => {
    try {
      await api.get('/some-endpoint');
    } catch (error) {
      handleError(error);
    }
  };

  return <Button onClick={fetchData}>데이터 새로고침</Button>;
}
```

### 6. 폴백 선택 가이드

| 폴백      | 사용처                  | 특징                                |
| --------- | ----------------------- | ----------------------------------- |
| `default` | 전체 페이지, 레이아웃   | 전체 화면, 제목/설명/버튼 제공      |
| `simple`  | 카드/섹션               | 인라인 카드 형태, 메시지/CTA 최소화 |
| `minimal` | Header, 버튼 등 작은 UI | 한 줄짜리 안내 문구                 |

### 7. 체크리스트

- [ ] 루트/레이아웃/페이지 단에서 각각 독립된 Boundary 사용
- [ ] `onError` 로 모든 레벨에서 로그 남기기
- [ ] `onReset` 혹은 홈 버튼 등 복구 경로 제공
- [ ] 비동기 함수에서는 `useErrorHandler` 로 예외 전달
- [ ] Storybook(`apps/storybook/src/stories/ErrorBoundary.stories.tsx`) 에 새로운 폴백/시나리오 추가 시 문서도 함께 수정

필요 시 `docs/APP_ARCHITECTURE.md` 와 연계해 페이지 구조를 먼저 확인한 뒤 Boundary 를 배치하세요.
