// app/sight/page.tsx
import { Suspense } from 'react';
import styles from './page.module.scss';
import SearchSection from './_components/SearchSection';
import ArenaSection from './_components/ArenaSection';
import ArenaLoadingFallback from './_components/ArenaLoadingFallback';

interface SightPageProps {
  searchParams: Promise<{
    query?: string;
  }>;
}

export default async function SightPage({ searchParams }: SightPageProps) {
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
