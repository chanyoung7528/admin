import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/report/')({
  component: ReportPage,
});

function ReportPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">운영 현황 리포트</h1>
        <p className="text-muted-foreground">Site별 운영 현황 및 정산 리포트</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">Site별 리포트</h2>
        <p className="text-muted-foreground">Site별 운영 현황 테이블 구현 예정</p>
      </div>
    </div>
  );
}
