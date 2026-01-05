import { MobileCalendar } from '@repo/shared/components/calendar';
import { ContentHeader, ContentWrapper } from '@repo/shared/components/layouts/content';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/mobile-calendar-example')({
  component: MobileCalendarExamplePage,
});

function MobileCalendarExamplePage() {
  return (
    <ContentWrapper>
      <ContentHeader
        title="모바일 캘린더 예제"
        description="모바일에 최적화된 주간/월간 캘린더 컴포넌트입니다. Sheet UI를 사용한 일정 관리를 테스트해보세요."
      />
      <div className="mx-auto h-[calc(100vh-200px)] max-w-md overflow-hidden rounded-lg border border-gray-200 shadow-lg">
        <MobileCalendar />
      </div>
    </ContentWrapper>
  );
}
