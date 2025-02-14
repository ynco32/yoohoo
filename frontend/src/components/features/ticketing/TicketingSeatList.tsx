// components/features/ticketing/TicketingSeatList.tsx
import React, { useEffect } from 'react';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { useTicketingGrid } from '@/hooks/useTicketingSeatsGrid';
import TicketingSeat from '@/components/ui/TicketingSeat';

interface TicketingSeatListProps {
  areaId: string; // A, B, C 같은거
}

const TicketingSeatList = ({ areaId }: TicketingSeatListProps) => {
  const {
    seats,
    isLoading,
    fetchSeatsByArea,
    selectSeat,
    selectedSeatNumber,
    isSeatAvailable,
  } = useTicketingSeatStore();

  const SEAT_WIDTH = 40;
  const SEAT_HEIGHT = 40;
  const SEAT_MARGIN = 5;

  const { grid, dimensions } = useTicketingGrid(
    seats,
    SEAT_WIDTH,
    SEAT_HEIGHT,
    SEAT_MARGIN
  );

  useEffect(() => {
    fetchSeatsByArea(areaId);
  }, [areaId, fetchSeatsByArea]);

  if (isLoading) {
    return (
      <div className="flex h-64 w-full items-center justify-center">
        <p>좌석 정보를 불러오는 중...</p>
      </div>
    );
  }

  const handleSeatClick = (seatNumber: string) => {
    if (isSeatAvailable(seatNumber)) {
      selectSeat(seatNumber);
    }
  };

  return (
    <div className="flex w-full justify-center overflow-auto">
      <svg
        viewBox={`0 0 ${dimensions.width} ${dimensions.height}`}
        width={dimensions.width}
        height={dimensions.height}
        className="max-w-full"
      >
        {grid.map((row, rowIndex) =>
          row.map(({ x, y, seat }, colIndex) =>
            seat ? (
              <TicketingSeat
                key={`${rowIndex}-${colIndex}`}
                x={x}
                y={y}
                width={SEAT_WIDTH}
                height={SEAT_HEIGHT}
                number={seat.seatNumber}
                status={seat.status}
                isSelected={seat.seatNumber === selectedSeatNumber}
                onClick={() => handleSeatClick(seat.seatNumber)}
              />
            ) : null
          )
        )}
      </svg>
    </div>
  );
};

export default TicketingSeatList;
