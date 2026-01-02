import type { MobileCalendarEvent } from './MobileCalendar';

interface MobileMonthViewProps {
  currentDate: Date;
  events: MobileCalendarEvent[];
  onEventClick: (event: MobileCalendarEvent) => void;
  onDateClick: (date: Date) => void;
}

export function MobileMonthView({ currentDate, events, onEventClick, onDateClick }: MobileMonthViewProps) {
  const getMonthDates = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - startDate.getDay());

    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const dates = [];
    const current = new Date(startDate);

    while (current <= endDate) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return dates;
  };

  const monthDates = getMonthDates();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentDate.getMonth();
  };

  const isSelected = (date: Date) => {
    return date.getDate() === currentDate.getDate() && date.getMonth() === currentDate.getMonth() && date.getFullYear() === currentDate.getFullYear();
  };

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return eventDate.getDate() === date.getDate() && eventDate.getMonth() === date.getMonth() && eventDate.getFullYear() === date.getFullYear();
    });
  };

  return (
    <div className="bg-white">
      {/* 요일 헤더 */}
      <div className="grid grid-cols-7 border-b bg-gray-50">
        {weekDays.map((day, index) => (
          <div key={index} className="py-2 text-center text-xs font-medium text-gray-600">
            {day}
          </div>
        ))}
      </div>

      {/* 월간 캘린더 그리드 */}
      <div className="grid grid-cols-7">
        {monthDates.map((date, index) => {
          const dateEvents = getEventsForDate(date);
          const hasEvent = dateEvents.length > 0;

          return (
            <button
              key={index}
              onClick={() => onDateClick(date)}
              className={`relative aspect-square border-r border-b p-1 transition-colors ${
                isSelected(date)
                  ? 'bg-blue-500 text-white'
                  : isToday(date)
                    ? 'bg-blue-50'
                    : isCurrentMonth(date)
                      ? 'hover:bg-gray-50'
                      : 'bg-gray-50/50 text-gray-400 hover:bg-gray-100'
              } ${index % 7 === 6 ? 'border-r-0' : ''}`}
            >
              <div className="flex h-full flex-col">
                <span
                  className={`text-sm ${
                    isSelected(date)
                      ? 'font-semibold text-white'
                      : isToday(date)
                        ? 'font-semibold text-blue-600'
                        : isCurrentMonth(date)
                          ? 'text-gray-900'
                          : 'text-gray-400'
                  }`}
                >
                  {date.getDate()}
                </span>

                {/* 이벤트 인디케이터 */}
                {hasEvent && (
                  <div className="mt-1 flex flex-col gap-0.5">
                    {dateEvents.slice(0, 3).map((event, i) => (
                      <div
                        key={i}
                        onClick={e => {
                          e.stopPropagation();
                          onEventClick(event);
                        }}
                        className="truncate rounded px-1 py-0.5 text-xs font-medium text-white"
                        style={{ backgroundColor: event.color }}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dateEvents.length > 3 && <div className="px-1 text-xs text-gray-500">+{dateEvents.length - 3}</div>}
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* 하단 정보 */}
      <div className="border-t p-4">
        <div className="text-center">
          <p className="text-sm text-gray-600">등록된 일정이 {events.filter(e => e.start.getMonth() === currentDate.getMonth()).length}개 있습니다.</p>
          <p className="mt-1 text-xs text-gray-400">날짜를 클릭하여 일정을 추가하세요.</p>
        </div>

        {/* 범례 */}
        <div className="mt-4 flex items-center justify-center gap-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-blue-500" />
            <span className="text-gray-600">일정</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-green-500" />
            <span className="text-gray-600">미팅</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-purple-500" />
            <span className="text-gray-600">리뷰</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="h-3 w-3 rounded-full bg-pink-500" />
            <span className="text-gray-600">개인</span>
          </div>
        </div>
      </div>
    </div>
  );
}
