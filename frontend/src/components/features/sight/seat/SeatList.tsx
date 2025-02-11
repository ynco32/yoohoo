'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Seat from '@/components/ui/Seat';
import { useSeatsStore } from '@/store/useSeatStore';

interface SeatListProps {
  isScrapMode: boolean;
}

export const SeatList = ({ isScrapMode }: SeatListProps) => {
  const { seats, isLoading, fetchSeatsBySection } = useSeatsStore();
  const { arenaId, stageType, sectionId } = useParams();
  const router = useRouter();

  useEffect(() => {
    fetchSeatsBySection(Number(arenaId), Number(stageType), Number(sectionId));
  }, [arenaId, stageType, sectionId, fetchSeatsBySection]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const SEAT_WIDTH = 30;
  const SEAT_HEIGHT = 30;
  const SEAT_MARGIN = 5;

  const maxRow = Math.max(...seats.map((seat) => seat.row));
  const maxCol = Math.max(...seats.map((seat) => seat.col));

  const viewBoxWidth = (maxCol + 1) * (SEAT_WIDTH + SEAT_MARGIN);
  const viewBoxHeight = (maxRow + 1) * (SEAT_HEIGHT + SEAT_MARGIN);

  return (
    <svg
      viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`}
      width={viewBoxWidth}
      height={viewBoxHeight}
    >
      {seats.map((seat) => (
        <Seat
          key={seat.seatId}
          {...seat}
          scrapped={seat.scrapped}
          isScrapMode={isScrapMode}
          x={seat.col * (SEAT_WIDTH + SEAT_MARGIN)}
          y={seat.row * (SEAT_HEIGHT + SEAT_MARGIN)}
          width={SEAT_WIDTH}
          height={SEAT_HEIGHT}
          onClick={() =>
            router.push(
              `/sight/${seat.arenaId}/${stageType}/${seat.sectionId}/${seat.seatId}`
            )
          }
        />
      ))}
    </svg>
  );
};

export default SeatList;
