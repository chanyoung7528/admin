import { zodResolver } from '@hookform/resolvers/zod';
import { FormCheckboxGroup, FormInput, FormSelect, FormTable, FormTextarea } from '@shared/components/form';
import { Button } from '@shared/components/ui/button';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// 복잡한 폼 템플릿
export function ComplexFormTemplate() {
  const schema = z.object({
    name: z.string().min(1, '이름을 입력하세요'),
    category: z.string().min(1, '카테고리를 선택하세요'),
    price: z.string().regex(/^\d+$/, '숫자만 입력 가능합니다'),
    preparationTime: z.string().regex(/^\d+$/, '숫자만 입력 가능합니다'),
    calories: z.string().optional(),
    description: z.string().max(500, '500자 이하로 입력하세요').optional(),
    tags: z.array(z.string()).min(1, '최소 1개 선택'),
    allergens: z.array(z.string()).optional(),
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      category: '',
      price: '',
      preparationTime: '',
      calories: '',
      description: '',
      tags: [],
      allergens: [],
    },
  });

  const categoryOptions = [
    { value: 'korean', label: '한식' },
    { value: 'chinese', label: '중식' },
    { value: 'japanese', label: '일식' },
    { value: 'western', label: '양식' },
  ];

  const tagOptions = [
    { value: 'spicy', label: '매운맛' },
    { value: 'sweet', label: '달콤한' },
    { value: 'popular', label: '인기' },
  ];

  const allergenOptions = [
    { value: 'egg', label: '계란' },
    { value: 'milk', label: '우유' },
    { value: 'peanut', label: '땅콩' },
  ];

  return (
    <form onSubmit={handleSubmit((data: unknown) => alert(JSON.stringify(data, null, 2)))} className="space-y-4">
      <FormTable title="기본 정보">
        <FormTable.Row>
          <FormTable.Cell label="음식명" required>
            <FormInput name="name" control={control} placeholder="음식명을 입력하세요" onChange={(value: string) => console.log('음식명:', value)} />
          </FormTable.Cell>
          <FormTable.Cell label="카테고리" required>
            <FormSelect name="category" control={control} options={categoryOptions} onValueChange={(value: string) => console.log('카테고리:', value)} />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <FormTable title="상세 정보">
        <FormTable.Row>
          <FormTable.Cell label="가격 (원)" required>
            <FormInput name="price" control={control} placeholder="10000" required onChange={(value: string) => console.log('가격:', value)} />
          </FormTable.Cell>
          <FormTable.Cell label="조리시간 (분)" required>
            <FormInput name="preparationTime" control={control} placeholder="15" required onChange={(value: string) => console.log('조리시간:', value)} />
          </FormTable.Cell>
          <FormTable.Cell label="칼로리 (kcal)">
            <FormInput name="calories" control={control} placeholder="500" onChange={(value: string) => console.log('칼로리:', value)} />
          </FormTable.Cell>
        </FormTable.Row>

        <FormTable.Row>
          <FormTable.Cell span={3} label="설명">
            <FormTextarea
              name="description"
              control={control}
              placeholder="음식 설명을 입력하세요"
              rows={4}
              maxLength={500}
              onChange={(value: string) => console.log('설명:', value)}
            />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <FormTable title="추가 옵션">
        <FormTable.Row>
          <FormTable.Cell label="태그" required>
            <FormCheckboxGroup
              name="tags"
              control={control}
              options={tagOptions}
              required
              maxSelection={3}
              layout="grid"
              gridCols={3}
              onValueChange={(values: string[]) => console.log('태그:', values)}
            />
          </FormTable.Cell>
          <FormTable.Cell label="알레르기 정보">
            <FormCheckboxGroup
              name="allergens"
              control={control}
              options={allergenOptions}
              layout="horizontal"
              onValueChange={(values: string[]) => console.log('알레르기:', values)}
            />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          취소
        </Button>
        <Button type="submit">등록</Button>
      </div>
    </form>
  );
}

// Row 레이아웃 폼 템플릿
export function RowLayoutFormTemplate() {
  const schema = z.object({
    name: z.string().min(1, '이름 입력 필수'),
    email: z.string().email('올바른 이메일 형식이 아닙니다'),
    phone: z.string().optional(),
    address: z.string().optional(),
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
    },
  });

  return (
    <form onSubmit={handleSubmit((data: unknown) => console.log(data))} className="space-y-4">
      <FormTable title="회원 등록">
        <FormTable.Row>
          <FormTable.Cell label="이름" required labelPosition="left" labelWidth="150px" span={2}>
            <FormInput name="name" control={control} placeholder="홍길동" />
          </FormTable.Cell>
        </FormTable.Row>

        <FormTable.Row>
          <FormTable.Cell label="이메일" required labelPosition="left" labelWidth="150px" span={2}>
            <FormInput name="email" control={control} placeholder="example@email.com" type="email" />
          </FormTable.Cell>
        </FormTable.Row>

        <FormTable.Row>
          <FormTable.Cell label="전화번호" labelPosition="left" labelWidth="150px" span={2}>
            <FormInput name="phone" control={control} placeholder="010-1234-5678" type="tel" />
          </FormTable.Cell>
        </FormTable.Row>

        <FormTable.Row>
          <FormTable.Cell label="주소" labelPosition="left" labelWidth="150px" span={2}>
            <FormTextarea name="address" control={control} placeholder="주소를 입력하세요" rows={3} />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          취소
        </Button>
        <Button type="submit">등록</Button>
      </div>
    </form>
  );
}

// 혼합 레이아웃 폼 템플릿
export function MixedColRowFormTemplate() {
  const schema = z.object({
    productName: z.string().min(1, '상품명을 입력하세요'),
    category: z.string().min(1, '카테고리를 선택하세요'),
    manufacturer: z.string().optional(),
    model: z.string().optional(),
    price: z.string().optional(),
    stock: z.string().optional(),
  });

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      productName: '',
      category: '',
      manufacturer: '',
      model: '',
      price: '',
      stock: '',
    },
  });

  const categoryOptions = [
    { value: 'electronics', label: '전자제품' },
    { value: 'fashion', label: '패션' },
    { value: 'food', label: '식품' },
  ];

  return (
    <form onSubmit={handleSubmit((data: unknown) => console.log(data))} className="space-y-4">
      <FormTable title="상품 등록">
        {/* Col 형태 */}
        <FormTable.Row>
          <FormTable.Cell label="상품명" required>
            <FormInput name="productName" control={control} placeholder="상품명 입력" />
          </FormTable.Cell>
          <FormTable.Cell label="카테고리" required>
            <FormSelect name="category" control={control} options={categoryOptions} />
          </FormTable.Cell>
        </FormTable.Row>

        {/* Row 형태 */}
        <FormTable.Row>
          <FormTable.Cell label="제조사" labelPosition="left" labelWidth="150px" span={2}>
            <FormInput name="manufacturer" control={control} placeholder="제조사명" />
          </FormTable.Cell>
        </FormTable.Row>

        <FormTable.Row>
          <FormTable.Cell label="모델명" labelPosition="left" labelWidth="150px" span={2}>
            <FormInput name="model" control={control} placeholder="모델명" />
          </FormTable.Cell>
        </FormTable.Row>

        {/* 다시 Col 형태 */}
        <FormTable.Row>
          <FormTable.Cell label="가격">
            <FormInput name="price" control={control} placeholder="100000" />
          </FormTable.Cell>
          <FormTable.Cell label="재고">
            <FormInput name="stock" control={control} placeholder="50" />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline">
          취소
        </Button>
        <Button type="submit">등록</Button>
      </div>
    </form>
  );
}
