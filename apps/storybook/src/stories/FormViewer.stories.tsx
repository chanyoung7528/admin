import { Button } from '@shared/components/ui/button';
import { FormViewer } from '@shared/components/ui/form/FormViewer';
import type { Meta, StoryObj } from '@storybook/react';
import type { ReactNode } from 'react';

import { CustomDocsPage } from '../components/CustomDocsPage';

interface ViewerField {
  label: string;
  value: string | number | ReactNode;
  span?: number;
  labelPosition?: 'top' | 'left';
  labelWidth?: string;
}

interface ViewerRow {
  fields: ViewerField[];
}

interface FormViewerProps {
  title?: string;
  rows: ViewerRow[];
  className?: string;
}

const meta: Meta<FormViewerProps> = {
  title: 'Forms/FormViewer',
  component: FormViewer,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="FormViewer"
          description="폼 데이터를 읽기 전용으로 표시하는 뷰어 컴포넌트입니다. FormTable을 기반으로 구축되어 일관된 스타일을 제공하며, 다양한 레이아웃과 데이터 타입을 지원합니다."
          installationDeps={['react']}
          implementationCode={`// 기본 FormViewer 사용
import { FormViewer } from '@shared/components/ui/form';

export default function UserProfile() {
  return (
    <FormViewer
      title="사용자 정보"
      rows={[
        {
          fields: [
            { label: '이름', value: '홍길동' },
            { label: '이메일', value: 'hong@example.com' },
          ],
        },
        {
          fields: [
            { label: '전화번호', value: '010-1234-5678' },
            { label: '부서', value: '개발팀' },
          ],
        },
        {
          fields: [
            { 
              label: '주소', 
              value: '서울시 강남구 테헤란로 123', 
              span: 2 
            }
          ],
        },
      ]}
    />
  );
}`}
          exampleCode={`// Badge와 ReactNode 사용
import { FormViewer } from '@shared/components/ui/form';

export default function MenuDetail() {
  return (
    <FormViewer
      title="메뉴 정보"
      rows={[
        {
          fields: [
            { label: '메뉴명', value: '김치찌개' },
            { label: '가격', value: '12,000원' },
          ],
        },
        {
          fields: [
            {
              label: '태그',
              value: (
                <div className="flex flex-wrap gap-2">
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">
                    매운맛
                  </span>
                  <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs">
                    인기메뉴
                  </span>
                </div>
              ),
              span: 2,
            },
          ],
        },
      ]}
    />
  );
}`}
          utilityCode={`// Props 인터페이스
interface FormViewerProps {
  title?: string; // 뷰어 상단 타이틀
  rows: ViewerRow[]; // 표시할 데이터 행
  className?: string;
}

interface ViewerRow {
  fields: ViewerField[]; // 각 행의 필드들
}

interface ViewerField {
  label: string; // 필드 라벨
  value: string | number | ReactNode; // 표시할 값
  span?: number; // colspan 값 (1-12)
  labelPosition?: 'top' | 'left'; // 라벨 위치
  labelWidth?: string; // 라벨 너비 (labelPosition="left"일 때)
}

// 사용 패턴
1. 기본 사용: 2열 그리드로 데이터 표시
2. span 조절: 필드가 차지할 열 수 지정
3. ReactNode: Badge, 이미지 등 커스텀 컴포넌트 표시
4. Row 레이아웃: labelPosition="left"로 라벨 왼쪽 배치
5. 빈 값: 값이 없으면 자동으로 '-' 표시

// 레이아웃 예시
- 2열 레이아웃: 각 필드에 span 지정 안함
- 3열 레이아웃: row에 3개 필드 배치
- 전체 너비: span={2} 또는 span={3} 사용
- 혼합: 각 행마다 다른 컬럼 수 구성 가능`}
        />
      ),
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<FormViewerProps>;

