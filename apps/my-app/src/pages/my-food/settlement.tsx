import { createFileRoute } from "@tanstack/react-router";
import { SettlementTable } from "@/domains/settlement/components";

export const Route = createFileRoute("/my-food/settlement")({
  component: FoodSettlementPage,
});

function FoodSettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY FOOD B2B 정산 관리</h1>
        <p className="text-muted-foreground">MY FOOD 서비스 B2B 정산 내역</p>
      </div>

      <SettlementTable service="FOOD" />
    </div>
  );
}
