import { createFileRoute } from '@tanstack/react-router';
import { DashboardView } from '@/domains/dashboard/components';

export const Route = createFileRoute('/dashboard')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">이용 현황 Dashboard</h1>
        <p className="text-muted-foreground">전체 서비스 이용 현황을 확인합니다</p>
      </div>

      <DashboardView service="ALL" />
    </div>
  );
}
