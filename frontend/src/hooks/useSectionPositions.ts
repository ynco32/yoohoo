import { useMemo } from 'react';

interface SectionPosition {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
}

export const useSectionPositions = (totalSections: number) => {
  const BASE_INNER_RADIUS = 100;
  const BASE_OUTER_RADIUS = 300;
  const INNER_CIRCLE_SECTIONS = 22;
  return useMemo(() => {
    const calculatePosition = (index: number): SectionPosition => {
      if (index < INNER_CIRCLE_SECTIONS) {
        // Inner circle sections (1-22)
        const anglePerSection = 360 / INNER_CIRCLE_SECTIONS;
        const startAngle = -90 + index * anglePerSection;
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
        const adjustedIndex = index - INNER_CIRCLE_SECTIONS;
        const startAngle = -90 + adjustedIndex * anglePerSection;
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
