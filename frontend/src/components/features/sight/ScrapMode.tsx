'use client';
import { StarButton } from '@/components/ui/StarButton';
import { SectionList } from './section/SectionList';
import SeatList from '@/components/features/sight/seat/SeatList';
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
        <div className="flex h-full w-full max-w-3xl flex-col items-center justify-center">
          <div className="relative h-[600px] w-full">
            <SectionList isScrapMode={isScrapMode} />
          </div>
        </div>
      ) : (
        <SeatList isScrapMode={isScrapMode} />
      )}
    </>
  );
};

export default ScrapMode;
