'use client';

import { useState } from 'react';
import { ConcertList } from '@/components/features/sharing/ConcertList';
import { SearchInput } from '@/components/common/SearchInput';

export default function SharingPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = (value: string) => {
    // 새로운 검색어가 이전과 다를 때만 업데이트
    if (value !== searchTerm) {
      setSearchTerm(value);
    }
  };

  return (
    <div className="flex h-[calc(100vh-56px)] flex-col bg-sight-main-gra">
      <div className="sticky top-0 z-20 flex-none bg-white">
        <div className="px-4 py-3 pb-1">
          <SearchInput placeholder="공연명 검색" onSearch={handleSearch} />
        </div>
        <div className="flex items-center justify-between px-4 py-1 pt-2">
          <h2 className="text-base font-bold text-gray-700">다가오는 콘서트</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto bg-transparent px-4">
        <div className="pt-2">
          {' '}
          {/* 약간의 상단 여백 */}
          <ConcertList searchTerm={searchTerm} />
        </div>
        <div className="h-10" />
      </div>
    </div>
  );
}
