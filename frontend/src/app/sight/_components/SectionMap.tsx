// app/sight/_components/SectionMap.tsx
import { use } from 'react';
// import { fetchSectionMap } from '../api';
import styles from '../[arenaId]/page.module.scss';
import KspoMap from '@/components/sight/Arenas/KspoMap';

interface SectionMapProps {
  arenaId: string;
}

export default function SectionMap({ arenaId }: SectionMapProps) {
  //   const sectionMap = use(fetchSectionMap());
  //   const arenaInfo = use(fetchArenaInfo());
  const sectionMap = null;
  const renderArenaMap = () => {
    switch (arenaId) {
      case '5':
        return <KspoMap />;
      // 지원하지 않는 경기장이거나 아이디가 잘못된 경우 기본 UI 표시
      default:
        return (
          <div className={styles.defaultMap}>
            <p>해당 경기장의 좌석표가 준비되지 않았습니다.</p>
          </div>
        );
    }
  };

  return (
    <div className={styles.sectionMap}>
      {/* 구역표 표시 로직 */}
      {renderArenaMap()}
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
