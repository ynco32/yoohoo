import React, { useEffect, useState } from 'react';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface ViewScoreSelectProps {
  value?: number;
  onChange?: (value: number) => void;
  onValidation: (result: ValidationResult) => void;
  className?: string;
}

const ViewScoreSelect = ({
  value = 0,
  onChange,
  onValidation,
  className = '',
}: ViewScoreSelectProps) => {
  const [touched, setTouched] = useState(false);

  // Array of circle sizes from smallest to largest
  const circles = [
    { size: 'w-4 h-4', value: 0 },
    { size: 'w-5 h-5', value: 1 },
    { size: 'w-6 h-6', value: 2 },
    { size: 'w-7 h-7', value: 3 },
    { size: 'w-8 h-8', value: 4 },
    { size: 'w-9 h-9', value: 5 },
    { size: 'w-10 h-10', value: 6 },
  ];

  const validate = (): ValidationResult => {
    console.log('=== ViewScoreSelect validation 실행 ===');
    if (value === 0) {
      console.log('❌ 시야 점수 미선택');
      return {
        isValid: false,
        error: '시야 거리를 선택해주세요',
      };
    }
    console.log('✅ validation 성공');
    return { isValid: true };
  };

  useEffect(() => {
    if (touched) {
      const validationResult = validate();
      if (!validationResult.isValid) {
        console.log('Validation Error:', validationResult.error);
      }
      onValidation(validationResult);
    }
  }, [value, touched]);

  const handleClick = (newValue: number) => {
    setTouched(true);
    onChange?.(newValue);
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <FormSectionHeader title="시야" description="시야 거리를 선택해주세요" />
      <div className="flex items-center justify-between px-2">
        <span className="text-sm text-gray-500">가깝다</span>
        <div className="flex items-center gap-2">
          {circles.map((circle, index) => (
            <button
              key={index}
              onClick={() => handleClick(circle.value)}
              className={`rounded-full transition-all duration-normal ${circle.size} ${
                value === circle.value
                  ? 'bg-primary-main ring-2 ring-primary-main ring-offset-2'
                  : 'bg-gray-200 hover:bg-gray-300'
              } `}
              aria-label={`시야 거리 레벨 ${index + 1}`}
            />
          ))}
        </div>
        <span className="text-sm text-gray-500">멀다</span>
      </div>
      {touched && !validate().isValid && (
        <p className="mt-1 text-sm text-status-warning">{validate().error}</p>
      )}
    </div>
  );
};

export default ViewScoreSelect;
