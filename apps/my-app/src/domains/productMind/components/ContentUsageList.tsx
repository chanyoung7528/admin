import { useMindContentQuery } from "../hooks";

export default function ContentUsageList() {
  const { data, isLoading } = useMindContentQuery();

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">콘텐츠 이용 내역</h2>
      {isLoading ? (
        <p className="text-muted-foreground">로딩 중...</p>
      ) : (
        <div className="space-y-2">
          {data && data.length > 0 ? (
            data.map((content: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">{content.title}</p>
                  <p className="text-sm text-muted-foreground">
                    {content.category} • {content.views}회 조회
                  </p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                  {content.duration}분
                </span>
              </div>
            ))
          ) : (
            <p className="text-muted-foreground">콘텐츠 이용 내역이 없습니다</p>
          )}
        </div>
      )}
    </div>
  );
}

