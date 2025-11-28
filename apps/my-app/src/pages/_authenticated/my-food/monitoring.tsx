import { MonitoringPanel } from '@/domains/monitoring/components';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/my-food/monitoring')({
  component: FoodMonitoringPage,
});

function FoodMonitoringPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">MY FOOD 모니터링</h1>
        <p className="text-muted-foreground text-sm">MY FOOD 기기 상태를 모니터링합니다</p>
      </div>

      <MonitoringPanel service="FOOD" refreshInterval={30000} />
    </div>
  );
}
