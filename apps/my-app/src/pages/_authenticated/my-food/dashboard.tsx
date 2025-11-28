import { DashboardView } from '@/domains/dashboard/components';
import { MonitoringPanel } from '@/domains/monitoring/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/my-food/dashboard')({
  component: FoodDashboardPage,
});

function FoodDashboardPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">MY FOOD Dashboard</h1>
        <p className="text-muted-foreground text-sm">MY FOOD 서비스 이용 현황</p>
      </div>

      {/* Dashboard + Monitoring 도메인 조합 */}
      <DashboardView service="FOOD" />
      <MonitoringPanel service="FOOD" />
    </div>
  );
}
