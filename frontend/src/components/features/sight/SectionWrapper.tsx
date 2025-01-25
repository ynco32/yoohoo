/**
 * @component SectionWrapper
 * @description 전체 배치도 컴포넌트
 */
'use client';

import { SectionList } from './SectionList';

export default function VenueSectionWrapper() {
  const sections = [
    { sectionId: 1, arenaId: 'arena1', sectionName: '001', isScraped: false },
    { sectionId: 2, arenaId: 'arena1', sectionName: '002', isScraped: true },
    { sectionId: 3, arenaId: 'arena1', sectionName: '003', isScraped: false },
    { sectionId: 4, arenaId: 'arena1', sectionName: '004', isScraped: false },
    { sectionId: 5, arenaId: 'arena1', sectionName: '005', isScraped: true },
    { sectionId: 6, arenaId: 'arena1', sectionName: '111', isScraped: false },
    { sectionId: 7, arenaId: 'arena1', sectionName: '110', isScraped: true },
    { sectionId: 8, arenaId: 'arena1', sectionName: '109', isScraped: false },
    { sectionId: 9, arenaId: 'arena1', sectionName: '108', isScraped: true },
    { sectionId: 10, arenaId: 'arena1', sectionName: '107', isScraped: false },
    { sectionId: 11, arenaId: 'arena1', sectionName: '106', isScraped: false },
    { sectionId: 12, arenaId: 'arena1', sectionName: '105', isScraped: true },
    { sectionId: 13, arenaId: 'arena1', sectionName: '235', isScraped: false },
    { sectionId: 14, arenaId: 'arena1', sectionName: '234', isScraped: true },
    { sectionId: 15, arenaId: 'arena1', sectionName: '233', isScraped: false },
    { sectionId: 16, arenaId: 'arena1', sectionName: '232', isScraped: true },
  ];

  const handleSectionClick = (sectionId: number) => {
    console.log(`Section ${sectionId} clicked`);
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="aspect-square w-full max-w-[800px] mobile:max-w-[375px] mobile-l:max-w-[425px] tablet:max-w-[600px] desktop:max-w-[800px]">
        <SectionList sections={sections} onSectionClick={handleSectionClick} />
      </div>
    </div>
  );
}
