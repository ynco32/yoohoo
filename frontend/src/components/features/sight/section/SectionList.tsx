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

  // Zustand store에서 필요한 상태와 액션 가져오기
  const { sections, isLoading, error, fetchSectionsByArena } = useSectionStore(
    (state) => ({
      sections: state.sections,
      isLoading: state.isLoading,
      error: state.error,
      fetchSectionsByArena: state.fetchSectionsByArena,
    })
  );

  useEffect(() => {
    if (!arenaId || !stageType) return;

    fetchSectionsByArena(Number(arenaId), Number(stageType));
  }, [arenaId, stageType, fetchSectionsByArena]);

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

          // API 응답을 컴포넌트 props로 변환
          const sectionProps: SectionComponentProps = {
            sectionId: section.sectionId,
            sectionNumber: parseInt(section.sectionName), // sectionName을 다시 number로 변환
            available: true, // API에서 available 정보가 없다면 기본값 설정
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
