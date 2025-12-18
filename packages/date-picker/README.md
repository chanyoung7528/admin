# @repo/date-picker

React DatePicker 컴포넌트 with dayjs integration

## 소개

`@repo/date-picker`는 react-datepicker를 기반으로 한 커스텀 날짜 선택 컴포넌트입니다. dayjs를 사용하여 날짜를 처리하며, 확장 가능하고 사용하기 쉬운 API를 제공합니다.

## 특징

- ✨ **dayjs 기반**: 모든 날짜 계산과 포맷팅은 dayjs를 사용하여 일관성 있게 처리
- 🎨 완전히 커스터마이징 가능한 스타일
- 📱 반응형 디자인
- 🔧 TypeScript 지원
- 🚀 경량 번들 크기

### 날짜 라이브러리 사용

이 패키지는 날짜 처리를 위해 **dayjs**를 사용합니다:

- ✅ 날짜 포맷팅: dayjs
- ✅ 날짜 계산: dayjs
- ✅ 연도/월 추출: dayjs
- ✅ Date 객체 변환: dayjs

date-fns는 react-datepicker의 로케일 시스템에만 최소한으로 사용됩니다.

## 설치

```bash
# 모노레포(이 레포)에서 워크스페이스 패키지로 추가
pnpm --filter <target-workspace> add @repo/date-picker@workspace:*

# 예)
pnpm --filter my-app add @repo/date-picker@workspace:*
pnpm --filter storybook-docs add @repo/date-picker@workspace:*
```

## Peer Dependencies

이 패키지는 다음 의존성들을 peer dependency로 요구합니다:

```json
{
  "react": "^18.0.0 || ^19.0.0",
  "react-dom": "^18.0.0 || ^19.0.0"
}
```

## 사용법

### DatePicker - 단일 날짜 선택

```tsx
import { DatePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';
import { useState } from 'react';

function App() {
  const [selectedDate, setSelectedDate] = useState<string>('');

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    console.log('Selected date:', date);
  };

  return <DatePicker onChangePickerDate={handleDateChange} placeholderText="날짜를 선택하세요" />;
}
```

### DateRangePicker - 날짜 범위 선택

```tsx
import { DateRangePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';
import { useState } from 'react';

function App() {
  const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

  const handleDateRangeChange = ({ startDate, endDate, displayStartDate, displayEndDate }) => {
    console.log('서버 전송용:', { startDate, endDate });
    console.log('화면 표시용:', { displayStartDate, displayEndDate });
    setDateRange({ startDate, endDate });
  };

  return <DateRangePicker defaultDate={dateRange} onChangePickerDate={handleDateRangeChange} placeholderText="날짜 범위를 선택하세요" />;
}
```

### DatePicker Props

| Prop                 | Type                            | Default                 | Description                                                      |
| -------------------- | ------------------------------- | ----------------------- | ---------------------------------------------------------------- |
| `onChangePickerDate` | `(date: string) => void`        | `undefined`             | 날짜가 선택되었을 때 호출되는 콜백 함수                          |
| `defaultDate`        | `string \| null`                | `null`                  | 기본 날짜 값 (yyyy-MM-dd 형식)                                   |
| `disabled`           | `boolean`                       | `false`                 | DatePicker 비활성화 여부                                         |
| `width`              | `number \| 'default' \| 'full'` | `'default'`             | DatePicker 너비 설정 (숫자: px 단위, default: 240px, full: 100%) |
| `placeholderText`    | `string`                        | `'Select date'`         | placeholder 텍스트                                               |
| `timeFormat`         | `string`                        | `'yyyy-MM-dd 23:59:59'` | 시간 포맷 설정                                                   |

### DateRangePicker Props

| Prop                 | Type                            | Default                | Description                                                           |
| -------------------- | ------------------------------- | ---------------------- | --------------------------------------------------------------------- |
| `onChangePickerDate` | `(dates: object) => void`       | `undefined` (required) | 날짜 범위가 선택되었을 때 호출되는 콜백 함수                          |
| `defaultDate`        | `object`                        | `null`                 | 기본 날짜 범위 값 `{ startDate: string, endDate: string }`            |
| `disabled`           | `boolean`                       | `false`                | DateRangePicker 비활성화 여부                                         |
| `width`              | `number \| 'default' \| 'full'` | `'default'`            | DateRangePicker 너비 설정 (숫자: px 단위, default: 240px, full: 100%) |
| `placeholderText`    | `string`                        | `'Select date range'`  | placeholder 텍스트                                                    |
| `isEditMode`         | `boolean`                       | `false`                | 편집 모드 (시간을 00:00:00으로 고정)                                  |

