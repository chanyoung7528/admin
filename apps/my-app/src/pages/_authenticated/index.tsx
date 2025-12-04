import { PageContainer, PageHeader } from '@repo/shared/components/layouts/content';
import { createFileRoute } from '@tanstack/react-router';

import { DashboardView } from '@/domains/dashboard/components';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <PageContainer>
      <PageHeader title="대시보드" description="서비스의 성과 및 통계 개요" />
      <DashboardView />
    </PageContainer>
  );
}
