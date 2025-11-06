import { useFoodUsageQuery } from "../hooks";

export default function FoodUsageDashboard() {
  const { data, isLoading } = useFoodUsageQuery();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">총 주문</h3>
        <p className="mt-2 text-3xl font-bold">{data?.totalOrders || 0}</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">재고 현황</h3>
        <p className="mt-2 text-3xl font-bold">{data?.stockCount || 0}개</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">월 매출</h3>
        <p className="mt-2 text-3xl font-bold">{data?.revenue || "₩0"}</p>
      </div>
    </div>
  );
}

