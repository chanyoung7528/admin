import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-body/settlement")({
  component: BodySettlementPage,
});

function BodySettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY BODY 정산 관리</h1>
        <p className="text-muted-foreground">MY BODY 서비스 정산 내역</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">정산 내역</h2>
        <p className="text-muted-foreground">정산 테이블 구현 예정</p>
      </div>
    </div>
  );
}

