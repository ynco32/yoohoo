/**
 * @component SectionWrapper
 * @description 전체 배치도 컴포넌트
 */
'use client';

import { useParams } from 'next/navigation';
import { SectionList } from './SectionList';

export default function VenueSectionWrapper() {
  const { arenaId } = useParams();
  const currentArenaId = Number(arenaId);
  const sections = [
    { sectionId: 1, arenaId: 1, sectionName: '001', isScraped: false },
    { sectionId: 2, arenaId: 1, sectionName: '002', isScraped: true },
    { sectionId: 3, arenaId: 1, sectionName: '003', isScraped: false },
    { sectionId: 4, arenaId: 1, sectionName: '004', isScraped: false },
    { sectionId: 5, arenaId: 1, sectionName: '005', isScraped: true },
    { sectionId: 6, arenaId: 1, sectionName: '111', isScraped: false },
    { sectionId: 7, arenaId: 1, sectionName: '110', isScraped: true },
    { sectionId: 8, arenaId: 1, sectionName: '109', isScraped: false },
    { sectionId: 9, arenaId: 1, sectionName: '108', isScraped: true },
    { sectionId: 10, arenaId: 1, sectionName: '107', isScraped: false },
    { sectionId: 11, arenaId: 1, sectionName: '106', isScraped: false },
    { sectionId: 12, arenaId: 1, sectionName: '105', isScraped: true },
    { sectionId: 13, arenaId: 1, sectionName: '235', isScraped: false },
    { sectionId: 14, arenaId: 1, sectionName: '234', isScraped: true },
    { sectionId: 15, arenaId: 1, sectionName: '233', isScraped: false },
    { sectionId: 16, arenaId: 1, sectionName: '232', isScraped: true },
    { sectionId: 12, arenaId: 2, sectionName: '105', isScraped: true },
    { sectionId: 13, arenaId: 2, sectionName: '235', isScraped: false },
    { sectionId: 14, arenaId: 2, sectionName: '234', isScraped: true },
    { sectionId: 15, arenaId: 2, sectionName: '233', isScraped: false },
    { sectionId: 16, arenaId: 2, sectionName: '232', isScraped: true },
  ];

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
