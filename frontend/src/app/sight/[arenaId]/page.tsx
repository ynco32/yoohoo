import { Suspense } from 'react';
import styles from './page.module.scss';

import SectionMap from '../_components/SectionMap';

interface ArenaPageProps {
  params: {
    arenaId: string;
  };
}

export default function ArenaPage({ params }: ArenaPageProps) {
  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        <Suspense fallback={<div>구역표 로딩 중...</div>}>
          <SectionMap arenaId={params.arenaId} />
        </Suspense>
      </div>
    </div>
  );
}
