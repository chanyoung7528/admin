# Form 컴포넌트 사용 가이드

React Hook Form 기반 테이블 레이아웃(FormTable)과 에러 컴포넌트를 빠르게 쓰기 위한 요약입니다.

## 구성 요소

- `FormTable`: 테이블 형태 레이아웃 (행·셀 단위 배치)
- `FormInput`: RHF 컨트롤된 인풋
- `FormError`: 폼 전체 에러 배너
- `FormFieldError`: 필드 인라인 에러

## 빠른 시작

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTable, FormInput, FormFieldError, FormError } from '@repo/shared/components/form';

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  email: z.string().email('이메일 형식이 올바르지 않습니다'),
});

export function ProfileForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <FormError title="입력 항목을 확인하세요" errors={Object.fromEntries(Object.entries(errors).map(([k, v]) => [k, v?.message]))} />
      <FormTable title="기본 정보">
        <FormTable.Row>
          <FormTable.Cell label="이름" required>
            <FormInput name="name" control={control} />
            <FormFieldError message={errors.name?.message} />
          </FormTable.Cell>
          <FormTable.Cell label="이메일" required>
            <FormInput name="email" control={control} />
            <FormFieldError message={errors.email?.message} />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>
      <button type="submit">저장</button>
    </form>
  );
}
```

## Props 요약

- `FormTable.Cell`
  - `label`: 필드 라벨
  - `required`: 필수 표시 여부
  - `span`: 열 병합 (colspan)
  - `labelPosition`: `'top' | 'left'`
  - `labelWidth`: 왼쪽 라벨 너비 (`labelPosition='left'`일 때)
- `FormError`
  - `title`, `message`, `errors: Record<string, string | undefined>`
  - `variant`: `'error' | 'warning' | 'info' | 'destructive'` (기본 `error`)
- `FormFieldError`
  - `message`: 문자열이 없으면 렌더링되지 않음

## 사용 팁

- 인라인 에러(`FormFieldError`)만으로도 충분한 경우가 많습니다. 전체 배너(`FormError`)는 서버 에러나 요약이 필요할 때만 사용하세요.
- 레이아웃은 `FormTable`을 기본으로 쓰고, 자유 레이아웃이 필요하면 일반 Flex/Grid와 혼합해도 됩니다.
- RHF 컨트롤과 함께 사용할 때는 `control`과 `name`만 전달하면 됩니다.

## 참고 링크

- React Hook Form: https://react-hook-form.com/
- Zod: https://zod.dev/
