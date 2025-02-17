'use client';

import React, { useState } from 'react';
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onChange?.(e);
  };

  const handleClear = () => {
    setValue('');
    if (onChange) {
      const event = {
        target: { value: '' },
      } as React.ChangeEvent<HTMLInputElement>;
      onChange(event);
    }
  };

  const handleSearch = () => {
    onSearch?.(value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="relative flex items-center">
      <MagnifyingGlassIcon className="absolute left-3 h-5 w-5 text-gray-600" />
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full rounded-xl  py-2.5 pl-10 pr-12 text-sm placeholder-gray-600 outline outline-1 outline-gray-600 focus:ring-1 focus:ring-gray-800 ${className}`}
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
