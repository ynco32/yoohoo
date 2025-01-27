'use client';
import { Section } from '../../ui/Section';
import { sections } from '../../../types/sections';
import { useRouter } from 'next/navigation';

/**
 * @component SectionList
 * @description 공연장 구역 전체를 표시하는 컴포넌트
 */

// 섹션 데이터 인터페이스 정의
interface SectionData {
  sectionId: number;
  arenaId: number;
  sectionName: string;
  isScraped: boolean;
  isScrapMode: boolean;
}

// 섹션 리스트 props 인터페이스 정의
interface SectionListProps {
  arenaId: number;
  isScrapMode: boolean;
}

export const SectionList = ({ arenaId, isScrapMode }: SectionListProps) => {
  const filteredSections = sections.filter(
    (section) => section.arenaId === arenaId
  );

  const router = useRouter();

  const calculateSectionSize = (totalSections: number) => {
    const BASE_INNER_RADIUS = 120;
    const BASE_OUTER_RADIUS = 330;
    const scaleFactor = Math.max(0.5, Math.min(1, 16 / totalSections));

    return {
      innerRadius: BASE_INNER_RADIUS * scaleFactor,
      outerRadius: BASE_OUTER_RADIUS * scaleFactor,
      angleSpread: Math.min(22, 360 / totalSections),
    };
  };
  // 각 섹션의 위치와 크기를 계산하는 함수s
  const getPositionForSection = (index: number, totalSections: number) => {
    const { innerRadius, outerRadius, angleSpread } =
      calculateSectionSize(totalSections);
    const radiusRatio = (outerRadius - innerRadius) / 3;

    if (index < 5) {
      return {
        startAngle: 150 + index * angleSpread,
        endAngle: 170 + index * angleSpread,
        innerRadius: innerRadius,
        outerRadius: innerRadius + radiusRatio,
      };
    }
    if (index < 11) {
      const adjustedIndex = index - 5;
      return {
        startAngle: 145 + adjustedIndex * angleSpread,
        endAngle: 165 + adjustedIndex * angleSpread,
        innerRadius: innerRadius + radiusRatio,
        outerRadius: innerRadius + 2 * radiusRatio,
      };
    }
    const adjustedIndex = index - 11;
    return {
      startAngle: 140 + adjustedIndex * angleSpread,
      endAngle: 160 + adjustedIndex * angleSpread,
      innerRadius: innerRadius + 2 * radiusRatio,
      outerRadius: outerRadius,
    };
  };

  return (
    <svg
      viewBox="-400 -400 800 800"
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto h-full w-full"
    >
      {/* 섹션 컴포넌트 위치 조정 */}
      <g transform="translate(-500, -550) scale(1.3)">
        {filteredSections.map((section, index) => {
          const position = getPositionForSection(
            index,
            filteredSections.length
          );
          return (
            <Section
              key={section.sectionId}
              {...section}
              {...position}
              isScrapMode={isScrapMode}
              onClick={() =>
                router.push(`/sight/${arenaId}/${section.sectionId}`)
              }
            />
          );
        })}
      </g>
    </svg>
  );
};
