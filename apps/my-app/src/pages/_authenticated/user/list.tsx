import { createFileRoute } from '@tanstack/react-router';

import { UserListTable } from '@/domains/user/components';

export const Route = createFileRoute('/_authenticated/user/list')({
  component: UserListPage,
});

function UserListPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">사용자 현황</h1>
        <p className="text-muted-foreground">전체 사용자 목록을 관리합니다</p>
      </div>

      <UserListTable />
    </div>
  );
}
