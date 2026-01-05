import { addMinutes, eachDayOfInterval, endOfWeek, format, isSameDay, isToday, startOfWeek } from 'date-fns';
import { ko } from 'date-fns/locale';

import type { CalendarEvent } from './Calendar';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onEventClick: (event: CalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export function WeekView({ currentDate, events, onEventClick, onDateClick }: WeekViewProps) {
  const weekStart = startOfWeek(currentDate, { locale: ko });
  const weekEnd = endOfWeek(currentDate, { locale: ko });
  const days = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const getEventsForDay = (day: Date) => {
    return events.filter(event => isSameDay(event.start, day));
  };

  const getEventPosition = (event: CalendarEvent) => {
    const startHour = event.start.getHours();
    const startMinute = event.start.getMinutes();
    const endHour = event.end.getHours();
    const endMinute = event.end.getMinutes();

    const top = (startHour + startMinute / 60) * 60;
    const height = (endHour - startHour + (endMinute - startMinute) / 60) * 60;

    return { top, height };
  };

  return (
    <div className="flex h-full flex-col p-6">
      {/* Week header */}
      <div className="mb-4 overflow-hidden rounded-lg bg-gray-200">
        <div className="flex">
          <div className="w-16 shrink-0 bg-white p-4" />
          <div className="flex-1 snap-x snap-mandatory overflow-x-auto scroll-smooth">
            <div className="flex min-w-fit gap-px">
              {days.map((day, index) => {
                const isDayToday = isToday(day);
                return (
                  <div key={day.toISOString()} className="min-w-[160px] snap-start bg-white p-4 text-center transition-colors hover:bg-gray-50">
                    <div className={`text-sm font-medium ${index === 0 ? 'text-red-600' : index === 6 ? 'text-blue-600' : 'text-gray-600'}`}>
                      {format(day, 'EEE', { locale: ko })}
                    </div>
                    <div
                      className={`mt-1 inline-flex h-8 w-8 items-center justify-center rounded-full ${
                        isDayToday ? 'bg-blue-600 font-semibold text-white' : 'text-gray-900'
                      }`}
                    >
                      {format(day, 'd')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Week grid */}
      <div className="flex-1 overflow-auto rounded-lg bg-gray-200">
        <div className="flex h-full">
          {/* Time column */}
          <div className="w-16 shrink-0 bg-white">
            {hours.map(hour => (
              <div key={hour} className="h-[60px] border-b border-gray-100 px-2 py-1 text-right text-xs text-gray-500">
                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour - 12} PM`}
              </div>
            ))}
          </div>

          {/* Day columns */}
          <div className="flex-1 snap-x snap-mandatory overflow-x-auto overflow-y-hidden scroll-smooth">
            <div className="flex min-w-fit gap-px">
              {days.map(day => {
                const dayEvents = getEventsForDay(day);
                return (
                  <div key={day.toISOString()} className="relative min-w-[160px] snap-start bg-white">
                    {hours.map(hour => (
                      <div
                        key={hour}
                        className="h-[60px] cursor-pointer border-b border-gray-100 transition-colors hover:bg-blue-50"
                        onClick={() => onDateClick(addMinutes(day, hour * 60))}
                      />
                    ))}

                    {/* Events overlay */}
                    {dayEvents.map(event => {
                      const { top, height } = getEventPosition(event);
                      return (
                        <div
                          key={event.id}
                          onClick={e => {
                            e.stopPropagation();
                            onEventClick(event);
                          }}
                          className="absolute right-1 left-1 cursor-pointer overflow-hidden rounded-md px-2 py-1 transition-opacity hover:opacity-90"
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            backgroundColor: event.color,
                            color: 'white',
                            zIndex: 10,
                          }}
                        >
                          <div className="truncate text-xs font-semibold">{event.title}</div>
                          <div className="text-xs opacity-90">
                            {format(event.start, 'HH:mm')} - {format(event.end, 'HH:mm')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
