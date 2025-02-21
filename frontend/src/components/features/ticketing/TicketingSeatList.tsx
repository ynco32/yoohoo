import React, { useEffect } from 'react';
import { useTicketingSeatStore } from '@/store/useTicketingSeatStore';
import { useTicketingGrid } from '@/hooks/useTicketingSeatsGrid';
import TicketingSeat from '@/components/ui/TicketingSeat';

const TicketingSeatList = ({ areaId }: { areaId: string }) => {
  const { seats, isLoading, fetchSeatsByArea, selectSeat, selectedSeatNumber } =
    useTicketingSeatStore();

  const SEAT_WIDTH = 20;
  const SEAT_HEIGHT = 20;
  const SEAT_MARGIN = 3;

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
    selectSeat(seatNumber);
  };

  return (
    <div className="flex w-full flex-col items-center pt-20">
      {/* Stage 영역 */}
      <div className="mb-16 w-32">
        <svg viewBox="0 0 100 30">
          <rect
            x="0"
            y="0"
            width="100"
            height="30"
            rx="4"
            fill="#1F2937"
            className="drop-shadow-md"
          />
          <text
            x="50"
            y="18"
            textAnchor="middle"
            fill="white"
            className="text-sm font-semibold"
          >
            STAGE
          </text>
        </svg>
      </div>

      {/* 좌석 영역 */}
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
    </div>
  );
};

export default TicketingSeatList;
