import { DataTable } from '@shared/components/data-table';
import { type NavigateFn, useTableUrlState } from '@shared/components/data-table';
import { useEffect, useState } from 'react';
import { settlementColumns } from '../columns';
import { useSettlements } from '../hooks';
import { type Settlement } from '../types';

interface SettlementTableProps {
  service: 'BODY' | 'FOOD' | 'MIND';
}

type SearchRecord = Record<string, unknown>;

export function SettlementTable({ service }: SettlementTableProps) {
  const serviceLabel = {
    BODY: 'MY BODY',
    FOOD: 'MY FOOD',
    MIND: 'MY MIND',
  }[service];

  // URL 상태 관리 (간단한 버전 - 실제로는 @tanstack/react-router 사용)
  const [searchParams, setSearchParams] = useState<SearchRecord>({
    page: 1,
    pageSize: 10,
    status: [],
    filter: '',
  });

  // URL 상태 동기화를 위한 navigate 함수
  const navigate: NavigateFn = ({ search }) => {
    if (typeof search === 'function') {
      setSearchParams(prev => {
        const result = search(prev);
        return { ...prev, ...result };
      });
    } else if (search !== true) {
      setSearchParams(prev => ({ ...prev, ...search }));
    }
  };

  const { globalFilter, onGlobalFilterChange, columnFilters, onColumnFiltersChange, pagination, onPaginationChange, ensurePageInRange } = useTableUrlState({
    search: searchParams,
    navigate,
    pagination: { defaultPage: 1, defaultPageSize: 10 },
    globalFilter: { enabled: true, key: 'filter' },
    columnFilters: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
  });

  // API 데이터 조회
  const { data, isLoading, isError } = useSettlements({
    page: pagination.pageIndex + 1,
    pageSize: pagination.pageSize,
    status: columnFilters.find(f => f.id === 'status')?.value as string[] | undefined,
    service,
    filter: globalFilter,
  });

  const settlements = data?.settlements || [];
  const totalCount = data?.total || 0;
  const pageCount = Math.ceil(totalCount / pagination.pageSize);

  // 페이지 범위 확인
  useEffect(() => {
    ensurePageInRange(pageCount);
  }, [pageCount, ensurePageInRange]);

  // 요약 통계 계산
  const totalAmount = settlements.reduce((sum: number, s: Settlement) => sum + s.amount, 0);
  const completedCount = settlements.filter((s: Settlement) => s.status === 'completed').length;
  const pendingCount = settlements.filter((s: Settlement) => s.status === 'pending').length;

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
      <DataTable
        columns={settlementColumns}
        data={settlements}
        pagination={pagination}
        onPaginationChange={onPaginationChange}
        pageCount={pageCount}
        columnFilters={columnFilters}
        onColumnFiltersChange={onColumnFiltersChange}
        globalFilter={globalFilter}
        onGlobalFilterChange={onGlobalFilterChange}
        ensurePageInRange={ensurePageInRange}
        searchPlaceholder="정산 ID 또는 Site명 검색..."
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
        emptyMessage={isLoading ? '로딩 중...' : '정산 내역이 없습니다.'}
        globalFilterFn={(row, _columnId, filterValue) => {
          const id = String(row.getValue('id')).toLowerCase();
          const site = String(row.getValue('site')).toLowerCase();
          const searchValue = String(filterValue).toLowerCase();
          return id.includes(searchValue) || site.includes(searchValue);
        }}
      />
    </div>
  );
}
