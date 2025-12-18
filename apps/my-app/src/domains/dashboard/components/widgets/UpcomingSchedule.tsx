import { WidgetCard } from '@repo/shared/components/layouts/content';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

import type { Schedule } from '../../types';

const DEVICE_SESSION_DATA = [
  { name: '데스크톱', value: 65, color: '#4F46E5' },
  { name: '모바일', value: 25, color: '#818CF8' },
  { name: '태블릿', value: 10, color: '#C7D2FE' },
];

interface UpcomingScheduleProps {
  schedules: Schedule[];
  title?: string;
}

/**
 * UpcomingSchedule - 디바이스별 세션 분포 위젯
 * @param _schedules - 일정 데이터 배열 (미사용, 향후 확장용)
 * @param title - 위젯 제목
 */
export function UpcomingSchedule({ schedules: _schedules, title = '디바이스별 세션' }: UpcomingScheduleProps) {
  return (
    <WidgetCard title={title}>
      <div className="flex items-center justify-center">
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie data={DEVICE_SESSION_DATA} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={2} dataKey="value">
              {DEVICE_SESSION_DATA.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
                padding: '8px 12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-4 flex items-center justify-center gap-6">
        {DEVICE_SESSION_DATA.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-sm text-gray-600">{item.name}</span>
          </div>
        ))}
      </div>
    </WidgetCard>
  );
}
