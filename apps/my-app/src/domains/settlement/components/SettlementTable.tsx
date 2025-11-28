import { DataTable } from '@shared/components/data-table';
import { Download, TrendingDown, TrendingUp } from 'lucide-react';
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

  // 평균 정산 금액
  const averageAmount = data.length > 0 ? totalAmount / data.length : 0;

  return (
    <div className="bg-card flex flex-col gap-4 rounded-lg border p-4 shadow-sm">
      {/* 헤더 */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{serviceLabel} 정산 관리</h2>
          <p className="text-muted-foreground mt-1 text-sm">{serviceLabel} 서비스의 Site별 정산 내역을 관리하고 조회할 수 있습니다.</p>
        </div>
        <div className="flex gap-2">
          <button className="bg-primary text-primary-foreground hover:bg-primary/90 flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors">
            <Download className="h-4 w-4" />
            정산 엑셀 다운로드
          </button>
        </div>
      </div>

      {/* 요약 통계 카드 */}
      <div className="mb-6 grid gap-4 md:grid-cols-4">
        {/* 총 정산 금액 */}
        <div className="bg-background rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">총 정산 금액</p>
            <div className="bg-primary/10 text-primary rounded-full p-2">
              <TrendingUp className="h-4 w-4" />
            </div>
          </div>
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

        {/* 정산 완료 */}
        <div className="bg-background rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">정산 완료</p>
            <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
              <svg className="h-4 w-4 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-green-600 dark:text-green-400">{isLoading ? '...' : `${completedCount}건`}</p>
          <p className="text-muted-foreground mt-1 text-xs">정상 처리됨</p>
        </div>

        {/* 정산 대기 */}
        <div className="bg-background rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">정산 대기</p>
            <div className="rounded-full bg-yellow-100 p-2 dark:bg-yellow-900">
              <svg className="h-4 w-4 text-yellow-600 dark:text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-yellow-600 dark:text-yellow-400">{isLoading ? '...' : `${pendingCount}건`}</p>
          <p className="text-muted-foreground mt-1 text-xs">처리 예정</p>
        </div>

        {/* 평균 정산 금액 */}
        <div className="bg-background rounded-lg border p-4 shadow-sm transition-shadow hover:shadow-md">
          <div className="flex items-center justify-between">
            <p className="text-muted-foreground text-sm font-medium">평균 정산 금액</p>
            <div className="rounded-full bg-blue-100 p-2 text-blue-600 dark:bg-blue-900 dark:text-blue-400">
              <TrendingDown className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-2 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {isLoading
              ? '...'
              : new Intl.NumberFormat('ko-KR', {
                  style: 'currency',
                  currency: 'KRW',
                  notation: 'compact',
                  maximumFractionDigits: 1,
                }).format(averageAmount)}
          </p>
          <p className="text-muted-foreground mt-1 text-xs">Site당 평균</p>
        </div>
      </div>

      {/* 에러 상태 */}
      {isError && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-red-100 p-2 dark:bg-red-900">
              <svg className="h-5 w-5 text-red-600 dark:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">데이터를 불러오는데 실패했습니다.</p>
              <p className="text-muted-foreground mt-1 text-xs">네트워크 연결을 확인하고 다시 시도해주세요.</p>
            </div>
          </div>
        </div>
      )}

      {/* 정산 테이블 */}
      <DataTable {...tableProps} />
    </div>
  );
}
