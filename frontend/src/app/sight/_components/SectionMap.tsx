// app/arena/components/SectionMap.tsx
import { use } from 'react';
// import { fetchSectionMap } from '../api';
import styles from '../[arenaId]/page.module.scss';
import KsopMap from '@/components/sight/Arenas/KspoMap';

export default function SectionMap() {
  //   const sectionMap = use(fetchSectionMap());
  //   const arenaInfo = use(fetchArenaInfo());
  const sectionMap = null;

  return (
    <div className={styles.sectionMap}>
      {/* 구역표 표시 로직 */}
      {/* {sectionMap && <div>구역표가 여기에 표시됩니다</div>} */}
      <KsopMap arenaId='1' />
      <div className={styles.card}>
        {/* Todo: 텍스트  */}
        <p className={styles.message}>
          올림픽 체조경기장은 00역 인근에 위치해있어요.
        </p>
        <p className={styles.message}>10000석 규모로 어쩌구저쩌구</p>
        <p className={styles.message}>구역을 선택해 시야를 확인하세요!</p>
      </div>
    </div>
  );
}
