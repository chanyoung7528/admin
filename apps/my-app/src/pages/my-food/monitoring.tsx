import { createFileRoute } from '@tanstack/react-router';
import { MonitoringPanel } from '@/domains/monitoring/components';

export const Route = createFileRoute('/my-food/monitoring')({
  component: FoodMonitoringPage,
});

function FoodMonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY FOOD 모니터링</h1>
        <p className="text-muted-foreground">MY FOOD 기기 상태를 모니터링합니다</p>
      </div>

      <MonitoringPanel service="FOOD" refreshInterval={30000} />
    </div>
  );
}
