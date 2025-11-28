/**
 * @author KIM
 * @description 공통 Date Range Picker
 *
 * 1. Create : 사용하고자 하는 곳에서 DateRangePicker 호출
 * 2. Read : 초기값은 null로 설정하여 placeholder가 보이게 설정
 * 3. Update : onChangePickerDate 함수로 useState의 값을 업데이트
 * 4. Delete : clickOutDefault 함수는 선택되지 않았는데 모달창 밖 범위를 클릭했을때 초기화
 */

import 'react-datepicker/dist/react-datepicker.css';
import './styles.css';

import { enUS } from 'date-fns/locale/en-US';
import dayjs from 'dayjs';
import { range } from 'lodash-es';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';

import { AngleIcon } from './icons';
import type { DateRangePickerProps } from './types';

// react-datepicker는 date-fns 로케일이 필요하지만, 날짜 처리는 dayjs로 통일
registerLocale('enUS', enUS);

// CustomInput을 컴포넌트 외부로 선언
interface CustomInputProps extends React.HTMLProps<HTMLInputElement> {
  width?: number | 'default' | 'full';
  openDate: boolean;
  endDate: Date | null;
  disabled: boolean;
  onOpenToggle: () => void;
  onInputClick: () => void;
}

const CustomInputComponent = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ width, openDate, endDate, disabled, onOpenToggle, onInputClick, ...props }, ref) => {
    const widthClass = width === 'full' ? 'full' : '';
    const widthStyle = typeof width === 'number' ? { width: `${width}px`, flexShrink: 0 } : {};

    return (
      <div onClick={onOpenToggle} style={widthStyle}>
        <div
          className={`date_picker_wrap ${widthClass} ${openDate ? 'open' : ''} ${endDate ? 'dateuse' : ''} ${disabled ? 'disabled' : ''}`}
          onClick={onInputClick}
        >
          <input readOnly ref={ref} {...props} />
        </div>
      </div>
    );
  }
);

CustomInputComponent.displayName = 'CustomInput';

/**
 * DateRangePicker 컴포넌트
 * react-datepicker를 기반으로 한 커스텀 날짜 범위 선택 컴포넌트
 * 날짜 계산과 포맷팅은 모두 dayjs를 사용합니다.
 */
export const DateRangePicker: React.FC<DateRangePickerProps> = ({
  onChangePickerDate,
  defaultDate,
  disabled = false,
  width,
  placeholderText = 'Select date range',
  isEditMode = false,
}) => {
  const isDefaultDate = defaultDate?.startDate && defaultDate?.endDate;
  const [openDate, setOpenDate] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(isDefaultDate ? dayjs(defaultDate.startDate).toDate() : null);
  const [endDate, setEndDate] = useState<Date | null>(isDefaultDate ? dayjs(defaultDate.endDate).toDate() : null);
  const [currentDate, setCurrentDate] = useState<Date[] | null>(null);

  // dayjs를 사용한 연도 범위 생성
  const currentYear = dayjs().year();
  const years = range(currentYear - 30, currentYear + 31, 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const calendar = useRef<ReactDatePicker>(null);

  const openDatePicker = () => {
    calendar.current?.setOpen(true);
    setOpenDate(true);
  };

  const resetInitDate = useCallback(() => {
    setStartDate(null);
    setEndDate(null);
  }, []);

  const formatToServerTime = (date: Date, isStartDate = true) => {
    const formatString = isStartDate ? '00:00:00' : '23:59:59';
    const type = isEditMode ? 'YYYY-MM-DD 00:00:00' : 'YYYY-MM-DD HH:mm:ss';

    if (isEditMode) {
      return dayjs(date).format(type);
    }

    return dayjs(`${dayjs(date).format('YYYY-MM-DD')} ${formatString}`).format(type);
  };

  const clickOutDefault = () => {
    if (!currentDate) {
      setOpenDate(false);
      setStartDate(null);
      setEndDate(null);
      return;
    }

    const [start, end] = currentDate;
    if (!start || !end) return;

    setStartDate(start);
    setEndDate(end);
    onChangePickerDate({
      startDate: formatToServerTime(start, true),
      endDate: formatToServerTime(end, false),
      displayStartDate: dayjs(start).format('YYYY-MM-DD'),
      displayEndDate: dayjs(end).format('YYYY-MM-DD'),
    });
    setOpenDate(false);
  };

  const closeDatePicker = () => {
    if (!startDate || !endDate) return;

    onChangePickerDate({
      displayStartDate: dayjs(startDate).format('YYYY-MM-DD'),
      displayEndDate: dayjs(endDate).format('YYYY-MM-DD'),
      startDate: formatToServerTime(startDate, true),
      endDate: formatToServerTime(endDate, false),
    });

    if (startDate && endDate) {
      setCurrentDate([startDate, endDate]);
    }

    calendar.current?.setOpen(false);
    setOpenDate(false);
  };

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  const inputClickOut = () => {
    if (openDate) {
      clickOutDefault();
      calendar?.current?.setOpen(false);
    }
  };

  // Sync with external defaultDate prop when it changes
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (!defaultDate?.startDate || !defaultDate?.endDate) {
      resetInitDate();
    } else {
      const newStartDate = dayjs(defaultDate.startDate).toDate();
      const newEndDate = dayjs(defaultDate.endDate).toDate();
      setStartDate(newStartDate);
      setEndDate(newEndDate);
      if (defaultDate.startDate && defaultDate.endDate) {
        setCurrentDate([newStartDate, newEndDate]);
      }
    }
  }, [defaultDate?.startDate, defaultDate?.endDate, resetInitDate]);
  /* eslint-enable react-hooks/set-state-in-effect */

  const handleOpenToggle = useCallback(() => {
    setOpenDate(!openDate);
  }, [openDate]);

  return (
    <ReactDatePicker
      className="date_picker"
      renderCustomHeader={({ date, changeYear, changeMonth, decreaseMonth, increaseMonth, prevMonthButtonDisabled, nextMonthButtonDisabled }) => (
        <div className="date_picker_header">
          <div className="date_picker_header_left">
            <select className="select" value={dayjs(date).year()} onChange={({ target: { value } }) => changeYear(Number(value))}>
              {years.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div className="date_picker_header_right">
            <button type="button" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
              <div style={{ transform: 'rotate(180deg)' }}>
                <AngleIcon width={24} height={24} fill="#657496" />
              </div>
            </button>
            <select className="select" value={months[dayjs(date).month()]} onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}>
              {months.map(option => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <button type="button" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
              <AngleIcon width={24} height={24} fill="#657496" />
            </button>
          </div>
        </div>
      )}
      ref={calendar}
      startDate={startDate}
      endDate={endDate}
      shouldCloseOnSelect={false}
      onInputClick={openDatePicker}
      selected={startDate}
      dateFormat="yyyy-MM-dd"
      placeholderText={placeholderText}
      locale="enUS"
      onClickOutside={clickOutDefault}
      selectsRange
      customInput={
        <CustomInputComponent
          width={width}
          openDate={openDate}
          endDate={endDate}
          disabled={disabled}
          onOpenToggle={handleOpenToggle}
          onInputClick={inputClickOut}
        />
      }
      onChange={onChange}
      disabled={disabled}
    >
      <div className="button-container">
        <button type="button" className={endDate ? 'btn_ctrl active' : 'btn_ctrl btn_ctrl-confirm'} disabled={!endDate} onClick={closeDatePicker}>
          Date Selected
        </button>
      </div>
    </ReactDatePicker>
  );
};

export default DateRangePicker;
