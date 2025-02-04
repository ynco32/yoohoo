import React from 'react';
import PlatformButtons from '@/components/features/ticketing/PlatformButtons';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import { TextBox } from '@/components/ui/TextBox';

export default function PlatformListPage() {
  const platformList = [
    {
      name: '멜론티켓',
      path: '/ticketing/melon-mode',
      icon: <MusicalNoteIcon />,
    },
    {
      name: '인터파크 티켓',
      path: '/ticketing/interpark-mode',
      icon: <MusicalNoteIcon />,
    },
    {
      name: '옥션',
      path: '/ticketing/auction-mode',
      icon: <MusicalNoteIcon />,
    },
    { name: 'yes24', path: '/ticketing/yes24-mode', icon: <MusicalNoteIcon /> },
  ];

  return (
    <div>
      <TextBox
        headText="티켓팅 연습하기"
        bodyText="연습할 플랫폼을 선택하세요"
      ></TextBox>
      <PlatformButtons platforms={platformList} />
    </div>
  );
}
