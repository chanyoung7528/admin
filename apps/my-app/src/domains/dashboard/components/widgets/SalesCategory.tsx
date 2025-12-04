import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { SalesCategory as SalesCategoryType } from '../../types';

interface SalesCategoryProps {
  categories: SalesCategoryType[];
  title?: string;
}

export function SalesCategory({ categories, title = '판매 카테고리' }: SalesCategoryProps) {
  const chartData = categories.map(cat => ({
    name: cat.name,
    percent: cat.value,
    value: cat.name,
    customRadius: cat.customRadius,
    color: cat.color,
  }));

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-4 h-[350px] w-full">
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
    </div>
  );
}
