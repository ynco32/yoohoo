import { WriteButton } from '@/components/common/WriteButton';
import { ScrapMode } from '@/components/features/sight/ScrapMode';

export default function SectionSelectPage() {
  return (
    <div className="container flex h-full items-center justify-center py-8">
      <ScrapMode />
      <WriteButton path="/sight/reviews/write" />
    </div>
  );
}
