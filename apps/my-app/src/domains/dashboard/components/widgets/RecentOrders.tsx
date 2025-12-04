import { WidgetCard } from '@repo/shared/components/layouts/content';

import type { Order } from '../../types';

interface RecentOrdersProps {
  orders: Order[];
  title?: string;
}

const statusConfig = {
  Complete: {
    label: '완료',
    className: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  },
  Pending: {
    label: '대기중',
    className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  },
};

/**
 * RecentOrders - 최근 주문 목록 테이블 위젯
 * @param orders - 주문 데이터 배열
 * @param title - 위젯 제목
 */
export function RecentOrders({ orders, title = '최근 주문' }: RecentOrdersProps) {
  return (
    <WidgetCard title={title} className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-muted-foreground/70 border-b">
              <th className="pb-3 pl-2 font-medium">주문 ID</th>
              <th className="pb-3 font-medium">고객</th>
              <th className="pb-3 font-medium">상품/서비스</th>
              <th className="pb-3 font-medium">금액</th>
              <th className="pb-3 font-medium">완료일</th>
              <th className="pr-2 pb-3 font-medium">상태</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(order => (
              <tr key={order.id} className="group hover:bg-muted/50 border-b last:border-0">
                <td className="py-4 pl-2 font-medium">{order.id}</td>
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold">
                      {order.customer.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{order.customer.name}</p>
                      <p className="text-muted-foreground text-xs">{order.customer.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4">{order.product}</td>
                <td className="py-4 font-medium">{order.amount}</td>
                <td className="text-muted-foreground py-4">{order.date}</td>
                <td className="py-4 pr-2">
                  <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusConfig[order.status].className}`}>
                    {statusConfig[order.status].label}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </WidgetCard>
  );
}
