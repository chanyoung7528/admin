import type { MobileCalendarEvent } from './MobileCalendar';

interface MobileWeekViewProps {
  currentDate: Date;
  events: MobileCalendarEvent[];
  onEventClick: (event: MobileCalendarEvent) => void;
  onDateClick: (date: Date) => void;
  onAddEventClick?: (date: Date) => void;
}

export function MobileWeekView({ currentDate, events, onEventClick, onDateClick, onAddEventClick }: MobileWeekViewProps) {
  const getWeekDates = () => {
    const dates = [];
    const current = new Date(currentDate);
    // 주의 시작 (일요일)
    const startOfWeek = new Date(current);
    startOfWeek.setDate(current.getDate() - current.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(startOfWeek);
      date.setDate(startOfWeek.getDate() + i);
      dates.push(date);
    }

    return dates;
  };

  const weekDates = getWeekDates();
  const weekDays = ['일', '월', '화', '수', '목', '금', '토'];

  const isToday = (date: Date) => {
    const today = new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
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

  const getTodayCalories = () => {
    // 오늘의 칼로리 데이터 (샘플)
    return {
      current: 0,
      target: 0,
      carbs: 0,
      protein: 0,
      fat: 0,
    };
  };

  const todayCalories = getTodayCalories();

  return (
    <div className="bg-white">
      {/* 주간 캘린더 헤더 - 스크롤 스냅 적용 */}
      <div className="snap-x snap-mandatory overflow-x-auto scroll-smooth border-b">
        <div className="flex min-w-fit">
          {weekDates.map((date, index) => {
            const dateEvents = getEventsForDate(date);
            const hasEvent = dateEvents.length > 0;

            return (
              <button
                key={index}
                onClick={() => onDateClick(date)}
                className={`relative flex min-w-[14.28%] snap-start flex-col items-center py-3 transition-colors ${
                  isSelected(date) ? 'bg-blue-500 text-white' : isToday(date) ? 'bg-blue-50' : 'hover:bg-gray-50'
                }`}
              >
                <span className={`text-xs ${isSelected(date) ? 'text-white' : 'text-gray-500'}`}>{weekDays[index]}</span>
                <span className={`mt-1 text-lg font-semibold ${isSelected(date) ? 'text-white' : isToday(date) ? 'text-blue-600' : 'text-gray-900'}`}>
                  {date.getDate()}
                </span>
                {hasEvent && !isSelected(date) && (
                  <div className="absolute bottom-1.5 flex gap-0.5">
                    {dateEvents.slice(0, 3).map((event, i) => (
                      <div key={i} className="h-1 w-1 rounded-full" style={{ backgroundColor: event.color }} />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 이벤트 리스트 */}
      <div className="p-4">
        <div className="mb-4 flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-blue-500" />
          <span className="text-sm font-medium text-gray-700">
            {currentDate.getMonth() + 1}월 {currentDate.getDate()}일
          </span>
        </div>

        <div className="space-y-3">
          {getEventsForDate(currentDate).map(event => (
            <button
              key={event.id}
              onClick={() => onEventClick(event)}
              className="w-full rounded-lg bg-blue-500 p-4 text-left transition-opacity hover:opacity-90"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="text-xs text-white/80">AI 아이콘</span>
                    <span className="text-sm font-semibold text-white">{event.title}</span>
                  </div>
                  {event.description && <p className="text-xs text-white/90">{event.description}</p>}
                </div>
              </div>
            </button>
          ))}
        </div>

        {getEventsForDate(currentDate).length === 0 && (
          <button
            onClick={() => onAddEventClick?.(currentDate)}
            className="w-full rounded-lg border-2 border-dashed border-gray-300 py-12 text-center transition-colors hover:border-blue-400 hover:bg-blue-50"
          >
            <p className="text-sm text-gray-500">등록된 일정이 없습니다.</p>
            <p className="mt-1 text-xs text-gray-400">클릭하여 일정을 추가하세요.</p>
          </button>
        )}
      </div>

      {/* 오늘의 섭취 칼로리 */}
      <div className="border-t p-4">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">오늘의 섭취 칼로리</h3>
        <div className="mb-4 flex items-center justify-center">
          <div className="text-center">
            <div className="text-3xl font-bold text-gray-900">{todayCalories.current}</div>
            <div className="text-sm text-gray-500">kcal</div>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div>
            <div className="text-xs text-gray-500">탄수화물</div>
            <div className="mt-1 text-sm font-medium text-gray-900">{todayCalories.carbs}g</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">단백질</div>
            <div className="mt-1 text-sm font-medium text-gray-900">{todayCalories.protein}g</div>
          </div>
          <div>
            <div className="text-xs text-gray-500">지방</div>
            <div className="mt-1 text-sm font-medium text-gray-900">{todayCalories.fat}g</div>
          </div>
        </div>
      </div>
    </div>
  );
}
