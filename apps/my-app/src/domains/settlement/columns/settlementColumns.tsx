import { type ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown } from 'lucide-react';

import { type Settlement } from '../types';

export const settlementColumns: ColumnDef<Settlement>[] = [
  {
    accessorKey: 'id',
    header: ({ column }) => (
      <button className="hover:text-foreground flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        정산 ID
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
    size: 120,
    meta: {
      className: 'w-[120px]',
    },
  },
  {
    accessorKey: 'site',
    header: ({ column }) => (
      <button className="hover:text-foreground flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Site명
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div>{row.getValue('site')}</div>,
    size: 200,
    meta: {
      className: 'w-[200px]',
    },
  },
  {
    accessorKey: 'period',
    header: '정산 기간',
    cell: ({ row }) => <div>{row.getValue('period')}</div>,
    size: 120,
    meta: {
      className: 'w-[120px]',
    },
  },
  {
    accessorKey: 'amount',
    header: ({ column }) => (
      <button className="hover:text-foreground flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        정산 금액
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue('amount'));
      const formatted = new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW',
      }).format(amount);
      return <div className="font-medium">{formatted}</div>;
    },
    size: 150,
    meta: {
      className: 'w-[150px]',
    },
  },
  {
    accessorKey: 'date',
    header: ({ column }) => (
      <button className="hover:text-foreground flex items-center gap-2" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        처리일
        <ArrowUpDown className="h-4 w-4" />
      </button>
    ),
    cell: ({ row }) => <div>{row.getValue('date')}</div>,
    size: 120,
    meta: {
      className: 'w-[120px]',
    },
  },
  {
    accessorKey: 'status',
    header: () => <div className="text-center">상태</div>,
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
    size: 100,
    meta: {
      className: 'w-[100px]',
    },
  },
  {
    accessorKey: 'description',
    header: '비고',
    cell: ({ row }) => {
      const description = row.getValue('description') as string | undefined;
      if (!description) return <div className="text-muted-foreground text-sm">-</div>;
      const truncated = description.length > 50 ? `${description.slice(0, 50)}...` : description;
      return (
        <div className="text-muted-foreground max-w-[300px] truncate text-sm" title={description}>
          {truncated}
        </div>
      );
    },
    enableSorting: false,
    size: 300,
    meta: {
      className: 'w-[300px]',
    },
  },
];
