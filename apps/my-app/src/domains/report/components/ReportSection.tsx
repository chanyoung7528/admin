interface ReportSectionProps {
  service: 'BODY' | 'FOOD' | 'MIND';
  period?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

export function ReportSection({ service, period = 'monthly' }: ReportSectionProps) {
  const serviceLabel = {
    BODY: 'MY BODY',
    FOOD: 'MY FOOD',
    MIND: 'MY MIND',
  }[service];

  const periodLabel = {
    daily: '일별',
    weekly: '주별',
    monthly: '월별',
    yearly: '연별',
  }[period];

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">
          {serviceLabel} 운영 리포트 ({periodLabel})
        </h2>
        <div className="flex gap-2">
          <button className="rounded-md border px-3 py-1 text-sm hover:bg-muted">PDF 저장</button>
          <button className="rounded-md bg-primary px-3 py-1 text-sm text-primary-foreground hover:bg-primary/90">엑셀 다운로드</button>
        </div>
      </div>

      <p className="text-muted-foreground mb-6">
        {serviceLabel} 서비스의 {periodLabel} 운영 현황을 분석합니다
      </p>

      {/* 핵심 지표 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-950">
          <p className="text-sm text-blue-700 dark:text-blue-300">총 매출</p>
          <p className="mt-1 text-2xl font-bold text-blue-900 dark:text-blue-100">₩45.2M</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">+15.3% 전기 대비</p>
        </div>
        <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950">
          <p className="text-sm text-green-700 dark:text-green-300">순이익</p>
          <p className="mt-1 text-2xl font-bold text-green-900 dark:text-green-100">₩12.8M</p>
          <p className="text-xs text-green-600 dark:text-green-400">+8.7% 전기 대비</p>
        </div>
        <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-950">
          <p className="text-sm text-purple-700 dark:text-purple-300">신규 가입</p>
          <p className="mt-1 text-2xl font-bold text-purple-900 dark:text-purple-100">234명</p>
          <p className="text-xs text-purple-600 dark:text-purple-400">+22.1% 전기 대비</p>
        </div>
        <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-950">
          <p className="text-sm text-orange-700 dark:text-orange-300">이탈률</p>
          <p className="mt-1 text-2xl font-bold text-orange-900 dark:text-orange-100">2.4%</p>
          <p className="text-xs text-green-600 dark:text-green-400">-0.8% 전기 대비</p>
        </div>
      </div>

      {/* 차트 영역 */}
      <div className="mb-6 rounded-lg border bg-background p-4">
        <h3 className="mb-3 text-sm font-semibold">매출 추이</h3>
        <div className="flex h-48 items-center justify-center text-muted-foreground">
          📈 {serviceLabel} {periodLabel} 매출 추이 차트 (구현 예정)
        </div>
      </div>

      {/* Site별 실적 */}
      <div className="rounded-lg border bg-background p-4">
        <h3 className="mb-3 text-sm font-semibold">Site별 실적 Top 5</h3>
        <div className="space-y-2">
          {[
            { name: '강남 헬스케어', revenue: 8500000, growth: 12.3 },
            { name: '서초 웰니스', revenue: 7200000, growth: 8.7 },
            { name: '판교 케어센터', revenue: 6800000, growth: 15.2 },
            { name: '분당 힐링센터', revenue: 5900000, growth: 5.4 },
            { name: '송파 웰빙센터', revenue: 5200000, growth: 10.1 },
          ].map((site, index) => (
            <div key={index} className="flex items-center justify-between rounded-lg border p-3">
              <div className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">{index + 1}</span>
                <span className="text-sm font-medium">{site.name}</span>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">₩{site.revenue.toLocaleString()}</p>
                <p className="text-xs text-green-600">+{site.growth}%</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
