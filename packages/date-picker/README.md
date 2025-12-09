# @repo/date-picker 사용 가이드

dayjs 기반 DatePicker/DateRangePicker 컴포넌트를 제공하는 패키지입니다.

## 빠른 시작

```tsx
import { DatePicker, DateRangePicker } from '@repo/date-picker';
import '@repo/date-picker/styles.css';

// 단일 날짜
<DatePicker defaultDate="2025-01-01" onChangePickerDate={date => console.log(date)} />;

// 날짜 범위
<DateRangePicker
  defaultDate={{ startDate: '', endDate: '' }}
  onChangePickerDate={({ startDate, endDate, displayStartDate, displayEndDate }) => {
    console.log('서버용', startDate, endDate);
    console.log('표시용', displayStartDate, displayEndDate);
  }}
/>;
```

## 주요 Props

- 공통
  - `onChangePickerDate`: 선택 시 호출되는 콜백 (필수)
  - `defaultDate`: 초기 값 (`string` 또는 `{ startDate, endDate }`)
  - `disabled`: 비활성화 여부
  - `width`: `number | 'default' | 'full'` (기본 240px)
  - `placeholderText`: 플레이스홀더
- DatePicker 전용
  - `timeFormat`: 기본 `'yyyy-MM-dd 23:59:59'`
- DateRangePicker 전용
  - `isEditMode`: `true`면 시간을 `00:00:00`으로 고정

## 스타일 커스터마이징

CSS 변수로 색상을 오버라이드할 수 있습니다.

```css
:root {
  --datepicker-navy100: #e8ebf0;
  --datepicker-blue400: #3357ff;
}
```

## Peer Dependencies

- react / react-dom ^18 || ^19

## 참고 링크

- react-datepicker: https://reactdatepicker.com/
- dayjs: https://day.js.org/
