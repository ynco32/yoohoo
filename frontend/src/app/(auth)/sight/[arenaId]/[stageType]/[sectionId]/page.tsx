import { SightReviewList } from '@/components/features/sight/review/SightReviewList';
import ScrapMode from '@/components/features/sight/ScrapMode';
import { WriteButton } from '@/components/common/WriteButton';

export default function SeatSelectPage() {
  return (
    <main className="h-[calc(100vh-64px)] bg-background-default">
      <div className="relative z-20 flex h-full flex-col items-center">
        <ScrapMode />
        <SightReviewList />
        <WriteButton path="/sight/write" />
      </div>
    </main>
  );
}
