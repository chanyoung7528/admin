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
        <div>
          <h2 className="text-lg font-semibold">{serviceLabel} 정산 내역</h2>
          <p className="text-muted-foreground mt-1 text-sm">
            JSONPlaceholder API로부터 실시간 데이터를 불러옵니다{' '}
            <a href="https://jsonplaceholder.typicode.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
              (API 문서)
            </a>
          </p>
        </div>
        <button className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm">정산 엑셀 다운로드</button>
      </div>

      {/* 요약 통계 */}
      <div className="mb-6 grid gap-4 md:grid-cols-3">
        <div className="bg-background rounded-lg border p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">총 정산 금액</p>
          <p className="mt-2 text-2xl font-bold">
            {isLoading
              ? '...'
              : new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(totalAmount)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">현재 페이지 기준</p>
        </div>
        <div className="bg-background rounded-lg border p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">정산 완료</p>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">{isLoading ? '...' : `${completedCount}건`}</p>
          <p className="text-muted-foreground mt-1 text-xs">정상 처리됨</p>
        </div>
        <div className="bg-background rounded-lg border p-4 shadow-sm">
          <p className="text-muted-foreground text-sm">정산 대기</p>
          <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{isLoading ? '...' : `${pendingCount}건`}</p>
          <p className="text-muted-foreground mt-1 text-xs">처리 예정</p>
        </div>
      </div>

      {/* 에러 상태 */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">데이터를 불러오는데 실패했습니다.</p>
              <p className="text-muted-foreground mt-1 text-xs">API 연결을 확인하고 다시 시도해주세요.</p>
            </div>
          </div>
        </div>
      )}

      {/* 정산 테이블 */}
      <DataTable {...tableProps} />
    </div>
  );
}
