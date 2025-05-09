// app/arena/page.tsx
import { Suspense } from 'react';
import styles from './page.module.scss';

import SectionMap from '../_components/SectionMap';
import Loading from '../_components/Loading';

export default function ArenaPage() {
  return (
    <div className={styles.container}>
      <div className={styles.sections}>
        <Suspense fallback={<div>구역표 로딩 중...</div>}>
          <SectionMap />
        </Suspense>
      </div>
    </div>
  );
}
