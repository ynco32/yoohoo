'use client';

import React from 'react';
import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import PlatformItem from './Platformitem';

const platformList = [
  {
    platformId: 1,
    name: 'M티켓',
    href: '/ticketing/melon-mode',
    icon: MusicalNoteIcon,
  },
  {
    platformId: 2,
    name: 'I티켓',
    href: '/ticketing/interpark-mode',
    icon: MusicalNoteIcon,
  },
  {
    platformId: 3,
    name: 'A사',
    href: '/ticketing/auction-mode',
    icon: MusicalNoteIcon,
  },
  {
    platformId: 4,
    name: 'Y사',
    href: '/ticketing/yes24-mode',
    icon: MusicalNoteIcon,
  },
];

export default function PlatformButtons() {
  return (
    <div className="max-w-xs mx-auto">
      <div className="grid grid-cols-2 justify-items-center gap-4">
        {platformList.map((item) => (
          <PlatformItem
            key={item.platformId}
            platformId={item.platformId}
            icon={item.icon}
            label={item.name}
            href={item.href}
          />
        ))}
      </div>
    </div>
  );
}
