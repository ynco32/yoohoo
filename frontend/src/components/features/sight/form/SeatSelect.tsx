import React from 'react';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface SeatInfo {
  section: string;
  row: string;
  number: string;
}

interface SeatSelectProps {
  value?: SeatInfo;
  onChange?: (value: SeatInfo) => void;
  className?: string;
}

const SeatNumberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
}) => (
  <div className="w-20">
    <input
      type="number"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder="0"
      min={0}
      className="w-full rounded border-b border-gray-200 bg-transparent p-2 text-center focus:border-primary-main focus:outline-none"
    />
    <p className="mt-1 text-center text-caption2 text-gray-500">{label}</p>
  </div>
);

export const SeatSelect = ({
  value = { section: '', row: '', number: '' },
  onChange,
  className = '',
}: SeatSelectProps) => {
  const handleSectionChange = (section: string) => {
    onChange?.({ ...value, section });
  };

  const handleRowChange = (row: string) => {
    onChange?.({ ...value, row });
  };

  const handleNumberChange = (number: string) => {
    onChange?.({ ...value, number });
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <FormSectionHeader title="좌석" />
      <div className="flex items-end space-x-4">
        <SeatNumberInput
          label="구역"
          value={value.section}
          onChange={handleSectionChange}
        />
        <SeatNumberInput
          label="열"
          value={value.row}
          onChange={handleRowChange}
        />
        <SeatNumberInput
          label="번"
          value={value.number}
          onChange={handleNumberChange}
        />
      </div>
    </div>
  );
};
