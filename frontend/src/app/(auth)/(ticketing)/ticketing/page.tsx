import React from 'react';
import PlatformButtons from '@/components/features/ticketing/PlatformButtons';

export default function PlatformListPage() {
  return (
    <div className="flex h-full flex-col bg-ticketing-bg">
      <div className="flex items-center justify-center px-3 pt-40">
        <span className="text-title-bold text-text-menu">
          연습할 플랫폼을 선택해주세요
        </span>
      </div>
      <div className="-mt-8 flex flex-1 items-center justify-center">
        <PlatformButtons />
      </div>
    </div>
  );
}
