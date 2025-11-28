import { type ColumnDef } from '@tanstack/react-table';

import { type User } from '../types';

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: 'id',
    header: 'ID',
    cell: ({ row }) => <div className="font-medium">{row.getValue('id')}</div>,
  },
  {
    accessorKey: 'name',
    header: '이름',
    cell: ({ row }) => <div className="font-medium">{row.getValue('name')}</div>,
  },
  {
    accessorKey: 'email',
    header: '이메일',
    cell: ({ row }) => <div>{row.getValue('email')}</div>,
  },
  {
    accessorKey: 'phone',
    header: '전화번호',
    cell: ({ row }) => <div>{row.getValue('phone')}</div>,
  },
  {
    accessorKey: 'site',
    header: 'Site',
    cell: ({ row }) => <div>{row.getValue('site')}</div>,
  },
  {
    accessorKey: 'createdAt',
    header: '가입일',
    cell: ({ row }) => <div>{row.getValue('createdAt')}</div>,
  },
  {
    accessorKey: 'status',
    header: '상태',
    cell: ({ row }) => {
      const status = row.getValue('status') as User['status'];
      const statusConfig = {
        active: {
          label: '활성',
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
        },
        inactive: {
          label: '비활성',
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
        },
        suspended: {
          label: '정지',
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
        },
      };

      const config = statusConfig[status];

      return (
        <div className="flex justify-center">
          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${config.className}`}>{config.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
];
