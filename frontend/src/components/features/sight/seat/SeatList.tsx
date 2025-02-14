import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Seat from '@/components/ui/Seat';
import { useSeatsStore } from '@/store/useSeatStore';
import { useSeatsGrid } from '@/hooks/useSeatsGrid';

interface SeatListProps {
  isScrapMode: boolean;
}

const SeatList = ({ isScrapMode }: SeatListProps) => {
  const { seats, isLoading, fetchSeatsBySection } = useSeatsStore();
  const { arenaId, stageType, sectionId } = useParams();
  const router = useRouter();
  const svgRef = useRef<SVGSVGElement>(null);

  const SEAT_WIDTH = 10;
  const SEAT_HEIGHT = 10;
  const SEAT_MARGIN = 2;

  // Pan state
  const [isPanning, setIsPanning] = useState(false);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [startPan, setStartPan] = useState({ x: 0, y: 0 });

  // Zoom state
  const [scale, setScale] = useState(1);
  const [initialDistance, setInitialDistance] = useState<number | null>(null);

  const { grid, dimensions } = useSeatsGrid(
    seats,
    SEAT_WIDTH,
    SEAT_HEIGHT,
    SEAT_MARGIN
  );

  useEffect(() => {
    fetchSeatsBySection(Number(arenaId), Number(stageType), Number(sectionId));
  }, [arenaId, stageType, sectionId, fetchSeatsBySection]);

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
        Loading...
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
          ref={svgRef}
          viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
          width={dimensions.width}
          height={dimensions.height}
          className="max-w-full origin-center transition-transform duration-normal"
          style={{ transform }}
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
                  onClick={() =>
                    !isPanning &&
                    router.push(
                      `/sight/${seat.arenaId}/${stageType}/${seat.sectionId}/${seat.seatId}`
                    )
                  }
                />
              ) : null
            )
          )}
        </svg>
      </div>
    </div>
  );
};

export default SeatList;
