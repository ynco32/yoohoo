import { SightReviewList } from '@/components/features/sight/review/SightReviewList';
import ScrapMode from '@/components/features/sight/ScrapMode';
import { WriteButton } from '@/components/common/WriteButton';

export default function SeatSelectPage() {
  return (
    <main className="-mt-16 min-h-screen bg-background-default">
      <div className="relative z-20 flex h-full flex-col items-center">
        <ScrapMode />
        <SightReviewList />
        <WriteButton path="/sight/reviews/write" />
      </div>
    </main>
  );
}
