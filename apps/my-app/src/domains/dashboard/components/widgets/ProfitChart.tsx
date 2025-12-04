import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ChartDataPoint } from '../../types';

interface ProfitChartProps {
  data: ChartDataPoint[];
  title?: string;
  description?: string;
}

export function ProfitChart({ data, title = '통계', description = '월별 목표 설정' }: ProfitChartProps) {
  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>
      </div>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 flex gap-8">
        <div>
          <p className="text-muted-foreground text-sm">연평균 수익</p>
          <p className="text-xl font-bold">₩275,944,758</p>
          <span className="text-xs font-medium text-green-600">+23.2%</span>
        </div>
        <div>
          <p className="text-muted-foreground text-sm">연평균 매출</p>
          <p className="text-xl font-bold">₩39,417,600</p>
          <span className="text-xs font-medium text-red-600">-12.3%</span>
        </div>
      </div>
    </div>
  );
}
