'use client';
import { useState } from 'react';
import { StarButton } from '@/components/ui/StarButton';
import { SectionList } from './SectionList';
import { sections } from '@/types/sections';

export const ScrapMode = () => {
  const [isScrapMode, setIsScrapMode] = useState(false);
  const [scrapData, setScrapData] = useState<{ sectionId: string[] }>({
    sectionId: [],
  });

  const handleScrapModeChange = (isScrap: boolean) => {
    setIsScrapMode(isScrap);
  };

  const handleSectionClick = (sectionId: number) => {
    if (!isScrapMode) return;

    const id = sectionId.toString();
    setScrapData((prev) => ({
      sectionId: prev.sectionId.includes(id)
        ? prev.sectionId.filter((item) => item !== id)
        : [...prev.sectionId, id],
    }));
  };

  return (
    <>
      <StarButton onScrapModeChange={handleScrapModeChange} />
      <SectionList
        sections={sections.map((section) => ({
          ...section,
          isScraped: scrapData.sectionId.includes(section.sectionId.toString()),
        }))}
        onSectionClick={handleSectionClick}
        arenaId={1}
        isScrapMode={isScrapMode}
      />
    </>
  );
};
