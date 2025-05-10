// app/components/MiniMap.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import KsopSvg from '@/assets/svgs/kspo.svg';
import styles from './MiniMap.module.scss';

interface MiniMapProps {
  arenaId: string;
  currentSectionId?: string; // 현재 선택된 섹션 ID
}

export default function MiniMap({ arenaId, currentSectionId }: MiniMapProps) {
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);

  // 모든 구역 요소를 회색으로 변경하고, 선택된 구역만 강조하는 함수
  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    // 모든 구역 요소 찾기 (cls-6, cls-7, cls-4 클래스가 부여된 path 요소들)
    const sectionPaths = svg.querySelectorAll(
      '.kspo_svg__cls-6, .kspo_svg__cls-7, .kspo_svg__cls-4'
    );
    const numberPaths = svg.querySelectorAll('.kspo_svg__cls-5');

    // 기본적으로 모든 구역을 회색으로 변경
    sectionPaths.forEach((path) => {
      path.setAttribute('style', 'fill: #e6e6e6; opacity: 0.5;');
    });

    // 모든 숫자 텍스트도 회색으로 변경
    numberPaths.forEach((path) => {
      path.setAttribute('style', 'fill: #cccccc; opacity: 0.5;');
    });

    // 선택된 구역이 있는 경우 해당 구역만 강조
    if (currentSectionId) {
      // ID에 해당하는 구역 그룹 찾기
      const selectedSection = svg.querySelector(
        `g[id*="Section${currentSectionId}"]`
      );

      if (selectedSection) {
        // 선택된 구역의 배경 요소 복원
        const selectedBgPaths = selectedSection.querySelectorAll(
          '.kspo_svg__cls-6, .kspo_svg__cls-7, .kspo_svg__cls-4'
        );
        selectedBgPaths.forEach((path) => {
          path.setAttribute('style', 'fill: #a7deff; opacity: 1;');
        });

        // 선택된 구역의 숫자 요소 복원
        const selectedNumberPaths =
          selectedSection.querySelectorAll('.kspo_svg__cls-5');
        selectedNumberPaths.forEach((path) => {
          path.setAttribute('style', 'fill: #0068ff; opacity: 1;');
        });
      }
    }
  }, [currentSectionId]);

  const handleMiniMapClick = () => {
    // 구역 선택 페이지로 이동
    router.push(`/sight/${arenaId}`);
  };

  return (
    <div className={styles.miniMapContainer} onClick={handleMiniMapClick}>
      <div className={styles.miniMapWrapper}>
        <KsopSvg ref={svgRef} className={styles.miniMapSvg} />
      </div>
    </div>
  );
}
