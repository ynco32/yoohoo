import React from 'react';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface ViewScoreSelectProps {
  value?: number;
  onChange?: (value: number) => void;
  error?: string;
  className?: string;
}

export const ViewScoreSelect = ({
  value,
  onChange,
  error,
  className,
}: ViewScoreSelectProps) => {
  const circles = [
    { size: 'w-10 h-10', value: 1 },
    { size: 'w-8 h-8', value: 2 },
    { size: 'w-6 h-6', value: 3 },
    { size: 'w-4 h-4', value: 4 },
    { size: 'w-6 h-6', value: 5 },
    { size: 'w-8 h-8', value: 6 },
    { size: 'w-10 h-10', value: 7 },
  ];

  return (
    <div className={`mt-4 space-y-4 px-4 ${className}`}>
      <FormSectionHeader title="시야" description="체감 거리를 선택해주세요" />
      <div className="flex flex-col space-y-6">
        <div className="px-2">
          <div className="flex items-center justify-between">
            {circles.map((circle, index) => (
              <button
                key={index}
                onClick={() => onChange?.(circle.value)}
                className={`rounded-full transition-all duration-normal ${circle.size} ${
                  value === circle.value
                    ? 'bg-sight-form ring-2 ring-sight-button ring-offset-2'
                    : 'bg-gray-100 blur-sm hover:bg-gray-300'
                }`}
                aria-label={`시야 거리 레벨 ${index + 1}`}
              />
            ))}
          </div>
        </div>
        <div className="flex w-full justify-between px-2">
          <span className="text-sm text-gray-500">가깝다</span>
          <span className="text-sm text-gray-500">멀다</span>
        </div>
      </div>
      {error && <p className="mt-1 text-sm text-status-warning">{error}</p>}
    </div>
  );
};
