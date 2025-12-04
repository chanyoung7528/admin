import type { Schedule } from '../../types';

interface UpcomingScheduleProps {
  schedules: Schedule[];
  title?: string;
}

export function UpcomingSchedule({ schedules, title = '예정된 일정' }: UpcomingScheduleProps) {
  const getColorClass = (type: Schedule['type']) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-500';
      case 'orange':
        return 'bg-orange-500';
      case 'green':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-card rounded-xl border p-6 shadow-sm">
      <h3 className="text-lg font-semibold">{title}</h3>
      <div className="mt-6 space-y-6">
        {schedules.map((item, index) => (
          <div key={index} className="flex gap-4">
            <div className="flex flex-col items-center pt-1">
              <div className={`h-3 w-3 rounded-full ${getColorClass(item.type)}`}></div>
              {index < schedules.length - 1 && <div className="my-1 h-full w-0.5 bg-gray-200 dark:bg-gray-800"></div>}
            </div>
            <div className="pb-4">
              <p className="text-muted-foreground text-xs font-semibold">
                {item.date} <span className="ml-2 font-normal">{item.time}</span>
              </p>
              <p className="mt-1 font-medium">{item.title}</p>
              <p className="text-muted-foreground mt-1 text-sm">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
