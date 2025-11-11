import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/monitoring/')({
  component: MonitoringPage,
});

function MonitoringPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">기기 작동 현황</h1>
        <p className="text-muted-foreground">실시간 기기 모니터링</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">전체 기기</h3>
          <p className="mt-2 text-3xl font-bold">234</p>
        </div>
        <div className="rounded-lg border border-green-500 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">정상 작동</h3>
          <p className="mt-2 text-3xl font-bold text-green-600">218</p>
        </div>
        <div className="rounded-lg border border-yellow-500 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">점검 필요</h3>
          <p className="mt-2 text-3xl font-bold text-yellow-600">12</p>
        </div>
        <div className="rounded-lg border border-red-500 bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">오류 발생</h3>
          <p className="mt-2 text-3xl font-bold text-red-600">4</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">기기 상태 모니터링</h2>
        <p className="text-muted-foreground">실시간 모니터링 대시보드 구현 예정</p>
      </div>
    </div>
  );
}
