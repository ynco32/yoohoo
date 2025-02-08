import React from 'react';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface SeatInfo {
  section: number | null;
  rowLine: number | null;
  columnLine: number | null;
}

interface SeatSelectProps {
  value?: SeatInfo;
  onChange?: (value: SeatInfo) => void;
  error?: string;
  className?: string;
}

const SeatNumberInput = ({
  label,
  value,
  onChange,
}: {
  label: string;
  value?: number | null;
  onChange?: (value: string) => void;
}) => (
  <div className="w-20">
    <input
      type="number"
      value={value?.toString() || ''}
      onChange={(e) => {
        const newValue = e.target.value;
        if (newValue === '' || parseInt(newValue) >= 0) {
          onChange?.(newValue);
        }
      }}
      placeholder=""
      min={0}
      className="w-full rounded border-b border-gray-200 bg-transparent p-2 text-center focus:border-primary-main focus:outline-none"
    />
    <p className="mt-1 text-center text-caption2 text-gray-500">{label}</p>
  </div>
);

export const SeatSelect = ({
  value = { section: null, rowLine: null, columnLine: null },
  onChange,
  error,
  className = '',
}: SeatSelectProps) => {
  const handleSectionChange = (section: string) => {
    onChange?.({
      ...value,
      section: section.length > 0 ? Number(section) : null,
    });
  };

  const handleRowChange = (rowLine: string) => {
    onChange?.({
      ...value,
      rowLine: rowLine.length > 0 ? Number(rowLine) : null,
    });
  };

  const handleNumberChange = (columnLine: string) => {
    onChange?.({
      ...value,
      columnLine: columnLine.length > 0 ? Number(columnLine) : null,
    });
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
          value={value.rowLine}
          onChange={handleRowChange}
        />
        <SeatNumberInput
          label="번"
          value={value.columnLine}
          onChange={handleNumberChange}
        />
      </div>
      {error && <p className="mt-1 text-sm text-status-warning">{error}</p>}
    </div>
  );
};
