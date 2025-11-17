import { ErrorBoundary } from '@repo/shared/components/ui';
import { createFileRoute, Outlet } from '@tanstack/react-router';

// 인증이 필요 없는 퍼블릭 페이지의 레이아웃
export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  // 사이드바 없이 컨텐츠만 렌더링
  return (
    <div className="min-h-screen">
      <ErrorBoundary
        fallback="default"
        title="페이지 로딩 실패"
        description="페이지를 불러오는 중 문제가 발생했습니다."
        showHomeButton={true}
        onError={(error, info) => {
          console.error('Public Page Error:', error);
          console.error('Component Stack:', info.componentStack);
        }}
      >
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}
