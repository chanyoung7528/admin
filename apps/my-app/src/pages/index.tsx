import { DashboardView } from '@/domains/dashboard/components';
import { Header } from '@/domains/dashboard/components/Header';
import { InsightDashboard } from '@/domains/insight/components';
import { Layout } from '@repo/shared/components/layouts';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

function DashboardPage() {
  return (
    <Layout>
      <Header />
      <InsightDashboard />
      <DashboardView service="ALL" />
    </Layout>
  );
}
