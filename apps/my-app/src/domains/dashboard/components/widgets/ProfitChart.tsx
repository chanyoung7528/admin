import { WidgetCard } from '@repo/shared/components/layouts/content';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

import type { ChartDataPoint, ProfitInsight } from '../../types';

interface ProfitChartProps {
  data: ChartDataPoint[];
  insights?: ProfitInsight[];
  title?: string;
  description?: string;
}

/**
 * ProfitChart - 수익 추이 차트 위젯
 * @param data - 차트 데이터
 * @param insights - 인사이트 정보
 * @param title - 차트 제목
 * @param description - 차트 설명
 */
export function ProfitChart({ data, insights, title = '통계', description = '월별 목표 설정' }: ProfitChartProps) {
  return (
    <WidgetCard title={title} description={description}>
      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" className="dark:stroke-gray-800" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
            <Area type="monotone" dataKey="profit" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      {insights && insights.length > 0 && (
        <div className="mt-4 flex gap-8">
          {insights.map((insight, index) => (
            <div key={index}>
              <p className="text-muted-foreground text-sm">{insight.label}</p>
              <p className="text-xl font-bold">{insight.value}</p>
              <span className={`text-xs font-medium ${insight.trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {insight.change}
              </span>
            </div>
          ))}
        </div>
      )}
    </WidgetCard>
  );
}
