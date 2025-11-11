import { createFileRoute } from '@tanstack/react-router';
import { DashboardView } from '@/domains/dashboard/components';
import { MonitoringPanel } from '@/domains/monitoring/components';

export const Route = createFileRoute('/my-mind/dashboard')({
  component: MindDashboardPage,
});

function MindDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY MIND Dashboard</h1>
        <p className="text-muted-foreground">MY MIND 서비스 이용 현황</p>
      </div>

      {/* Dashboard + Monitoring 도메인 조합 */}
      <DashboardView service="MIND" />
      <MonitoringPanel service="MIND" />
    </div>
  );
}
