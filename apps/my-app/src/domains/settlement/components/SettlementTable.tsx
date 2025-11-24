import { DataTable } from '@shared/components/data-table';
import { settlementColumns } from '../columns';
import { type Settlement } from '../types';

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
  const settlements: Settlement[] = [
    {
      id: 'ST-2025-001',
      site: '강남 헬스케어',
      amount: 3500000,
      period: '2025-10',
      status: 'completed',
      date: '2025-11-05',
    },
    {
      id: 'ST-2025-002',
      site: '서초 웰니스',
      amount: 2800000,
      period: '2025-10',
      status: 'pending',
      date: '2025-11-03',
    },
    {
      id: 'ST-2025-003',
      site: '판교 케어센터',
      amount: 4200000,
      period: '2025-10',
      status: 'completed',
      date: '2025-11-01',
    },
  ];

  // 요약 통계 계산
  const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
  const completedCount = settlements.filter(s => s.status === 'completed').length;
  const pendingCount = settlements.filter(s => s.status === 'pending').length;

  return (
    <div className="bg-card rounded-lg border p-6">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold">{serviceLabel} 정산 내역</h2>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">정산 엑셀 다운로드</button>
      </div>

      <p className="text-muted-foreground mb-6">{serviceLabel} 서비스의 Site별 정산 내역을 확인하세요</p>

      {/* 요약 통계 */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">총 정산 금액</p>
          <p className="mt-1 text-2xl font-bold">
            {new Intl.NumberFormat('ko-KR', {
              style: 'currency',
              currency: 'KRW',
              notation: 'compact',
              maximumFractionDigits: 1,
            }).format(totalAmount)}
          </p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">정산 완료</p>
          <p className="mt-1 text-2xl font-bold">{completedCount}건</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">정산 대기</p>
          <p className="mt-1 text-2xl font-bold">{pendingCount}건</p>
        </div>
      </div>

      {/* 정산 테이블 */}
      <DataTable
        columns={settlementColumns}
        data={settlements}
        searchPlaceholder="정산 검색..."
        filters={[
          {
            columnId: 'status',
            title: '상태',
            options: [
              { label: '완료', value: 'completed' },
              { label: '대기', value: 'pending' },
            ],
          },
        ]}
        emptyMessage="정산 내역이 없습니다."
      />
    </div>
  );
}
