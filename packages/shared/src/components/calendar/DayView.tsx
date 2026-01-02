import { format, isSameDay } from 'date-fns';
import { ko } from 'date-fns/locale';

import type { CalendarEvent } from './Calendar';

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
}

export function DayView({ currentDate, events, onEventClick }: DayViewProps) {
  const hours = Array.from({ length: 24 }, (_, i) => i);

  const dayEvents = events.filter(event => isSameDay(event.start, currentDate));

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();

    const top = (startHour + startMinute / 60) * 80;
    const height = (endHour - startHour + (endMinute - startMinute) / 60) * 80;

    return { top, height };
  };

  return (
    <div className="flex h-full flex-col p-6">
      {/* Day header */}
      <div className="mb-4 rounded-lg bg-white p-6 shadow-sm">
        <div className="text-sm font-medium text-gray-600">{format(currentDate, 'yyyy년 M월', { locale: ko })}</div>
        <div className="mt-1 text-3xl font-bold text-gray-900">{format(currentDate, 'd일 EEEE', { locale: ko })}</div>
      </div>

      {/* Day grid */}
      <div className="flex-1 overflow-auto rounded-lg bg-white shadow-sm">
        <div className="relative">
          {hours.map(hour => (
            <div key={hour} className="flex cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50">
              <div className="w-20 flex-shrink-0 px-4 py-2 text-right text-sm text-gray-500">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
              <div className="relative h-[80px] flex-1" />
            </div>
          ))}

          {/* Events overlay */}
          <div className="absolute top-0 right-0 left-20" style={{ height: '100%' }}>
            {dayEvents.map(event => {
              const { top, height } = getEventPosition(event);
              return (
                <div
                  key={event.id}
                  onClick={() => onEventClick(event)}
                  className="absolute right-4 left-4 cursor-pointer rounded-lg px-4 py-3 shadow-md transition-opacity hover:opacity-90"
                  style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    backgroundColor: event.color,
                    color: 'white',
                    zIndex: 10,
                  }}
                >
                  <div className="font-semibold">{event.title}</div>
                  <div className="mt-1 text-sm opacity-90">
                    {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                  </div>
                  {event.location && <div className="mt-1 text-sm opacity-90">📍 {event.location}</div>}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
