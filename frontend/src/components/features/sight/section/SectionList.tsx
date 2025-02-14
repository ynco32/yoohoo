import { useEffect } from 'react';
import { Section as SectionComponent } from '../../../ui/Section';
import { useParams, useRouter } from 'next/navigation';
import { useSectionPositions } from '@/hooks/useSectionPositions';
import { useSectionStore } from '@/store/useSectionStore';
import { SectionComponentProps } from '@/types/sections';

interface SectionListProps {
  isScrapMode: boolean;
}

export const SectionList = ({ isScrapMode }: SectionListProps) => {
  const { arenaId, stageType } = useParams();
  const router = useRouter();

  // 각각의 상태를 개별적으로 가져오기
  const sections = useSectionStore((state) => state.sections);
  const isLoading = useSectionStore((state) => state.isLoading);
  const error = useSectionStore((state) => state.error);
  const fetchSectionsByArena = useSectionStore(
    (state) => state.fetchSectionsByArena
  );

  useEffect(() => {
    const fetchData = async () => {
      if (!arenaId || !stageType) return;
      await fetchSectionsByArena(Number(arenaId), Number(stageType));
    };

    fetchData();
  }, [arenaId, stageType]); // fetchSectionsByArena 제거

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

          const sectionProps: SectionComponentProps = {
            sectionId: section.sectionId,
            sectionNumber: parseInt(section.sectionName),
            available: true,
            scrapped: section.isScraped,
            arenaId: section.arenaId,
            ...position,
            onClick: () =>
              router.push(
                `/sight/${arenaId}/${stageType}/${section.sectionId}`
              ),
            isScrapMode,
          };

          return <SectionComponent key={section.sectionId} {...sectionProps} />;
        })}
      </g>
    </svg>
  );
};

export default SectionList;