### 예제

#### 기본 예제 (width 생략 시 기본 240px 적용)

```tsx
import { DatePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';

function BasicExample() {
  return <DatePicker onChangePickerDate={date => console.log(date)} placeholderText="날짜 선택" />;
}
```

#### 기본값이 있는 예제

```tsx
import { DatePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';

function DefaultDateExample() {
  return <DatePicker defaultDate="2025-01-01" onChangePickerDate={date => console.log(date)} />;
}
```

#### 너비 옵션 예제

```tsx
import { DatePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';

function WidthExample() {
  return (
    <div>
      {/* width 미지정 - 기본 240px */}
      <DatePicker onChangePickerDate={date => console.log(date)} />

      {/* width={300} - 300px */}
      <DatePicker width={300} onChangePickerDate={date => console.log(date)} />

      {/* width={400} - 400px */}
      <DatePicker width={400} onChangePickerDate={date => console.log(date)} />

      {/* width="full" - 100% */}
      <DatePicker width="full" onChangePickerDate={date => console.log(date)} />
    </div>
  );
}
```

#### 비활성화 예제

```tsx
import { DatePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';

function DisabledExample() {
  return <DatePicker disabled defaultDate="2025-01-01" />;
}
```

#### Form과 함께 사용

```tsx
import { DatePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';
import { useState } from 'react';

function FormExample() {
  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>시작 날짜</label>
        <DatePicker defaultDate={formData.startDate} onChangePickerDate={date => setFormData({ ...formData, startDate: date })} />
      </div>
      <div>
        <label>종료 날짜</label>
        <DatePicker defaultDate={formData.endDate} onChangePickerDate={date => setFormData({ ...formData, endDate: date })} />
      </div>
      <button type="submit">제출</button>
    </form>
  );
}
```

## 스타일 커스터마이징

CSS 변수를 사용하여 DatePicker의 스타일을 커스터마이징할 수 있습니다:

```css
:root {
  --datepicker-navy100: #e8ebf0;
  --datepicker-navy200: #a2adc1;
  --datepicker-typo900: #1a1a1a;
  --datepicker-bg: #f5f5f5;
  --datepicker-blue50: #e6f0ff;
  --datepicker-blue400: #3357ff;
}
```

## DateRangePicker 콜백 인터페이스

`onChangePickerDate` 콜백은 다음 객체를 받습니다:

```typescript
{
  startDate: string;        // 서버 형식 (YYYY-MM-DD HH:mm:ss)
  endDate: string;          // 서버 형식 (YYYY-MM-DD HH:mm:ss)
  displayStartDate?: string; // 표시 형식 (YYYY-MM-DD)
  displayEndDate?: string;   // 표시 형식 (YYYY-MM-DD)
}
```

### 예시

```tsx
const handleDateRangeChange = ({ startDate, endDate, displayStartDate, displayEndDate }) => {
  console.log('서버 전송용:', startDate, endDate);
  console.log('화면 표시용:', displayStartDate, displayEndDate);
};
```

## 유틸리티 함수

### changeTimeServer

날짜를 서버 형식으로 변환하는 유틸리티 함수입니다.

```tsx
import { changeTimeServer } from '@repo/date-picker';

const formatted = changeTimeServer({
  time: new Date(),
  type: 'YYYY-MM-DD HH:mm:ss',
});
console.log(formatted); // "2025-11-18 23:59:59"
```

## 개발

### 빌드

```bash
pnpm --filter @repo/date-picker build
```

### 타입 체크

```bash
pnpm --filter @repo/date-picker type-check
```

### 린트

```bash
pnpm --filter @repo/date-picker lint
```

### 클린

```bash
pnpm --filter @repo/date-picker clean
```

## 브라우저 지원

- Chrome (최신)
- Firefox (최신)
- Safari (최신)
- Edge (최신)
