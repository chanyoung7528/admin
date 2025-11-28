import type { BasicTableColumn } from '@repo/shared/components/ui';

import type { Order } from '../types';

export const orderColumns: BasicTableColumn<Order>[] = [
  {
    key: 'id',
    header: '주문번호',
    accessor: 'id',
    cellClassName: 'font-medium',
  },
  {
    key: 'site',
    header: 'Site명',
    accessor: 'site',
  },
  {
    key: 'items',
    header: '품목',
    accessor: 'items',
  },
  {
    key: 'amount',
    header: '주문금액',
    cellClassName: 'font-medium',
    cell: row => `₩${row.amount.toLocaleString()}`,
  },
  {
    key: 'date',
    header: '주문일',
    accessor: 'date',
  },
  {
    key: 'status',
    header: '상태',
    headerAlign: 'center',
    cellAlign: 'center',
    cell: row => (
      <span
        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
          row.status === '배송완료'
            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
            : row.status === '배송중'
              ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
        }`}
      >
        {row.status}
      </span>
    ),
  },
];
