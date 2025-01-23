'use client';

import { Arena } from '@/components/ui/Arena';

export default function ArenaList() {
  // DUMMY_DATA: Arena venues - TO BE REMOVED
  // TODO: Replace with real API data
  const ArenaItems = [
    {
      arenaName: '올림픽 체조 경기장',
      engName: 'KSPO DOME',
      href: '/sight/olympic',
      imageSrc: '/images/kspo.png',
      imageAlt: '올림픽 체조 경기장',
    },
    {
      arenaName: '고척 스카이돔',
      engName: 'Gocheok Sky Dome',
      href: '/sight/gocheok',
      imageSrc: '/images/kspo.png',
      imageAlt: '고척 스카이돔',
    },
    {
      arenaName: '잠실실내체육관',
      engName: 'Jamsil Arena',
      href: '/sight/jamsil',
      imageSrc: '/images/kspo.png',
      imageAlt: '잠실실내체육관',
    },
    {
      arenaName: '케이스포 돔',
      engName: 'Legacy DOME',
      href: '/sight/legacy',
      imageSrc: '/images/kspo.png',
      imageAlt: '케이스포 돔',
    },
  ];
  // DUMMY_DATA END
  return (
    <div className="grid grid-cols-2 gap-sm">
      <div>
        {ArenaItems.map((item) => (
          <Arena
            key={item.arenaName}
            arenaName={item.arenaName}
            engName={item.engName}
            href={item.href}
            imageSrc={item.imageSrc}
            imageAlt={item.imageAlt}
          />
        ))}
      </div>
    </div>
  );
}
