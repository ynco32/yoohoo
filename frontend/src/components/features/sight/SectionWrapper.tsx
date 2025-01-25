/**
 * @component SectionWrapper
 * @description 전체 배치도 컴포넌트
 */
'use client';

import { useParams } from 'next/navigation';
import { SectionList } from './SectionList';
import { sections } from '@/types/sections';

export default function VenueSectionWrapper() {
  const { arenaId } = useParams();
  const currentArenaId = Number(arenaId);

  const handleSectionClick = (sectionId: number) => {
    console.log(`Section ${sectionId} clicked`);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="aspect-square w-full max-w-[800px] mobile:max-w-[375px] mobile-l:max-w-[425px] tablet:max-w-[600px] desktop:max-w-[800px]">
        <SectionList
          arenaId={currentArenaId}
          sections={sections}
          onSectionClick={handleSectionClick}
        />
      </div>
    </div>
  );
}
