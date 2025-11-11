export function InsightDashboard() {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h2 className="mb-4 text-lg font-semibold">사용자 Insight 분석</h2>
      <p className="text-muted-foreground mb-6">사용자 행동 패턴과 트렌드를 분석하여 인사이트를 제공합니다</p>

      {/* 주요 인사이트 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-gradient-to-br from-blue-50 to-blue-100 p-4 dark:from-blue-950 dark:to-blue-900">
          <p className="text-sm font-medium text-blue-700 dark:text-blue-300">가장 활동적인 연령대</p>
          <p className="mt-2 text-3xl font-bold text-blue-900 dark:text-blue-100">30-39세</p>
          <p className="text-xs text-blue-600 dark:text-blue-400">전체 이용의 42%</p>
        </div>
        <div className="rounded-lg border bg-gradient-to-br from-green-50 to-green-100 p-4 dark:from-green-950 dark:to-green-900">
          <p className="text-sm font-medium text-green-700 dark:text-green-300">평균 이용 시간</p>
          <p className="mt-2 text-3xl font-bold text-green-900 dark:text-green-100">45분</p>
          <p className="text-xs text-green-600 dark:text-green-400">+8분 전월 대비</p>
        </div>
        <div className="rounded-lg border bg-gradient-to-br from-purple-50 to-purple-100 p-4 dark:from-purple-950 dark:to-purple-900">
          <p className="text-sm font-medium text-purple-700 dark:text-purple-300">재방문율</p>
          <p className="mt-2 text-3xl font-bold text-purple-900 dark:text-purple-100">87.5%</p>
          <p className="text-xs text-purple-600 dark:text-purple-400">+3.2% 전월 대비</p>
        </div>
      </div>

      {/* 사용자 행동 분석 차트 */}
      <div className="mb-6 rounded-lg border bg-background p-4">
        <h3 className="mb-3 text-sm font-semibold">시간대별 이용 패턴</h3>
        <div className="flex h-48 items-center justify-center text-muted-foreground">📊 시간대별 사용자 활동 차트 (구현 예정)</div>
      </div>

      {/* 서비스별 선호도 */}
      <div className="rounded-lg border bg-background p-4">
        <h3 className="mb-3 text-sm font-semibold">서비스별 선호도</h3>
        <div className="space-y-3">
          {[
            { service: 'MY BODY', usage: 45, color: 'bg-blue-500' },
            { service: 'MY FOOD', usage: 32, color: 'bg-green-500' },
            { service: 'MY MIND', usage: 23, color: 'bg-purple-500' },
          ].map(item => (
            <div key={item.service}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="font-medium">{item.service}</span>
                <span className="text-muted-foreground">{item.usage}%</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-secondary">
                <div className={`h-full ${item.color}`} style={{ width: `${item.usage}%` }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
