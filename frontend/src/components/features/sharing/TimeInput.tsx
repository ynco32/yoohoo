import React, { useEffect, useState, useCallback } from 'react';

export const TimeInput = ({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) => {
  const [meridian, setMeridian] = useState<'오전' | '오후'>('오전');
  const [hour, setHour] = useState<number>(12);
  const [minute, setMinute] = useState<number>(0);

  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오는 함수를 메모이제이션
  const getCurrentDate = useCallback(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }, []);

  // 시간 값을 ISO 형식으로 조합하는 함수를 메모이제이션
  const getTimeValue = useCallback(
    (newMeridian: '오전' | '오후', newHour: number, newMinute: number) => {
      const adjustedHour =
        newMeridian === '오전' ? newHour % 12 : (newHour % 12) + 12;
      const formattedHour = String(adjustedHour).padStart(2, '0');
      const formattedMinute = String(newMinute).padStart(2, '0');
      return `${getCurrentDate()}T${formattedHour}:${formattedMinute}:00`;
    },
    [getCurrentDate]
  );

  // 초기값 설정
  useEffect(() => {
    if (value) {
      // T로 시간 부분 분리하고, :00이 없을 수 있으므로 더 유연한 매칭 사용
      const timeMatch = value.split('T')[1]?.match(/(\d{2}):(\d{2})/);
      if (timeMatch) {
        const [, hours, minutes] = timeMatch;
        const hourNum = parseInt(hours, 10);
        const isPM = hourNum >= 12;

        // 12시간제로 변환
        const hour12 = isPM
          ? hourNum === 12
            ? 12
            : hourNum - 12
          : hourNum === 0
            ? 12
            : hourNum;

        setMeridian(isPM ? '오후' : '오전');
        setHour(hour12);
        setMinute(parseInt(minutes, 10));
      }
    } else {
      // value가 없을 경우 기본값 설정
      onChange(getTimeValue('오전', 12, 0));
    }
  }, [value, onChange, getTimeValue]);

  // 변경 핸들러들을 메모이제이션
  const handleMeridianChange = useCallback(
    (newMeridian: '오전' | '오후') => {
      setMeridian(newMeridian);
      onChange(getTimeValue(newMeridian, hour, minute));
    },
    [onChange, getTimeValue, hour, minute]
  );

  const handleHourChange = useCallback(
    (newHour: number) => {
      setHour(newHour);
      onChange(getTimeValue(meridian, newHour, minute));
    },
    [onChange, getTimeValue, meridian, minute]
  );

  const handleMinuteChange = useCallback(
    (newMinute: number) => {
      setMinute(newMinute);
      onChange(getTimeValue(meridian, hour, newMinute));
    },
    [onChange, getTimeValue, meridian, hour]
  );

  return (
    <div>
      <div className="flex space-x-2">
        <select
          value={meridian}
          onChange={(e) =>
            handleMeridianChange(e.target.value as '오전' | '오후')
          }
          className="rounded-lg bg-gray-100 p-3"
        >
          <option value="오전">오전</option>
          <option value="오후">오후</option>
        </select>

        <select
          value={hour}
          onChange={(e) => handleHourChange(Number(e.target.value))}
          className="rounded-lg bg-gray-100 p-3"
        >
          {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
            <option key={h} value={h}>
              {h}
            </option>
          ))}
        </select>

        <select
          value={minute}
          onChange={(e) => handleMinuteChange(Number(e.target.value))}
          className="rounded-lg bg-gray-100 p-3"
        >
          {Array.from({ length: 6 }, (_, i) => i * 10).map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="mt-1 text-sm text-status-warning">{error}</p>}
    </div>
  );
};
