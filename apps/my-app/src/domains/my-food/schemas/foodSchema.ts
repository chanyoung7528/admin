import { z } from 'zod';

export const foodFormSchema = z.object({
  name: z.string().min(1, '음식명을 입력해주세요.').max(100, '음식명은 100자 이하로 입력해주세요.'),
  category: z.string().min(1, '카테고리를 선택해주세요.'),
  price: z
    .string()
    .regex(/^\d+$/, '가격은 숫자만 입력 가능합니다.')
    .refine(val => parseInt(val) > 0, {
      message: '가격은 0보다 커야 합니다.',
    }),
  status: z.string().optional(),
  description: z.string().max(500, '설명은 500자 이하로 입력해주세요.'),
  isAvailable: z.boolean(),
  tags: z.array(z.string()).min(1, '최소 1개의 태그를 선택해주세요.').max(5, '태그는 최대 5개까지 선택 가능합니다.'),
  preparationTime: z.string().regex(/^\d+$/, '조리 시간은 숫자만 입력 가능합니다.'),
  calories: z.string().refine(val => val === '' || /^\d+$/.test(val), {
    message: '칼로리는 숫자만 입력 가능합니다.',
  }),
  allergens: z.array(z.string()),
  servings: z.string().optional(),
  cookingMethods: z.array(z.string()).optional(),
});

export type FoodFormSchema = z.infer<typeof foodFormSchema>;
