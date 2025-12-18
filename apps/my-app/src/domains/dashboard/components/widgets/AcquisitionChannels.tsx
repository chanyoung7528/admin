import { WidgetCard } from '@repo/shared/components/layouts/content';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

const CHANNEL_DATA = [
  { month: '1월', direct: 40, referral: 30, organic: 20, social: 10 },
  { month: '2월', direct: 45, referral: 35, organic: 25, social: 15 },
  { month: '3월', direct: 50, referral: 30, organic: 30, social: 20 },
  { month: '4월', direct: 55, referral: 40, organic: 35, social: 15 },
  { month: '5월', direct: 35, referral: 25, organic: 20, social: 15 },
  { month: '6월', direct: 48, referral: 38, organic: 28, social: 18 },
  { month: '7월', direct: 52, referral: 42, organic: 32, social: 22 },
  { month: '8월', direct: 58, referral: 35, organic: 30, social: 20 },
];

const CHANNEL_LEGEND = [
  { label: '직접 유입', color: 'bg-indigo-700' },
  { label: '추천', color: 'bg-indigo-500' },
  { label: '자연 검색', color: 'bg-indigo-300' },
  { label: '소셜', color: 'bg-indigo-200' },
] as const;

interface AcquisitionChannelsProps {
  title?: string;
  description?: string;
}

/**
 * AcquisitionChannels - 채널별 매출 현황 위젯
 * @param title - 위젯 제목
 * @param description - 위젯 설명
 */
export function AcquisitionChannels({ title = '획득 채널', description = '월별 목표 설정' }: AcquisitionChannelsProps) {
  return (
    <WidgetCard title={title} description={description} className="h-full">
      <div className="mb-6 flex items-center gap-6">
        {CHANNEL_LEGEND.map(({ label, color }) => (
          <div key={label} className="flex items-center gap-2">
            <div className={`h-3 w-3 rounded-sm ${color}`} />
            <span className="text-sm text-gray-600">{label}</span>
          </div>
        ))}
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={CHANNEL_DATA}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
              padding: '8px 12px',
            }}
          />
          <Bar dataKey="direct" stackId="a" fill="#3730A3" radius={[0, 0, 0, 0]} />
          <Bar dataKey="referral" stackId="a" fill="#4F46E5" radius={[0, 0, 0, 0]} />
          <Bar dataKey="organic" stackId="a" fill="#818CF8" radius={[0, 0, 0, 0]} />
          <Bar dataKey="social" stackId="a" fill="#C7D2FE" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </WidgetCard>
  );
}
