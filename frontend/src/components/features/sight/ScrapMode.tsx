'use client';
import { useState } from 'react';
import { StarButton } from '@/components/ui/StarButton';
import { SectionList } from './SectionList';
import { sections } from '@/types/sections';
import { useParams } from 'next/navigation';

export const ScrapMode = () => {
  const [isScrapMode, setIsScrapMode] = useState(false);
  const params = useParams();
  const currentArenaId = Number(params.arenaId);

  const handleScrapModeChange = (isScrap: boolean) => {
    setIsScrapMode(isScrap);
  };

  return (
    <>
      <StarButton onScrapModeChange={handleScrapModeChange} />
      <SectionList arenaId={currentArenaId} isScrapMode={isScrapMode} />
    </>
  );
};
