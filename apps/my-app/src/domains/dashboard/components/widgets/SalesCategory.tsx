import { WidgetCard } from '@repo/shared/components/layouts/content';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { SalesCategory as SalesCategoryType } from '../../types';

interface SalesCategoryProps {
  categories: SalesCategoryType[];
  title?: string;
}

/**
 * SalesCategory - 판매 카테고리 분포 차트 위젯
 * @param categories - 카테고리 데이터 배열
 * @param title - 위젯 제목
 */
export function SalesCategory({ categories, title = '판매 카테고리' }: SalesCategoryProps) {
  const chartData = categories.map(cat => ({
    name: cat.name,
    percent: cat.value,
    value: cat.name,
    customRadius: cat.customRadius,
    color: cat.color,
  }));

  return (
    <WidgetCard title={title}>
      <div className="h-[350px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              dataKey="percent"
              nameKey="value"
              outerRadius={(entry: { customRadius: number }) => entry.customRadius}
              fill="#8884d8"
              label={({ name, percent }) => `${name} ${percent}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => `${value}%`} />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 space-y-3">
        {categories.map((category, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
              <span className="text-muted-foreground">{category.name}</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="font-medium">{category.value}%</span>
              <span className="text-muted-foreground text-xs">{category.count}</span>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
