import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Seat from '@/components/ui/Seat';
import { useSeatsStore } from '@/store/useSeatStore';
import { useSeatsGrid } from '@/hooks/useSeatsGrid';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { SeatProps } from '@/types/seats';

interface SeatListProps {
  isScrapMode: boolean;
}

const SeatList = ({ isScrapMode }: SeatListProps) => {
  const { seats, isLoading, fetchSeatsBySection } = useSeatsStore();
  const { arenaId, stageType, sectionId } = useParams();
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);
  const [currentScale, setCurrentScale] = useState(1);

  const SEAT_WIDTH = 10;
  const SEAT_HEIGHT = 10;
  const SEAT_MARGIN = 2;

  const { grid, dimensions } = useSeatsGrid(
    seats,
    SEAT_WIDTH,
    SEAT_HEIGHT,
    SEAT_MARGIN
  );

  useEffect(() => {
    fetchSeatsBySection(Number(arenaId), Number(stageType), Number(sectionId));
  }, [arenaId, stageType, sectionId, fetchSeatsBySection]);

  const handleSeatClick = (seat: SeatProps) => {
    // 확대된 상태(1.2배 이상)에서는 클릭 무시
    if (currentScale >= 1.2) return;

    router.push(
      `/sight/${seat.arenaId}/${stageType}/${seat.sectionId}/${seat.seatId}`
    );
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="items-center justify-center overflow-hidden">
      <TransformWrapper
        initialScale={1}
        minScale={0.5}
        maxScale={4}
        centerOnInit
        panning={{ velocityDisabled: true }}
        limitToBounds={false}
        smooth
        onTransformed={(e) => {
          setCurrentScale(e.state.scale);
        }}
      >
        <TransformComponent
          wrapperClass="w-full h-full"
          contentClass="w-full h-full"
        >
          <svg
            ref={svgRef}
            viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
            width={dimensions.width}
            height={dimensions.height}
            className="max-w-full origin-center"
          >
            {grid.map((row, rowIndex) =>
              row.map(({ x, y, seat }, seatIndex) =>
                seat ? (
                  <Seat
                    key={`${rowIndex}-${seatIndex}`}
                    {...seat}
                    scrapped={seat.scrapped}
                    isScrapMode={isScrapMode}
                    x={x}
                    y={y}
                    width={SEAT_WIDTH}
                    height={SEAT_HEIGHT}
                    onClick={() => handleSeatClick(seat)}
                  />
                ) : null
              )
            )}
          </svg>
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
};

export default SeatList;
