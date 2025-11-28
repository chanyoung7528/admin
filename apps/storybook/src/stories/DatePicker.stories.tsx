import '@repo/date-picker/styles.css';

import { DatePicker } from '@repo/date-picker';
import type { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import { Calendar, Clock } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'Components/DatePicker',
  component: DatePicker,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="DatePicker"
          description="dayjs 기반의 날짜 선택 컴포넌트입니다. react-datepicker를 래핑하여 일관된 날짜 처리와 커스텀 스타일을 제공합니다."
          installationDeps={['repo-date-picker', 'dayjs']}
          implementationCode={`// DatePicker 컴포넌트 사용
import { DatePicker } from "repo-date-picker";
import "repo-date-picker/styles.css";
import { useState } from "react";

export default function Example() {
  const [date, setDate] = useState('');

  return (
    <div>
      <DatePicker
        defaultDate={date}
        onChangePickerDate={setDate}
        placeholderText="날짜를 선택하세요"
      />
      {date && <p>선택된 날짜: {date}</p>}
    </div>
  );
}`}
          exampleCode={`// Form과 함께 사용하는 예시
function BookingForm() {
  const [formData, setFormData] = useState({
    checkIn: '',
    checkOut: '',
    guests: 1,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('예약 정보:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label>체크인 날짜</label>
        <DatePicker
          defaultDate={formData.checkIn}
          onChangePickerDate={(date) =>
            setFormData({ ...formData, checkIn: date })
          }
          placeholderText="체크인 날짜 선택"
        />
      </div>
      <div>
        <label>체크아웃 날짜</label>
        <DatePicker
          defaultDate={formData.checkOut}
          onChangePickerDate={(date) =>
            setFormData({ ...formData, checkOut: date })
          }
          placeholderText="체크아웃 날짜 선택"
        />
      </div>
      <button type="submit">예약하기</button>
    </form>
  );
}`}
          utilityCode={`// dayjs를 사용한 날짜 유틸리티
import dayjs from 'dayjs';

// 날짜 포맷팅
export const changeTimeServer = ({ 
  time, 
  type = 'YYYY-MM-DD HH:mm:ss' 
}: { 
  time: Date | string; 
  type?: string 
}): string => {
  return dayjs(time).format(type);
};

// 날짜 비교
export const isAfter = (date1: string, date2: string) => {
  return dayjs(date1).isAfter(dayjs(date2));
};

export const isBefore = (date1: string, date2: string) => {
  return dayjs(date1).isBefore(dayjs(date2));
};`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    width: {
      control: 'text',
      description: '너비 설정 (예: 300, 400 또는 "default", "full")',
      table: {
        type: { summary: 'number | "default" | "full"' },
        defaultValue: { summary: 'default' },
      },
    },
    disabled: {
      control: 'boolean',
    },
    placeholderText: {
      control: 'text',
    },
    defaultDate: {
      control: 'text',
      description: '초기 날짜 (YYYY-MM-DD HH:mm:ss 형식)',
    },
    onChangePickerDate: {
      table: {
        disable: false,
      },
      control: false,
    },
  },
} satisfies Meta<typeof DatePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 DatePicker
export const Default: Story = {
  render: args => {
    const DefaultExample = () => {
      const [date, setDate] = useState(args.defaultDate || '');

      // args.defaultDate 변경 시 반영
      useEffect(() => {
        setTimeout(() => {
          setDate(args.defaultDate || '');
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [args.defaultDate]);

      // width를 적절하게 파싱 (텍스트 입력을 숫자로 변환)
      const parsedArgs = {
        ...args,
        width: args.width && !isNaN(Number(args.width)) && args.width !== 'default' && args.width !== 'full' ? Number(args.width) : args.width,
      };

      return (
        <div className="w-80 space-y-4">
          <DatePicker {...parsedArgs} defaultDate={date} onChangePickerDate={setDate} />
          {date && (
            <div className="rounded-lg border bg-blue-50 p-3 text-sm">
              <p className="font-medium text-blue-900">선택된 날짜:</p>
              <p className="text-blue-700">{date}</p>
            </div>
          )}
        </div>
      );
    };

    return <DefaultExample />;
  },
  args: {
    placeholderText: '날짜를 선택하세요',
    width: 'default',
    defaultDate: '',
    disabled: false,
  },
};

// 기본값이 설정된 DatePicker
export const WithDefaultDate: Story = {
  render: args => {
    const WithDefaultDateExample = () => {
      const initialDate = args.defaultDate || dayjs().format('YYYY-MM-DD HH:mm:ss');
      const [date, setDate] = useState(initialDate);

      // args.defaultDate 변경 시 반영
      useEffect(() => {
        setTimeout(() => {
          setDate(args.defaultDate || dayjs().format('YYYY-MM-DD HH:mm:ss'));
        }, 0);
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [args.defaultDate]);

      // width를 적절하게 파싱
      const parsedArgs = {
        ...args,
        width: args.width && !isNaN(Number(args.width)) && args.width !== 'default' && args.width !== 'full' ? Number(args.width) : args.width,
      };

      return (
        <div className="w-80 space-y-4">
          <div className="rounded-lg border bg-gray-50 p-3 text-sm">
            <p className="font-medium text-gray-700">오늘 날짜로 초기화됨</p>
          </div>
          <DatePicker {...parsedArgs} defaultDate={date} onChangePickerDate={setDate} />
          {date && (
            <div className="rounded-lg border bg-blue-50 p-3 text-sm">
              <p className="font-medium text-blue-900">선택된 날짜:</p>
              <p className="text-blue-700">{date}</p>
            </div>
          )}
        </div>
      );
    };

    return <WithDefaultDateExample />;
  },
  args: {
    placeholderText: '날짜 선택',
    width: 'default',
    defaultDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    disabled: false,
  },
};

// 너비 옵션
export const WidthVariants: Story = {
  render: () => {
    const WidthVariantsExample = () => {
      const [date1, setDate1] = useState('');
      const [date2, setDate2] = useState('');
      const [date3, setDate3] = useState('');
      const [date4, setDate4] = useState('');

      return (
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">기본 너비 (240px)</label>
            <DatePicker defaultDate={date1} onChangePickerDate={setDate1} width="default" placeholderText="기본 너비" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">커스텀 너비 (300px)</label>
            <DatePicker defaultDate={date2} onChangePickerDate={setDate2} width={300} placeholderText="300px 너비" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">커스텀 너비 (400px)</label>
            <DatePicker defaultDate={date3} onChangePickerDate={setDate3} width={400} placeholderText="400px 너비" />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full 너비 (100%)</label>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <DatePicker defaultDate={date4} onChangePickerDate={setDate4} width="full" placeholderText="Full 너비" />
            </div>
          </div>
        </div>
      );
    };

    return <WidthVariantsExample />;
  },
};

// 비활성화 상태
export const Disabled: Story = {
  render: args => {
    // width를 적절하게 파싱
    const parsedArgs = {
      ...args,
      width: args.width && !isNaN(Number(args.width)) && args.width !== 'default' && args.width !== 'full' ? Number(args.width) : args.width,
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">비활성화 (빈 값)</label>
          <DatePicker {...parsedArgs} disabled placeholderText="날짜를 선택할 수 없습니다" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">비활성화 (날짜 있음)</label>
          <DatePicker {...parsedArgs} disabled defaultDate="2025-01-01" placeholderText="날짜를 선택할 수 없습니다" />
        </div>
      </div>
    );
  },
  args: {
    disabled: true,
    width: 'default',
  },
};

// 예약 시스템 예제
export const BookingSystem: Story = {
  render: () => {
    const BookingSystemExample = () => {
      const [checkIn, setCheckIn] = useState('');
      const [checkOut, setCheckOut] = useState('');
      const [guests, setGuests] = useState(1);

      const calculateNights = () => {
        if (checkIn && checkOut) {
          return dayjs(checkOut).diff(dayjs(checkIn), 'day');
        }
        return 0;
      };

      const pricePerNight = 120000;
      const totalPrice = calculateNights() * pricePerNight;

      return (
        <div className="w-full max-w-md">
          <div className="rounded-lg border bg-white shadow-lg">
            <div className="border-b bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <h3 className="mb-1 text-xl font-bold">호텔 예약</h3>
              <p className="text-sm text-blue-100">원하는 날짜를 선택하세요</p>
            </div>

            <div className="space-y-4 p-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="min-w-0">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    체크인
                  </label>
                  <div className="w-full">
                    <DatePicker defaultDate={checkIn} onChangePickerDate={setCheckIn} placeholderText="날짜 선택" width="full" />
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                    <Calendar className="h-4 w-4" />
                    체크아웃
                  </label>
                  <div className="w-full">
                    <DatePicker defaultDate={checkOut} onChangePickerDate={setCheckOut} placeholderText="날짜 선택" width="full" />
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">투숙객 수</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                  value={guests}
                  onChange={e => setGuests(Number(e.target.value))}
                >
                  {[1, 2, 3, 4, 5, 6].map(num => (
                    <option key={num} value={num}>
                      {num}명
                    </option>
                  ))}
                </select>
              </div>

              {checkIn && checkOut && calculateNights() > 0 && (
                <div className="rounded-lg bg-blue-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>
                        ₩{pricePerNight.toLocaleString()} x {calculateNights()}박
                      </span>
                      <span className="font-medium">₩{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="border-t border-blue-200 pt-2">
                      <div className="flex justify-between font-bold text-blue-900">
                        <span>총 금액</span>
                        <span>₩{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                disabled={!checkIn || !checkOut || calculateNights() <= 0}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <BookingSystemExample />;
  },
};

// 일정 관리 예제
export const ScheduleManager: Story = {
  render: () => {
    const ScheduleManagerExample = () => {
      const [schedules, setSchedules] = useState<Array<{ id: number; title: string; date: string }>>([
        { id: 1, title: '팀 미팅', date: '2025-11-20 23:59:59' },
        { id: 2, title: '프로젝트 마감', date: '2025-11-25 23:59:59' },
      ]);
      const [newTitle, setNewTitle] = useState('');
      const [newDate, setNewDate] = useState('');

      const addSchedule = () => {
        if (newTitle && newDate) {
          setSchedules([...schedules, { id: Date.now(), title: newTitle, date: newDate }]);
          setNewTitle('');
          setNewDate('');
        }
      };

      const removeSchedule = (id: number) => {
        setSchedules(schedules.filter(s => s.id !== id));
      };

      const sortedSchedules = [...schedules].sort((a, b) => dayjs(a.date).diff(dayjs(b.date)));

      return (
        <div className="w-full max-w-2xl space-y-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Clock className="h-5 w-5 text-purple-600" />
              일정 추가
            </h3>

            <div className="flex gap-3">
              <input
                type="text"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
                placeholder="일정 제목"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
              />
              <div className="w-64 min-w-0 flex-shrink-0">
                <DatePicker defaultDate={newDate} onChangePickerDate={setNewDate} placeholderText="날짜 선택" width="full" />
              </div>
              <button
                onClick={addSchedule}
                className="flex-shrink-0 rounded-md bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                disabled={!newTitle || !newDate}
              >
                추가
              </button>
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-4">
              <h3 className="font-semibold text-gray-900">예정된 일정 ({sortedSchedules.length})</h3>
            </div>
            <div className="divide-y">
              {sortedSchedules.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>등록된 일정이 없습니다.</p>
                </div>
              ) : (
                sortedSchedules.map(schedule => (
                  <div key={schedule.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{schedule.title}</p>
                      <p className="text-sm text-gray-500">{dayjs(schedule.date).format('YYYY년 MM월 DD일')}</p>
                    </div>
                    <button
                      onClick={() => removeSchedule(schedule.id)}
                      className="rounded-md border border-red-300 px-3 py-1 text-sm text-red-600 hover:bg-red-50"
                    >
                      삭제
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      );
    };

    return <ScheduleManagerExample />;
  },
};
