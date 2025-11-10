interface DashboardViewProps {
  service: "ALL" | "BODY" | "FOOD" | "MIND";
}

export function DashboardView({ service }: DashboardViewProps) {
  const serviceLabel = {
    ALL: "전체",
    BODY: "MY BODY",
    FOOD: "MY FOOD",
    MIND: "MY MIND",
  }[service];

  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">{serviceLabel} 대시보드</h2>
      <p className="text-muted-foreground mb-6">
        {serviceLabel} 서비스의 핵심 지표를 시각화합니다
      </p>

      {/* 통계 카드 */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm font-medium text-muted-foreground">총 사용자</p>
          <p className="mt-2 text-2xl font-bold">12,345</p>
          <p className="text-xs text-green-600">+12.5% 전월 대비</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm font-medium text-muted-foreground">월 매출</p>
          <p className="mt-2 text-2xl font-bold">₩45M</p>
          <p className="text-xs text-green-600">+8.2% 전월 대비</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm font-medium text-muted-foreground">활성 Site</p>
          <p className="mt-2 text-2xl font-bold">87</p>
          <p className="text-xs text-muted-foreground">변동 없음</p>
        </div>
        <div className="rounded-lg border bg-background p-4">
          <p className="text-sm font-medium text-muted-foreground">이용률</p>
          <p className="mt-2 text-2xl font-bold">94.2%</p>
          <p className="text-xs text-green-600">+2.1% 전월 대비</p>
        </div>
      </div>

      {/* 차트 영역 (구현 예정) */}
      <div className="mt-6 h-64 rounded-lg border border-dashed p-4 flex items-center justify-center text-muted-foreground">
        📊 {serviceLabel} 사용 트렌드 차트 (구현 예정)
      </div>
    </div>
  );
}

