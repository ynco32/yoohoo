import { WriteButton } from '@/components/common/WriteButton';
import ArenaList from '@/components/features/sight/ArenaList';

export default function SightMainPage() {
  return (
    <main className="h-[calc(100vh-64px)] bg-background-default">
      <ArenaList />
      <WriteButton path="/sight/write" />
    </main>
  );
}
