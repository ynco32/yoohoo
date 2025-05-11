// app/sight/page.tsx
import { Suspense } from 'react';
import styles from './page.module.scss';
import SearchSection from './_components/SearchSection';
import ArenaSection from './_components/ArenaSection';
import ArenaLoadingFallback from './_components/ArenaLoadingFallback';

type Params = Promise<{
  searchParams: {
    searchWord?: string;
  };
}>;

export default async function SightPage({
  searchParams,
}: {
  searchParams: Promise<{ searchWord?: string }>;
}) {
  const { searchWord } = await searchParams;

  return (
    <div className={styles.container}>
      <Suspense fallback={null}>
        <SearchSection defaultQuery={searchWord} />
      </Suspense>

      <Suspense fallback={<ArenaLoadingFallback />}>
        <ArenaSection searchQuery={searchWord} />
      </Suspense>
    </div>
  );
}
