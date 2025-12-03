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
  const isFetchingPosts = useIsFetching({ queryKey: [''] });

  return (
    <ErrorBoundary
      fallback="default"
      showHomeButton={true}
      onError={(error, info) => {
        // 에러 로깅 서비스로 전송 (Sentry, LogRocket 등)
        console.error('🚨 Root Level Error:', error);
        console.error('Component Stack:', info.componentStack);

        // TODO: 실제 환경에서는 에러 모니터링 서비스로 전송
        // Sentry.captureException(error, { contexts: { react: { componentStack: info.componentStack } } });
      }}
      onReset={() => {
        // 에러 리셋 시 홈으로 이동
        router.navigate({ to: '/' });
      }}
    >
      <Outlet />

      {isFetchingPosts > 0 && <LoadingPageOverlay />}

      {env.isDebug && (
        <Suspense fallback={null}>
          <TanStackRouterDevtools position="bottom-left" />
        </Suspense>
      )}
    </ErrorBoundary>
  );
}
