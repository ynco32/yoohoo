import { SightReviewList } from '@/components/features/sight/SightReviewList';
import ScrapMode from '@/components/features/sight/ScrapMode';
import { SeatList } from '@/components/features/sight/SeatList';
import { WriteButton } from '@/components/common/WriteButton';

export default function Page() {
  return (
    <div className="relative min-h-screen bg-gray-50">
      <div className="container mx-auto flex min-h-screen justify-center">
        <ScrapMode />
      </div>
      <div className="z-20">
        <SightReviewList />
      </div>
      <WriteButton path="/sight/write" />
    </div>
  );
}
