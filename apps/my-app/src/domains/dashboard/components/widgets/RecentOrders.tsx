import { WidgetCard } from '@repo/shared/components/layouts/content';

import type { Order } from '../../types';
import { RecentOrdersTable } from '../RecentOrdersTable';

interface RecentOrdersProps {
  orders: Order[];
  title?: string;
}

/**
 * RecentOrders - 최근 주문 목록 테이블 위젯
 * @param orders - 주문 데이터 배열
 * @param title - 위젯 제목
 */
export function RecentOrders({ orders, title = '최근 주문' }: RecentOrdersProps) {
  return (
    <WidgetCard title={title} className="overflow-hidden">
      <RecentOrdersTable orders={orders} />
    </WidgetCard>
  );
}
