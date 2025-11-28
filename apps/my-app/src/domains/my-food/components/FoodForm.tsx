import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/components/ui/button';
import { ControlledInput } from '@shared/components/ui/form/FormInput';
import { ControlledSelect } from '@shared/components/ui/form/FormSelect';
import { FormTable } from '@shared/components/ui/form/FormTable';
import { ControlledTextarea } from '@shared/components/ui/form/FormTextarea';
import { useForm } from 'react-hook-form';
import { foodFormSchema, type FoodFormSchema } from '../schemas';

const CATEGORY_OPTIONS = [
  { value: 'korean', label: '한식' },
  { value: 'chinese', label: '중식' },
  { value: 'japanese', label: '일식' },
  { value: 'western', label: '양식' },
  { value: 'dessert', label: '디저트' },
];

const STATUS_OPTIONS = [
  { value: 'active', label: '판매중' },
  { value: 'inactive', label: '판매중지' },
  { value: 'soldout', label: '품절' },
];

const categoryOptions = [
  { value: 'korean', label: '한식' },
  { value: 'chinese', label: '중식' },
  { value: 'japanese', label: '일식' },
  { value: 'western', label: '양식' },
];

interface FoodFormProps {
  onSubmit: (data: FoodFormSchema) => void;
  defaultValues?: Partial<FoodFormSchema>;
}

export function FoodForm({ onSubmit, defaultValues }: FoodFormProps) {
  const { control, handleSubmit, reset } = useForm<FoodFormSchema>({
    resolver: zodResolver(foodFormSchema),
    defaultValues: {
      name: defaultValues?.name ?? '',
      category: defaultValues?.category ?? '',
      price: defaultValues?.price ?? '',
      status: defaultValues?.status ?? '',
      description: defaultValues?.description ?? '',
      isAvailable: defaultValues?.isAvailable ?? true,
      tags: defaultValues?.tags ?? [],
      preparationTime: defaultValues?.preparationTime ?? '',
      calories: defaultValues?.calories ?? '',
      allergens: defaultValues?.allergens ?? [],
      servings: defaultValues?.servings ?? '',
      cookingMethods: defaultValues?.cookingMethods ?? [],
    },
  });

  const handleFormSubmit = (data: FoodFormSchema) => {
    console.log('Form submitted:', data);
    onSubmit(data);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 기본 정보 섹션 */}
      <FormTable title="기본 정보">
        {/* Row 1: 음식명, 카테고리 */}
        <FormTable.Row>
          <FormTable.Cell label="음식명" required>
            <ControlledInput name="name" control={control} placeholder="예: 김치찌개" onChange={value => console.log('음식명 변경:', value)} />
          </FormTable.Cell>
          <FormTable.Cell label="카테고리" required>
            <ControlledSelect
              name="category"
              control={control}
              options={CATEGORY_OPTIONS}
              placeholder="카테고리를 선택하세요"
              onValueChange={value => console.log('카테고리 변경:', value)}
            />
          </FormTable.Cell>
        </FormTable.Row>

        {/* Row 2: 가격, 상태 */}
        <FormTable.Row>
          <FormTable.Cell label="가격" required>
            <ControlledInput name="price" control={control} placeholder="10000" onChange={value => console.log('가격 변경:', value)} />
          </FormTable.Cell>
          <FormTable.Cell label="판매 상태">
            <ControlledSelect name="status" control={control} options={STATUS_OPTIONS} placeholder="상태를 선택하세요" />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      {/* 상세 정보 섹션 */}
      <FormTable title="상세 정보">
        {/* Row 3: 조리시간, 칼로리, 인분 */}
        <FormTable.Row>
          <FormTable.Cell label="조리시간" required>
            <ControlledInput name="preparationTime" control={control} placeholder="15" onChange={value => console.log('조리시간 변경:', value)} />
            <p className="text-muted-foreground mt-1 text-xs">분 단위로 입력</p>
          </FormTable.Cell>
          <FormTable.Cell label="칼로리">
            <ControlledInput name="calories" control={control} placeholder="500" onChange={value => console.log('칼로리 변경:', value)} />
            <p className="text-muted-foreground mt-1 text-xs">kcal 단위</p>
          </FormTable.Cell>
          <FormTable.Cell label="인분">
            <ControlledInput name="servings" control={control} placeholder="2" />
            <p className="text-muted-foreground mt-1 text-xs">1인분 기준</p>
          </FormTable.Cell>
        </FormTable.Row>

        {/* Row 4: 상세 설명 (전체 너비) */}
        <FormTable.Row>
          <FormTable.Cell span={3} label="상세 설명">
            <ControlledTextarea
              name="description"
              control={control}
              placeholder="음식에 대한 상세한 설명을 입력하세요&#10;예: 얼큰하고 시원한 국물이 일품인 김치찌개입니다."
              rows={4}
              maxLength={500}
              onChange={value => console.log('설명 변경:', value)}
            />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <FormTable title="상품 등록">
        {/* Col 형태 */}
        <FormTable.Row>
          <FormTable.Cell label="상품명" required>
            <ControlledInput name="productName" control={control} placeholder="상품명 입력" />
          </FormTable.Cell>
          <FormTable.Cell label="카테고리" required>
            <ControlledSelect name="category" control={control} options={categoryOptions} />
          </FormTable.Cell>
        </FormTable.Row>

        {/* Row 형태 */}
        <FormTable.Row>
          <FormTable.Cell label="제조사" labelPosition="left" labelWidth="150px" span={2}>
            <ControlledInput name="manufacturer" control={control} placeholder="제조사명" />
          </FormTable.Cell>
        </FormTable.Row>

        <FormTable.Row>
          <FormTable.Cell label="모델명" labelPosition="left" labelWidth="150px" span={2}>
            <ControlledInput name="model" control={control} placeholder="모델명" />
          </FormTable.Cell>
        </FormTable.Row>

        {/* 다시 Col 형태 */}
        <FormTable.Row>
          <FormTable.Cell label="가격">
            <ControlledInput name="price" control={control} placeholder="100000" />
          </FormTable.Cell>
          <FormTable.Cell label="재고">
            <ControlledInput name="stock" control={control} placeholder="50" />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      {/* 버튼 */}
      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" size="lg" className="min-w-32" onClick={handleReset}>
          초기화
        </Button>
        <Button type="submit" size="lg" className="min-w-32">
          등록
        </Button>
      </div>
    </form>
  );
}
