interface MonitoringPanelProps {
  service: 'BODY' | 'FOOD' | 'MIND';
  refreshInterval?: number;
}

export function MonitoringPanel({ service, refreshInterval = 60000 }: MonitoringPanelProps) {
  const serviceLabel = {
    BODY: 'MY BODY',
    FOOD: 'MY FOOD',
    MIND: 'MY MIND',
  }[service];

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{serviceLabel} 모니터링</h2>
        <span className="text-muted-foreground text-xs">자동 새로고침: {refreshInterval / 1000}초</span>
      </div>

      <p className="text-muted-foreground mb-6">{serviceLabel} 서비스의 실시간 시스템 상태를 모니터링합니다</p>

      {/* 상태 카드 */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium">서버 상태</p>
          </div>
          <p className="mt-2 text-xl font-bold text-green-700 dark:text-green-300">정상</p>
          <p className="text-xs text-green-600 dark:text-green-400">응답시간: 45ms</p>
        </div>

        <div className="rounded-lg border bg-green-50 p-4 dark:bg-green-950">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-green-500"></div>
            <p className="text-sm font-medium">DB 상태</p>
          </div>
          <p className="mt-2 text-xl font-bold text-green-700 dark:text-green-300">정상</p>
          <p className="text-xs text-green-600 dark:text-green-400">연결 수: 45/100</p>
        </div>

        <div className="rounded-lg border bg-yellow-50 p-4 dark:bg-yellow-950">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
            <p className="text-sm font-medium">API 응답</p>
          </div>
          <p className="mt-2 text-xl font-bold text-yellow-700 dark:text-yellow-300">지연</p>
          <p className="text-xs text-yellow-600 dark:text-yellow-400">응답시간: 850ms</p>
        </div>
      </div>

      {/* 상세 로그 영역 */}
      <div className="bg-background mt-6 rounded-lg border p-4">
        <h3 className="mb-3 text-sm font-semibold">최근 이벤트</h3>
        <div className="space-y-2 text-xs">
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span>11:23:45 - {serviceLabel} 시스템 정상 작동 중</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="text-yellow-600">⚠</span>
            <span>11:20:12 - API 응답 시간 증가 감지</span>
          </div>
          <div className="text-muted-foreground flex items-center gap-2">
            <span className="text-green-600">✓</span>
            <span>11:15:33 - 정기 백업 완료</span>
          </div>
        </div>
      </div>
    </div>
  );
}
