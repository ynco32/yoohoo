// app/components/minimaps/InspireMinimap.tsx
'use client';

import React, { useEffect, useRef } from 'react';
import InspireSvg from '@/assets/svgs/inspire.svg';
import styles from './MiniMap.module.scss';

interface InspireMinimapProps {
  currentSectionId?: string;
}

export default function InspireMinimap({
  currentSectionId,
}: InspireMinimapProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = svgRef.current;

    // Stage 요소 찾기
    const stageGroup = svg.getElementById('inspire_svg__stage');

    // 모든 그룹과 요소 초기화 (stage 제외)
    const allGroups = svg.querySelectorAll('g[id]');
    allGroups.forEach((group) => {
      // stage는 제외하고 나머지만 회색으로 변경
      if (group.id !== 'inspire_svg__stage') {
        group.querySelectorAll('*').forEach((el) => {
          const className = el.getAttribute('class') || '';

          if (className.includes('cls-1')) {
            // 텍스트 요소
            el.setAttribute('style', 'fill: #cccccc; opacity: 0.5;');
          } else if (className.includes('cls-')) {
            // 배경 요소 (모든 cls- 클래스)
            el.setAttribute('style', 'fill: #e6e6e6; opacity: 0.5;');
          }
        });
      }
    });

    // 선택된 섹션이 있는 경우 해당 섹션만 강조
    if (currentSectionId) {
      // ID로 섹션 선택 (정확한 ID 패턴 사용)
      let sectionId;

      if (currentSectionId.startsWith('F')) {
        sectionId = `inspire_svg__sectionF${currentSectionId.substring(1)}`;
      } else {
        sectionId = `inspire_svg__section${currentSectionId}`;
      }

      const selectedSection = svg.getElementById(sectionId);

      if (selectedSection) {
        // 선택된 섹션의 모든 요소 원래 색상으로 복원
        selectedSection.querySelectorAll('*').forEach((el) => {
          const className = el.getAttribute('class') || '';

          // 요소 유형에 따라 스타일 적용
          if (className.includes('cls-1')) {
            // 텍스트 요소
            el.setAttribute('style', 'fill: #4986e8; opacity: 1;');
          } else if (
            className.includes('cls-3') ||
            className.includes('cls-5')
          ) {
            // 브랜드 색상을 사용하는 배경 요소
            el.setAttribute('style', 'fill: #a7deff; opacity: 1;');
          } else if (className.includes('cls-4')) {
            // 초록색 배경 요소
            el.setAttribute('style', 'fill: #b1fcb1; opacity: 1;');
          } else if (className.includes('cls-2')) {
            // 기타 배경 요소
            el.setAttribute('style', 'opacity: 1;');
          }
        });
      }
    }
  }, [currentSectionId]);

  return <InspireSvg ref={svgRef} className={styles.miniMapSvg} />;
}
