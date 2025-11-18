import { DateRangePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';
import type { Meta, StoryObj } from '@storybook/react';
import dayjs from 'dayjs';
import { Calendar, CalendarRange } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'Components/DateRangePicker',
  component: DateRangePicker,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="DateRangePicker"
          description="dayjs 기반의 날짜 범위 선택 컴포넌트입니다. react-datepicker를 래핑하여 시작일과 종료일을 선택할 수 있으며, 일관된 날짜 처리와 커스텀 스타일을 제공합니다."
          installationDeps={['repo-date-picker', 'dayjs']}
          implementationCode={`// DateRangePicker 컴포넌트 사용
import { DateRangePicker } from "repo-date-picker";
import "repo-date-picker/styles.css";
import { useState } from "react";

export default function Example() {
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: '',
  });

  const handleDateChange = ({ startDate, endDate, displayStartDate, displayEndDate }) => {
    console.log('선택된 기간:', { startDate, endDate });
    setDateRange({ startDate, endDate });
  };

  return (
    <div>
      <DateRangePicker
        defaultDate={dateRange}
        onChangePickerDate={handleDateChange}
        placeholderText="날짜 범위를 선택하세요"
      />
      {dateRange.startDate && dateRange.endDate && (
        <p>선택된 기간: {displayStartDate} ~ {displayEndDate}</p>
      )}
    </div>
  );
}`}
          exampleCode={`// 예약 시스템에서 사용하는 예시
function BookingSystem() {
  const [booking, setBooking] = useState({
    checkIn: '',
    checkOut: '',
    nights: 0,
  });

  const handleDateChange = ({ startDate, endDate, displayStartDate, displayEndDate }) => {
    const nights = dayjs(endDate).diff(dayjs(startDate), 'day');
    setBooking({
      checkIn: startDate,
      checkOut: endDate,
      nights,
    });
  };

  return (
    <div className="booking-form">
      <DateRangePicker
        defaultDate={{ startDate: booking.checkIn, endDate: booking.checkOut }}
        onChangePickerDate={handleDateChange}
        placeholderText="체크인 ~ 체크아웃"
        width="full"
      />
      {booking.nights > 0 && (
        <p className="summary">
          {booking.nights}박 {booking.nights + 1}일 예약
        </p>
      )}
    </div>
  );
}`}
          utilityCode={`// dayjs를 사용한 날짜 범위 유틸리티
import dayjs from 'dayjs';

// 날짜 범위 계산
export const getDaysDifference = (startDate: string, endDate: string) => {
  return dayjs(endDate).diff(dayjs(startDate), 'day');
};

// 날짜 범위 검증
export const isValidDateRange = (startDate: string, endDate: string) => {
  return dayjs(endDate).isAfter(dayjs(startDate)) || dayjs(endDate).isSame(dayjs(startDate));
};

// 주말 포함 여부
export const hasWeekend = (startDate: string, endDate: string) => {
  let current = dayjs(startDate);
  const end = dayjs(endDate);
  
  while (current.isBefore(end) || current.isSame(end)) {
    const day = current.day();
    if (day === 0 || day === 6) return true;
    current = current.add(1, 'day');
  }
  
  return false;
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
    isEditMode: {
      control: 'boolean',
      description: '편집 모드 (시간 포맷 00:00:00으로 고정)',
    },
    defaultDate: {
      control: 'object',
      description: '초기 날짜 범위 { startDate: string, endDate: string }',
    },
    onChangePickerDate: {
      table: {
        disable: false,
      },
      control: false,
    },
  },
} satisfies Meta<typeof DateRangePicker>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 DateRangePicker
export const Default: Story = {
  render: args => {
    const DefaultExample = () => {
      const initialRange = args.defaultDate || { startDate: '', endDate: '' };
      const [dateRange, setDateRange] = useState(initialRange);

      // args.defaultDate 변경 시 반영
      useEffect(() => {
        if (args.defaultDate) {
          setDateRange(args.defaultDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [JSON.stringify(args.defaultDate)]);

      // width를 적절하게 파싱
      const parsedArgs = {
        ...args,
        width: args.width && !isNaN(Number(args.width)) && args.width !== 'default' && args.width !== 'full' ? Number(args.width) : args.width,
        defaultDate: dateRange,
      };

      const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string; displayStartDate?: string; displayEndDate?: string }) => {
        setDateRange({ startDate, endDate });
      };

      const getDays = () => {
        if (dateRange.startDate && dateRange.endDate) {
          return dayjs(dateRange.endDate).diff(dayjs(dateRange.startDate), 'day');
        }
        return 0;
      };

      return (
        <div className="w-96 space-y-4">
          <DateRangePicker {...parsedArgs} onChangePickerDate={handleDateChange} />
          {dateRange.startDate && dateRange.endDate && (
            <div className="rounded-lg border bg-blue-50 p-4 text-sm">
              <p className="mb-2 font-medium text-blue-900">선택된 기간:</p>
              <div className="space-y-1 text-blue-700">
                <p>• 시작: {dayjs(dateRange.startDate).format('YYYY년 MM월 DD일')}</p>
                <p>• 종료: {dayjs(dateRange.endDate).format('YYYY년 MM월 DD일')}</p>
                <p className="font-semibold text-blue-900">• 총 {getDays()}일</p>
              </div>
            </div>
          )}
        </div>
      );
    };

    return <DefaultExample />;
  },
  args: {
    placeholderText: '날짜 범위를 선택하세요',
    width: 'default',
    defaultDate: { startDate: '', endDate: '' },
    disabled: false,
    isEditMode: false,
    onChangePickerDate: () => {},
  },
};

// 기본값이 설정된 DateRangePicker
export const WithDefaultDate: Story = {
  render: args => {
    const WithDefaultDateExample = () => {
      const today = dayjs();
      const initialRange = args.defaultDate || {
        startDate: today.format('YYYY-MM-DD HH:mm:ss'),
        endDate: today.add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
      };
      const [dateRange, setDateRange] = useState(initialRange);

      // args.defaultDate 변경 시 반영
      useEffect(() => {
        if (args.defaultDate) {
          setDateRange(args.defaultDate);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [JSON.stringify(args.defaultDate)]);

      // width를 적절하게 파싱
      const parsedArgs = {
        ...args,
        width: args.width && !isNaN(Number(args.width)) && args.width !== 'default' && args.width !== 'full' ? Number(args.width) : args.width,
        defaultDate: dateRange,
      };

      const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string; displayStartDate?: string; displayEndDate?: string }) => {
        setDateRange({ startDate, endDate });
      };

      return (
        <div className="w-96 space-y-4">
          <div className="rounded-lg border bg-gray-50 p-3 text-sm">
            <p className="font-medium text-gray-700">오늘부터 7일 후로 초기화됨</p>
          </div>
          <DateRangePicker {...parsedArgs} onChangePickerDate={handleDateChange} />
          {dateRange.startDate && dateRange.endDate && (
            <div className="rounded-lg border bg-green-50 p-3 text-sm">
              <p className="font-medium text-green-900">현재 선택:</p>
              <p className="text-green-700">
                {dayjs(dateRange.startDate).format('MM/DD')} ~ {dayjs(dateRange.endDate).format('MM/DD')}
              </p>
            </div>
          )}
        </div>
      );
    };

    return <WithDefaultDateExample />;
  },
  args: {
    placeholderText: '기간 선택',
    width: 'default',
    defaultDate: {
      startDate: dayjs().format('YYYY-MM-DD HH:mm:ss'),
      endDate: dayjs().add(7, 'day').format('YYYY-MM-DD HH:mm:ss'),
    },
    disabled: false,
    isEditMode: false,
    onChangePickerDate: () => {},
  },
};

// 너비 옵션
export const WidthVariants: Story = {
  render: () => {
    const WidthVariantsExample = () => {
      const [date1, setDate1] = useState({ startDate: '', endDate: '' });
      const [date2, setDate2] = useState({ startDate: '', endDate: '' });
      const [date3, setDate3] = useState({ startDate: '', endDate: '' });

      return (
        <div className="w-full space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">기본 너비 (240px)</label>
            <DateRangePicker
              defaultDate={date1}
              onChangePickerDate={data => setDate1({ startDate: data.startDate, endDate: data.endDate })}
              placeholderText="기본 너비"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">커스텀 너비 (350px)</label>
            <DateRangePicker
              defaultDate={date2}
              onChangePickerDate={data => setDate2({ startDate: data.startDate, endDate: data.endDate })}
              width={350}
              placeholderText="350px 너비"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Full 너비 (100%)</label>
            <div style={{ width: '100%', maxWidth: '600px' }}>
              <DateRangePicker
                defaultDate={date3}
                onChangePickerDate={data => setDate3({ startDate: data.startDate, endDate: data.endDate })}
                width="full"
                placeholderText="Full 너비"
              />
            </div>
          </div>
        </div>
      );
    };

    return <WidthVariantsExample />;
  },
  args: {
    onChangePickerDate: () => {},
  },
};

// 비활성화 상태
export const Disabled: Story = {
  render: args => {
    const today = dayjs();
    const defaultRange = {
      startDate: today.format('YYYY-MM-DD HH:mm:ss'),
      endDate: today.add(3, 'day').format('YYYY-MM-DD HH:mm:ss'),
    };

    // width를 적절하게 파싱
    const parsedArgs = {
      ...args,
      width: args.width && !isNaN(Number(args.width)) && args.width !== 'default' && args.width !== 'full' ? Number(args.width) : args.width,
    };

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">비활성화 (빈 값)</label>
          <DateRangePicker {...parsedArgs} disabled placeholderText="날짜를 선택할 수 없습니다" />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">비활성화 (날짜 범위 있음)</label>
          <DateRangePicker {...parsedArgs} disabled defaultDate={defaultRange} placeholderText="날짜를 선택할 수 없습니다" />
        </div>
      </div>
    );
  },
  args: {
    disabled: true,
    width: 'default',
    onChangePickerDate: () => {},
  },
};

// 호텔 예약 시스템
export const HotelBookingSystem: Story = {
  render: () => {
    const HotelBookingExample = () => {
      const [booking, setBooking] = useState({ startDate: '', endDate: '' });
      const [guests, setGuests] = useState(2);

      const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string; displayStartDate?: string; displayEndDate?: string }) => {
        setBooking({ startDate, endDate });
      };

      const calculateNights = () => {
        if (booking.startDate && booking.endDate) {
          return dayjs(booking.endDate).diff(dayjs(booking.startDate), 'day');
        }
        return 0;
      };

      const pricePerNight = 150000;
      const nights = calculateNights();
      const totalPrice = nights * pricePerNight;

      return (
        <div className="w-[350px] max-w-md">
          <div className="rounded-lg border bg-white shadow-lg">
            <div className="border-b bg-gradient-to-r from-purple-600 to-purple-700 p-6 text-white">
              <h3 className="mb-1 text-xl font-bold">호텔 예약</h3>
              <p className="text-sm text-purple-100">체크인/체크아웃 날짜를 선택하세요</p>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-700">
                  <CalendarRange className="h-4 w-4" />
                  숙박 기간
                </label>
                <div className="w-full">
                  <DateRangePicker defaultDate={booking} onChangePickerDate={handleDateChange} placeholderText="날짜 선택" width="full" />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">투숙객 수</label>
                <select
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
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

              {nights > 0 && (
                <div className="rounded-lg bg-purple-50 p-4">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-700">
                      <span>
                        ₩{pricePerNight.toLocaleString()} x {nights}박
                      </span>
                      <span className="font-medium">₩{totalPrice.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>투숙 인원</span>
                      <span>{guests}명</span>
                    </div>
                    <div className="border-t border-purple-200 pt-2">
                      <div className="flex justify-between font-bold text-purple-900">
                        <span>총 금액</span>
                        <span>₩{totalPrice.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                className="w-full rounded-md bg-purple-600 py-3 text-sm font-medium text-white hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-300"
                disabled={nights <= 0}
              >
                예약하기
              </button>
            </div>
          </div>
        </div>
      );
    };

    return <HotelBookingExample />;
  },
  args: {
    onChangePickerDate: () => {},
  },
};

// 휴가 계획
export const VacationPlanner: Story = {
  render: () => {
    const VacationPlannerExample = () => {
      const [vacations, setVacations] = useState<Array<{ id: number; title: string; startDate: string; endDate: string }>>([]);
      const [newVacation, setNewVacation] = useState({
        title: '',
        startDate: '',
        endDate: '',
      });

      const handleDateChange = ({ startDate, endDate }: { startDate: string; endDate: string; displayStartDate?: string; displayEndDate?: string }) => {
        console.log('Date changed:', { startDate, endDate });
        setNewVacation(prev => ({ ...prev, startDate, endDate }));
      };

      const addVacation = () => {
        if (newVacation.title && newVacation.startDate && newVacation.endDate) {
          setVacations([...vacations, { id: Date.now(), ...newVacation }]);
          setNewVacation({ title: '', startDate: '', endDate: '' });
        }
      };

      const isAddButtonDisabled = !newVacation.title || !newVacation.startDate || !newVacation.endDate;

      const removeVacation = (id: number) => {
        setVacations(vacations.filter(v => v.id !== id));
      };

      const getDays = (start: string, end: string) => {
        return dayjs(end).diff(dayjs(start), 'day');
      };

      return (
        <div className="w-full max-w-2xl space-y-4">
          <div className="rounded-lg border bg-white p-6 shadow-sm">
            <h3 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
              <Calendar className="h-5 w-5 text-indigo-600" />
              휴가 추가
            </h3>

            <div className="w-[350px] space-y-3">
              <input
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                placeholder="휴가 제목 (예: 제주도 여행)"
                value={newVacation.title}
                onChange={e => setNewVacation({ ...newVacation, title: e.target.value })}
              />
              <div className="w-full">
                <DateRangePicker
                  defaultDate={newVacation.startDate && newVacation.endDate ? { startDate: newVacation.startDate, endDate: newVacation.endDate } : undefined}
                  onChangePickerDate={handleDateChange}
                  placeholderText="휴가 기간 선택"
                  width="full"
                />
              </div>
              <button
                onClick={addVacation}
                className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500"
                disabled={isAddButtonDisabled}
                type="button"
              >
                추가
              </button>
              {isAddButtonDisabled && <p className="text-xs text-gray-500">{!newVacation.title ? '제목을 입력하세요' : '날짜 범위를 선택하세요'}</p>}
            </div>
          </div>

          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b p-4">
              <h3 className="font-semibold text-gray-900">계획된 휴가 ({vacations.length})</h3>
            </div>
            <div className="divide-y">
              {vacations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <p>등록된 휴가가 없습니다.</p>
                </div>
              ) : (
                vacations.map(vacation => (
                  <div key={vacation.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                    <div>
                      <p className="font-medium text-gray-900">{vacation.title}</p>
                      <p className="text-sm text-gray-500">
                        {dayjs(vacation.startDate).format('YYYY.MM.DD')} ~ {dayjs(vacation.endDate).format('YYYY.MM.DD')} (
                        {getDays(vacation.startDate, vacation.endDate)}일)
                      </p>
                    </div>
                    <button
                      onClick={() => removeVacation(vacation.id)}
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

    return <VacationPlannerExample />;
  },
  args: {
    onChangePickerDate: () => {},
  },
};
