import { ArrowDown, ArrowUp } from 'lucide-react';

import type { StatCard } from '../../types';

interface StatsGridProps {
  stats: StatCard[];
}

export function StatsGrid({ stats }: StatsGridProps) {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {stats.map((stat, index) => (
        <div key={index} className="bg-card rounded-xl border p-4 shadow-sm">
          <div className="mb-2">
            <span className="text-3xl font-bold">{stat.value}</span>
          </div>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-muted-foreground text-sm font-medium">{stat.title}</h3>
            <div className="mt-1 flex items-center gap-2 text-sm">
              <span className={`flex items-center font-medium ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {stat.trend === 'up' ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
                {stat.change}
              </span>
              <span className="text-muted-foreground">{stat.period}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
