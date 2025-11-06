import { useBodyUsageQuery } from "../hooks";
import BodyUsageChart from "./BodyUsageChart";

export default function BodyUsageDashboard() {
  const { data, isLoading } = useBodyUsageQuery();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            전체 이용자
          </h3>
          <p className="mt-2 text-3xl font-bold">{data?.totalUsers || 0}</p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            이번 달 이용
          </h3>
          <p className="mt-2 text-3xl font-bold">
            {data?.monthlyUsers || 0}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-6">
          <h3 className="text-sm font-medium text-muted-foreground">월 매출</h3>
          <p className="mt-2 text-3xl font-bold">{data?.revenue || "₩0"}</p>
        </div>
      </div>

      <BodyUsageChart />
    </div>
  );
}

