'use client';
import { useState } from 'react';
import { StarButton } from '@/components/ui/StarButton';
import { SectionList } from './SectionList';
import { sections } from '@/types/sections';

export const ScrapMode = () => {
  const [isScrapMode, setIsScrapMode] = useState(false);

  const handleScrapModeChange = (isScrap: boolean) => {
    setIsScrapMode(isScrap);
  };

  return (
    <>
      <StarButton onScrapModeChange={handleScrapModeChange} />
      <SectionList arenaId={1} isScrapMode={isScrapMode} />
    </>
  );
};
