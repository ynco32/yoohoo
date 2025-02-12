import { useEffect, useState } from 'react';
import { Section as SectionComponent } from '../../../ui/Section';
import { Section, fetchSections } from '@/lib/api/sections';
import { useParams, useRouter } from 'next/navigation';
import { useSectionPositions } from '@/hooks/useSectionPositions';

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

  const { calculatePosition } = useSectionPositions(sections.length);

  if (isLoading) {
    return <div className="py-4 text-center">Loading sections...</div>;
  }

  if (error) {
    return <div className="py-4 text-center text-red-500">{error}</div>;
  }

  return (
    <svg
      viewBox="-350 -350 700 700"
      preserveAspectRatio="xMidYMid meet"
      className="h-full w-full"
    >
      <g transform="translate(-460, -300) scale(1.2)">
        {sections.map((section, index) => {
          const position = calculatePosition(index);
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
