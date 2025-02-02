import { ToggleButtonGroup } from '@/components/ui/ToggleButtonGroup';
import { FormSectionHeader } from './FormSectionHeader';

interface OtherSelectProps {
  comfort?: string;
  sightLevel?: string;
  onComfortChange?: (value: string) => void;
  onSightLevelChange?: (value: string) => void;
  className?: string;
}

export const OtherSelect = ({
  comfort,
  sightLevel,
  onComfortChange,
  onSightLevelChange,
  className = '',
}: OtherSelectProps) => {
  const comfortOptions = ['잘 안 들려요', '평범해요', '선명해요'];
  const sightLevelOptions = ['좁아요', '평범해요', '넓어요'];

  return (
    <div className={`space-y-6 ${className}`}>
      <FormSectionHeader title="기타" />

      <div className="space-y-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-600">음향</p>
          <ToggleButtonGroup
            options={comfortOptions}
            value={comfort}
            onChange={onComfortChange}
          />
        </div>

        <div className="space-y-2">
          <p className="text-sm text-gray-600">좌석 간격</p>
          <ToggleButtonGroup
            options={sightLevelOptions}
            value={sightLevel}
            onChange={onSightLevelChange}
          />
        </div>
      </div>
    </div>
  );
};

export default OtherSelect;
