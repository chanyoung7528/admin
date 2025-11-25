import { useDataTableController } from '@shared/components/data-table';
import { settlementColumns } from '../columns';
import { type Settlement } from '../types';
import { useSettlements } from './useSettlements';

interface UseSettlementTableParams {
  service: 'BODY' | 'FOOD' | 'MIND';
}

export function useSettlementTable({ service }: UseSettlementTableParams) {
  return useDataTableController<Settlement, unknown>({
    tableId: `settlement-${service.toLowerCase()}`,
    columns: settlementColumns,
    useQueryHook: useSettlements,
    queryParams: ({ pagination, columnFilters, globalFilter }) => {
      const statusFilter = columnFilters.find(f => f.id === 'status')?.value as string[] | undefined;
      return {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        status: statusFilter && statusFilter.length > 0 ? statusFilter : undefined,
        service,
        filter: globalFilter && globalFilter.trim() !== '' ? globalFilter : undefined,
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
