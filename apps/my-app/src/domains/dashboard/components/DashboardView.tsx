import { profitData, recentOrders, revenueGoals, salesCategoryData, statsData, upcomingSchedule } from '../data/mockData';
import { ProfitChart } from './widgets/ProfitChart';
import { RecentOrders } from './widgets/RecentOrders';
import { RevenueGoals } from './widgets/RevenueGoals';
import { SalesCategory } from './widgets/SalesCategory';
import { StatsGrid } from './widgets/StatsGrid';
import { UpcomingSchedule } from './widgets/UpcomingSchedule';

interface DashboardViewProps {
  service: 'ALL' | 'BODY' | 'FOOD' | 'MIND';
}

export function DashboardView({ service }: DashboardViewProps) {
  const serviceLabel = {
    ALL: '전체',
    BODY: 'MY BODY',
    FOOD: 'MY FOOD',
    MIND: 'MY MIND',
  }[service];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{serviceLabel} 대시보드</h2>
        <p className="text-muted-foreground mt-1">{serviceLabel} 서비스의 성과 및 통계 개요</p>
      </div>

      <StatsGrid stats={statsData} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ProfitChart data={profitData} />
        </div>
        <div className="lg:col-span-4">
          <RevenueGoals goals={revenueGoals} />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesCategory categories={salesCategoryData} />
        <UpcomingSchedule schedules={upcomingSchedule} />
      </div>

      <RecentOrders orders={recentOrders} />
    </div>
  );
}
