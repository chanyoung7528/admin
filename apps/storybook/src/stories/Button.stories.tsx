import { Button } from '@repo/shared/components/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, ArrowRight, Check, ChevronRight, Download, Edit, Loader2, Mail, Plus, Search, Settings, Trash2, Upload } from 'lucide-react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Button"
          description="다양한 스타일과 크기를 지원하는 버튼 컴포넌트입니다. 아이콘, 로딩 상태 등을 포함할 수 있습니다."
          installationDeps={['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge']}
          implementationCode={`// 기본 Button 컴포넌트 사용
import { Button } from "@components/ui/button";
import { Mail } from "lucide-react";

export default function Example() {
  return (
    <div className="flex gap-2">
      {/* 기본 버튼 */}
      <Button>버튼</Button>
      
      {/* 아이콘과 함께 */}
      <Button>
        <Mail />
        이메일 보내기
      </Button>
      
      {/* 로딩 상태 */}
      <Button disabled>
        <Loader2 className="animate-spin" />
        처리 중...
      </Button>
    </div>
  );
}`}
          exampleCode={`// 실제 사용 예시
function UserActions() {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await saveUser();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" onClick={() => router.back()}>
        취소
      </Button>
      <Button onClick={handleSave} disabled={isLoading}>
        {isLoading && <Loader2 className="animate-spin" />}
        저장
      </Button>
    </div>
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon', 'icon-sm', 'icon-lg'],
    },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * 기본 Button
 */
export const Default: Story = {
  args: {
    variant: 'default',
    size: 'default',
    children: 'Button',
  },
};

// 모든 변형 한눈에 보기
export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button>Default</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="link">Link</Button>
    </div>
  ),
};

// 크기 변형
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button size="sm">Small</Button>
        <Button>Default</Button>
        <Button size="lg">Large</Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="sm" variant="outline">
          Small
        </Button>
        <Button variant="outline">Default</Button>
        <Button size="lg" variant="outline">
          Large
        </Button>
      </div>
    </div>
  ),
};

// 아이콘 버튼
export const IconButtons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button size="icon-sm" variant="outline">
          <Search />
        </Button>
        <Button size="icon">
          <Settings />
        </Button>
        <Button size="icon-lg" variant="secondary">
          <Plus />
        </Button>
      </div>
      <div className="flex items-center gap-3">
        <Button size="icon" variant="outline">
          <Edit />
        </Button>
        <Button size="icon" variant="destructive">
          <Trash2 />
        </Button>
        <Button size="icon" variant="ghost">
          <Download />
        </Button>
      </div>
    </div>
  ),
};

// 아이콘과 텍스트
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button>
          <Mail />
          이메일 보내기
        </Button>
        <Button variant="outline">
          <Download />
          다운로드
        </Button>
        <Button variant="secondary">
          <Plus />
          새로 만들기
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button variant="destructive" size="sm">
          <Trash2 />
          삭제
        </Button>
        <Button variant="ghost" size="sm">
          <Edit />
          수정
        </Button>
        <Button variant="link" size="sm">
          자세히 보기
          <ChevronRight />
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="lg">
          <Upload />
          파일 업로드
        </Button>
        <Button size="lg" variant="outline">
          계속하기
          <ArrowRight />
        </Button>
      </div>
    </div>
  ),
};

// 로딩 상태
export const LoadingStates: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3">
        <Button disabled>
          <Loader2 className="animate-spin" />
          처리 중...
        </Button>
        <Button variant="outline" disabled>
          <Loader2 className="animate-spin" />
          로딩 중
        </Button>
        <Button variant="secondary" disabled>
          <Loader2 className="animate-spin" />
          업로드 중
        </Button>
      </div>
      <div className="flex flex-wrap gap-3">
        <Button size="sm" disabled>
          <Loader2 className="animate-spin" />
          저장 중
        </Button>
        <Button size="icon" disabled>
          <Loader2 className="animate-spin" />
        </Button>
        <Button size="lg" disabled>
          <Loader2 className="animate-spin" />
          데이터 처리 중
        </Button>
      </div>
    </div>
  ),
};

// 비활성화 상태
export const Disabled: Story = {
  render: () => (
    <div className="flex flex-wrap gap-3">
      <Button disabled>비활성화</Button>
      <Button variant="outline" disabled>
        비활성화
      </Button>
      <Button variant="secondary" disabled>
        비활성화
      </Button>
      <Button variant="destructive" disabled>
        비활성화
      </Button>
      <Button variant="ghost" disabled>
        비활성화
      </Button>
    </div>
  ),
};

// 버튼 그룹
export const ButtonGroups: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Button variant="outline">취소</Button>
        <Button>확인</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline">이전</Button>
        <Button variant="outline">다음</Button>
        <Button>완료</Button>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Edit />
          수정
        </Button>
        <Button variant="ghost" size="sm">
          <Download />
          다운로드
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 />
          삭제
        </Button>
      </div>
    </div>
  ),
};

// 전체 너비
export const FullWidth: Story = {
  render: () => (
    <div className="w-96 space-y-3">
      <Button className="w-full">
        <Check />
        전체 너비 버튼
      </Button>
      <Button variant="outline" className="w-full">
        <Download />
        전체 너비 Outline
      </Button>
      <Button variant="secondary" className="w-full">
        전체 너비 Secondary
      </Button>
      <Button variant="destructive" className="w-full">
        <Trash2 />
        전체 너비 Destructive
      </Button>
    </div>
  ),
};

// 실제 사용 예시 - 폼 액션
export const FormActions: Story = {
  render: () => (
    <div className="bg-card w-full max-w-md rounded-lg border p-6 shadow-sm">
      <h3 className="mb-4 text-lg font-semibold">사용자 정보 수정</h3>
      <div className="space-y-4">
        <div>
          <label className="mb-2 block text-sm font-medium">이름</label>
          <input
            type="text"
            className="border-input ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
            placeholder="이름을 입력하세요"
            defaultValue="홍길동"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">이메일</label>
          <input
            type="email"
            className="border-input ring-offset-background focus-visible:border-ring focus-visible:ring-ring/50 w-full rounded-md border bg-transparent px-3 py-2 text-sm shadow-xs outline-none focus-visible:ring-2"
            placeholder="email@example.com"
            defaultValue="hong@example.com"
          />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button variant="outline">취소</Button>
          <Button>
            <Check />
            저장
          </Button>
        </div>
      </div>
    </div>
  ),
};

// 실제 사용 예시 - 카드 액션
export const CardActions: Story = {
  render: () => (
    <div className="bg-card w-full max-w-md rounded-lg border shadow-sm">
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold">어드민 대시보드 프로젝트</h3>
            <p className="text-muted-foreground mt-1 text-sm">Next.js 15와 React 19를 활용한 모던 어드민 시스템</p>
          </div>
          <Button size="icon-sm" variant="ghost">
            <Settings />
          </Button>
        </div>
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>업데이트: 2일 전</span>
          <span>•</span>
          <span>멤버: 5명</span>
        </div>
      </div>
      <div className="flex items-center justify-between border-t p-4">
        <Button variant="ghost" size="sm">
          <Edit />
          수정
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download />
            공유
          </Button>
          <Button size="sm">
            보기
            <ChevronRight />
          </Button>
        </div>
      </div>
    </div>
  ),
};

// 실제 사용 예시 - 위험한 작업
export const DangerousAction: Story = {
  render: () => (
    <div className="border-destructive/50 bg-destructive/10 w-full max-w-md rounded-lg border p-6">
      <div className="mb-4 flex items-start gap-3">
        <div className="bg-destructive/20 rounded-full p-2">
          <AlertCircle className="text-destructive h-5 w-5" />
        </div>
        <div>
          <h3 className="text-destructive font-semibold">계정 영구 삭제</h3>
          <p className="text-destructive/90 mt-1 text-sm">이 작업은 되돌릴 수 없습니다. 모든 데이터가 영구적으로 삭제되며 복구할 수 없습니다.</p>
        </div>
      </div>
      <div className="flex justify-end gap-2">
        <Button variant="outline" size="sm">
          취소
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 />
          영구 삭제
        </Button>
      </div>
    </div>
  ),
};

// 실제 사용 예시 - 대시보드 액션
export const DashboardActions: Story = {
  render: () => (
    <div className="bg-card w-full max-w-2xl space-y-4 rounded-lg border p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">대시보드</h2>
          <p className="text-muted-foreground text-sm">전체 시스템 현황을 한눈에 확인하세요</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download />
            내보내기
          </Button>
          <Button size="sm">
            <Plus />
            새로 만들기
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">총 사용자</p>
          <p className="mt-1 text-2xl font-bold">1,234</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">활성 사용자</p>
          <p className="mt-1 text-2xl font-bold">892</p>
        </div>
        <div className="rounded-lg border p-4">
          <p className="text-muted-foreground text-sm">신규 가입</p>
          <p className="mt-1 text-2xl font-bold">45</p>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="ghost" size="sm">
          <Settings />
          설정
        </Button>
        <Button variant="outline" size="sm">
          새로고침
        </Button>
        <Button size="sm">
          보고서 보기
          <ArrowRight />
        </Button>
      </div>
    </div>
  ),
};
