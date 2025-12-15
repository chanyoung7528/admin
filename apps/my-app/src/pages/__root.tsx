import { env } from '@repo/core/config';
import { ErrorBoundary, LoadingPageOverlay } from '@repo/shared/components/ui';
import { useIsFetching } from '@tanstack/react-query';
import { createRootRouteWithContext, Outlet, useRouter } from '@tanstack/react-router';
import { lazy, Suspense } from 'react';

// 개발 도구는 동적 임포트 (프로덕션 빌드에서 제외)
const TanStackRouterDevtools = env.isDebug
  ? lazy(() =>
      import('@tanstack/react-router-devtools').then(res => ({
        default: res.TanStackRouterDevtools,
      }))
    )
  : () => null;

export const Route = createRootRouteWithContext()({
  component: RootComponent,
});

function RootComponent() {
  const router = useRouter();

  return (
    <ErrorBoundary
      fallback="default"
      showHomeButton={true}
      onError={(error, info) => {
        console.error('🚨 Root Level Error:', error);
        console.error('Component Stack:', info.componentStack);
      }}
      onReset={() => {
        router.navigate({ to: '/' });
      }}
    >
      <Outlet />

      <GlobalFetchingOverlay />

      {env.isDebug && (
        <Suspense fallback={null}>
          <TanStackRouterDevtools position="bottom-left" />
        </Suspense>
      )}
    </ErrorBoundary>
  );
}

function GlobalFetchingOverlay() {
  const isFetching = useIsFetching();
  if (isFetching <= 0) return null;
  return <LoadingPageOverlay />;
}
