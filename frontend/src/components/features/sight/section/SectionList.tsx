'use client';

import { useEffect, useState } from 'react';
import { Section as SectionComponent } from '../../../ui/Section';
import { Section, fetchSections } from '@/lib/api/sections';
import { useParams, useRouter } from 'next/navigation';

/**
 * @component SectionList
 * @description 공연장 구역 전체를 표시하는 컴포넌트
 */

interface SectionListProps {
  isScrapMode: boolean;
}

export const SectionList = ({ isScrapMode }: SectionListProps) => {
  const { arenaId, stageType } = useParams();
  const router = useRouter();
  const [sections, setSections] = useState<Section[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadSections() {
      if (!arenaId || !stageType) {
        setError('Missing arena ID or stage type');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const sectionsData = await fetchSections(
          Array.isArray(arenaId) ? arenaId[0] : arenaId,
          Array.isArray(stageType) ? stageType[0] : stageType
        );
        setSections(sectionsData);
        setError(null);
      } catch (err) {
        console.error('Failed to load sections:', err);
        setError('Failed to load sections. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    }

    if (arenaId && stageType) {
      loadSections();
    }
  }, [arenaId, stageType]);

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

  if (isLoading) {
    return <div className="py-4 text-center">Loading sections...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  return (
    <svg
      viewBox="-400 -400 800 800"
      preserveAspectRatio="xMidYMid meet"
      className="mx-auto h-full w-full"
    >
      <g transform="translate(-500, -550) scale(1.3)">
        {sections.map((section, index) => {
          const position = getPositionForSection(index, sections.length);
          return (
            <SectionComponent
              key={section.sectionId}
              {...section}
              {...position}
              isScrapMode={isScrapMode}
              onClick={() =>
                router.push(
                  `/sight/${arenaId}/${stageType}/${section.sectionId}`
                )
              }
            />
          );
        })}
      </g>
    </svg>
  );
};

export default SectionList;
