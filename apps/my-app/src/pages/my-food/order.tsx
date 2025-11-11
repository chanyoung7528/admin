import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-food/order')({
  component: FoodOrderPage,
});

function FoodOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">발주 관리</h1>
        <p className="text-muted-foreground">주문, 입고, 판매 내역을 관리합니다</p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">주문 내역</h2>
        <p className="text-muted-foreground">주문 테이블 구현 예정</p>
      </div>
    </div>
  );
}
