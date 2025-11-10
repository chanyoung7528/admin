interface UsageChartProps {
  service: "BODY" | "FOOD" | "MIND" | "ALL";
  period?: "daily" | "weekly" | "monthly";
}

export function UsageChart({ service, period = "daily" }: UsageChartProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="mb-4 text-base font-semibold">이용 현황 차트</h3>
      <div className="h-48 rounded border border-dashed p-4 flex items-center justify-center text-muted-foreground">
        {service} 서비스 {period} 이용 현황 차트 (구현 예정)
      </div>
    </div>
  );
}

