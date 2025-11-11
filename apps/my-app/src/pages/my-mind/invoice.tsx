import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-mind/invoice')({
  component: MindInvoicePage,
});

function MindInvoicePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">계산서 출력</h1>
        <p className="text-muted-foreground">MY MIND 계산서를 출력합니다</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">계산서 목록</h2>
        <p className="text-muted-foreground">계산서 목록 구현 예정</p>
      </div>
    </div>
  );
}
