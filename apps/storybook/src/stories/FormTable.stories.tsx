import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/components/ui/button';
import { ControlledCheckboxGroup } from '@shared/components/ui/form/FormCheckbox';
import { ControlledInput } from '@shared/components/ui/form/FormInput';
import { ControlledSelect } from '@shared/components/ui/form/FormSelect';
import { FormTable } from '@shared/components/ui/form/FormTable';
import { ControlledTextarea } from '@shared/components/ui/form/FormTextarea';
import type { Meta, StoryObj } from '@storybook/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomDocsPage } from '../components/CustomDocsPage';
import { ComplexFormTemplate, MixedColRowFormTemplate, RowLayoutFormTemplate } from './FormTableTemplates';

const meta = {
  title: 'Forms/FormTable',
  component: FormTable,
  parameters: {
    layout: 'padded',
    docs: {
      page: () => (
        <CustomDocsPage
          componentName="FormTable"
          description="테이블 기반의 폼 레이아웃 컴포넌트입니다. React Hook Form과 Zod를 활용하여 유연한 폼 레이아웃을 구성할 수 있습니다. Col/Row 형태의 다양한 레이아웃을 지원합니다."
          installationDeps={['react-hook-form', 'zod', '@hookform/resolvers']}
          implementationCode={`// 기본 FormTable 사용
import { FormTable } from '@shared/components/ui/form';
import { ControlledInput } from '@shared/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  email: z.string().email('이메일을 입력하세요'),
});

export default function MyForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
    },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <FormTable title="사용자 정보">
        <FormTable.Row>
          <FormTable.Cell label="이름" required>
            <ControlledInput name="name" control={control} />
          </FormTable.Cell>
          <FormTable.Cell label="이메일" required>
            <ControlledInput name="email" control={control} type="email" />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>
      <button type="submit">제출</button>
    </form>
  );
}`}
          exampleCode={`// Row 레이아웃 (라벨이 왼쪽)
export default function RowLayoutForm() {
  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '' },
  });

  return (
    <form onSubmit={handleSubmit((data) => console.log(data))}>
      <FormTable title="회원 등록">
        <FormTable.Row>
          <FormTable.Cell 
            label="이름" 
            required 
            labelPosition="left" 
            labelWidth="150px"
            span={2}
          >
            <ControlledInput name="name" control={control} />
          </FormTable.Cell>
        </FormTable.Row>

        <FormTable.Row>
          <FormTable.Cell 
            label="이메일" 
            required 
            labelPosition="left" 
            labelWidth="150px"
            span={2}
          >
            <ControlledInput name="email" control={control} type="email" />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>
      <button type="submit">등록</button>
    </form>
  );
}`}
          utilityCode={`// Props 인터페이스
interface FormTableProps {
  children: ReactNode;
  className?: string;
  title?: string; // 테이블 상단 타이틀
}

interface FormTableCellProps {
  children: ReactNode;
  span?: number; // colspan 값 (1-12)
  className?: string;
  label?: string; // 필드 라벨
  required?: boolean; // 필수 여부 표시
  labelPosition?: 'top' | 'left'; // 라벨 위치
  labelWidth?: string; // 라벨 너비 (labelPosition="left"일 때)
}

// 사용 가능한 Form 컴포넌트들
- ControlledInput: 텍스트 입력 필드
- ControlledSelect: 드롭다운 선택
- ControlledTextarea: 여러 줄 텍스트 입력
- ControlledCheckboxGroup: 체크박스 그룹 (layout: vertical/horizontal/grid)

// 레이아웃 패턴
1. Col 형태: 라벨이 위, 입력 필드가 아래
2. Row 형태: 라벨이 왼쪽, 입력 필드가 오른쪽
3. 혼합 형태: Col과 Row를 자유롭게 조합`}
        />
      ),
    },
  },
  tags: ['autodocs'],
  args: {
    children: null,
  },
} satisfies Meta<typeof FormTable>;

export default meta;
type Story = StoryObj<typeof meta>;

// 기본 스키마
const basicSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  email: z.string().email('올바른 이메일을 입력하세요'),
});

// 2x2 그리드 예제
export const TwoByTwo: Story = {
  render: function TwoByTwoForm() {
    const { control, handleSubmit } = useForm({
      resolver: zodResolver(basicSchema),
    });

    return (
      <form onSubmit={handleSubmit((data: unknown) => console.log(data))} className="space-y-4">
        <h2 className="text-lg font-semibold">2행 x 2열 예제</h2>
        <FormTable>
          <FormTable.Row cols={2}>
            <FormTable.Cell>
              <ControlledInput name="name" control={control} label="이름" placeholder="홍길동" required />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="email" control={control} label="이메일" placeholder="example@email.com" type="email" required />
            </FormTable.Cell>
          </FormTable.Row>
          <FormTable.Row cols={2}>
            <FormTable.Cell>
              <ControlledInput name="phone" control={control} label="전화번호" placeholder="010-1234-5678" type="tel" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="address" control={control} label="주소" placeholder="서울시 강남구" />
            </FormTable.Cell>
          </FormTable.Row>
        </FormTable>
        <Button type="submit">제출</Button>
      </form>
    );
  },
};

