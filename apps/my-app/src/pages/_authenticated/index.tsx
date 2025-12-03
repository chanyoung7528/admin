import { createFileRoute } from '@tanstack/react-router';

import { DashboardView } from '@/domains/dashboard/components';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage() {
  // Layout은 _authenticated.tsx에서 제공되므로 여기서는 컨텐츠만
  return (
    <>
      <DashboardView service="ALL" />
    </>
  );
}
