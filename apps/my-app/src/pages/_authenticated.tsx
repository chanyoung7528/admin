import { Header, Layout } from '@repo/shared/components/layouts';
import { ErrorBoundary } from '@repo/shared/components/ui';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

import { useLogout } from '@/domains/auth/hooks/useLogout';
import { useAuthStore } from '@/domains/auth/stores/useAuthStore';

// 인증이 필요한 모든 페이지의 레이아웃
export const Route = createFileRoute('/_authenticated')({
  // 인증 체크 로직
  beforeLoad: ({ location }) => {
    // 인증 상태 확인
    const { isAuthenticated } = useAuthStore.getState();

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

const topNav = [
  { title: '개요', href: '/', isActive: true },
  { title: '인사이트', href: '/user/insight', isActive: false },
];

function AuthenticatedLayout() {
  const { logout } = useLogout();

  return (
    <Layout onSignOut={logout}>
      {/* Header는 별도 에러 바운더리로 보호 */}
      <ErrorBoundary
        fallback="minimal"
        onError={error => {
          console.error('Header Error:', error);
        }}
      >
        <Header links={topNav} onSignOut={logout} />
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
