import { profitData, profitInsights, recentOrders, revenueGoals, salesCategoryData, statsData, upcomingSchedule } from '../data/mockData';
import { DashboardStats, ProfitChart, RecentOrders, RevenueGoals, SalesCategory, UpcomingSchedule } from './widgets';

export function DashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardStats stats={statsData} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ProfitChart data={profitData} insights={profitInsights} />
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
