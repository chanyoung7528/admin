interface UsageChartProps {
  service: 'BODY' | 'FOOD' | 'MIND' | 'ALL';
  period?: 'daily' | 'weekly' | 'monthly';
}

export function UsageChart({ service, period = 'daily' }: UsageChartProps) {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h3 className="mb-4 text-base font-semibold">이용 현황 차트</h3>
      <div className="text-muted-foreground flex h-48 items-center justify-center rounded border border-dashed p-4">
        {service} 서비스 {period} 이용 현황 차트 (구현 예정)
      </div>
    </div>
  );
}
