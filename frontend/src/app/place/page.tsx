import { Suspense } from 'react';
import styles from './page.module.scss';
import SearchSection from '@/app/sight/_components/SearchSection';
import ArenaSection from '@/app/sight/_components/ArenaSection';
import ArenaLoadingFallback from '@/app/sight/_components/ArenaLoadingFallback';

interface PlacePageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

export default async function PlacePage({ searchParams }: PlacePageProps) {
  // searchParams를 await로 처리
  const params = await searchParams;

  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <SearchSection defaultQuery={params.query} />
      </Suspense>

      <Suspense fallback={<ArenaLoadingFallback />}>
        <ArenaSection searchQuery={params.query} />
      </Suspense>
    </div>
  );
}
