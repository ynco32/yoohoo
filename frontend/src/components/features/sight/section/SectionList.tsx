import { useEffect, useState } from 'react';
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

  const sections = useSectionStore((state) => state.sections);
  const isLoading = useSectionStore((state) => state.isLoading);
  const error = useSectionStore((state) => state.error);
  const fetchSectionsByArena = useSectionStore(
    (state) => state.fetchSectionsByArena
  );

  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Zoom state
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!arenaId || !stageType) return;
      await fetchSectionsByArena(Number(arenaId), Number(stageType));
    };

    fetchData();
  }, [arenaId, stageType]);

  const { calculatePosition } = useSectionPositions(sections.length);

  // Calculate distance between two touch points
  const getDistance = (touch1: React.Touch, touch2: React.Touch): number => {
    return Math.hypot(
      touch2.clientX - touch1.clientX,
      touch2.clientY - touch1.clientY
    );
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      // Single touch - start panning
      setIsPanning(true);
      setStartPan({
        x: e.touches[0].clientX - panOffset.x,
        y: e.touches[0].clientY - panOffset.y,
      });
    } else if (e.touches.length === 2) {
      // Two finger touch - start zooming
      const distance = getDistance(e.touches[0], e.touches[1]);
      setInitialDistance(distance);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();

    if (e.touches.length === 1 && isPanning) {
      // Handle panning
      setPanOffset({
        x: e.touches[0].clientX - startPan.x,
        y: e.touches[0].clientY - startPan.y,
      });
    } else if (e.touches.length === 2 && initialDistance !== null) {
      // Handle zooming
      const newDistance = getDistance(e.touches[0], e.touches[1]);
      const deltaScale = newDistance / initialDistance;
      const newScale = Math.min(Math.max(scale * deltaScale, 0.5), 3);
      setScale(newScale);
      setInitialDistance(newDistance); // Update initial distance for smooth scaling
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    setInitialDistance(null);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading sections...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  const transform = `translate(${panOffset.x}px, ${panOffset.y}px) scale(${scale})`;

  return (
    <div className="flex h-screen w-full items-center justify-center overflow-hidden">
      <div
        className="touch-none"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <svg
          viewBox="-350 -350 700 700"
          preserveAspectRatio="xMidYMid meet"
          className="h-full w-full origin-center transition-transform duration-normal"
          style={{ transform }}
        >
          <g transform="translate(-500, -400) scale(1.2)">
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
                  !isPanning &&
                  router.push(
                    `/sight/${arenaId}/${stageType}/${section.sectionId}`
                  ),
                isScrapMode,
              };

              return (
                <SectionComponent key={section.sectionId} {...sectionProps} />
              );
            })}
          </g>
        </svg>
      </div>
    </div>
  );
};

export default SectionList;
