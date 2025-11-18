export interface DatePickerProps {
  /**
   * 날짜 변경 시 호출되는 콜백 함수
   * @param date - 선택된 날짜 문자열 (yyyy-MM-dd HH:mm:ss 형식)
   */
  onChangePickerDate?: (date: string) => void;

  /**
   * 기본 날짜 값
   * @default null
   */
  defaultDate?: string | null;

  /**
   * DatePicker 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * DatePicker 너비 설정
   * - number: px 단위로 직접 지정 (예: 300)
   * - 'default': 240px (기본값)
   * - 'full': 100%
   * @default 'default'
   */
  width?: number | 'default' | 'full';

  /**
   * placeholder 텍스트
   * @default 'Select date'
   */
  placeholderText?: string;

  /**
   * 시간 포맷 설정
   * @default 'yyyy-MM-dd 23:59:59'
   */
  timeFormat?: string;
}

/**
 * DateRangePicker 컴포넌트의 Props 타입
 */
export interface DateRangePickerProps {
  /**
   * 날짜 범위가 선택되었을 때 호출되는 콜백 함수
   * @required
   */
  onChangePickerDate: (dates: { startDate: string; endDate: string; displayStartDate?: string; displayEndDate?: string }) => void;

  /**
   * 기본 날짜 범위 값
   * @default null
   */
  defaultDate?: {
    startDate: string;
    endDate: string;
  };

  /**
   * DateRangePicker 비활성화 여부
   * @default false
   */
  disabled?: boolean;

  /**
   * DateRangePicker 너비 설정
   * - number: px 단위로 직접 지정 (예: 300)
   * - 'default': 240px (기본값)
   * - 'full': 100%
   * @default 'default'
   */
  width?: number | 'default' | 'full';

  /**
   * placeholder 텍스트
   * @default 'Select date range'
   */
  placeholderText?: string;

  /**
   * 편집 모드 여부 (시간 포맷 결정)
   * @default false
   */
  isEditMode?: boolean;
}

/**
 * changeTimeServer 함수의 파라미터 타입
 */
export interface ChangeTimeServerParams {
  time: Date | string;
  type?: string;
}
