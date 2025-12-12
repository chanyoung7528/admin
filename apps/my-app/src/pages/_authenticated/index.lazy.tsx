import { ContentHeader, ContentWrapper } from '@repo/shared/components/layouts/content';
import { createLazyFileRoute } from '@tanstack/react-router';

import { DashboardView } from '@/domains/dashboard/components';

export const Route = createLazyFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ContentWrapper>
      <ContentHeader title="대시보드" description="서비스의 성과 및 통계 개요" />
      <DashboardView />
    </ContentWrapper>
  );
}
