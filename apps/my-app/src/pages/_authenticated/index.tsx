import { ContentWrapper } from '@repo/shared/components/layouts/content';
import { createFileRoute } from '@tanstack/react-router';

import { DashboardView } from '@/domains/dashboard/components';

export const Route = createFileRoute('/_authenticated/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <ContentWrapper>
      <DashboardView service="ALL" />
    </ContentWrapper>
  );
}
