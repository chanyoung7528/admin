import { Button } from '../ui';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';

import type { MobileViewMode } from './MobileCalendar';

interface MobileCalendarHeaderProps {
  currentDate: Date;
  viewMode: MobileViewMode;
  onDateChange: (date: Date) => void;
  onViewModeChange: (mode: MobileViewMode) => void;
  onAddEvent: () => void;
}

export function MobileCalendarHeader({ currentDate, viewMode, onDateChange, onViewModeChange, onAddEvent }: MobileCalendarHeaderProps) {
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() - 7);
    } else {
      newDate.setMonth(currentDate.getMonth() - 1);
    }
    onDateChange(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (viewMode === 'week') {
      newDate.setDate(currentDate.getDate() + 7);
    } else {
      newDate.setMonth(currentDate.getMonth() + 1);
    }
    onDateChange(newDate);
  };

  const handleToday = () => {
    onDateChange(new Date());
  };

  const formatTitle = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    return `${year}년 ${String(month).padStart(2, '0')}월`;
  };

  return (
    <div className="border-b bg-white">
      {/* 상단 헤더 */}
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold">COACH</h1>
        <Button size="icon-sm" variant="ghost" onClick={onAddEvent}>
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* 뷰 모드 탭 */}
      <div className="flex border-b">
        <button
          onClick={() => onViewModeChange('week')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${viewMode === 'week' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          마이코치
        </button>
        <button
          onClick={() => onViewModeChange('month')}
          className={`flex-1 py-3 text-sm font-medium transition-colors ${viewMode === 'month' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-600'}`}
        >
          맛집탐방
        </button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-600">식사일기</button>
        <button className="flex-1 py-3 text-sm font-medium text-gray-600">복약달력</button>
      </div>

      {/* 날짜 네비게이션 */}
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <Button size="icon-sm" variant="ghost" onClick={handlePrevious}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="min-w-[120px] text-center text-base font-semibold">{formatTitle()}</span>
          <Button size="icon-sm" variant="ghost" onClick={handleNext}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <Button size="sm" variant="outline" onClick={handleToday} className="rounded-full">
          등록
        </Button>
      </div>
    </div>
  );
}
