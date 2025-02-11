'use client';
import { StarButton } from '@/components/ui/StarButton';
import { SectionList } from './section/SectionList';
import { SeatList } from './seat/SeatList';
import { useParams } from 'next/navigation';
import { useScrapStore } from '@/store/useScrapStore';

export const ScrapMode = () => {
  const { isScrapMode } = useScrapStore();
  const params = useParams();
  const currentSectionId = params.sectionId;

  return (
    <>
      <StarButton />
      {!currentSectionId ? (
        <SectionList isScrapMode={isScrapMode} />
      ) : (
        <SeatList isScrapMode={isScrapMode} />
      )}
    </>
  );
};

export default ScrapMode;
