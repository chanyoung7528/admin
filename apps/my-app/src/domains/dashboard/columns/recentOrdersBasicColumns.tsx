import type { BasicTableColumn } from '@repo/shared/components/ui';

import type { Order } from '../types';

export const recentOrdersBasicColumns: BasicTableColumn<Order>[] = [
  {
    key: 'id',
    header: '주문번호',
    accessor: 'id',
    cellClassName: 'font-medium',
  },
  {
    key: 'customer',
    header: '고객명',
    accessor: 'customer',
  },

  {
    key: 'amount',
    header: '주문금액',
    cellClassName: 'font-medium',
    cell: row => `₩${row.amount}`,
  },
  {
    key: 'date',
    header: '주문일',
    accessor: 'date',
  },
  {
    key: 'status',
    header: '상태',
    accessor: 'status',
  },
];
