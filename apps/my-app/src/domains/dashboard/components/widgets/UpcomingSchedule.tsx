import { WidgetCard } from '@repo/shared/components/layouts/content';

import type { Schedule } from '../../types';

interface UpcomingScheduleProps {
  schedules: Schedule[];
  title?: string;
}

const scheduleColorMap: Record<Schedule['type'], string> = {
  primary: 'bg-blue-500',
  orange: 'bg-orange-500',
  green: 'bg-green-500',
};

/**
 * UpcomingSchedule - 예정된 일정 타임라인 위젯
 * @param schedules - 일정 데이터 배열
 * @param title - 위젯 제목
 */
export function UpcomingSchedule({ schedules, title = '예정된 일정' }: UpcomingScheduleProps) {
  return (
    <WidgetCard title={title}>
      <div className="space-y-6">
        {schedules.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <div className={`h-3 w-3 flex-shrink-0 rounded-full ${scheduleColorMap[item.type]}`} />
              {index < schedules.length - 1 && <div className="my-1 h-full w-0.5 bg-gray-200 dark:bg-gray-800" />}
            </div>
            <div className="flex-1 pb-4">
              <p className="text-muted-foreground text-xs font-semibold">
                {item.date} <span className="ml-2 font-normal">{item.time}</span>
              </p>
              <p className="mt-1 font-medium">{item.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
