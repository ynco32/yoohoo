'use client';

import { MusicalNoteIcon } from '@heroicons/react/24/outline';
import PlatformItem from './Platformitem';

const platformList = [
  {
    platformId: 1,
    name: '멜론티켓',
    href: '/ticketing/melon-mode',
    icon: MusicalNoteIcon,
  },
  {
    platformId: 2,
    name: '인터파크 티켓',
    href: '/ticketing/interpark-mode',
    icon: MusicalNoteIcon,
  },
  {
    platformId: 3,
    name: '옥션',
    href: '/ticketing/auction-mode',
    icon: MusicalNoteIcon,
  },
  {
    platformId: 4,
    name: 'yes24',
    href: '/ticketing/yes24-mode',
    icon: MusicalNoteIcon,
  },
];

export default function PlatformButtons() {
  return (
    <div className="flex-1 py-4">
      <div className="flex grid h-full w-full grid-cols-2 gap-x-md gap-y-sm">
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
