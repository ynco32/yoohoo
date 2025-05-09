import styles from './layout.module.scss';
import { Suspense } from 'react';
import SectionsSelector from '../_components/SectionSelector';
import StairsSelector from '../_components/StairSelector';
import WriteButton from '@/components/sight/WriteButton/WriteButton';

export default function SectionSelectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className={styles.container}>
      {/* <div className={styles.help}>구역을 선택해 좌석을 확인하세요!</div> */}
      <div className={styles.selects}>
        <Suspense fallback={<div>층 정보 로딩 중...</div>}>
          <StairsSelector />
        </Suspense>
        <Suspense fallback={<div>구역 정보 로딩 중...</div>}>
          <SectionsSelector />
        </Suspense>
      </div>
      {children}
      <WriteButton />
    </div>
  );
}
