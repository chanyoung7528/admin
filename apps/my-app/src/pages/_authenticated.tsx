import { Layout } from '@repo/shared/components/layouts';
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router';

// 인증이 필요한 모든 페이지의 레이아웃
export const Route = createFileRoute('/_authenticated')({
  // 인증 체크 로직
  beforeLoad: async ({ location }) => {
    // TODO: 실제 인증 상태 확인 로직
    const isAuthenticated = checkAuth();

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
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

// 임시 인증 체크 함수 (실제로는 zustand store나 context에서 가져와야 함)
function checkAuth(): boolean {
  // localStorage나 cookie에서 토큰 확인
  // 또는 auth store에서 상태 확인
  const token = localStorage.getItem('auth_token');
  return !!token;
}
