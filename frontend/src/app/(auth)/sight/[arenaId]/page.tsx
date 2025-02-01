import { ScrapMode } from '@/components/features/sight/ScrapMode';

export default function Page() {
  return (
    <main className="h-[calc(100vh-64px)] bg-background-default">
      <div className="container mx-auto flex h-full items-center justify-center px-4 py-8">
        <ScrapMode />
      </div>
    </main>
  );
}
