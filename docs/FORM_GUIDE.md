# 폼 개발 가이드

React Hook Form + Zod로 타입 세이프 폼을 빠르게 구현하는 방법을 설명합니다.

## 핵심 개념

Zod 스키마로 타입과 검증을 한 번에 정의하고, React Hook Form으로 상태를 관리합니다.

**관련 문서**: [React Hook Form](https://react-hook-form.com/), [Zod](https://zod.dev/), [Form 컴포넌트](../packages/shared/src/components/form/README.md)

## 빠른 시작

### 1단계: Zod 스키마 정의

```tsx
// schemas/settlementSchema.ts
import { z } from 'zod';

export const settlementSchema = z.object({
  site: z.string().min(1, '사이트를 입력하세요'),
  service: z.enum(['BODY', 'FOOD', 'MIND']),
  amount: z.number().min(0, '금액은 0 이상이어야 합니다'),
  date: z.string().min(1, '날짜를 선택하세요'),
  notes: z.string().optional(),
});

export type SettlementFormData = z.infer<typeof settlementSchema>;
```

### 2단계: 폼 컴포넌트 작성

```tsx
// components/SettlementForm.tsx
export function SettlementForm({ initialData, onSubmit, isLoading }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(settlementSchema),
    defaultValues: initialData || {},
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable title="기본 정보">
        <FormTable.Row>
          <FormTable.Cell label="사이트" required>
            <FormInput name="site" control={control} />
            <FormFieldError message={errors.site?.message} />
          </FormTable.Cell>
          <FormTable.Cell label="서비스" required>
            <FormSelect
              name="service"
              control={control}
              options={[
                { label: 'Body', value: 'BODY' },
                { label: 'Food', value: 'FOOD' },
              ]}
            />
            <FormFieldError message={errors.service?.message} />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>
      <Button type="submit" disabled={isLoading}>
        저장
      </Button>
    </form>
  );
}
```

### 3단계: API 연동

```tsx
// hooks/useCreateSettlement.ts
export function useCreateSettlement() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: createSettlement,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      navigate({ to: '/settlement/list' });
    },
  });
}

// 페이지에서 사용
const createMutation = useCreateSettlement();
<SettlementForm onSubmit={data => createMutation.mutate(data)} isLoading={createMutation.isPending} />;
```

## 수정 폼

```tsx
// 수정 훅
export function useUpdateSettlement(id) {
  return useMutation({
    mutationFn: data => updateSettlement(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['settlements'] });
      navigate({ to: '/settlement/list' });
    },
  });
}

// 페이지에서 사용
const { data: settlement } = useSettlement(id);
const updateMutation = useUpdateSettlement(id);
<SettlementForm initialData={settlement} onSubmit={data => updateMutation.mutate(data)} />;
```

## 스키마 검증 패턴

### 조건부 검증

```tsx
export const schema = z
  .object({
    type: z.enum(['individual', 'corporate']),
    personalId: z.string().optional(),
    businessNumber: z.string().optional(),
  })
  .refine(data => (data.type === 'individual' ? Boolean(data.personalId) : Boolean(data.businessNumber)), {
    message: '필수 항목을 입력하세요',
    path: ['personalId'],
  });
```

### 비밀번호 검증

```tsx
export const schema = z
  .object({
    password: z.string().min(8, '8자 이상').regex(/[A-Z]/, '대문자 포함').regex(/[0-9]/, '숫자 포함'),
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: '비밀번호 불일치',
    path: ['confirmPassword'],
  });
```

### 중첩 객체

```tsx
export const schema = z.object({
  address: z.object({
    zipCode: z.string().min(1),
    address1: z.string().min(1),
  }),
  tags: z.array(z.string()).min(1),
});

// 사용
<FormInput name="address.zipCode" control={control} />;
```

## 폼 컴포넌트 사용법

### FormTable (테이블 레이아웃)

```tsx
<FormTable title="기본 정보">
  <FormTable.Row>
    {/* 1열 */}
    <FormTable.Cell label="이름" required>
      <FormInput name="name" control={control} />
      <FormFieldError message={errors.name?.message} />
    </FormTable.Cell>
    {/* 2열 */}
    <FormTable.Cell label="이메일" required>
      <FormInput name="email" control={control} />
    </FormTable.Cell>
  </FormTable.Row>
  {/* 열 병합 */}
  <FormTable.Row>
    <FormTable.Cell label="주소" span={2}>
      <FormInput name="address" control={control} />
    </FormTable.Cell>
  </FormTable.Row>
</FormTable>
```

### 입력 컴포넌트

```tsx
<FormInput name="name" control={control} type="text" />
<FormSelect name="service" control={control} options={[...]} />
<FormTextarea name="notes" control={control} rows={5} />
<FormCheckbox name="agree" control={control} label="동의" />
```

### 에러 표시

```tsx
{
  /* 인라인 에러 (권장) */
}
<FormFieldError message={errors.name?.message} />;

{
  /* 전체 에러 배너 (선택) */
}
<FormError title="입력 확인" errors={{ name: '이름 필수', email: '이메일 필수' }} />;
```

## 추가 패턴

### 다단계 폼

```tsx
const [step, setStep] = useState('basic');
const { trigger } = useForm();

const handleNext = async () => {
  const isValid = await trigger(); // 현재 단계 검증
  if (isValid) setStep('detail');
};
```

### 동적 필드 (배열)

```tsx
const { fields, append, remove } = useFieldArray({ control, name: 'items' });

{
  fields.map((field, index) => (
    <div key={field.id}>
      <FormInput name={`items.${index}.name`} control={control} />
      <Button onClick={() => remove(index)}>삭제</Button>
    </div>
  ));
}
<Button onClick={() => append({ name: '' })}>추가</Button>;
```

### 서버 에러 처리

```tsx
const { setError } = useForm();

catch (error) {
  // 서버 에러를 필드에 매핑
  Object.entries(error.response.data.errors).forEach(([field, message]) => {
    setError(field, { message });
  });
}
```

## 체크리스트

**필수**

- ✅ Zod 스키마로 타입과 검증 정의
- ✅ zodResolver 등록
- ✅ FormFieldError로 에러 표시
- ✅ 제출 중 버튼 비활성화

**권장**

- ✅ 스키마는 별도 파일로 분리
- ✅ 서버 에러는 setError로 매핑
- ✅ defaultValues 기본값 제공

## 관련 가이드

- [Form 컴포넌트](../packages/shared/src/components/form/README.md) - 컴포넌트 API
- [API 통합 가이드](API_INTEGRATION.md) - Mutation 패턴
- [React Hook Form](https://react-hook-form.com/) - 공식 문서
- [Zod](https://zod.dev/) - 공식 문서
