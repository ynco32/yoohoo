import { SightReviewList } from '@/components/features/sight/review/SightReviewList';
import ScrapMode from '@/components/features/sight/ScrapMode';
import { WriteButton } from '@/components/common/WriteButton';

export default function SeatSelectPage() {
  return (
    <main className="flex h-full w-full flex-col">
      <div className="z-20 mt-8 flex w-full flex-col items-center justify-center">
        <ScrapMode />
        <SightReviewList />
        <WriteButton path="/sight/reviews/write" />
      </div>
    </main>
  );
}
