interface SettlementTableProps {
  service: 'BODY' | 'FOOD' | 'MIND';
}

export function SettlementTable({ service }: SettlementTableProps) {
  const serviceLabel = {
    BODY: 'MY BODY',
    FOOD: 'MY FOOD',
    MIND: 'MY MIND',
  }[service];

  // 샘플 데이터
  const settlements = [
    {
      id: 'ST-2025-001',
      site: '강남 헬스케어',
      amount: 3500000,
      period: '2025-10',
      status: '완료',
      date: '2025-11-05',
    },
    {
      id: 'ST-2025-002',
      site: '서초 웰니스',
      amount: 2800000,
      period: '2025-10',
      status: '대기',
      date: '2025-11-03',
    },
    {
      id: 'ST-2025-003',
      site: '판교 케어센터',
      amount: 4200000,
      period: '2025-10',
      status: '완료',
      date: '2025-11-01',
    },
  ];

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{serviceLabel} 정산 내역</h2>
        <button className="rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90">정산 엑셀 다운로드</button>
      </div>

      <p className="text-muted-foreground mb-6">{serviceLabel} 서비스의 Site별 정산 내역을 확인하세요</p>

      {/* 요약 통계 */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="rounded-lg bg-background p-4">
          <p className="text-sm text-muted-foreground">총 정산 금액</p>
          <p className="mt-1 text-2xl font-bold">₩10.5M</p>
        </div>
        <div className="rounded-lg bg-background p-4">
          <p className="text-sm text-muted-foreground">정산 완료</p>
          <p className="mt-1 text-2xl font-bold">2건</p>
        </div>
        <div className="rounded-lg bg-background p-4">
          <p className="text-sm text-muted-foreground">정산 대기</p>
          <p className="mt-1 text-2xl font-bold">1건</p>
        </div>
      </div>

      {/* 정산 테이블 */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">정산 ID</th>
              <th className="px-4 py-3 text-left text-sm font-medium">Site명</th>
              <th className="px-4 py-3 text-left text-sm font-medium">정산 기간</th>
              <th className="px-4 py-3 text-right text-sm font-medium">정산 금액</th>
              <th className="px-4 py-3 text-left text-sm font-medium">처리일</th>
              <th className="px-4 py-3 text-center text-sm font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {settlements.map(settlement => (
              <tr key={settlement.id} className="border-t hover:bg-muted/50">
                <td className="px-4 py-3 text-sm font-medium">{settlement.id}</td>
                <td className="px-4 py-3 text-sm">{settlement.site}</td>
                <td className="px-4 py-3 text-sm">{settlement.period}</td>
                <td className="px-4 py-3 text-right text-sm font-medium">₩{settlement.amount.toLocaleString()}</td>
                <td className="px-4 py-3 text-sm">{settlement.date}</td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                      settlement.status === '완료'
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    }`}
                  >
                    {settlement.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
