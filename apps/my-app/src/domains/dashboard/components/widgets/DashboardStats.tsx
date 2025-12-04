import { WidgetCard } from '@repo/shared/components/layouts/content';
import { ArrowDown, ArrowUp } from 'lucide-react';

import type { StatCard } from '../../types';

interface DashboardStatsProps {
  stats: StatCard[];
}

/**
 * DashboardStats - 대시보드 상단 통계 카드들
 * @param stats - 통계 데이터 배열
 */
export function DashboardStats({ stats }: DashboardStatsProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <WidgetCard key={index} padding="sm">
          <div className="mb-2">
            <span className="text-3xl font-bold">{stat.value}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span
                className={`flex items-center font-medium ${stat.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
              >
                {stat.trend === 'up' ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.period}</span>
            </div>
          </div>
        </WidgetCard>
      ))}
    </div>
  );
}