// 컴포넌트 템플릿
function ViewerWithActionsTemplate() {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">주문 상세</h2>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => alert('취소')}>
            취소
          </Button>
          <Button onClick={() => alert('수정')}>수정</Button>
        </div>
      </div>

      <FormViewer
        rows={[
          {
            fields: [
              { label: '주문번호', value: 'ORD-2024-001234' },
              { label: '주문상태', value: '결제완료' },
            ],
          },
          {
            fields: [
              { label: '주문자', value: '홍길동' },
              { label: '결제금액', value: '125,000원' },
              { label: '결제방법', value: '신용카드' },
            ],
          },
          {
            fields: [{ label: '주문 메모', value: '빠른 배송 부탁드립니다.', span: 3 }],
          },
        ]}
      />
    </div>
  );
}

function MultiSectionTemplate() {
  return (
    <div className="space-y-8">
      <FormViewer
        title="기본 정보"
        rows={[
          {
            fields: [
              { label: '회사명', value: '테크 컴퍼니' },
              { label: '대표자', value: '김대표' },
            ],
          },
          {
            fields: [
              { label: '사업자등록번호', value: '123-45-67890' },
              { label: '업종', value: 'IT 서비스' },
            ],
          },
        ]}
      />

      <FormViewer
        title="연락처 정보"
        rows={[
          {
            fields: [
              { label: '대표 전화', value: '02-1234-5678' },
              { label: '팩스', value: '02-1234-5679' },
            ],
          },
          {
            fields: [{ label: '주소', value: '서울시 강남구 테헤란로 123, ABC빌딩 10층', span: 2 }],
          },
        ]}
      />

      <FormViewer
        title="추가 정보"
        rows={[
          {
            fields: [
              { label: '설립일', value: '2020-01-01' },
              { label: '직원수', value: '50명' },
              { label: '자본금', value: '100,000,000원' },
            ],
          },
        ]}
      />
    </div>
  );
}

function RowLayoutTemplate() {
  return (
    <FormViewer
      title="사용자 프로필"
      rows={[
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
      ]}
    />
  );
}

function MixedColRowTemplate() {
  return (
    <FormViewer
      title="회원 정보"
      rows={[
        {
          fields: [
            { label: '회원명', value: '김철수' },
            { label: '회원등급', value: 'VIP' },
          ],
        },
        {
          fields: [{ label: '이메일', value: 'kim@example.com', span: 2, labelPosition: 'left' }],
        },
        {
          fields: [{ label: '휴대폰', value: '010-9876-5432', span: 2, labelPosition: 'left' }],
        },
        {
          fields: [
            { label: '가입일', value: '2024-01-15' },
            { label: '최근 접속', value: '2024-11-28' },
            { label: '포인트', value: '12,500P' },
          ],
        },
      ]}
    />
  );
}

// 기본 예제 - 사용자 정보
export const UserInfo: Story = {
  args: {
    title: '사용자 정보',
    rows: [
      {
        fields: [
          { label: '이름', value: '홍길동' },
          { label: '이메일', value: 'hong@example.com' },
        ],
      },
      {
        fields: [
          { label: '전화번호', value: '010-1234-5678' },
          { label: '부서', value: '개발팀' },
        ],
      },
      {
        fields: [{ label: '주소', value: '서울시 강남구 테헤란로 123', span: 2 }],
      },
    ],
  },
};

// 상품 정보
export const ProductInfo: Story = {
  args: {
    title: '상품 상세 정보',
    rows: [
      {
        fields: [
          { label: '상품명', value: '무선 마우스' },
          { label: '카테고리', value: '전자제품 > 컴퓨터 주변기기' },
        ],
      },
      {
        fields: [
          { label: '가격', value: '29,900원' },
          { label: '재고', value: '152개' },
          { label: '상태', value: '판매중' },
        ],
      },
      {
        fields: [
          {
            label: '상품 설명',
            value: '인체공학적 디자인의 무선 마우스입니다.\n조용한 클릭음과 정확한 센서로 편안한 사용이 가능합니다.',
            span: 3,
          },
        ],
      },
    ],
  },
};

