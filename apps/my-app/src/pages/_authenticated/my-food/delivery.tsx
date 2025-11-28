import { createFileRoute } from '@tanstack/react-router';

import { OrderList } from '@/domains/order/components';

export const Route = createFileRoute('/_authenticated/my-food/delivery')({
  component: FoodDeliveryPage,
});

function FoodDeliveryPage() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">구매/배송 내역</h1>
        <p className="text-muted-foreground text-sm">MY FOOD 구매 및 배송 현황</p>
      </div>

      <OrderList />
    </div>
  );
}
