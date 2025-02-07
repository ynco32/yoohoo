import React, { useEffect, useState } from 'react';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { FormSectionHeader } from './FormSectionHeader';

type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
type SoundStatus = '나쁨' | '보통' | '좋음';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface OtherSelectProps {
  seatDistance?: SeatDistanceStatus;
  sound?: SoundStatus;
  onSeatDistanceChange?: (value: SeatDistanceStatus) => void;
  onSoundChange?: (value: SoundStatus) => void;
  onValidation?: (result: ValidationResult) => void;
  className?: string;
}

const SEAT_DISTANCE_OPTIONS: SeatDistanceStatus[] = [
  '좁아요',
  '평범해요',
  '넓어요',
];
const SOUND_OPTIONS: SoundStatus[] = ['나쁨', '보통', '좋음'];

export const OtherSelect = ({
  seatDistance = '',
  sound = '',
  onSeatDistanceChange,
  onSoundChange,
  onValidation,
  className = '',
}: OtherSelectProps) => {
  const [touched, setTouched] = useState(false);

  const validate = (): ValidationResult => {
    if (!seatDistance || !sound) {
      return {
        isValid: false,
        error: '좌석 간격과 음향을 모두 선택해주세요',
      };
    }
    return { isValid: true };
  };

  useEffect(() => {
    if (touched) {
      const validationResult = validate();
      onValidation?.(validationResult);
    }
  }, [seatDistance, sound, touched, onValidation]);

  const handleSeatDistanceChange = (value: SeatDistanceStatus) => {
    setTouched(true);
    onSeatDistanceChange?.(value);
  };

  const handleSoundChange = (value: SoundStatus) => {
    setTouched(true);
    onSoundChange?.(value);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <FormSectionHeader title="기타" />

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">좌석 간격</p>
          <ToggleButtonGroup
            options={SEAT_DISTANCE_OPTIONS}
            value={seatDistance}
            onChange={handleSeatDistanceChange}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">음향</p>
          <ToggleButtonGroup
            options={SOUND_OPTIONS}
            value={sound}
            onChange={handleSoundChange}
          />
        </div>
      </div>

      {touched && !validate().isValid && (
        <p className="text-sm text-status-warning">{validate().error}</p>
      )}
    </div>
  );
};

export default OtherSelect;
