import { type UseDataTableControllerReturn, useDataTableController } from '@shared/components/data-table';
import { settlementColumns } from '../columns';
import { type Settlement } from '../types';
import { useSettlements } from './useSettlements';

interface UseSettlementTableParams {
  service: 'BODY' | 'FOOD' | 'MIND';
}

export function useSettlementTable({ service }: UseSettlementTableParams): UseDataTableControllerReturn<Settlement, unknown> {
  return useDataTableController<Settlement, unknown>({
    tableId: `settlement-${service.toLowerCase()}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters, globalFilter, sorting }) => {
      const statusFilter = columnFilters.find(f => f.id === 'status')?.value as string[] | undefined;
      const sortBy = sorting?.[0]?.id;
      const sortOrder = sorting?.[0]?.desc ? 'desc' : 'asc';

      return {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        status: statusFilter && statusFilter.length > 0 ? statusFilter : undefined,
        service,
        filter: globalFilter && globalFilter.trim() !== '' ? globalFilter : undefined,
        sortBy: sortBy,
        sortOrder: sortBy ? sortOrder : undefined,
      };
    },
    filterConfigs: [{ columnId: 'status', searchKey: 'status', type: 'array' }],
    searchPlaceholder: '정산 ID 또는 Site명 검색...',
    emptyMessage: '정산 내역이 없습니다.',
    renderFilters: () => [
      {
        columnId: 'status',
        title: '상태',
        options: [
          { label: '완료', value: 'completed' },
          { label: '대기', value: 'pending' },
        ],
      },
    ],
    globalFilterFn: (row, _columnId, filterValue) => {
      const id = String(row.getValue('id')).toLowerCase();
      const site = String(row.getValue('site')).toLowerCase();
      const searchValue = String(filterValue).toLowerCase();
      return id.includes(searchValue) || site.includes(searchValue);
    },
  });
}
