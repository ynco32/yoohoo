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
    <div className="flex h-[calc(100vh-56px)] flex-col">
      <div className="sticky top-0 z-10 bg-white">
        <div className="px-4 py-4">
          <SearchInput placeholder="공연명 검색" onSearch={handleSearch} />
        </div>
        <div className="flex items-center justify-between px-4 py-3">
          <h2 className="text-lg font-medium">다가오는 콘서트</h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4">
        <ConcertList searchTerm={searchTerm} />
        <div className="h-10" />
      </div>
    </div>
  );
}
