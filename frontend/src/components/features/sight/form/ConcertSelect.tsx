import React, { useMemo } from 'react';
import { FormSectionHeader } from '@/components/features/sight/form/FormSectionHeader';

interface Concert {
  concertId: string;
  label: string;
  artist: string;
}

interface ValidationResult {
  isValid: boolean;
  error?: string;
}

interface SelectProps {
  options: Concert[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const Select = ({
  options,
  value,
  onChange,
  placeholder = '선택해주세요',
  disabled = false,
  className = '',
}: SelectProps) => {
  return (
    <div className="relative">
      <select
        value={value ?? ''}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        className={`w-full appearance-none rounded-lg border border-gray-200 bg-background-default p-3 text-gray-900 focus:border-primary-main focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
      >
        <option value="" disabled>
          {placeholder}
        </option>
        {options.map((option) => (
          <option key={option.concertId} value={option.concertId}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-600">
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>
    </div>
  );
};

interface ConcertSelectProps {
  artist?: string;
  value: string;
  onChange: (value: string) => void;
  onValidation: (result: ValidationResult) => void;
  className?: string;
}

export const ConcertSelect = ({
  artist,
  value,
  onChange,
  onValidation,
  className = '',
}: ConcertSelectProps) => {
  const validate = (): ValidationResult => {
    if (value.length === 0 || value.length === 0) {
      return {
        isValid: false,
        error: '콘서트를 선택해주세요',
      };
    }
    return { isValid: true };
  };

  const handleChange = (newValue: string) => {
    onChange(newValue);
    onValidation(validate());
  };

  const concerts: Concert[] = [
    { concertId: '1', label: 'WORLD TOUR [BORN PINK]', artist: 'BLACKPINK' },
    { concertId: '2', label: '5TH WORLD TOUR', artist: 'TWICE' },
    { concertId: '3', label: 'TOUR THE DREAM SHOW2', artist: 'NCT DREAM' },
    { concertId: '4', label: 'WORLD TOUR [SYNK]', artist: 'BLACKPINK' },
    { concertId: '5', label: 'READY TO BE', artist: 'TWICE' },
  ];

  const filteredConcerts = useMemo(() => {
    if (artist == null) return concerts;
    return concerts.filter((concert) => concert.artist === artist);
  }, [artist]);

  return (
    <div className={`space-y-2 ${className}`}>
      <FormSectionHeader
        title="콘서트"
        description={
          artist != null
            ? `${artist}의 콘서트 중 리뷰를 작성할 공연을 선택해주세요`
            : '리뷰를 작성할 콘서트를 선택해주세요'
        }
      />
      <Select
        options={filteredConcerts}
        value={value}
        onChange={handleChange}
        placeholder={
          artist != null
            ? `${artist}의 콘서트를 선택해주세요`
            : '콘서트를 선택해주세요'
        }
      />
    </div>
  );
};
