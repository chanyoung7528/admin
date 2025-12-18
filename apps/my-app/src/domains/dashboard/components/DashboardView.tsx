import { profitData, profitInsights, recentOrders, salesCategoryData, statsData } from '../data/mockData';
import { AcquisitionChannels, DashboardStats, DeviceSessions, ProfitChart, RecentOrders, SalesCategory } from './widgets';

export function DashboardView() {
  return (
    <div className="flex flex-col gap-6">
      <DashboardStats stats={statsData} />

      <div className="grid gap-6 lg:grid-cols-12">
        <div className="lg:col-span-8">
          <ProfitChart data={profitData} insights={profitInsights} />
        </div>
        <div className="lg:col-span-4">
          <AcquisitionChannels />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <SalesCategory categories={salesCategoryData} />
        <DeviceSessions />
      </div>

      <RecentOrders orders={recentOrders} />
    </div>
  );
}
