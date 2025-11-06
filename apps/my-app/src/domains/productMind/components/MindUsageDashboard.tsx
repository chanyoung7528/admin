import { useMindUsageQuery } from "../hooks";

export default function MindUsageDashboard() {
  const { data, isLoading } = useMindUsageQuery();

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">
          총 콘텐츠 이용
        </h3>
        <p className="mt-2 text-3xl font-bold">{data?.totalViews || 0}</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">활성 계약</h3>
        <p className="mt-2 text-3xl font-bold">{data?.activeContracts || 0}개</p>
      </div>
      <div className="rounded-lg border bg-card p-6">
        <h3 className="text-sm font-medium text-muted-foreground">월 매출</h3>
        <p className="mt-2 text-3xl font-bold">{data?.revenue || "₩0"}</p>
      </div>
    </div>
  );
}

