import { addDays, addMonths, addWeeks, format, subDays, subMonths, subWeeks } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Calendar, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import type { ViewMode } from './Calendar';

interface CalendarHeaderProps {
  currentDate: Date;
  viewMode: ViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: ViewMode) => void;
  onAddEvent: () => void;
}

export function CalendarHeader({ currentDate, viewMode, onDateChange, onViewModeChange, onAddEvent }: CalendarHeaderProps) {
  const handlePrevious = () => {
    if (viewMode === 'month') {
      onDateChange(subMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      onDateChange(subWeeks(currentDate, 1));
    } else {
      onDateChange(subDays(currentDate, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month') {
      onDateChange(addMonths(currentDate, 1));
    } else if (viewMode === 'week') {
      onDateChange(addWeeks(currentDate, 1));
    } else {
      onDateChange(addDays(currentDate, 1));
    }
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const getDateDisplay = () => {
    if (viewMode === 'month') {
      return format(currentDate, 'yyyy년 M월', { locale: ko });
    } else if (viewMode === 'week') {
      return format(currentDate, 'yyyy년 M월', { locale: ko });
    } else {
      return format(currentDate, 'yyyy년 M월 d일 EEEE', { locale: ko });
    }
  };

  return (
    <div className="border-b border-gray-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900">캘린더</h1>
          </div>

          <button
            onClick={handleToday}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            오늘
          </button>

          <div className="flex items-center gap-2">
            <button onClick={handlePrevious} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button onClick={handleNext} className="rounded-lg p-2 text-gray-600 transition-colors hover:bg-gray-100">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <h2 className="text-lg font-semibold text-gray-900">{getDateDisplay()}</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex rounded-lg bg-gray-100 p-1">
            <button
              onClick={() => onViewModeChange('month')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'month' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              월
            </button>
            <button
              onClick={() => onViewModeChange('week')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'week' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              주
            </button>
            <button
              onClick={() => onViewModeChange('day')}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                viewMode === 'day' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              일
            </button>
          </div>

          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            일정 추가
          </button>
        </div>
      </div>
    </div>
  );
}
