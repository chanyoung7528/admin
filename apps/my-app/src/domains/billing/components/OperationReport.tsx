import { useOperationReport } from '../hooks';

export default function OperationReport() {
  const { data, isLoading } = useOperationReport();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">운영 현황 리포트</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-4">
          {/* TODO: Implement operation report charts */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">총 매출</p>
              <p className="mt-2 text-2xl font-bold">{data?.totalRevenue || '₩0'}</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">정산 완료</p>
              <p className="mt-2 text-2xl font-bold">{data?.completedCount || 0}건</p>
            </div>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm text-muted-foreground">정산 대기</p>
              <p className="mt-2 text-2xl font-bold">{data?.pendingCount || 0}건</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
