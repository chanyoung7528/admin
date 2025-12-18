# Form Components

React Hook Form 기반의 재사용 가능한 폼 컴포넌트 모음입니다.

## 📦 구성 요소

### FormTable - 테이블 기반 폼 레이아웃

폼을 테이블 형태로 깔끔하게 배치하는 레이아웃 컴포넌트입니다.

```tsx
import { FormTable } from '@shared/components/form/FormTable';

<FormTable title="기본 정보">
  <FormTable.Row>
    <FormTable.Cell label="이름" required>
      <Input {...} />
    </FormTable.Cell>
    <FormTable.Cell label="이메일" required>
      <Input {...} />
    </FormTable.Cell>
  </FormTable.Row>
</FormTable>
```

**Props:**

- `title`: 섹션 제목
- `FormTable.Cell`:
  - `label`: 필드 라벨
  - `required`: 필수 표시 (\*)
  - `span`: 열 병합 (colspan)
  - `labelPosition`: `'top' | 'left'` - 라벨 위치
  - `labelWidth`: 왼쪽 라벨 너비 (labelPosition='left'일 때)

### FormError - 에러 표시 컴포넌트

폼 검증 에러를 일관된 스타일로 표시하는 컴포넌트입니다.

### FormError - 전체 폼 에러 (상단 표시)

```tsx
import { FormError } from '@shared/components/form/FormError';

// 기본 사용 (error 스타일)
<FormError
  title="입력 오류"
  errors={{
    name: '이름을 입력해주세요.',
    email: '올바른 이메일 형식이 아닙니다.'
  }}
/>

// Warning 스타일
<FormError
  variant="warning"
  title="주의"
  message="일부 필드가 누락되었습니다."
/>

// Info 스타일
<FormError
  variant="info"
  title="안내"
  message="필수 입력 항목(*)을 모두 입력해주세요."
/>

// Destructive 스타일
<FormError
  variant="destructive"
  title="심각한 오류"
  errors={{
    server: '서버와의 연결이 끊어졌습니다.'
  }}
/>
```

**Props:**

- `title`: 에러 제목
- `message`: 단일 메시지 (ReactNode)
- `errors`: 에러 객체 `Record<string, string | undefined>`
- `variant`: `'error' | 'warning' | 'info' | 'destructive'` (기본: 'error')
- `className`: 추가 스타일

### FormFieldError - 필드별 인라인 에러

```tsx
import { FormFieldError } from '@shared/components/form/FormError';

<FormTable.Cell label="이름" required>
  <Input {...} />
  <FormFieldError message={errors.name?.message} />
</FormTable.Cell>
```

**Props:**

- `message`: 에러 메시지 (없으면 렌더링 안됨)
- `className`: 추가 스타일

### 실제 사용 예제 (권장)

**인라인 에러만 사용 (권장)**

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormTable } from '@shared/components/form/FormTable';
import { FormFieldError } from '@shared/components/form/FormError';
import { FormInput } from '@shared/components/form/FormInput';

export function MyForm() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mySchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormTable title="기본 정보">
        <FormTable.Row>
          <FormTable.Cell label="이름" required>
            <FormInput name="name" control={control} />
            {/* 각 필드 바로 아래 인라인 에러 표시 */}
            <FormFieldError message={errors.name?.message} />
          </FormTable.Cell>

          <FormTable.Cell label="이메일" required>
            <FormInput name="email" control={control} />
            <FormFieldError message={errors.email?.message} />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <button type="submit">제출</button>
    </form>
  );
}
```

**전체 에러 요약 + 인라인 에러 (선택사항)**

서버 에러나 전체 폼 상태를 요약해서 보여줘야 할 때만 사용:

```tsx
export function MyFormWithSummary() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(mySchema),
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 전체 에러 요약 (선택) */}
      <FormError variant="error" title="입력 항목 확인" errors={Object.fromEntries(Object.entries(errors).map(([key, error]) => [key, error?.message]))} />

      <FormTable title="기본 정보">
        <FormTable.Row>
          <FormTable.Cell label="이름" required>
            <FormInput name="name" control={control} />
            <FormFieldError message={errors.name?.message} />
          </FormTable.Cell>
        </FormTable.Row>
      </FormTable>

      <button type="submit">제출</button>
    </form>
  );
}
```

## 🎨 에러 스타일 가이드

### Error (기본)

- 빨간색 계열
- 필수 입력 누락, 형식 오류 등

### Warning

- 노란색 계열
- 권장사항, 주의사항

### Info

- 파란색 계열
- 안내 메시지, 도움말

### Destructive

- 진한 빨간색 계열
- 심각한 오류, 서버 에러, 인증 실패 등

## 📖 Storybook

다양한 예제는 Storybook에서 확인할 수 있습니다:

- `FormError.stories.tsx`: 에러 컴포넌트 예제
- `FormTable.stories.tsx`: 테이블 레이아웃 예제
- `FormViewer.stories.tsx`: 읽기 전용 뷰어 예제
