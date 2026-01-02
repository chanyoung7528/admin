import { useState } from 'react';

import { CalendarHeader } from './CalendarHeader';
import { DayView } from './DayView';
import { EventDialog } from './EventDialog';
import { MonthView } from './MonthView';
import { WeekView } from './WeekView';

export type ViewMode = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color: string;
  description?: string;
  location?: string;
}

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [events, setEvents] = useState<CalendarEvent[]>([
    {
      id: '1',
      title: '팀 미팅',
      start: new Date(2025, 0, 15, 10, 0),
      end: new Date(2025, 0, 15, 11, 0),
      color: '#3b82f6',
      description: 'Q1 계획 논의',
      location: '회의실 A',
    },
    {
      id: '2',
      title: '프로젝트 리뷰',
      start: new Date(2025, 0, 17, 14, 0),
      end: new Date(2025, 0, 17, 16, 0),
      color: '#8b5cf6',
      description: '진행 상황 점검',
    },
    {
      id: '3',
      title: '점심 약속',
      start: new Date(2025, 0, 18, 12, 30),
      end: new Date(2025, 0, 18, 13, 30),
      color: '#ec4899',
    },
  ]);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleAddEvent = (event: CalendarEvent) => {
    setEvents([...events, event]);
  };

  const handleUpdateEvent = (updatedEvent: CalendarEvent) => {
    setEvents(events.map(e => (e.id === updatedEvent.id ? updatedEvent : e)));
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(e => e.id !== eventId));
  };

  const handleEventClick = (event: CalendarEvent) => {
    setSelectedEvent(event);
    setIsDialogOpen(true);
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    setSelectedEvent(null);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedEvent(null);
    setSelectedDate(null);
  };

  return (
    <div className="flex h-screen flex-col bg-gray-50">
      <CalendarHeader
        currentDate={currentDate}
        viewMode={viewMode}
        onDateChange={setCurrentDate}
        onViewModeChange={setViewMode}
        onAddEvent={() => {
          setSelectedEvent(null);
          setSelectedDate(currentDate);
          setIsDialogOpen(true);
        }}
      />

      <div className="flex-1 overflow-auto">
        {viewMode === 'month' && <MonthView currentDate={currentDate} events={events} onEventClick={handleEventClick} onDateClick={handleDateClick} />}
        {viewMode === 'week' && <WeekView currentDate={currentDate} events={events} onEventClick={handleEventClick} onDateClick={handleDateClick} />}
        {viewMode === 'day' && <DayView currentDate={currentDate} events={events} onEventClick={handleEventClick} />}
      </div>

      <EventDialog
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
        event={selectedEvent}
        selectedDate={selectedDate}
        onSave={selectedEvent ? handleUpdateEvent : handleAddEvent}
        onDelete={handleDeleteEvent}
      />
    </div>
  );
}
