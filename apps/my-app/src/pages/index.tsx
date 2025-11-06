import { createFileRoute } from "@tanstack/react-router";
import { UserInsightChart } from "../domains/user/components";

export const Route = createFileRoute("/")({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">대시보드</h1>
        <p className="text-muted-foreground">
          사용자 인사이트 및 전체 현황을 확인하세요
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            전체 사용자
          </h3>
          <p className="mt-2 text-3xl font-bold">12,345</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            활성 사용자
          </h3>
          <p className="mt-2 text-3xl font-bold">8,234</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            이번 달 신규
          </h3>
          <p className="mt-2 text-3xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">총 매출</h3>
          <p className="mt-2 text-3xl font-bold">₩123M</p>
        </div>
      </div>

      <UserInsightChart />
    </div>
  );
}
