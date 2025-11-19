/**
 * @author KIM
 * @description 공통 Date picker
 *
 * 1. Create : 사용하고자 하는 곳에서 DatePicker 호출
 * 2. Read : 초기값은 null로 설정하여 placeholder가 보이게 설정
 * 3. Update : onChangePickerDate 함수로 useState의 값을 업데이트
 * 4. Delete : clickOutDefault 함수는 선택되지 않았는데 모달창 밖 범위를 클릭했을때 초기화
 */

import { enUS } from 'date-fns/locale/en-US';
import dayjs from 'dayjs';
import { range } from 'lodash-es';
import React, { forwardRef, useCallback, useEffect, useRef, useState } from 'react';
import ReactDatePicker, { registerLocale } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { AngleIcon } from './icons';
import './styles.css';
import type { DatePickerProps } from './types';
import { changeTimeServer } from './utils';

// react-datepicker는 date-fns 로케일이 필요하지만, 날짜 처리는 dayjs로 통일
registerLocale('enUS', enUS);

// CustomInput을 컴포넌트 외부로 선언
interface CustomInputProps extends React.HTMLProps<HTMLInputElement> {
  width?: number | 'full';
  openDate: boolean;
  selectedDate: Date | null;
  disabled: boolean;
  onOpenToggle: () => void;
  onInputClick: () => void;
}

const CustomInputComponent = forwardRef<HTMLInputElement, CustomInputProps>(
  ({ width, openDate, selectedDate, disabled, onOpenToggle, onInputClick, ...props }, ref) => {
    const widthClass = width === 'full' ? 'full' : '';
    const widthStyle = typeof width === 'number' ? { width: `${width}px`, flexShrink: 0 } : {};

    return (
      <div onClick={onOpenToggle} style={widthStyle}>
        <div
          className={`date_picker_wrap ${widthClass} ${openDate ? 'open' : ''} ${selectedDate ? 'dateuse' : ''} ${disabled ? 'disabled' : ''}`}
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
 * DatePicker 컴포넌트
 * react-datepicker를 기반으로 한 커스텀 날짜 선택 컴포넌트
 * 날짜 계산과 포맷팅은 모두 dayjs를 사용합니다.
 */
export const DatePicker: React.FC<DatePickerProps> = ({ onChangePickerDate, defaultDate = null, disabled = false, width, placeholderText = 'Select date' }) => {
  const [openDate, setOpenDate] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(defaultDate ? dayjs(defaultDate).toDate() : null);
  const [tempDate, setTempDate] = useState<Date | null>(null);

  // dayjs를 사용한 연도 범위 생성
  const currentYear = dayjs().year();
  const years = range(currentYear - 30, currentYear + 31, 1);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const calendar = useRef<ReactDatePicker>(null);

  useEffect(() => {
    // Sync with external defaultDate prop when it changes
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedDate(defaultDate ? dayjs(defaultDate).toDate() : null);
  }, [defaultDate]);

  const openDatePicker = () => {
    calendar.current?.setOpen(true);
    setOpenDate(true);
  };

  const closeDatePicker = () => {
    if (onChangePickerDate && selectedDate) {
      // dayjs를 사용한 날짜 포맷팅
      onChangePickerDate(changeTimeServer({ time: selectedDate, type: 'YYYY-MM-DD 23:59:59' }));
    }

    if (selectedDate) {
      setTempDate(selectedDate);
    }

    calendar.current?.setOpen(false);
    setOpenDate(false);
  };

  const clickOutDefault = () => {
    if (!tempDate) {
      setSelectedDate(defaultDate ? dayjs(defaultDate).toDate() : tempDate);
      setOpenDate(false);
      return;
    }

    setSelectedDate(tempDate);
    if (onChangePickerDate && tempDate) {
      // dayjs를 사용한 날짜 포맷팅
      onChangePickerDate(changeTimeServer({ time: tempDate, type: 'YYYY-MM-DD 23:59:59' }));
    }
    setOpenDate(false);
  };

  const onChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const inputClickOut = () => {
    if (openDate) {
      clickOutDefault();
      calendar.current?.setOpen(false);
    }
  };

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
      shouldCloseOnSelect={false}
      onInputClick={openDatePicker}
      selected={selectedDate}
      dateFormat="yyyy-MM-dd"
      placeholderText={placeholderText}
      locale="enUS"
      customInput={
        <CustomInputComponent
          width={width}
          openDate={openDate}
          selectedDate={selectedDate}
          disabled={disabled}
          onOpenToggle={handleOpenToggle}
          onInputClick={inputClickOut}
        />
      }
      onClickOutside={clickOutDefault}
      onChange={onChange}
      disabled={disabled}
    >
      <div className="button-container">
        <button type="button" className={selectedDate ? 'btn_ctrl active' : 'btn_ctrl btn_ctrl-confirm'} disabled={!selectedDate} onClick={closeDatePicker}>
          Date Selected
        </button>
      </div>
    </ReactDatePicker>
  );
};

export default DatePicker;
