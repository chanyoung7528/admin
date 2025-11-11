import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/my-mind/usage')({
  component: MindUsagePage,
});

function MindUsagePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">콘텐츠 이용 내역</h1>
        <p className="text-muted-foreground">MY MIND 콘텐츠 이용 내역을 확인합니다</p>
      </div>

      <div className="rounded-lg border bg-card p-6">
        <h2 className="mb-4 text-lg font-semibold">이용 내역</h2>
        <p className="text-muted-foreground">이용 내역 테이블 구현 예정</p>
      </div>
    </div>
  );
}