// Badge와 함께 사용
export const WithBadges: Story = {
  args: {
    title: '메뉴 정보',
    rows: [
      {
        fields: [
          { label: '메뉴명', value: '김치찌개' },
          { label: '카테고리', value: '한식' },
        ],
      },
      {
        fields: [
          { label: '가격', value: '12,000원' },
          { label: '조리시간', value: '20분' },
          { label: '칼로리', value: '450kcal' },
        ],
      },
      {
        fields: [
          {
            label: '태그',
            value: (
              <div className="flex flex-wrap gap-2">
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">매운맛</span>
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">인기메뉴</span>
                <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-xs font-medium">추천</span>
              </div>
            ),
            span: 3,
          },
        ],
      },
      {
        fields: [
          {
            label: '알레르기 정보',
            value: (
              <div className="flex flex-wrap gap-2">
                <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">돼지고기</span>
                <span className="bg-destructive/10 text-destructive rounded-full px-3 py-1 text-xs font-medium">대두</span>
              </div>
            ),
            span: 3,
          },
        ],
      },
    ],
  },
};

// 3열 레이아웃
export const ThreeColumns: Story = {
  args: {
    title: '배송 정보',
    rows: [
      {
        fields: [
          { label: '주문번호', value: 'ORD-2024-001234' },
          { label: '주문일시', value: '2024-11-28 14:30' },
          { label: '배송상태', value: '배송중' },
        ],
      },
      {
        fields: [
          { label: '수령인', value: '김철수' },
          { label: '연락처', value: '010-9876-5432' },
          { label: '배송비', value: '3,000원' },
        ],
      },
      {
        fields: [{ label: '배송 주소', value: '서울시 송파구 올림픽로 300, 101동 1202호', span: 3 }],
      },
    ],
  },
};

// 위 3개, 아래 2개 레이아웃
export const ThreeThenTwo: Story = {
  args: {
    title: '상품 스펙',
    rows: [
      {
        fields: [
          { label: 'CPU', value: 'Intel Core i7-12700K' },
          { label: 'RAM', value: '32GB DDR5' },
          { label: 'Storage', value: '1TB NVMe SSD' },
        ],
      },
      {
        fields: [
          { label: 'GPU', value: 'NVIDIA RTX 4070' },
          { label: '전원', value: '750W 80+ Gold' },
        ],
      },
      {
        fields: [{ label: '추가 정보', value: '3년 무상 A/S 제공\n게이밍 및 영상 편집에 최적화된 고성능 시스템', span: 3 }],
      },
    ],
  },
};

// 위 2개, 아래 3개 레이아웃
export const TwoThenThree: Story = {
  args: {
    title: '결제 정보',
    rows: [
      {
        fields: [
          { label: '결제 방법', value: '신용카드' },
          { label: '카드사', value: '신한카드' },
        ],
      },
      {
        fields: [
          { label: '카드번호', value: '**** **** **** 1234' },
          { label: '할부', value: '일시불' },
          { label: '결제금액', value: '125,000원' },
        ],
      },
      {
        fields: [{ label: '영수증 메모', value: '사업자 지출증빙 필요', span: 3 }],
      },
    ],
  },
};

// 혼합 레이아웃
export const MixedLayout: Story = {
  args: {
    title: '프로젝트 정보',
    rows: [
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
    ],
  },
};

// 버튼과 함께 사용
export const WithActions: Story = {
  render: () => <ViewerWithActionsTemplate />,
};

// 섹션으로 나눈 뷰어
export const MultiSection: Story = {
  render: () => <MultiSectionTemplate />,
};

// 빈 값 처리
export const WithEmptyValues: Story = {
  args: {
    title: '정보 조회',
    rows: [
      {
        fields: [
          { label: '이름', value: '홍길동' },
          { label: '닉네임', value: '' },
        ],
      },
      {
        fields: [
          { label: '이메일', value: 'hong@example.com' },
          { label: '전화번호', value: '' },
          { label: '팩스', value: '' },
        ],
      },
    ],
  },
};

// Row 형태 레이아웃 (Label이 왼쪽)
export const RowLayout: Story = {
  render: () => <RowLayoutTemplate />,
};

// 혼합 레이아웃 (Col + Row)
export const MixedColRow: Story = {
  render: () => <MixedColRowTemplate />,
};
