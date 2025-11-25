import { useAuth } from '@/domains/auth/hooks/useAuth';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';
import { Header } from '@/domains/dashboard/components/Header';
import { Layout } from '@repo/shared/components/layouts';
import { ErrorBoundary } from '@repo/shared/components/ui';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

// 인증이 필요한 모든 페이지의 레이아웃
export const Route = createFileRoute('/_authenticated')({
  // 인증 체크 로직
  beforeLoad: async ({ location }) => {
    // 인증 상태 확인 (비동기)
    const isAuthenticated = await checkAuth();

    if (!isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { signOut } = useAuth();

  return (
    <Layout onSignOut={signOut}>
      {/* Header는 별도 에러 바운더리로 보호 */}
      <ErrorBoundary
        fallback="minimal"
        onError={error => {
          console.error('Header Error:', error);
        }}
      >
        <Header />
      </ErrorBoundary>

      {/* 메인 콘텐츠 영역 에러 바운더리 */}
      <ErrorBoundary
        fallback="default"
        title="페이지 로딩 실패"
        description="페이지를 불러오는 중 문제가 발생했습니다. 다시 시도해 주세요."
        onError={(error, info) => {
          console.error('Authenticated Page Error:', error);
          console.error('Component Stack:', info.componentStack);

          // TODO: 에러 모니터링 서비스로 전송
        }}
      >
        <Outlet />
      </ErrorBoundary>
    </Layout>
  );
}
// 인증 상태 체크
async function checkAuth(): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false;
  }

  const { accessToken } = useAuthStore.getState();
  return Boolean(accessToken);
}
