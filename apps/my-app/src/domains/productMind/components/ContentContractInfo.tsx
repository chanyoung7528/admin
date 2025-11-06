import { useContractInfo } from "../hooks";

export default function ContentContractInfo() {
  const { data, isLoading } = useContractInfo();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">계약 정보</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">계약 기간</p>
              <p className="mt-1 font-medium">
                {data?.startDate} ~ {data?.endDate}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">계약 상태</p>
              <p className="mt-1 font-medium">
                <span className="rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                  {data?.status || "활성"}
                </span>
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">월 이용료</p>
              <p className="mt-1 text-xl font-bold">{data?.monthlyFee}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">총 이용 횟수</p>
              <p className="mt-1 text-xl font-bold">{data?.totalUsage}회</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

