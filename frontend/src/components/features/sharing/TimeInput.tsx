import React, { useEffect, useState } from 'react';

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

  // 초기값 설정
  useEffect(() => {
    if (value) {
      const [formattedHour, formattedMinute] = value.split(':').map(Number);
      const isPM = formattedHour >= 12;
      setMeridian(isPM ? '오후' : '오전');
      setHour(isPM ? formattedHour - 12 || 12 : formattedHour || 12);
      setMinute(formattedMinute);
    }
  }, [value]);

  // 시간 값을 조합하는 함수
  const getTimeValue = (newMeridian: '오전' | '오후', newHour: number, newMinute: number) => {
    const adjustedHour = newMeridian === '오전' ? newHour % 12 : (newHour % 12) + 12;
    const formattedHour = String(adjustedHour).padStart(2, '0');
    const formattedMinute = String(newMinute).padStart(2, '0');
    return `${formattedHour}:${formattedMinute}`;
  };

  // 변경 핸들러
  const handleMeridianChange = (newMeridian: '오전' | '오후') => {
    setMeridian(newMeridian);
    onChange(getTimeValue(newMeridian, hour, minute));
  };

  const handleHourChange = (newHour: number) => {
    setHour(newHour);
    onChange(getTimeValue(meridian, newHour, minute));
  };

  const handleMinuteChange = (newMinute: number) => {
    setMinute(newMinute);
    onChange(getTimeValue(meridian, hour, newMinute));
  };

  return (
    <div>
      <label className="block text-sm mb-1">시작 시간</label>
      <div className="flex space-x-2">
        {/* 오전/오후 선택 */}
        <select
          value={meridian}
          onChange={(e) => handleMeridianChange(e.target.value as '오전' | '오후')}
          className="rounded-lg bg-gray-100 p-3"
        >
          <option value="오전">오전</option>
          <option value="오후">오후</option>
        </select>

        {/* 시간 선택 */}
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

        {/* 분 선택 */}
        <select
          value={minute}
          onChange={(e) => handleMinuteChange(Number(e.target.value))}
          className="rounded-lg bg-gray-100 p-3"
        >
          {Array.from({ length: 12 }, (_, i) => i * 5).map((m) => (
            <option key={m} value={m}>
              {String(m).padStart(2, '0')}
            </option>
          ))}
        </select>
      </div>
      {error && <p className="text-sm text-status-warning mt-1">{error}</p>}
    </div>
  );
};
