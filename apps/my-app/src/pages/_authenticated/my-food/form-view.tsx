import { FormViewer, type ViewerRow } from '@shared/components/form/FormViewer';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/my-food/form-view')({
  component: RouteComponent,
});
const rows: ViewerRow[] = [
  {
    fields: [
      { label: '프로젝트명', value: '관리자 대시보드 개발' },
      { label: '담당자', value: '김개발' },
    ],
  },
  {
    fields: [
      { label: '시작일', value: '2024-01-01' },
      { label: '종료일', value: '2024-12-31' },
      { label: '진행률', value: '75%' },
    ],
  },
  {
    fields: [
      {
        label: '프로젝트 설명',
        value: `관리자 페이지 전면 리뉴얼 프로젝트

• React 19 + Next.js 15 기반 구축
• TypeScript 전환
• 반응형 디자인 적용
• 성능 최적화`,
        span: 3,
      },
    ],
  },
  {
    fields: [
      { label: '참여 인원', value: '5명' },
      { label: '예산', value: '50,000,000원' },
    ],
  },
];

const rows2: ViewerRow[] = [
  {
    fields: [{ label: '이름', value: '홍길동', span: 2, labelPosition: 'left' }],
  },
  {
    fields: [{ label: '이메일', value: 'hong@example.com', span: 2, labelPosition: 'left' }],
  },
  {
    fields: [{ label: '전화번호', value: '010-1234-5678', span: 2, labelPosition: 'left' }],
  },
  {
    fields: [{ label: '주소', value: '서울시 강남구 테헤란로 123', span: 2, labelPosition: 'left' }],
  },
];

function RouteComponent() {
  return (
    <div className="flex flex-col gap-4 p-4">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-bold">MY FOOD 폼 조회</h1>
        <p className="text-muted-foreground text-sm">MY FOOD 폼 조회 - Table 기반 재사용 컴포넌트 예제</p>
      </div>

      <FormViewer title="주문 상세" rows={rows} />

      <FormViewer title="사용자 정보" rows={rows2} />
    </div>
  );
}
