'use client';

import { Arena } from '@/components/ui/Arena';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { SelectedArenaMenu } from '../sight/SelectedArenaMenu';

/**
 * @component ArenaList
 * @description 공연장 목록을 표시하고 선택된 공연장의 좌석 메뉴를 관리하는 컴포넌트
 */

export default function ArenaList() {
  // 선택된 공연장의 ID를 관리하는 state (0: 미선택)
  const [selectedArenaId, setSelectedArenaId] = useState(0);
  const router = useRouter();
  // DUMMY_DATA: Arena venues - TO BE REMOVED
  // TODO: Replace with real API data
  const ArenaItems = [
    {
      arenaId: 1,
      arenaName: '올림픽체조경기장',
      engName: 'KSPO DOME',
      imageSrc: '/images/kspo.png',
      imageAlt: '올림픽 체조 경기장',
    },
    {
      arenaId: 2,
      arenaName: '고척스카이돔',
      engName: 'Gocheok Sky Dome',
      imageSrc: '/images/kspo.png',
      imageAlt: '고척 스카이돔',
    },
    {
      arenaId: 3,
      arenaName: '잠실실내체육관',
      engName: 'Jamsil Arena',
      imageSrc: '/images/kspo.png',
      imageAlt: '잠실실내체육관',
    },
    {
      arenaId: 4,
      arenaName: '케이스포 돔',
      engName: 'Legacy DOME',
      imageSrc: '/images/kspo.png',
      imageAlt: '케이스포 돔',
    },
    {
      arenaId: 5,
      arenaName: '올림픽 체조 경기장22',
      engName: 'KSPO DOME',
      imageSrc: '/images/kspo.png',
      imageAlt: '올림픽 체조 경기장',
    },
    {
      arenaId: 6,
      arenaName: '고척 스카이돔22',
      engName: 'Gocheok Sky Dome',
      imageSrc: '/images/kspo.png',
      imageAlt: '고척 스카이돔',
    },
    {
      arenaId: 7,
      arenaName: '잠실실내체육관22',
      engName: 'Jamsil Arena',
      imageSrc: '/images/kspo.png',
      imageAlt: '잠실실내체육관',
    },
    {
      arenaId: 8,
      arenaName: '케이스포 돔22',
      engName: 'Legacy DOME',
      imageSrc: '/images/kspo.png',
      imageAlt: '케이스포 돔',
    },
  ];
  // DUMMY_DATA END
  return (
    <div className="flex h-screen flex-col">
      <div className="scrollbar-hide overflow-x-auto">
        <div className="flex gap-4 px-4">
          {ArenaItems.map((item) => (
            <Arena
              key={item.arenaId}
              arenaName={item.arenaName}
              engName={item.engName}
              imageSrc={item.imageSrc}
              imageAlt={item.imageAlt}
              onClick={() => setSelectedArenaId(item.arenaId)}
              arenaId={item.arenaId}
            />
          ))}
        </div>
      </div>
      {/* 선택된 공연장 ID (디버깅용) */}
      <div className="flex-1 overflow-y-auto">
        {selectedArenaId && <SelectedArenaMenu arenaId={selectedArenaId} />}
      </div>
    </div>
  );
}
