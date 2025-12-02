import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@shared/components/ui/button';
import { FormInput } from '@shared/components/ui/form/FormInput';
import { FormSelect } from '@shared/components/ui/form/FormSelect';
import { FormTable } from '@shared/components/ui/form/FormTable';
import { FormTextarea } from '@shared/components/ui/form/FormTextarea';
import { type FieldErrors, useForm } from 'react-hook-form';

import { type FoodFormSchema, foodFormSchema } from '../schemas';

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
    console.log('✅ Form submitted:', data);
    onSubmit(data);
  };

  const handleFormError = (errors: FieldErrors<FoodFormSchema>) => {
    console.error('❌ Validation errors:', errors);
  };

  const handleReset = () => {
    reset();
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit, handleFormError)} className="space-y-6">
      {/* 기본 정보 섹션 */}
      <FormTable title="기본 정보">
        {/* Row 1: 음식명, 카테고리 */}
        <FormTable.Row>
          <FormTable.Cell label="음식명" required>
            <FormInput name="name" control={control} placeholder="예: 김치찌개" />
          </FormTable.Cell>
          <FormTable.Cell label="카테고리" required>
            <FormSelect name="category" control={control} options={CATEGORY_OPTIONS} placeholder="카테고리를 선택하세요" />
          </FormTable.Cell>
        </FormTable.Row>

        {/* Row 2: 가격, 상태 */}
        <FormTable.Row>
          <FormTable.Cell label="가격" required>
            <FormInput name="price" control={control} placeholder="10000" />
          </FormTable.Cell>
          <FormTable.Cell label="판매 상태">
            <FormSelect name="status" control={control} options={STATUS_OPTIONS} placeholder="상태를 선택하세요" />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      {/* 상세 정보 섹션 */}
      <FormTable title="상세 정보">
        {/* Row 3: 조리시간, 칼로리, 인분 */}
        <FormTable.Row>
          <FormTable.Cell label="조리시간" required>
            <FormInput name="preparationTime" control={control} placeholder="15" />
            <p className="text-muted-foreground mt-1 text-xs">분 단위로 입력</p>
          </FormTable.Cell>
          <FormTable.Cell label="칼로리">
            <FormInput name="calories" control={control} placeholder="500" />
            <p className="text-muted-foreground mt-1 text-xs">kcal 단위</p>
          </FormTable.Cell>
          <FormTable.Cell label="인분">
            <FormInput name="servings" control={control} placeholder="2" />
            <p className="text-muted-foreground mt-1 text-xs">1인분 기준</p>
          </FormTable.Cell>
        </FormTable.Row>

        {/* Row 4: 상세 설명 (전체 너비) */}
        <FormTable.Row>
          <FormTable.Cell span={3} label="상세 설명">
            <FormTextarea
              name="description"
              control={control}
              placeholder="음식에 대한 상세한 설명을 입력하세요&#10;예: 얼큰하고 시원한 국물이 일품인 김치찌개입니다."
              rows={4}
              maxLength={500}
            />
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
