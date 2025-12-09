import { BasicTable } from '@repo/shared/components/ui';

import { recentOrdersBasicColumns } from '../columns/recentOrdersBasicColumns';
import type { Order } from '../types';

export function RecentOrdersTable({ orders }: { orders: Order[] }) {
  return <BasicTable data={orders} columns={recentOrdersBasicColumns} />;
}