// 3x3 그리드 예제
export const ThreeByThree: Story = {
  render: function ThreeByThreeForm() {
    const { control, handleSubmit } = useForm();

    return (
      <form onSubmit={handleSubmit((data: unknown) => console.log(data))} className="space-y-4">
        <h2 className="text-lg font-semibold">3행 x 3열 예제</h2>
        <FormTable>
          <FormTable.Row cols={3}>
            <FormTable.Cell>
              <ControlledInput name="field1" control={control} label="필드 1" placeholder="값 입력" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="field2" control={control} label="필드 2" placeholder="값 입력" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="field3" control={control} label="필드 3" placeholder="값 입력" />
            </FormTable.Cell>
          </FormTable.Row>
          <FormTable.Row cols={3}>
            <FormTable.Cell>
              <ControlledInput name="field4" control={control} label="필드 4" placeholder="값 입력" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="field5" control={control} label="필드 5" placeholder="값 입력" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="field6" control={control} label="필드 6" placeholder="값 입력" />
            </FormTable.Cell>
          </FormTable.Row>
          <FormTable.Row cols={3}>
            <FormTable.Cell>
              <ControlledInput name="field7" control={control} label="필드 7" placeholder="값 입력" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="field8" control={control} label="필드 8" placeholder="값 입력" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="field9" control={control} label="필드 9" placeholder="값 입력" />
            </FormTable.Cell>
          </FormTable.Row>
        </FormTable>
        <Button type="submit">제출</Button>
      </form>
    );
  },
};

// 3행 x 4열 예제
export const ThreeByFour: Story = {
  render: function ThreeByFourForm() {
    const { control, handleSubmit } = useForm();

    return (
      <form onSubmit={handleSubmit((data: unknown) => console.log(data))} className="space-y-4">
        <h2 className="text-lg font-semibold">3행 x 4열 예제</h2>
        <FormTable>
          <FormTable.Row cols={4}>
            <FormTable.Cell>
              <ControlledInput name="a1" control={control} label="A1" placeholder="A1" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="a2" control={control} label="A2" placeholder="A2" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="a3" control={control} label="A3" placeholder="A3" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="a4" control={control} label="A4" placeholder="A4" />
            </FormTable.Cell>
          </FormTable.Row>
          <FormTable.Row cols={4}>
            <FormTable.Cell>
              <ControlledInput name="b1" control={control} label="B1" placeholder="B1" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="b2" control={control} label="B2" placeholder="B2" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="b3" control={control} label="B3" placeholder="B3" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="b4" control={control} label="B4" placeholder="B4" />
            </FormTable.Cell>
          </FormTable.Row>
          <FormTable.Row cols={4}>
            <FormTable.Cell>
              <ControlledInput name="c1" control={control} label="C1" placeholder="C1" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="c2" control={control} label="C2" placeholder="C2" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="c3" control={control} label="C3" placeholder="C3" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="c4" control={control} label="C4" placeholder="C4" />
            </FormTable.Cell>
          </FormTable.Row>
        </FormTable>
        <Button type="submit">제출</Button>
      </form>
    );
  },
};

// 혼합 레이아웃 예제 (다양한 colspan)
export const MixedLayout: Story = {
  render: function MixedLayoutForm() {
    const { control, handleSubmit } = useForm();

    const categoryOptions = [
      { value: 'korean', label: '한식' },
      { value: 'chinese', label: '중식' },
      { value: 'japanese', label: '일식' },
    ];

    const tagOptions = [
      { value: 'popular', label: '인기' },
      { value: 'new', label: '신메뉴' },
      { value: 'spicy', label: '매운맛' },
    ];

    return (
      <form onSubmit={handleSubmit((data: unknown) => console.log(data))} className="space-y-4">
        <h2 className="text-lg font-semibold">혼합 레이아웃 예제 (다양한 colspan)</h2>
        <FormTable>
          {/* 1행: 2개 셀 (각각 colspan 1) */}
          <FormTable.Row cols={2}>
            <FormTable.Cell>
              <ControlledInput name="title" control={control} label="제목" placeholder="제목 입력" required />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledSelect name="category" control={control} label="카테고리" options={categoryOptions} required />
            </FormTable.Cell>
          </FormTable.Row>

          {/* 2행: 3개 셀 (각각 colspan 1) */}
          <FormTable.Row cols={3}>
            <FormTable.Cell>
              <ControlledInput name="price" control={control} label="가격" placeholder="10000" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="stock" control={control} label="재고" placeholder="100" />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="discount" control={control} label="할인율" placeholder="10" />
            </FormTable.Cell>
          </FormTable.Row>

          {/* 3행: 1개 셀 (colspan 3으로 전체 너비) */}
          <FormTable.Row cols={1}>
            <FormTable.Cell span={3}>
              <ControlledTextarea name="description" control={control} label="상세 설명" placeholder="상세 설명을 입력하세요" rows={4} maxLength={500} />
            </FormTable.Cell>
          </FormTable.Row>

          {/* 4행: 2개 셀 (첫 번째는 colspan 2, 두 번째는 colspan 1) */}
          <FormTable.Row cols={3}>
            <FormTable.Cell span={2}>
              <ControlledCheckboxGroup name="tags" control={control} label="태그" options={tagOptions} maxSelection={3} />
            </FormTable.Cell>
            <FormTable.Cell>
              <ControlledInput name="code" control={control} label="상품코드" placeholder="ABC123" />
            </FormTable.Cell>
          </FormTable.Row>
        </FormTable>
        <Button type="submit">제출</Button>
      </form>
    );
  },
};

// 복잡한 폼 예제 (커스텀 템플릿 사용)
export const ComplexForm: Story = {
  render: () => <ComplexFormTemplate />,
};

// Row 형태 레이아웃 (Label이 왼쪽)
export const RowLayoutForm: Story = {
  render: () => <RowLayoutFormTemplate />,
};

// 혼합 레이아웃 (Col + Row)
export const MixedColRowForm: Story = {
  render: () => <MixedColRowFormTemplate />,
};
