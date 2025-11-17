import { DashboardView } from '@/domains/dashboard/components';
import { MonitoringPanel } from '@/domains/monitoring/components';
import { ErrorBoundary } from '@repo/shared/components/ui';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/my-body/dashboard')({
  component: BodyDashboardPage,
});

function BodyDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY BODY Dashboard</h1>
        <p className="text-muted-foreground">MY BODY 서비스 이용 현황</p>
      </div>

      {/* Dashboard 도메인 - 에러 발생 시에도 Monitoring은 계속 표시 */}
      <ErrorBoundary
        fallback="simple"
        onError={error => {
          console.error('Dashboard View Error:', error);
        }}
      >
        <DashboardView service="BODY" />
      </ErrorBoundary>

      {/* Monitoring 도메인 - 별도 에러 바운더리로 독립적 보호 */}
      <ErrorBoundary
        fallback="simple"
        onError={error => {
          console.error('Monitoring Panel Error:', error);
        }}
      >
        <MonitoringPanel service="BODY" />
      </ErrorBoundary>
    </div>
  );
}
