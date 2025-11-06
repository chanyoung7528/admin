import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-food/dashboard")({
  component: FoodDashboardPage,
});

function FoodDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY FOOD 대시보드</h1>
        <p className="text-muted-foreground">MY FOOD 서비스 이용 현황</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            총 주문
          </h3>
          <p className="mt-2 text-3xl font-bold">5,678</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            재고 현황
          </h3>
          <p className="mt-2 text-3xl font-bold">234개</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            월 매출
          </h3>
          <p className="mt-2 text-3xl font-bold">₩78M</p>
        </div>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">판매 현황 차트</h2>
        <p className="text-muted-foreground">차트 구현 예정</p>
      </div>
    </div>
  );
}
