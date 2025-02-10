'use client';
import { useState } from 'react';
import { StarButton } from '@/components/ui/StarButton';
import { SectionList } from './section/SectionList';
import { SeatList } from './seat/SeatList';
import { useParams } from 'next/navigation';

export const ScrapMode = () => {
  const [isScrapMode, setIsScrapMode] = useState(false);
  const params = useParams();
  const currentArenaId = Number(params.arenaId);
  const currentStageType = Number(params.stageType);
  const currentSectionId = params.sectionId;

  const handleScrapModeChange = (isScrap: boolean) => {
    setIsScrapMode(isScrap);
  };

  return (
    <>
      <StarButton onScrapModeChange={handleScrapModeChange} />
      {!currentSectionId ? (
        // sight/[arenaId] 경로에서는 섹션 목록
        <SectionList
          arenaId={currentArenaId}
          stageType={currentStageType}
          isScrapMode={isScrapMode}
        />
      ) : (
        // sight/[arenaId]/[sectionId] 경로에서는 좌석 목록
        <SeatList isScrapMode={isScrapMode} />
      )}
    </>
  );
};

export default ScrapMode;
