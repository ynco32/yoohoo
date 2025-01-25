import SectionWrapper from '@/components/features/sight/SectionWrapper';
import { ScrapButton } from '@/components/ui/ScrapButton';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="pt-16"></div>
      <div className="container relative mx-auto px-4">
        {' '}
        <ScrapButton isScrapMode={false} />
      </div>

      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <SectionWrapper />
      </div>
    </div>
  );
}
