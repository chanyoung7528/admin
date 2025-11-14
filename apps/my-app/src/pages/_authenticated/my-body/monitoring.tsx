import { createFileRoute } from '@tanstack/react-router';
import { MonitoringPanel } from '@/domains/monitoring/components';

export const Route = createFileRoute('/_authenticated/my-body/monitoring')({
  component: BodyMonitoringPage,
});

function BodyMonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY BODY 모니터링</h1>
        <p className="text-muted-foreground">MY BODY 기기 상태를 모니터링합니다</p>
      </div>

      <MonitoringPanel service="BODY" refreshInterval={30000} />
    </div>
  );
}
