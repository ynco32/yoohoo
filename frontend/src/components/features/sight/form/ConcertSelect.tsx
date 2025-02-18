import React, { useEffect, useState } from 'react';
import { Concert, concertAPI } from '@/lib/api/concertSight';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';

interface SelectProps {
  options: Concert[];
  value: number | null;
  onChange?: (value: number) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const formatDateTime = (dateTimeStr: string): string => {
  const date = new Date(dateTimeStr);
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date);
};

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
        onChange={(e) => {
          const selectedValue = e.target.value;
          if (selectedValue.length > 0) {
            onChange?.(Number(selectedValue));
          }
        }}
        disabled={disabled}
        className={`w-full appearance-none rounded-md border border-gray-100 bg-background-default px-md py-md text-gray-900 focus:border-primary-main focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${className}`}
      >
        <option value="">{placeholder}</option>
        {options.map((concert) => (
          <option key={concert.concertId} value={concert.concertId}>
            {concert.concertName} ({formatDateTime(concert.startTime)})
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-xs text-gray-600">
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
  value: number | null;
  onChange: (value: number) => void;
  error?: string;
  className?: string;
}

export const ConcertSelect = ({
  value = null,
  onChange,
  error,
  className = '',
}: ConcertSelectProps) => {
  const [concerts, setConcerts] = useState<Concert[]>([]);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState('');

  // 검색어 디바운싱 처리
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // API 호출
  useEffect(() => {
    const fetchConcerts = async () => {
      try {
        setLoading(true);
        setApiError(null);
        const response =
          await concertAPI.getConcertsByArtist(debouncedSearchTerm);
        setConcerts(response.concerts);
      } catch (error) {
        if (error instanceof Error) {
          setApiError(error.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchConcerts();
  }, [debouncedSearchTerm]);

  return (
    <div className={`space-y-sm ${className}`}>
      {/* 검색 입력 필드 */}
      <div className="relative max-w-[100px]">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2">
          <MagnifyingGlassIcon className="h-4 w-4 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="가수명"
          className="w-full border-0 border-b border-gray-200 bg-transparent py-2 pl-8 pr-3 text-sm text-gray-900 focus:border-primary-main focus:outline-none focus:ring-0"
        />
      </div>

      {/* Select 컴포넌트 */}
      <Select
        options={concerts}
        value={value}
        onChange={onChange}
        placeholder={
          searchTerm
            ? `${searchTerm}의 콘서트를 선택해주세요`
            : '콘서트를 선택해주세요'
        }
        disabled={loading}
      />

      {/* 에러 메시지 */}
      {(error || apiError) && (
        <p className="mt-xs text-sm text-status-warning">{error || apiError}</p>
      )}

      {/* 로딩 중이 아니고 검색 결과가 없는 경우 */}
      {!loading && searchTerm && concerts.length === 0 && (
        <p className="text-sm text-gray-500">검색 결과가 없습니다.</p>
      )}
    </div>
  );
};
