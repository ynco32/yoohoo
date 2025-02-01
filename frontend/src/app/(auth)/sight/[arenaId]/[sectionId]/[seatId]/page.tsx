import { SightReviewList } from '@/components/features/sight/SightReviewList';
import ScrapMode from '@/components/features/sight/ScrapMode';

export default function Page() {
  return (
    <main className="h-[calc(100vh-64px)] bg-background-default">
      <div className="relative z-20 flex h-full flex-col items-center">
        <ScrapMode />
        <SightReviewList />
      </div>
    </main>
  );
}
