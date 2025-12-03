import { FormError, FormFieldError } from '@shared/components/ui/form/FormError';
import type { Meta, StoryObj } from '@storybook/react';

import { CustomDocsPage } from '../components/CustomDocsPage';

const meta = {
  title: 'Forms/FormError',
  component: FormError,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="FormError"
          description="폼 검증 에러를 일관된 스타일로 표시하는 컴포넌트입니다."
          installationDeps={['lucide-react']}
          exampleCode={`import { FormError, FormFieldError } from '@shared/components/ui/form/FormError';
import { FormInput } from '@shared/components/ui/form/FormInput';
import { useForm } from 'react-hook-form';

export function MyForm() {
  const { control, formState: { errors } } = useForm();

  return (
    <form>
      {/* 전체 에러 요약 (선택사항) */}
      <FormError 
        variant="error"
        errors={{
          name: '이름을 입력해주세요.',
          email: '올바른 이메일 형식이 아닙니다.'
        }}
      />

      {/* 각 필드는 자동으로 에러 표시됨 */}
      <FormInput name="name" control={control} />
      <FormInput name="email" control={control} />
    </form>
  );
}`}
        />
      ),
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof FormError>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 에러
export const Default: Story = {
  args: {
    title: '입력 오류',
    errors: {
      name: '이름을 입력해주세요.',
      email: '올바른 이메일 형식이 아닙니다.',
    },
  },
};

// 단일 메시지
export const SingleMessage: Story = {
  args: {
    title: '알림',
    message: '폼 제출 중 오류가 발생했습니다. 다시 시도해주세요.',
    variant: 'error',
  },
};

// Warning 스타일
export const Warning: Story = {
  args: {
    title: '주의',
    message: '일부 필드가 누락되었습니다. 확인 후 제출해주세요.',
    variant: 'warning',
  },
};

// Info 스타일
export const Info: Story = {
  args: {
    title: '안내',
    message: '필수 입력 항목(*)을 모두 입력해주세요.',
    variant: 'info',
  },
};

// Destructive 스타일
export const Destructive: Story = {
  args: {
    title: '심각한 오류',
    errors: {
      server: '서버와의 연결이 끊어졌습니다.',
      auth: '인증이 만료되었습니다. 다시 로그인해주세요.',
    },
    variant: 'destructive',
  },
};

// 복수 에러
export const MultipleErrors: Story = {
  args: {
    title: '입력 항목 확인 필요',
    errors: {
      name: '이름은 필수 입력 항목입니다.',
      email: '올바른 이메일 형식이 아닙니다.',
      password: '비밀번호는 8자 이상이어야 합니다.',
      phone: '전화번호 형식이 올바르지 않습니다.',
      address: '주소를 입력해주세요.',
    },
    variant: 'error',
  },
};

// 메시지 + 에러 목록
export const MessageWithErrors: Story = {
  args: {
    title: '폼 검증 실패',
    message: '다음 항목들을 확인해주세요:',
    errors: {
      name: '이름을 입력해주세요.',
      category: '카테고리를 선택해주세요.',
      price: '가격은 0보다 커야 합니다.',
    },
    variant: 'error',
  },
};

// Field Error (인라인)
export const FieldErrorExample = () => {
  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">이름</label>
        <input type="text" className="border-input mt-1 w-full rounded-md border px-3 py-2" placeholder="이름 입력" />
        <FormFieldError message="이름은 필수 입력 항목입니다." />
      </div>

      <div>
        <label className="text-sm font-medium">이메일</label>
        <input type="email" className="border-input mt-1 w-full rounded-md border px-3 py-2" placeholder="이메일 입력" />
        <FormFieldError message="올바른 이메일 형식이 아닙니다." />
      </div>

      <div>
        <label className="text-sm font-medium">전화번호 (정상)</label>
        <input type="tel" className="border-input mt-1 w-full rounded-md border px-3 py-2" placeholder="전화번호 입력" value="010-1234-5678" readOnly />
        <FormFieldError />
      </div>
    </div>
  );
};

// 실제 폼 예제
export const RealFormExample = () => {
  return (
    <div className="space-y-6">
      <FormError
        title="폼 검증 실패"
        errors={{
          name: '음식명을 입력해주세요.',
          price: '가격은 숫자만 입력 가능합니다.',
          preparationTime: '조리 시간은 숫자만 입력 가능합니다.',
        }}
      />

      <div className="space-y-4 rounded-lg border p-4">
        <h3 className="text-lg font-semibold">음식 정보</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium">
              음식명 <span className="text-destructive">*</span>
            </label>
            <input type="text" className="border-input mt-1 w-full rounded-md border px-3 py-2" placeholder="예: 김치찌개" />
            <FormFieldError message="음식명을 입력해주세요." />
          </div>

          <div>
            <label className="text-sm font-medium">
              가격 <span className="text-destructive">*</span>
            </label>
            <input type="text" className="border-input mt-1 w-full rounded-md border px-3 py-2" placeholder="10000" value="abc" readOnly />
            <FormFieldError message="가격은 숫자만 입력 가능합니다." />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">
            조리시간 <span className="text-destructive">*</span>
          </label>
          <input type="text" className="border-input mt-1 w-full rounded-md border px-3 py-2" placeholder="15" />
          <p className="text-muted-foreground mt-1 text-xs">분 단위로 입력</p>
          <FormFieldError message="조리 시간은 숫자만 입력 가능합니다." />
        </div>
      </div>
    </div>
  );
};
