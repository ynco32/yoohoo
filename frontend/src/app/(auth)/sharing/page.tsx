'use client';

import { ConcertList } from '@/components/features/sharing/ConcertList';
import { SearchInput } from '@/components/common/SearchInput';

export default function SharingPage() {
  return (
    <div className="flex h-[calc(100vh-56px)] flex-col">
      <div className="sticky top-0 bg-white px-4 py-3 shadow-sm">
        <SearchInput placeholder="공연명 검색" />
      </div>
      <div className="flex-1 overflow-auto px-4">
        <ConcertList />
        <div className="h-10" />
      </div>
    </div>
  );
}
