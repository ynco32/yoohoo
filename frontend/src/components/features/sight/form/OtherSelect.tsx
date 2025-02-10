import React from 'react';
import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { FormSectionHeader } from './FormSectionHeader';

type SeatDistanceStatus = '좁아요' | '평범해요' | '넓어요';
type SoundStatus = '잘 안 들려요' | '평범해요' | '선명해요';

interface OtherSelectProps {
  seatDistance?: SeatDistanceStatus;
  sound?: SoundStatus;
  onSeatDistanceChange?: (value: SeatDistanceStatus) => void;
  onSoundChange?: (value: SoundStatus) => void;
  error?: string;
  className?: string;
}

const SEAT_DISTANCE_OPTIONS: SeatDistanceStatus[] = [
  '좁아요',
  '평범해요',
  '넓어요',
];
const SOUND_OPTIONS: SoundStatus[] = ['잘 안 들려요', '평범해요', '선명해요'];

export const OtherSelect = ({
  seatDistance,
  sound,
  onSeatDistanceChange,
  onSoundChange,
  error,
  className = '',
}: OtherSelectProps) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <FormSectionHeader title="기타" />
      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">좌석 간격</p>
          <ToggleButtonGroup
            options={SEAT_DISTANCE_OPTIONS}
            value={seatDistance}
            onChange={onSeatDistanceChange}
          />
        </div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">음향</p>
          <ToggleButtonGroup
            options={SOUND_OPTIONS}
            value={sound}
            onChange={onSoundChange}
          />
        </div>
      </div>
      {error && <p className="text-sm text-status-warning">{error}</p>}
    </div>
  );
};
