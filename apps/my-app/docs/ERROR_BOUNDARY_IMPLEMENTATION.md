# ErrorBoundary 적용 가이드 (my-app)

`@repo/shared/components/ui`의 `ErrorBoundary`로 레이아웃·페이지·섹션을 보호하는 최소 사용법입니다. 구현체는 `react-error-boundary` 기반이며, 에러는 콘솔 또는 로깅 툴에 전달하면 됩니다.

## 계층 적용 요약

- `pages/__root.tsx`: 앱 전체 보호, `fallback="default"`, `showHomeButton` 활성화
- `pages/_authenticated.tsx`: 헤더(`fallback="minimal"`)와 본문(`fallback="default"`)을 분리
- `pages/_public.tsx`: 공개 페이지용 `fallback="default"`
- 페이지/도메인 컴포넌트: 필요한 섹션에 `fallback="simple"` 등으로 감싸기

```tsx
// pages/__root.tsx
import { ErrorBoundary } from '@repo/shared/components/ui';

export function Root() {
  return (
    <ErrorBoundary fallback="default" showHomeButton onError={console.error} onReset={() => router.navigate({ to: '/' })}>
      <Outlet />
    </ErrorBoundary>
  );
}
```

```tsx
// pages/_authenticated.tsx (발췌)
<ErrorBoundary fallback="minimal" onError={error => console.error('Header', error)}>
  <Header />
</ErrorBoundary>
<ErrorBoundary fallback="default" title="페이지 로딩 실패" description="다시 시도해주세요" onError={error => console.error('Page', error)}>
  <Outlet />
</ErrorBoundary>
```

```tsx
// 섹션/도메인 예시
<ErrorBoundary fallback="simple" onError={error => console.error('Dashboard', error)}>
  <DashboardView />
</ErrorBoundary>
```

## 비동기 에러 전달

비동기 로직은 `useErrorHandler`로 ErrorBoundary에 위임합니다.

```tsx
import { useErrorHandler } from '@repo/shared/components/ui';

function FetchButton() {
  const handleError = useErrorHandler();
  const fetchData = async () => {
    try {
      const res = await api.get('/data');
      return res.data;
    } catch (error) {
      handleError(error);
    }
  };
  return <button onClick={fetchData}>불러오기</button>;
}
```

## 폴백 선택 가이드

- `default`: 페이지 전체 에러 화면 (루트/레이아웃)
- `simple`: 섹션/도메인 박스 단위 에러
- `minimal`: 헤더/위젯 등 한 줄 알림

## 로깅

프로덕션에서는 Sentry 등으로 전송하세요.

```ts
import * as Sentry from '@sentry/react';

onError={(error, info) => Sentry.captureException(error, { contexts: { react: { componentStack: info.componentStack } } })};
```

## 참고 링크

- react-error-boundary: https://github.com/bvaughn/react-error-boundary
