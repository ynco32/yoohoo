import { Suspense } from 'react';
import styles from './page.module.scss';
import SectionMap from '../_components/SectionMap';

type Params = Promise<{ arenaId: string }>;

export default async function ArenaPage({ params }: { params: Params }) {
  const { arenaId } = await params;

  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        <Suspense fallback={<div>구역표 로딩 중...</div>}>
          <SectionMap arenaId={arenaId} />
        </Suspense>
      </div>
    </div>
  );
}
