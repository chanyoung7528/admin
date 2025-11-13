import { DashboardView } from '@/domains/dashboard/components';
import { InsightDashboard } from '@/domains/insight/components';
import { Header, Layout, TopNav } from '@repo/shared/components/layouts';

import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: DashboardPage,
});

const topNav = [
  { title: '개요', href: '/', isActive: true },
  { title: '인사이트', href: '/user/insight', isActive: false },
];

function DashboardPage() {
  return (
    <Layout>
      <TopNav links={topNav} />
      <Header> </Header>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">대시보드</h1>
          <p className="text-muted-foreground">사용자 인사이트 및 전체 현황을 확인하세요</p>
        </div>

        {/* Insight + Dashboard 도메인 조합 */}
        <InsightDashboard />
        <DashboardView service="ALL" />
      </div>
    </Layout>
  );
}
