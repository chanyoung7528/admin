import { createFileRoute, Outlet } from '@tanstack/react-router';

// 인증이 필요 없는 퍼블릭 페이지의 레이아웃
export const Route = createFileRoute('/_public')({
  component: PublicLayout,
});

function PublicLayout() {
  // 사이드바 없이 컨텐츠만 렌더링
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
