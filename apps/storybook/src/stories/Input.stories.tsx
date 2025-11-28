import { Input } from '@repo/shared/components/ui';
import type { Meta, StoryObj } from '@storybook/react';
import { AlertCircle, Check, DollarSign, Eye, EyeOff, Lock, Mail, Phone, Search, User } from 'lucide-react';
import { useState } from 'react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'UI Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="Input"
          description="텍스트 입력을 위한 기본 Input 컴포넌트입니다. 다양한 타입과 아이콘을 지원합니다."
          installationDeps={['clsx', 'tailwind-merge']}
          implementationCode={`import { Input } from "@components/ui/input";

export default function Example() {
  return (
    <div className="space-y-4">
      <Input type="text" placeholder="이름을 입력하세요" />
      <Input type="email" placeholder="email@example.com" />
      <Input type="password" placeholder="비밀번호" />
    </div>
  );
}`}
          exampleCode={`// 라벨과 함께 사용
function FormField() {
  return (
    <div className="space-y-2">
      <label htmlFor="email" className="text-sm font-medium">
        이메일
      </label>
      <Input
        id="email"
        type="email"
        placeholder="email@example.com"
      />
      <p className="text-xs text-muted-foreground">
        알림을 받을 이메일 주소를 입력하세요
      </p>
    </div>
  );
}

// 아이콘과 함께 사용
function SearchInput() {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder="검색..."
        className="pl-9"
      />
    </div>
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url', 'search'],
    },
    placeholder: {
      control: 'text',
    },
    disabled: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 입력
export const Default: Story = {
  args: {
    placeholder: '텍스트를 입력하세요',
  },
};

// 다양한 타입
export const Types: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Input type="text" placeholder="텍스트 입력" />
      <Input type="email" placeholder="email@example.com" />
      <Input type="password" placeholder="비밀번호" />
      <Input type="number" placeholder="숫자 입력" />
      <Input type="tel" placeholder="전화번호" />
      <Input type="url" placeholder="https://example.com" />
      <Input type="search" placeholder="검색..." />
      <Input type="date" />
    </div>
  ),
};

// 라벨과 함께
export const WithLabels: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <label htmlFor="name" className="text-sm font-medium">
          이름
        </label>
        <Input id="name" type="text" placeholder="홍길동" />
      </div>

      <div className="space-y-2">
        <label htmlFor="email" className="text-sm font-medium">
          이메일
        </label>
        <Input id="email" type="email" placeholder="email@example.com" />
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          전화번호
        </label>
        <Input id="phone" type="tel" placeholder="010-1234-5678" />
      </div>
    </div>
  ),
};

// 설명 텍스트와 함께
export const WithDescription: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <label htmlFor="username" className="text-sm font-medium">
          사용자명
        </label>
        <Input id="username" type="text" placeholder="username" />
        <p className="text-muted-foreground text-xs">4-20자의 영문, 숫자만 사용 가능합니다</p>
      </div>

      <div className="space-y-2">
        <label htmlFor="email-sub" className="text-sm font-medium">
          이메일
        </label>
        <Input id="email-sub" type="email" placeholder="email@example.com" />
        <p className="text-muted-foreground text-xs">알림을 받을 이메일 주소를 입력하세요</p>
      </div>
    </div>
  ),
};

// 아이콘과 함께
export const WithIcons: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">이메일</label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="email" placeholder="email@example.com" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">비밀번호</label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="password" placeholder="••••••••" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">검색</label>
        <div className="relative">
          <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="search" placeholder="검색어를 입력하세요" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">사용자명</label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="text" placeholder="username" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">전화번호</label>
        <div className="relative">
          <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="tel" placeholder="010-1234-5678" className="pl-9" />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">금액</label>
        <div className="relative">
          <DollarSign className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="number" placeholder="0" className="pl-9" />
        </div>
      </div>
    </div>
  ),
};

// 비밀번호 보기/숨기기
export const PasswordToggle: Story = {
  render: function PasswordToggleExample() {
    const [showPassword, setShowPassword] = useState(false);

    return (
      <div className="w-80 space-y-2">
        <label className="text-sm font-medium">비밀번호</label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="pr-9 pl-9" />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  },
};

// 에러 상태
export const WithError: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <div className="space-y-2">
        <label htmlFor="error-email" className="text-sm font-medium">
          이메일
        </label>
        <Input id="error-email" type="email" placeholder="email@example.com" aria-invalid="true" defaultValue="invalid-email" />
        <p className="text-destructive flex items-center gap-1 text-xs">
          <AlertCircle className="h-3 w-3" />
          유효한 이메일 주소를 입력하세요
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="error-password" className="text-sm font-medium">
          비밀번호
        </label>
        <Input id="error-password" type="password" placeholder="••••••••" aria-invalid="true" defaultValue="123" />
        <p className="text-destructive flex items-center gap-1 text-xs">
          <AlertCircle className="h-3 w-3" />
          비밀번호는 최소 8자 이상이어야 합니다
        </p>
      </div>
    </div>
  ),
};

// 성공 상태
export const WithSuccess: Story = {
  render: () => (
    <div className="w-80 space-y-2">
      <label htmlFor="success-email" className="text-sm font-medium">
        이메일
      </label>
      <div className="relative">
        <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
        <Input id="success-email" type="email" placeholder="email@example.com" className="pr-9 pl-9" defaultValue="user@example.com" />
        <Check className="absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-green-600" />
      </div>
      <p className="flex items-center gap-1 text-xs text-green-600">
        <Check className="h-3 w-3" />
        사용 가능한 이메일입니다
      </p>
    </div>
  ),
};

// 비활성화
export const Disabled: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Input type="text" placeholder="비활성화된 입력" disabled />
      <Input type="text" placeholder="값이 있는 비활성화" defaultValue="읽기 전용 값" disabled />
      <div className="space-y-2">
        <label className="text-muted-foreground text-sm font-medium">비활성화된 필드</label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
          <Input type="email" placeholder="email@example.com" className="pl-9" disabled />
        </div>
      </div>
    </div>
  ),
};

// 크기 변형
export const Sizes: Story = {
  render: () => (
    <div className="w-80 space-y-4">
      <Input type="text" placeholder="Small" className="h-8 text-xs" />
      <Input type="text" placeholder="Default (h-9)" />
      <Input type="text" placeholder="Large" className="h-11" />
    </div>
  ),
};

// 로그인 폼 예시
export const LoginForm: Story = {
  render: () => (
    <div className="bg-card w-full max-w-sm rounded-lg border p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold">로그인</h2>
        <p className="text-muted-foreground mt-2 text-sm">계정에 로그인하세요</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="login-email" className="text-sm font-medium">
            이메일
          </label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input id="login-email" type="email" placeholder="email@example.com" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="login-password" className="text-sm font-medium">
            비밀번호
          </label>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input id="login-password" type="password" placeholder="••••••••" className="pl-9" />
          </div>
        </div>

        <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium">로그인</button>

        <div className="text-center">
          <a href="#" className="text-muted-foreground text-xs hover:underline">
            비밀번호를 잊으셨나요?
          </a>
        </div>
      </div>
    </div>
  ),
};

// 회원가입 폼 예시
export const SignupForm: Story = {
  render: () => (
    <div className="bg-card w-full max-w-md rounded-lg border p-6 shadow-sm">
      <div className="mb-6">
        <h2 className="text-2xl font-bold">회원가입</h2>
        <p className="text-muted-foreground mt-2 text-sm">새 계정을 만들어보세요</p>
      </div>

      <div className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label htmlFor="first-name" className="text-sm font-medium">
              이름
            </label>
            <Input id="first-name" type="text" placeholder="홍" />
          </div>
          <div className="space-y-2">
            <label htmlFor="last-name" className="text-sm font-medium">
              성
            </label>
            <Input id="last-name" type="text" placeholder="길동" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="signup-email" className="text-sm font-medium">
            이메일
          </label>
          <div className="relative">
            <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input id="signup-email" type="email" placeholder="email@example.com" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="signup-phone" className="text-sm font-medium">
            전화번호
          </label>
          <div className="relative">
            <Phone className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input id="signup-phone" type="tel" placeholder="010-1234-5678" className="pl-9" />
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="signup-password" className="text-sm font-medium">
            비밀번호
          </label>
          <div className="relative">
            <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
            <Input id="signup-password" type="password" placeholder="••••••••" className="pl-9" />
          </div>
          <p className="text-muted-foreground text-xs">최소 8자 이상, 영문/숫자/특수문자 포함</p>
        </div>

        <button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full rounded-md px-4 py-2 text-sm font-medium">가입하기</button>
      </div>
    </div>
  ),
};

// 검색 입력 예시
export const SearchBar: Story = {
  render: () => (
    <div className="w-full max-w-2xl space-y-4">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2" />
        <Input type="search" placeholder="사용자, 주문, 제품 검색..." className="h-11 pr-4 pl-10" />
      </div>

      <div className="space-y-2">
        <p className="text-muted-foreground text-sm">빠른 검색</p>
        <div className="flex flex-wrap gap-2">
          {['최근 주문', '활성 사용자', '신규 가입', '매출 보고서'].map(tag => (
            <button key={tag} className="hover:bg-accent rounded-full border px-3 py-1 text-xs">
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  ),
};
