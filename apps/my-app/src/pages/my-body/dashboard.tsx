import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-body/dashboard")({
  component: BodyDashboardPage,
});

function BodyDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY BODY 대시보드</h1>
        <p className="text-muted-foreground">MY BODY 서비스 이용 현황</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            전체 이용자
          </h3>
          <p className="mt-2 text-3xl font-bold">3,456</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            이번 달 이용
          </h3>
          <p className="mt-2 text-3xl font-bold">2,234</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            월 매출
          </h3>
          <p className="mt-2 text-3xl font-bold">₩45M</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">이용 현황 차트</h2>
        <p className="text-muted-foreground">차트 구현 예정</p>
      </div>
    </div>
  );
}

