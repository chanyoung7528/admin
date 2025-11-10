import { createFileRoute } from "@tanstack/react-router";
import { SettlementTable } from "@/domains/settlement/components";

export const Route = createFileRoute("/my-body/settlement")({
  component: BodySettlementPage,
});

function BodySettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY BODY 정산 관리</h1>
        <p className="text-muted-foreground">MY BODY 서비스 결제 및 정산 내역</p>
      </div>

      <SettlementTable service="BODY" />
    </div>
  );
}
