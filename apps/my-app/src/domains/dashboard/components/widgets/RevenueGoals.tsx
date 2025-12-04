import { WidgetCard } from '@repo/shared/components/layouts/content';

import type { RevenueGoal } from '../../types';

interface RevenueGoalsProps {
  goals: RevenueGoal[];
  title?: string;
  description?: string;
}

/**
 * RevenueGoals - 매출 목표 달성률 위젯
 * @param goals - 목표 데이터 배열
 * @param title - 위젯 제목
 * @param description - 위젯 설명
 */
export function RevenueGoals({ goals, title = '예상 매출', description = '월별 목표 설정' }: RevenueGoalsProps) {
  return (
    <WidgetCard title={title} description={description} className="h-full">
      <div className="space-y-6">
        {goals.map((goal, index) => (
          <div key={index}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium">{goal.label}</span>
              <span className="font-bold">{goal.amount}</span>
            </div>
            <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
              <div className={`h-full rounded-full ${goal.color}`} style={{ width: `${goal.percentage}%` }} />
            </div>
            <div className="text-muted-foreground mt-1 text-right text-xs">{goal.percentage}%</div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
