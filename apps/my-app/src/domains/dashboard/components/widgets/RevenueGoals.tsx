import type { RevenueGoal } from '../../types';

interface RevenueGoalsProps {
  goals: RevenueGoal[];
  title?: string;
  description?: string;
}

export function RevenueGoals({ goals, title = '예상 매출', description = '월별 목표 설정' }: RevenueGoalsProps) {
  return (
    <div className="bg-card h-full rounded-xl border p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="text-muted-foreground mb-6 text-sm">{description}</p>

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
    </div>
  );
}
