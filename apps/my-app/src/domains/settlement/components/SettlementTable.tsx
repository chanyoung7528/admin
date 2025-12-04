import { DataTable } from '@shared/components/data-table';
import { StatsCard, StatsGrid } from '@shared/components/ui';
import { AlertCircle, CheckCircle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { useMemo } from 'react';

import { useSettlementTable } from '../hooks';
import { type Settlement } from '../types';

interface SettlementTableProps {
  service: 'BODY' | 'FOOD' | 'MIND';
}

export function SettlementTable({ service }: SettlementTableProps) {
  const { tableProps, data, isError, isLoading } = useSettlementTable({ service });

  const stats = useMemo(() => {
    const totalAmount = data.reduce((sum: number, s: Settlement) => sum + s.amount, 0);
    const completedCount = data.filter((s: Settlement) => s.status === 'completed').length;
    const pendingCount = data.filter((s: Settlement) => s.status === 'pending').length;
    const averageAmount = data.length > 0 ? totalAmount / data.length : 0;

    return {
      totalAmount,
      completedCount,
      pendingCount,
      averageAmount,
    };
  }, [data]);

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('ko-KR', {
      style: 'currency',
      currency: 'KRW',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(amount);

  return (
    <div className="bg-card flex flex-col gap-6 rounded-lg border p-6 shadow-sm">
      <StatsGrid>
        <StatsCard
          title="총 정산 금액"
          value={formatCurrency(stats.totalAmount)}
          description="현재 페이지 기준"
          icon={TrendingUp}
          variant="default"
          isLoading={isLoading}
        />
        <StatsCard title="정산 완료" value={`${stats.completedCount}건`} description="정상 처리됨" icon={CheckCircle} variant="success" isLoading={isLoading} />
        <StatsCard title="정산 대기" value={`${stats.pendingCount}건`} description="처리 예정" icon={Clock} variant="warning" isLoading={isLoading} />
        <StatsCard
          title="평균 정산 금액"
          value={formatCurrency(stats.averageAmount)}
          description="Site당 평균"
          icon={DollarSign}
          variant="info"
          isLoading={isLoading}
        />
      </StatsGrid>

      {isError && (
        <div className="mb-4 rounded-lg border border-red-500 bg-red-50 p-4 dark:bg-red-900/20">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
            <div>
              <p className="text-sm font-medium text-red-800 dark:text-red-200">데이터를 불러오는데 실패했습니다.</p>
              <p className="text-muted-foreground mt-1 text-xs">네트워크 연결을 확인하고 다시 시도해주세요.</p>
            </div>
          </div>
        </div>
      )}

      <DataTable {...tableProps} />
    </div>
  );
}
