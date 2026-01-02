import { Calendar } from '@repo/shared/components/calendar';
import { ContentHeader, ContentWrapper } from '@repo/shared/components/layouts/content';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/calendar-example')({
  component: CalendarExamplePage,
});

function CalendarExamplePage() {
  return (
    <ContentWrapper>
      <ContentHeader title="캘린더 예제" description="주간/월간/일간 뷰를 지원하는 캘린더 컴포넌트입니다. 일정 추가, 수정, 삭제 기능을 테스트해보세요." />
      <div className="h-[calc(100vh-200px)]">
        <Calendar />
      </div>
    </ContentWrapper>
  );
}
