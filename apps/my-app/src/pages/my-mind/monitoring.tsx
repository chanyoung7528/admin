import { createFileRoute } from '@tanstack/react-router';
import { MonitoringPanel } from '@/domains/monitoring/components';

export const Route = createFileRoute('/my-mind/monitoring')({
  component: MindMonitoringPage,
});

function MindMonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY MIND 모니터링</h1>
        <p className="text-muted-foreground">MY MIND 콘텐츠 이용 상태를 모니터링합니다</p>
      </div>

      <MonitoringPanel service="MIND" refreshInterval={30000} />
    </div>
  );
}
