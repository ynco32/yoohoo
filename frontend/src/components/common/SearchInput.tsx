'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/20/solid';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onSearch?: (value: string) => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const SearchInput = ({
  placeholder = '검색어를 입력하세요',
  className = '',
  onSearch,
  onChange,
}: SearchInputProps) => {
  const [value, setValue] = useState('');
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 입력값이 변경될 때마다 실행
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);

    // 기존 onChange 콜백 호출
    onChange?.(e);

    // 디바운싱 처리 - 타이핑 중에 과도한 API 호출 방지
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      onSearch?.(newValue);
    }, 300); // 300ms 딜레이
  };

  // 검색어 초기화
  const handleClear = () => {
    setValue('');

    // 기존 onChange 콜백 호출 (이벤트 객체 모방)
    if (onChange) {
      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }

    // 검색어 초기화 시 즉시 검색 실행 (전체 결과 표시)
    onSearch?.('');
  };

  // Enter 키 처리
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      onSearch?.(value);
    }
  };

  // 컴포넌트 언마운트 시 타이머 정리
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex items-center">
      <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-600" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-xl py-2.5 pl-10 pr-12 text-sm placeholder-gray-600 outline outline-1 outline-gray-600 focus:ring-1 focus:ring-gray-800 ${className}`}
      />
      {value && (
        <div className="absolute right-2 flex items-center">
          <button
            type="button"
            onClick={handleClear}
            className="rounded-full p-1.5 hover:bg-gray-100"
          >
            <XMarkIcon className="h-4 w-4 text-gray-600" />
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchInput;
