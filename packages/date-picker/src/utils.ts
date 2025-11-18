import dayjs from 'dayjs';

interface ChangeTimeServerOptions {
  time: Date | string;
  type?: string;
}

/**
 * 날짜를 서버 형식으로 변환
 * @param options - 시간과 타입 옵션
 * @returns 포맷된 날짜 문자열
 */
export const changeTimeServer = ({ time, type = 'YYYY-MM-DD HH:mm:ss' }: ChangeTimeServerOptions): string => {
  return dayjs(time).format(type);
};
