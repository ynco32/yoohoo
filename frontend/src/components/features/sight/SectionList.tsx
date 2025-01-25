'use client';
import { Section } from '../../ui/Section';

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
}

// 섹션 리스트 props 인터페이스 정의
interface SectionListProps {
  sections: SectionData[];
  onSectionClick?: (sectionId: number) => void;
  arenaId: number;
}

export const SectionList = ({
  sections,
  onSectionClick,
  arenaId,
}: SectionListProps) => {
  const filteredSections = sections.filter(
    (section) => section.arenaId === arenaId
  );

  // 각 섹션의 위치와 크기를 계산하는 함수s
  const getPositionForSection = (index: number, totalSections: number) => {
    // 첫 번째 행 (가장 안쪽)
    if (index < 5) {
      return {
        startAngle: 150 + index * 22,
        endAngle: 170 + index * 22,
        innerRadius: 120,
        outerRadius: 190,
      };
    }
    // 두 번째 행
    if (index < 11) {
      const adjustedIndex = index - 5;
      return {
        startAngle: 145 + adjustedIndex * 22,
        endAngle: 165 + adjustedIndex * 22,
        innerRadius: 190,
        outerRadius: 260,
      };
    }
    // 세 번째 행 (가장 바깥쪽)
    const adjustedIndex = index - 11;
    return {
      startAngle: 140 + adjustedIndex * 22,
      endAngle: 160 + adjustedIndex * 22,
      innerRadius: 260,
      outerRadius: 330,
    };
  };

  return (
    <svg
      viewBox="-400 -400 800 800"
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto h-full w-full"
    >
      <g transform="translate(-300, -300) scale(1.0)">
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
              onClick={() => onSectionClick?.(section.sectionId)}
            />
          );
        })}
      </g>
    </svg>
  );
};
