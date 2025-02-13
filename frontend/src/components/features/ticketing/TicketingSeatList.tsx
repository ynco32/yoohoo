import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import TicketingSeat from '@/components/ui/TicketingSeat';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { useSeatsGrid } from '@/hooks/useSeatsGrid';

interface SeatListProps {
  isScrapMode: boolean;
}

const TicketingSeatList = ({ isScrapMode }: SeatListProps) => {
  const { seats, isLoading, fetchSeatsBySection } = useTicketingSeatStore();
  const { arenaId, stageType, sectionId } = useParams();
  const router = useRouter();

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

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex w-full justify-center">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        width={dimensions.width}
        height={dimensions.height}
        className="max-w-full"
      >
        {grid.map((row, rowIndex) =>
          row.map(({ x, y, seat }, seatIndex) =>
            seat ? (
              <TicketingSeat
                key={`${rowIndex}-${seatIndex}`}
                {...seat}
                scrapped={seat.scrapped}
                isScrapMode={isScrapMode}
                x={x}
                y={y}
                width={SEAT_WIDTH}
                height={SEAT_HEIGHT}
                onClick={() =>
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
  );
};

export default TicketingSeatList;
