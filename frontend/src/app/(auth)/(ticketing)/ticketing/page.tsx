import React from 'react';
import PlatformButtons from '@/components/features/ticketing/PlatformButtons';

export default function PlatformListPage() {
  return (
    <div className="bg-ticketing-bg h-full">
      <div className="flex items-center justify-center px-3 py-20">
        <span className="font-title-bold text-text-menu">
          연습할 플랫폼을 선택해주세요
        </span>
      </div>
      <div className="container">
        <PlatformButtons />
      </div>
    </div>
  );
}
