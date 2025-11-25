import { DataTable } from '@shared/components/data-table';
import { useSettlementTable } from '../hooks';
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

  const { tableProps, data, isError, isLoading } = useSettlementTable({ service });

  // 요약 통계 계산
  const totalAmount = data.reduce((sum: number, s: Settlement) => sum + s.amount, 0);
  const completedCount = data.filter((s: Settlement) => s.status === 'completed').length;
  const pendingCount = data.filter((s: Settlement) => s.status === 'pending').length;

  return (
    <div className="bg-card p-6">
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
            {isLoading
              ? '...'
              : new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(totalAmount)}
          </p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">정산 완료</p>
          <p className="mt-1 text-2xl font-bold">{isLoading ? '...' : `${completedCount}건`}</p>
        </div>
        <div className="bg-background rounded-lg p-4">
          <p className="text-muted-foreground text-sm">정산 대기</p>
          <p className="mt-1 text-2xl font-bold">{isLoading ? '...' : `${pendingCount}건`}</p>
        </div>
      </div>

      {/* 에러 상태 */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 text-sm text-red-800 dark:bg-red-900 dark:text-red-200">
          데이터를 불러오는데 실패했습니다. 다시 시도해주세요.
        </div>
      )}

      {/* 정산 테이블 */}
      <DataTable {...tableProps} />
    </div>
  );
}
