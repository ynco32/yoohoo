import { WriteButton } from '@/components/common/WriteButton';
import ArenaList from '@/components/features/sight/arena/ArenaList';

export default function SightMainPage() {
  return (
    <div className="flex h-full flex-col overflow-hidden bg-sight-main-gra">
      <ArenaList />
      <WriteButton path="/sight/reviews/write" />
    </div>
  );
}
