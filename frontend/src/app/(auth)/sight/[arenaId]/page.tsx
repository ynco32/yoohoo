import { ScrapMode } from '@/components/features/sight/ScrapMode';

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="pt-16"></div>
      <div className="container mx-auto flex min-h-screen items-center justify-center px-4 py-8">
        <ScrapMode />
      </div>
    </div>
  );
}
