import { type ColumnDef } from '@tanstack/react-table';
import { type Settlement } from '../types';

export const settlementColumns: ColumnDef<Settlement>[] = [
  {
    accessorKey: 'id',
    header: '정산 ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'site',
    header: 'Site명',
    cell: ({ row }) => <div>{row.getValue('site')}</div>,
  },
  {
    accessorKey: 'period',
    header: '정산 기간',
    cell: ({ row }) => <div>{row.getValue('period')}</div>,
  },
  {
    accessorKey: 'amount',
    header: '정산 금액',
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(amount);
      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: 'date',
    header: '처리일',
    cell: ({ row }) => <div>{row.getValue('date')}</div>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as Settlement['status'];
      return (
        <div className="flex justify-center">
          <span
            className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
              status === 'completed'
                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
            }`}
          >
            {status === 'completed' ? '완료' : '대기'}
          </span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
