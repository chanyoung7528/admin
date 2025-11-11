import { createFileRoute } from '@tanstack/react-router';
import { OrderList } from '@/domains/order/components';

export const Route = createFileRoute('/my-food/delivery')({
  component: FoodDeliveryPage,
});

function FoodDeliveryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">구매/배송 내역</h1>
        <p className="text-muted-foreground">MY FOOD 구매 및 배송 현황</p>
      </div>

      <OrderList />
    </div>
  );
}
