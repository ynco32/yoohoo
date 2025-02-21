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
    <div className="flex w-full flex-col items-center pt-0">
      <div className="mb-8 flex w-full justify-center">
        <StarButton />
      </div>
      {!currentSectionId ? (
        <div className="max-w-3xl flex h-96 w-full flex-col items-center justify-center">
          <SectionList isScrapMode={isScrapMode} />
        </div>
      ) : (
        <SeatList isScrapMode={isScrapMode} />
      )}
    </div>
  );
};

export default ScrapMode;
