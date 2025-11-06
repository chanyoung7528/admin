import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/dashboard")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">이용 현황 Dashboard</h1>
        <p className="text-muted-foreground">전체 서비스 이용 현황을 확인합니다</p>
      </div>

      <div className="grid gap-6 md:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            전체 사용자
          </h3>
          <p className="mt-2 text-3xl font-bold">12,345</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            MY BODY 이용
          </h3>
          <p className="mt-2 text-3xl font-bold">3,456</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            MY FOOD 주문
          </h3>
          <p className="mt-2 text-3xl font-bold">5,678</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            MY MIND 조회
          </h3>
          <p className="mt-2 text-3xl font-bold">4,567</p>
        </div>
      </div>
    </div>
  );
}
