import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/inquiry/')({
  component: InquiryListPage,
});

function InquiryListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">1:1 문의 관리</h1>
        <p className="text-muted-foreground">사용자 문의 및 요청을 관리합니다</p>
      </div>

      <div className="bg-card rounded-lg border p-6">
        <h2 className="mb-4 text-lg font-semibold">문의 목록</h2>
        <p className="text-muted-foreground">문의 목록 테이블 구현 예정</p>
      </div>
    </div>
  );
}
