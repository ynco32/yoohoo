'use client';
import { Section } from '../../ui/Section';

interface SectionData {
  sectionId: number;
  arenaId: string;
  sectionName: string;
  isScraped: boolean;
}

interface SectionListProps {
  sections: SectionData[];
  onSectionClick?: (sectionId: number) => void;
}

export const SectionList = ({ sections, onSectionClick }: SectionListProps) => {
  const getPositionForSection = (index: number, totalSections: number) => {
    // Floor sections (first row)
    if (index < 3) {
      return {
        startAngle: 145 + index * 30,
        endAngle: 170 + index * 30,
        innerRadius: 60,
        outerRadius: 100,
      };
    }
    // Second row
    else if (index < 7) {
      const adjustedIndex = index - 3;
      return {
        startAngle: 135 + adjustedIndex * 30,
        endAngle: 165 + adjustedIndex * 30,
        innerRadius: 100,
        outerRadius: 140,
      };
    }
    // Third row
    else {
      const adjustedIndex = index - 7;
      return {
        startAngle: 130 + adjustedIndex * 30,
        endAngle: 155 + adjustedIndex * 30,
        innerRadius: 140,
        outerRadius: 180,
      };
    }
  };

  return (
    <svg viewBox="0 0 800 450" className="w-full">
      {/* Stage */}
      <rect x="300" y="50" width="200" height="50" fill="#ccc" />
      <text x="400" y="75" textAnchor="middle" dominantBaseline="middle">
        STAGE
      </text>

      {/* Sections */}
      {sections.map((section, index) => {
        const position = getPositionForSection(index, sections.length);
        return (
          <Section
            key={section.sectionId}
            {...section}
            {...position}
            onClick={() => onSectionClick?.(section.sectionId)}
          />
        );
      })}
    </svg>
  );
};

export default SectionList;
