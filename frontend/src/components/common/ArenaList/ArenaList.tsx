'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useHeader } from '@/components/layout/Header/HeaderProvider';
import ArenaCard from '@/components/common/ArenaCard/ArenaCard';
import { ArenaInfo } from '@/types/arena';
import styles from './ArenaList.module.scss';

interface ArenaListProps {
  arenas: ArenaInfo[];
  targetPage?: 'sight' | 'place'; // 이동할 페이지 지정
}

export default function ArenaList({ arenas, targetPage }: ArenaListProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { setArenaInfo } = useHeader();

  // targetPage가 명시되지 않았으면 현재 경로로 판단
  const getTargetPage = () => {
    if (targetPage) return targetPage;
    if (pathname.startsWith('/sight')) return 'sight';
    if (pathname.startsWith('/place')) return 'place';
    return 'place'; // 기본값
  };

  // 경기장 클릭 핸들러
  const handleArenaClick = (arena: ArenaInfo) => {
    // 헤더에 경기장 정보 설정
    setArenaInfo(arena);

    const page = getTargetPage();
    router.push(`/${page}/${arena.arenaId}`);
  };

  return (
    <div className={styles.arenaList}>
      {arenas.map((arena) => (
        <ArenaCard
          key={arena.arenaId}
          arenaId={arena.arenaId}
          address={arena.address}
          englishName={arena.arenaEngName}
          name={arena.arenaName}
          imageUrl={arena.photoUrl}
          onClick={() => handleArenaClick(arena)}
        />
      ))}
    </div>
  );
}
