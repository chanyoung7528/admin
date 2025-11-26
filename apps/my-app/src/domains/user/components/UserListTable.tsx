import { EmptyState, LoadingOverlay, LoadingPageOverlay } from '@shared/components/ui';

export default function UserListTable() {
  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">사용자 목록</h2>
      {/* TODO: Implement UserListTable */}
      <p className="text-muted-foreground">사용자 목록 테이블</p>

      <LoadingOverlay message="사용자 목록 로딩 중..." />
      <EmptyState title="사용자 목록" description="사용자 목록이 없습니다." />
      <LoadingPageOverlay />
    </div>
  );
}
