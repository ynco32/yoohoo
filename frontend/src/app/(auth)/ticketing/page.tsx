import React from 'react';
import PlatformButtons from '@/components/features/ticketing/PlatformButtons';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';

export default function PlatformListPage() {
  const platformList = [
    { name: '멜론티켓', path: '/ticketing/melon', icon: <MusicalNoteIcon /> },
    {
      name: '인터파크 티켓',
      path: '/ticketing/interpark',
      icon: <MusicalNoteIcon />,
    },
    { name: '옥션', path: '/ticketing/auction', icon: <MusicalNoteIcon /> },
    { name: 'yes24', path: '/ticketing/yes24', icon: <MusicalNoteIcon /> },
  ];

  return (
    <div>
      <div className="px-3 py-20">
        <h2 className="head">티켓팅 연습하기</h2>
        <h1 className="body">연습할 플랫폼을 선택하세요</h1>
      </div>
      <PlatformButtons platforms={platformList} />
    </div>
  );
}
