// app/sight/_components/SectionMap.tsx
'use client';
import { useState, useEffect } from 'react';
import styles from '../[arenaId]/page.module.scss';
import GocheokSvg from '@/assets/svgs/gocheok.svg';
import InspireSvg from '@/assets/svgs/inspire.svg';
import KspoSvg from '@/assets/svgs/kspo.svg';
import HandballSvg from '@/assets/svgs/handball.svg';
import JamsilSvg from '@/assets/svgs/jamsil.svg';
import { useRouter } from 'next/navigation';
import { ArenaInfo } from '@/types/arena'; // 기존 타입 임포트

interface SectionMapProps {
  arenaId: string;
  arenaInfo?: ArenaInfo; // 서버에서 페칭한 데이터를 props로 받음
}

export default function SectionMap({ arenaId, arenaInfo }: SectionMapProps) {
  const router = useRouter();

  const handleSectionClick = (sectionId: string) => {
    const routingUrl = arenaId + sectionId;
    console.log(`라우팅: /sight/${arenaId}/${routingUrl}`);
    router.push(`/sight/${arenaId}/${routingUrl}`);
  };

  const handleSvgClick = (e: React.MouseEvent) => {
    // 이벤트 버블링 활용
    const target = e.target as SVGElement;

    // 가장 가까운 g 요소 찾기
    const section = target.closest('g[id]');

    if (section) {
      const sectionId = section.id;
      console.log('클릭된 섹션 ID:', sectionId);

      // kspo_svg__section 접두사 처리
      if (sectionId.includes('section')) {
        const cleanSectionId = sectionId.replace(/^.*section/, '');
        handleSectionClick(cleanSectionId);
      }
    }
  };

  const renderArenaMap = () => {
    switch (arenaId) {
      // case 1 월드컵 경기장
      // case 2 고양
      case '3':
        return (
          <GocheokSvg
            onClick={handleSvgClick}
            className={styles.interactiveSvg}
          />
        );
      case '4':
        return (
          <InspireSvg
            onClick={handleSvgClick}
            className={styles.interactiveSvg}
          />
        );
      case '5':
        return (
          <KspoSvg onClick={handleSvgClick} className={styles.interactiveSvg} />
        );
      case '6':
        return (
          <JamsilSvg
            onClick={handleSvgClick}
            className={styles.interactiveSvg}
          />
        );
      case '7':
        return (
          <HandballSvg
            onClick={handleSvgClick}
            className={styles.interactiveSvg}
          />
        );
      // case 8 올림픽홀
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
      <div className={styles.svgContainer}>{renderArenaMap()}</div>
      <div className={styles.card}>
        {arenaInfo ? (
          <>
            <p className={styles.message}>
              {arenaInfo.arenaName}은(는) {arenaInfo.address}에 위치해있어요.
            </p>
            <p className={styles.message}>000석 규모입니다.</p>
          </>
        ) : (
          <>
            <p className={styles.message}>
              올림픽 체조경기장은 00역 인근에 위치해있어요.
            </p>
            <p className={styles.message}>10000석 규모로 어쩌구저쩌구</p>
          </>
        )}
        <p className={styles.message}>구역을 선택해 시야를 확인하세요!</p>
      </div>
    </div>
  );
}
