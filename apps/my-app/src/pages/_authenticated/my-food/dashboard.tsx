import { DashboardView } from '@/domains/dashboard/components';
import { MonitoringPanel } from '@/domains/monitoring/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/my-food/dashboard')({
  component: FoodDashboardPage,
});

function FoodDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY FOOD Dashboard</h1>
        <p className="text-muted-foreground">MY FOOD 서비스 이용 현황</p>
      </div>

      {/* Dashboard + Monitoring 도메인 조합 */}
      <DashboardView service="FOOD" />
      <MonitoringPanel service="FOOD" />
    </div>
  );
}
