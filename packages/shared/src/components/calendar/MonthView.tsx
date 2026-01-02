import { eachDayOfInterval, endOfMonth, endOfWeek, format, isSameDay, isSameMonth, isToday, startOfMonth, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

import type { CalendarEvent } from './Calendar';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export function MonthView({ currentDate, events, onEventClick, onDateClick }: MonthViewProps) {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: ko });
  const calendarEnd = endOfWeek(monthEnd, { locale: ko });

  const days = eachDayOfInterval({ start: calendarStart, end: calendarEnd });
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.start, day)).sort((a, b) => a.start.getTime() - b.start.getTime());
  };

  return (
    <div className="flex h-full flex-col p-6">
      {/* Week day headers */}
      <div className="mb-px grid grid-cols-7 gap-px overflow-hidden rounded-t-lg bg-gray-200">
        {weekDays.map((day, index) => (
          <div
            key={day}
            className={`bg-white py-3 text-center text-sm font-semibold ${index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-700'}`}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid flex-1 grid-cols-7 gap-px overflow-hidden rounded-b-lg bg-gray-200">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isDayToday = isToday(day);

          return (
            <div
              key={day.toISOString()}
              onClick={() => onDateClick(day)}
              className={`min-h-[120px] cursor-pointer bg-white p-2 transition-colors hover:bg-gray-50 ${!isCurrentMonth ? 'opacity-40' : ''}`}
            >
              <div className="mb-1 flex items-center justify-between">
                <span
                  className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-sm ${
                    isDayToday ? 'bg-blue-600 font-semibold text-white' : index % 7 === 0 ? 'text-red-600' : index % 7 === 6 ? 'text-blue-600' : 'text-gray-700'
                  }`}
                >
                  {format(day, 'd')}
                </span>
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 3).map(event => (
                  <div
                    key={event.id}
                    onClick={e => {
                      e.stopPropagation();
                      onEventClick(event);
                    }}
                    className="cursor-pointer truncate rounded px-2 py-1 text-xs font-medium transition-opacity hover:opacity-80"
                    style={{
                      backgroundColor: event.color + '20',
                      color: event.color,
                      borderLeft: `3px solid ${event.color}`,
                    }}
                  >
                    {format(event.start, 'HH:mm')} {event.title}
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="px-2 text-xs font-medium text-gray-500">+{dayEvents.length - 3}개 더보기</div>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
