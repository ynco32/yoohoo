import { useMemo } from 'react';

interface SectionPosition {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

export const useSectionPositions = (totalSections: number) => {
  const BASE_INNER_RADIUS = 70;
  const BASE_OUTER_RADIUS = 200;
  const INNER_CIRCLE_SECTIONS = 22;
  const INNER_ROTATION = 9; // 내부 원 11칸 회전
  const OUTER_ROTATION = 11.5; // 외부 원 15칸 회전

  return useMemo(() => {
    const getRotatedIndex = (index: number): number => {
      if (index < INNER_CIRCLE_SECTIONS) {
        // 내부 원의 경우
        return (index + INNER_ROTATION) % INNER_CIRCLE_SECTIONS;
      } else {
        // 외부 원의 경우
        const outerIndex = index - INNER_CIRCLE_SECTIONS;
        const remainingSections = totalSections - INNER_CIRCLE_SECTIONS;
        return (
          INNER_CIRCLE_SECTIONS +
          ((outerIndex + OUTER_ROTATION) % remainingSections)
        );
      }
    };

    const calculatePosition = (index: number): SectionPosition => {
      const rotatedIndex = getRotatedIndex(index);

      if (rotatedIndex < INNER_CIRCLE_SECTIONS) {
        // Inner circle sections (1-22)
        const anglePerSection = 360 / INNER_CIRCLE_SECTIONS;
        const startAngle = -90 + rotatedIndex * anglePerSection;
        return {
          startAngle,
          endAngle: startAngle + anglePerSection,
          innerRadius: BASE_INNER_RADIUS,
          outerRadius: BASE_INNER_RADIUS + 60,
        };
      } else {
        // Outer circle sections (23+)
        const remainingSections = totalSections - INNER_CIRCLE_SECTIONS;
        const anglePerSection = 360 / remainingSections;
        const outerAdjustedIndex = rotatedIndex - INNER_CIRCLE_SECTIONS;
        const startAngle = -90 + outerAdjustedIndex * anglePerSection;
        return {
          startAngle,
          endAngle: startAngle + anglePerSection,
          innerRadius: BASE_OUTER_RADIUS - 60,
          outerRadius: BASE_OUTER_RADIUS,
        };
      }
    };

    return { calculatePosition };
  }, [totalSections]);
};
