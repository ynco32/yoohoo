import React, { useEffect, useState } from 'react';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface SeatInfo {
  section: number | null;
  rowLine: number | null;
  columnLine: number | null;
}

interface SeatSelectProps {
  value?: SeatInfo;
  onChange?: (value: SeatInfo) => void;
  onValidation: (result: ValidationResult) => void;
  className?: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

const SeatNumberInput = ({
  label,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  value?: string;
  onChange?: (value: string) => void;
  onBlur?: () => void;
}) => (
  <div className="w-20">
    <input
      type="number"
      value={value === '0' ? '' : value}
      onChange={(e) => {
        const newValue = e.target.value;
        if (newValue === '' || parseInt(newValue) >= 0) {
          onChange?.(newValue);
        }
      }}
      onBlur={onBlur}
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
  onValidation,
  className = '',
}: SeatSelectProps) => {
  const [touched, setTouched] = useState(false);

  const validate = (): ValidationResult => {
    console.log('=== SeatSelect validation 실행 ===');
    if (value.section == null || value.section === 0) {
      console.log('❌ 구역 정보 누락');
      return {
        isValid: false,
        error: '구역을 입력해주세요',
      };
    }
    if (value.rowLine == null || value.rowLine === 0) {
      console.log('❌ 열 정보 누락');
      return {
        isValid: false,
        error: '열을 입력해주세요',
      };
    }
    if (value.columnLine == null || value.columnLine === 0) {
      console.log('❌ 번호 정보 누락');
      return {
        isValid: false,
        error: '번호를 입력해주세요',
      };
    }
    if (value.section < 0 || value.rowLine < 0 || value.columnLine < 0) {
      console.log('❌ 잘못된 숫자 입력');
      return {
        isValid: false,
        error: '올바른 숫자를 입력해주세요',
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

  const handleBlur = () => {
    setTouched(true);
  };

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
          value={value.section?.toString()}
          onChange={handleSectionChange}
          onBlur={handleBlur}
        />
        <SeatNumberInput
          label="열"
          value={value.rowLine?.toString()}
          onChange={handleRowChange}
          onBlur={handleBlur}
        />
        <SeatNumberInput
          label="번"
          value={value.columnLine?.toString()}
          onChange={handleNumberChange}
          onBlur={handleBlur}
        />
      </div>
      {touched && !validate().isValid && (
        <p className="mt-1 text-sm text-status-warning">{validate().error}</p>
      )}
    </div>
  );
};
