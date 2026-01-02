import { useState } from 'react';

import { MobileCalendarHeader } from './MobileCalendarHeader';
import { MobileEventSheet } from './MobileEventSheet';
import { MobileMonthView } from './MobileMonthView';
import { MobileWeekView } from './MobileWeekView';

export type MobileViewMode = 'week' | 'month';

export interface MobileCalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
  location?: string;
}

export function MobileCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<MobileViewMode>('week');
  const [events, setEvents] = useState<MobileCalendarEvent[]>([
    {
      id: '1',
      title: 'AI생명공학 현장',
      start: new Date(2025, 0, 8, 9, 0),
      end: new Date(2025, 0, 8, 10, 30),
      color: '#3b82f6',
      description: '경기과학기술대학교 사업재단 창업보육센터 502호',
    },
    {
      id: '2',
      title: '팀 미팅',
      start: new Date(2025, 0, 15, 10, 0),
      end: new Date(2025, 0, 15, 11, 0),
      color: '#10b981',
      description: 'Q1 계획 논의',
      location: '회의실 A',
    },
    {
      id: '3',
      title: '프로젝트 리뷰',
      start: new Date(2025, 0, 17, 14, 0),
      end: new Date(2025, 0, 17, 16, 0),
      color: '#8b5cf6',
      description: '진행 상황 점검',
    },
    {
      id: '4',
      title: '점심 약속',
      start: new Date(2025, 0, 18, 12, 30),
      end: new Date(2025, 0, 18, 13, 30),
      color: '#ec4899',
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<MobileCalendarEvent | null>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleAddEvent = (event: MobileCalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleUpdateEvent = (updatedEvent: MobileCalendarEvent) => {
    setEvents(events.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleEventClick = (event: MobileCalendarEvent) => {
    setSelectedEvent(event);
    setIsSheetOpen(true);
  };

  const handleDateClick = (date: Date) => {
    // 날짜 선택만 하고 Sheet는 열지 않음 (일정 보기 위해)
    setCurrentDate(date);
  };

  const handleAddEventForDate = (date: Date) => {
    // 일정 추가 시에만 Sheet 열기
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <MobileCalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={setCurrentDate}
        onViewModeChange={setViewMode}
        onAddEvent={() => {
          setSelectedEvent(null);
          setSelectedDate(currentDate);
          setIsSheetOpen(true);
        }}
      />

      <div className="flex-1 overflow-auto">
        {viewMode === 'week' && (
          <MobileWeekView
            currentDate={currentDate}
            events={events}
            onEventClick={handleEventClick}
            onDateClick={handleDateClick}
            onAddEventClick={handleAddEventForDate}
          />
        )}
        {viewMode === 'month' && <MobileMonthView currentDate={currentDate} events={events} onEventClick={handleEventClick} onDateClick={handleDateClick} />}
      </div>

      <MobileEventSheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
