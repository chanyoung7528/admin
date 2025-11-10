import { useSettlementQuery } from "../hooks";

export default function SettlementTable() {
  const { data, isLoading } = useSettlementQuery();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">정산 내역</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-4">
          {/* TODO: Implement settlement table with data */}
          <p className="text-muted-foreground">
            정산 내역 테이블 (총 {data?.length || 0}건)
          </p>
        </div>
      )}
    </div>
  );
}

