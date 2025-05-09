// app/sight/page.tsx
import { Suspense } from 'react';
import styles from './page.module.scss';
import SearchSection from './_components/SearchSection';
import ArenaSection from './_components/ArenaSection';
import ArenaLoadingFallback from './_components/ArenaLoadingFallback';

interface SightPageProps {
  searchParams: {
    searchWord?: string;
  };
}

export default function SightPage({ searchParams }: SightPageProps) {
  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <SearchSection defaultQuery={searchParams.searchWord} />
      </Suspense>

      <Suspense fallback={<ArenaLoadingFallback />}>
        <ArenaSection searchQuery={searchParams.searchWord} />
      </Suspense>
    </div>
  );
}
