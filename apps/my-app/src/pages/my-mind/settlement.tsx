import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/my-mind/settlement")({
  component: MindSettlementPage,
});

function MindSettlementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">MY MIND B2B 정산 관리</h1>
        <p className="text-muted-foreground">MY MIND 서비스 B2B 정산 내역</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">B2B 정산 내역</h2>
        <p className="text-muted-foreground">정산 테이블 구현 예정</p>
      </div>
    </div>
  );
}

